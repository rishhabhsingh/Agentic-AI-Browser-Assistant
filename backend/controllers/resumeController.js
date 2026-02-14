const { getGroqCompletion } = require('../utils/groqHelper');
const { generateResumeDocx } = require('../utils/resumeTemplate');
const path = require('path');

exports.optimizeResume = async (req, res) => {
  try {
    const { jobDescription, resumeText, generateTemplate = false, profileData } = req.body;

    console.log('📄 Resume optimization request');

    if (!jobDescription || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both job description and resume'
      });
    }

    // Extract keywords from job description
    const keywordPrompt = `Extract the 15 most important keywords/skills from this job description. Focus on technical skills, tools, and qualifications.

${jobDescription.substring(0, 2000)}

Return ONLY a JSON array of keywords, nothing else.
Example: ["Python", "React", "Team Leadership", "Agile", "SQL"]`;

    let keywords = [];
    try {
      const keywordResponse = await getGroqCompletion(
        "You are a keyword extraction assistant. Return ONLY valid JSON arrays.",
        keywordPrompt,
        { temperature: 0.3, maxTokens: 300, model: "llama-3.3-70b-versatile" }
      );
      
      const clean = keywordResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      keywords = JSON.parse(clean);
      console.log('Extracted keywords:', keywords);
    } catch (error) {
      console.warn('Keyword extraction failed:', error.message);
      keywords = ['communication', 'teamwork', 'problem-solving', 'leadership'];
    }

    // Calculate match score
    const resumeLower = resumeText.toLowerCase();
    const matchedKeywords = keywords.filter(kw => 
      resumeLower.includes(kw.toLowerCase())
    );
    const matchScore = Math.round((matchedKeywords.length / keywords.length) * 100);

    // Generate optimization suggestions
    const suggestionPrompt = `You are a professional resume consultant. Analyze this resume against the job description and provide specific, actionable improvements.

Job Description:
${jobDescription.substring(0, 1500)}

Current Resume:
${resumeText.substring(0, 2000)}

Provide 5-7 specific suggestions to improve this resume for this job. Format as bullet points. Be concise and actionable.

Focus on:
1. Missing keywords to add
2. How to highlight relevant experience
3. ATS optimization tips
4. Format improvements
5. Achievement quantification`;

    let suggestions = 'No suggestions available.';
    try {
      suggestions = await getGroqCompletion(
        "You are a professional resume consultant.",
        suggestionPrompt,
        { temperature: 0.6, maxTokens: 600, model: "llama-3.3-70b-versatile" }
      );
    } catch (error) {
      console.warn('Suggestion generation failed:', error.message);
    }

    // Generate template if requested
    let downloadUrl = null;
    let fileName = null;

    if (generateTemplate) {
      try {
        // Extract data from job description using AI
        const extractPrompt = `Based on this job description, suggest a professional summary and key skills for a resume:

${jobDescription.substring(0, 1500)}

Return ONLY valid JSON:
{
  "summary": "2-3 sentence professional summary",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "suggestedTitle": "Job Title from description"
}`;

        let extractedData = {
          summary: 'Results-driven professional with expertise in relevant technologies.',
          skills: keywords.slice(0, 10),
          suggestedTitle: 'Professional'
        };

        try {
          const extractResponse = await getGroqCompletion(
            "You are a resume writing assistant. Return ONLY valid JSON.",
            extractPrompt,
            { temperature: 0.5, maxTokens: 400, model: "llama-3.3-70b-versatile" }
          );
          
          const cleanExtract = extractResponse.replace(/```json/g, '').replace(/```/g, '').trim();
          extractedData = JSON.parse(cleanExtract);
        } catch (error) {
          console.warn('Data extraction failed, using defaults');
        }

        // Prepare resume data
        const resumeData = {
          fullName: profileData?.fullName || 'Your Name',
          email: profileData?.email || 'your.email@example.com',
          phone: profileData?.phone || '+1 234 567 8900',
          location: profileData?.location || 'City, State',
          summary: extractedData.summary,
          jobTitle: extractedData.suggestedTitle,
          skills: extractedData.skills,
          experience: profileData?.experience || [
            {
              title: extractedData.suggestedTitle,
              company: 'Company Name',
              startDate: 'Month Year',
              endDate: 'Present',
              responsibilities: [
                'Add your key achievement here with quantifiable results',
                'Describe your main responsibilities and impact',
                'Highlight skills relevant to the job description'
              ]
            }
          ],
          education: profileData?.education || [
            {
              degree: 'Your Degree',
              university: 'University Name',
              graduationYear: 'Year',
              gpa: '0.00'
            }
          ]
        };

        const result = await generateResumeDocx(resumeData);
        fileName = result.fileName;
        downloadUrl = `/api/resume/download/${fileName}`;
        
        console.log('✅ Resume template generated:', fileName);
      } catch (error) {
        console.error('Template generation failed:', error);
      }
    }

    console.log(`✅ Match score: ${matchScore}%`);

    res.json({
      success: true,
      matchScore: matchScore,
      keywords: keywords,
      matchedKeywords: matchedKeywords,
      missingKeywords: keywords.filter(kw => !matchedKeywords.includes(kw)),
      suggestions: suggestions,
      downloadUrl: downloadUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('❌ Error optimizing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize resume',
      error: error.message
    });
  }
};

// Download generated resume
exports.downloadResume = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../temp', filename);

    console.log('📥 Download request for:', filename);

    if (!require('fs').existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Download failed'
        });
      }

      // Delete file after download (cleanup)
      setTimeout(() => {
        try {
          require('fs').unlinkSync(filePath);
          console.log('🗑️ Cleaned up temp file:', filename);
        } catch (e) {
          console.warn('Cleanup failed:', e.message);
        }
      }, 60000); // Delete after 1 minute
    });

  } catch (error) {
    console.error('❌ Error downloading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Download failed',
      error: error.message
    });
  }
};