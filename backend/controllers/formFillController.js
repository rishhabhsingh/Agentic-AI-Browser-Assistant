const UserProfile = require('../models/UserProfile');
const { getGroqCompletion } = require('../utils/groqHelper');

// Save user profile
exports.saveProfile = async (req, res) => {
  try {
    const { userId = 'default_user', profile } = req.body;

    console.log('💾 Saving user profile for:', userId);

    let userProfile = await UserProfile.findOne({ userId });

    if (userProfile) {
      // Update existing
      userProfile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: profile },
        { new: true }
      );
    } else {
      // Create new
      userProfile = new UserProfile({
        userId,
        ...profile
      });
      await userProfile.save();
    }

    console.log('✅ Profile saved');

    res.json({
      success: true,
      message: 'Profile saved successfully',
      profile: userProfile
    });

  } catch (error) {
    console.error('❌ Error saving profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save profile',
      error: error.message
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;

    console.log('📖 Getting profile for:', userId);

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.json({
        success: true,
        profile: null,
        message: 'No profile found'
      });
    }

    res.json({
      success: true,
      profile: profile
    });

  } catch (error) {
    console.error('❌ Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Match form fields to user data with AI
exports.matchFields = async (req, res) => {
  try {
    const { fields, userId = 'default_user' } = req.body;

    console.log('🎯 Matching fields for:', userId);
    console.log('Fields received:', fields.length);

    // Get user profile
    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: 'No user profile found. Please create a profile first.'
      });
    }

    // Flatten profile data
    const userData = {
      fullName: profile.personalInfo?.fullName,
      firstName: profile.personalInfo?.fullName?.split(' ')[0],
      lastName: profile.personalInfo?.fullName?.split(' ').slice(1).join(' '),
      email: profile.personalInfo?.email,
      phone: profile.personalInfo?.phone,
      address: profile.personalInfo?.address,
      city: profile.personalInfo?.city,
      state: profile.personalInfo?.state,
      zipCode: profile.personalInfo?.zipCode,
      country: profile.personalInfo?.country,
      currentTitle: profile.professional?.currentTitle,
      company: profile.professional?.company,
      linkedIn: profile.professional?.linkedIn,
      github: profile.professional?.github,
      portfolio: profile.professional?.portfolio,
      degree: profile.education?.degree,
      major: profile.education?.major,
      university: profile.education?.university,
      graduationYear: profile.education?.graduationYear,
      gpa: profile.education?.gpa
    };

    // Use AI to match fields
    const systemPrompt = "You are a smart form-filling assistant. Match form field labels to user data. Return ONLY valid JSON.";

    const userPrompt = `Match these form fields to the user's data:

Form Fields:
${fields.map((f, i) => `${i + 1}. ${f.label || f.name || f.placeholder || 'Unknown'} (type: ${f.type})`).join('\n')}

User Data:
${JSON.stringify(userData, null, 2)}

Return JSON with this structure:
{
  "matches": [
    {
      "fieldIndex": 0,
      "matchedKey": "fullName",
      "value": "John Doe",
      "confidence": 95
    }
  ]
}

Only include high-confidence matches (>70%). If a field doesn't match, skip it.`;

    let matches;
    try {
      const aiResponse = await getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.3,
        maxTokens: 1000,
        model: "llama-3.3-70b-versatile"
      });

      const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanResponse);
      matches = parsed.matches || [];

      console.log(`✅ AI matched ${matches.length} fields`);

    } catch (aiError) {
      console.error('AI matching failed, using fallback:', aiError.message);
      
      // Fallback: Simple keyword matching
      matches = fields.map((field, index) => {
        const label = (field.label || field.name || field.placeholder || '').toLowerCase();
        
        let matchedKey = null;
        let value = null;
        let confidence = 0;

        // Simple matching logic
        if (label.includes('name') && !label.includes('last') && !label.includes('first')) {
          matchedKey = 'fullName';
          value = userData.fullName;
          confidence = 90;
        } else if (label.includes('first') && label.includes('name')) {
          matchedKey = 'firstName';
          value = userData.firstName;
          confidence = 95;
        } else if (label.includes('last') && label.includes('name')) {
          matchedKey = 'lastName';
          value = userData.lastName;
          confidence = 95;
        } else if (label.includes('email')) {
          matchedKey = 'email';
          value = userData.email;
          confidence = 95;
        } else if (label.includes('phone') || label.includes('mobile')) {
          matchedKey = 'phone';
          value = userData.phone;
          confidence = 90;
        } else if (label.includes('address')) {
          matchedKey = 'address';
          value = userData.address;
          confidence = 85;
        } else if (label.includes('city')) {
          matchedKey = 'city';
          value = userData.city;
          confidence = 90;
        } else if (label.includes('state')) {
          matchedKey = 'state';
          value = userData.state;
          confidence = 85;
        } else if (label.includes('zip') || label.includes('postal')) {
          matchedKey = 'zipCode';
          value = userData.zipCode;
          confidence = 90;
        } else if (label.includes('country')) {
          matchedKey = 'country';
          value = userData.country;
          confidence = 85;
        }

        if (matchedKey && value) {
          return {
            fieldIndex: index,
            matchedKey,
            value,
            confidence
          };
        }
        return null;
      }).filter(m => m !== null);
    }

    res.json({
      success: true,
      matches: matches,
      matchedCount: matches.length,
      totalFields: fields.length
    });

  } catch (error) {
    console.error('❌ Error matching fields:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to match fields',
      error: error.message
    });
  }
};