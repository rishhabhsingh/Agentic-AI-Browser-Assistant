const { getGroqCompletion } = require('../utils/groqHelper');

// Analyze YouTube video based on metadata
exports.analyzeVideo = async (req, res) => {
  try {
    const { videoId, url, title, description } = req.body;

    console.log(`🎥 YouTube Analysis Request - Video ID: ${videoId}`);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a video ID'
      });
    }

    const videoTitle = title || 'YouTube Video';
    const videoDesc = description || '';

    console.log('📝 Analyzing video metadata...');

    // Generate AI summary from title and description
    const systemPrompt = "You are a helpful YouTube video analyst. Provide concise, useful information.";

    const userPrompt = `Analyze this YouTube video and provide:

Title: ${videoTitle}
Description: ${videoDesc}
URL: ${url}

Generate:
1. **Summary** (2-3 sentences about what this video covers)
2. **Key Topics** (4-6 main topics as bullet points)
3. **Estimated Timestamps/Chapters** (Create 5 logical timestamp suggestions based on typical video structure)
   Format: [0:00] Intro, [2:30] Topic 1, etc.
4. **Target Audience** (Who should watch this)

Be specific and helpful based on the title and description.`;

    let analysis;
    try {
      analysis = await getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.6,
        maxTokens: 800,
        model: "llama-3.3-70b-versatile"
      });
    } catch (error) {
      console.error('AI analysis failed:', error.message);
      analysis = `**Summary:**\n${videoTitle}\n\n**Description:**\n${videoDesc}\n\nAI analysis unavailable. Watch the video for full content.`;
    }

    // Extract suggested timestamps from AI response
    const timestampMatches = analysis.match(/\[(\d+:\d+)\]\s*([^\n]+)/g) || [];
    const suggestedChapters = timestampMatches.map(match => {
      const parts = match.match(/\[(\d+:\d+)\]\s*(.+)/);
      if (parts) {
        const time = parts[1].split(':');
        const seconds = parseInt(time[0]) * 60 + parseInt(time[1]);
        return {
          timestamp: parts[1],
          seconds: seconds,
          title: parts[2].trim()
        };
      }
      return null;
    }).filter(Boolean);

    console.log('✅ Analysis complete');

    res.json({
      success: true,
      videoId: videoId,
      url: url,
      videoInfo: {
        title: videoTitle,
        description: videoDesc
      },
      summary: analysis,
      suggestedChapters: suggestedChapters,
      note: 'Analysis based on video title and description. Timestamps are AI-suggested based on typical video structure.',
      stats: {
        chaptersGenerated: suggestedChapters.length
      }
    });

  } catch (error) {
    console.error('❌ Error analyzing video:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze video',
      error: error.message
    });
  }
};