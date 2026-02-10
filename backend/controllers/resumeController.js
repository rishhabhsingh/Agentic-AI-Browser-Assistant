const { getGroqCompletion } = require('../utils/groqHelper');

exports.optimizeResume = async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body;

    console.log('📄 Resume optimization request');

    if (!jobDescription || !resumeText) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both job description and resume'
      });
    }

    // Extract keywords from job description
    const keywordPrompt = `Extract the 10 most important keywords/skills from this job description:

${jobDescription.substring(0, 2000)}

Return ONLY a JSON array of keywords, nothing else.
Example: ["Python", "React", "Team Leadership", "Agile"]`;

    let keywords = [];
    try {
      const keywordResponse = await getGroqCompletion(
        "You are a keyword extraction assistant. Return ONLY valid JSON arrays.",
        keywordPrompt,
        { temperature: 0.3, maxTokens: 200, model: "llama-3.3-70b-versatile" }
      );
      
      const clean = keywordResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      keywords = JSON.parse(clean);
    } catch (error) {
      console.warn('Keyword extraction failed:', error.message);
      keywords = ['communication', 'teamwork', 'problem-solving'];
    }

    // Calculate match score
    const resumeLower = resumeText.toLowerCase();
    const matchedKeywords = keywords.filter(kw => 
      resumeLower.includes(kw.toLowerCase())
    );
    const matchScore = Math.round((matchedKeywords.length / keywords.length) * 100);

    // Generate optimization suggestions
    const suggestionPrompt = `Analyze this resume against the job description and provide specific improvement suggestions:

Job Description:
${jobDescription.substring(0, 1500)}

Resume:
${resumeText.substring(0, 2000)}

Provide 3-5 specific, actionable suggestions to improve the resume for this job. Be concise and practical.`;

    let suggestions = 'No suggestions available.';
    try {
      suggestions = await getGroqCompletion(
        "You are a professional resume consultant.",
        suggestionPrompt,
        { temperature: 0.6, maxTokens: 500, model: "llama-3.3-70b-versatile" }
      );
    } catch (error) {
      console.warn('Suggestion generation failed:', error.message);
    }

    console.log(`✅ Match score: ${matchScore}%`);

    res.json({
      success: true,
      matchScore: matchScore,
      keywords: keywords,
      matchedKeywords: matchedKeywords,
      suggestions: suggestions,
      downloadUrl: null // We're not generating actual DOCX for now (can add later)
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