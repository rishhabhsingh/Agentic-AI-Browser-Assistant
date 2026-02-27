const { getGroqCompletion } = require('../utils/groqHelper');

// Analyze YouTube video based on metadata
exports.analyzeVideo = async (req, res) => {
  try {
    const { videoId, url, title, description } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Video ID is required'
      });
    }

    console.log(`🎥 Analyzing YouTube video: ${videoId}`);

    // IMPROVED PROMPT - NoteGPT Style
    const systemPrompt = `You are an expert video analyst specializing in creating comprehensive summaries and chapter breakdowns. Your goal is to provide maximum value to users who want to understand video content quickly without watching the entire video.`;

    const userPrompt = `Analyze this YouTube video and create a detailed summary:

VIDEO INFORMATION:
Title: ${title || 'Unknown'}
URL: ${url}
Description: ${description ? description.substring(0, 1000) : 'No description available'}

INSTRUCTIONS:
1. Create a comprehensive 3-4 sentence summary capturing the MAIN TOPIC and KEY TAKEAWAYS
2. Generate 6-10 chapter titles that would logically divide this video
3. For each chapter, provide:
   - A descriptive title (not generic like "Introduction")
   - Estimated timestamp (spread evenly across video)
   - 1-2 sentence description of what's covered
4. List 5-7 KEY POINTS or main ideas from the video
5. Identify the TARGET AUDIENCE (who would benefit from this video)

CHAPTER GUIDELINES:
- Be SPECIFIC and DESCRIPTIVE (e.g., "Setting up React development environment" not "Setup")
- Make chapters actionable (what the viewer will learn/do)
- Cover the full arc of the video (beginning, middle, end)
- Each chapter should be substantial (2-5 minutes worth of content)

Return ONLY valid JSON in this EXACT format:
{
  "summary": "2-3 sentence comprehensive summary here",
  "chapters": [
    {
      "timestamp": "0:00",
      "title": "Specific descriptive title",
      "description": "What's covered in this section"
    }
  ],
  "keyPoints": [
    "Key point 1",
    "Key point 2"
  ],
  "targetAudience": "Who this video is for"
}`;

    // Call Groq AI
    const aiResponse = await groqHelper.getGroqCompletion(systemPrompt, userPrompt, {
      temperature: 0.4, // Lower for more factual outputs
      maxTokens: 1500
    });

    // Parse AI response
    const cleaned = aiResponse.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Enhance response
    const response = {
      success: true,
      videoId,
      url,
      title: title || 'YouTube Video',
      summary: parsed.summary || 'Video analysis generated.',
      chapters: parsed.chapters || [],
      keyPoints: parsed.keyPoints || [],
      targetAudience: parsed.targetAudience || 'General viewers',
      analyzedAt: new Date()
    };

    console.log(`✅ Video analyzed: ${parsed.chapters.length} chapters generated`);

    res.json(response);

  } catch (error) {
    console.error('❌ Error analyzing video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze video',
      error: error.message
    });
  }
};