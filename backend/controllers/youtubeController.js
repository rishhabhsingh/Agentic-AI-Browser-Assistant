const { getGroqCompletion } = require('../utils/groqHelper');

// Simple YouTube analysis without transcript
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

    // Since we can't get transcript reliably, use title/description
    const videoInfo = title || 'YouTube Video';
    const videoDesc = description || 'No description available';

    console.log('📝 Analyzing video metadata...');

    // Generate summary from title and description
    const systemPrompt = "You are a helpful assistant that analyzes YouTube videos.";

    const userPrompt = `Based on this YouTube video information, provide a helpful summary:

Title: ${videoInfo}
Description: ${videoDesc}
URL: ${url}

Provide:
1. **What this video is likely about** (2-3 sentences)
2. **Key topics** (3-5 bullet points based on title/description)
3. **Who should watch** (target audience)

Be helpful and informative.`;

    let summary;
    try {
      summary = await getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.6,
        maxTokens: 500,
        model: "llama-3.3-70b-versatile"
      });
    } catch (error) {
      summary = `**About this video:**\n${videoInfo}\n\n**Description:**\n${videoDesc}`;
    }

    console.log('✅ Summary generated');

    res.json({
      success: true,
      videoId: videoId,
      url: url,
      videoInfo: {
        title: videoInfo,
        description: videoDesc
      },
      summary: summary,
      note: 'Summary based on video metadata (transcript not available)',
      stats: {
        available: false
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