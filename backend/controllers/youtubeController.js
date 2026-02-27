const groqHelper = require('../utils/groqHelper');

// BULLETPROOF YouTube Analyzer - NEVER CRASHES
exports.analyzeVideo = async (req, res) => {
  try {
    const { videoId, url, title, description, duration, channelTitle } = req.body;

    // Validate input
    if (!videoId && !url) {
      return res.status(400).json({
        success: false,
        message: 'Video ID or URL is required'
      });
    }

    console.log(`🎥 Analyzing video: ${videoId || url}`);

    // Extract video ID
    let actualVideoId = videoId;
    if (!actualVideoId && url) {
      const match = url.match(/[?&]v=([^&]+)/);
      if (match) actualVideoId = match[1];
    }

    // Fallback values
    const videoTitle = title || 'YouTube Video';
    const videoDesc = description || 'No description';
    const videoDuration = duration || 'Unknown';
    const channel = channelTitle || 'Unknown';

    // AI Prompt
    const systemPrompt = `You are a video analyzer. Create summaries and chapters.`;
    const userPrompt = `Video: ${videoTitle}
Channel: ${channel}
Duration: ${videoDuration}
Description: ${videoDesc.substring(0, 500)}

Return ONLY JSON:
{
  "summary": "3-4 sentence summary",
  "chapters": [{"timestamp": "0:00", "title": "...", "description": "..."}],
  "keyPoints": ["point1", "point2"],
  "targetAudience": "who should watch"
}`;

    // Try AI analysis with fallback
    let aiResponse;
    try {
      aiResponse = await groqHelper.getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxTokens: 1500
      });
    } catch (aiError) {
      console.error('❌ AI Error:', aiError.message);
      
      // FALLBACK: Return basic response
      return res.json({
        success: true,
        videoId: actualVideoId,
        url: url || `https://youtube.com/watch?v=${actualVideoId}`,
        title: videoTitle,
        summary: `Video: "${videoTitle}" by ${channel}. Duration: ${videoDuration}`,
        chapters: [
          { timestamp: '0:00', title: 'Introduction', description: 'Video starts' },
          { timestamp: '2:30', title: 'Main Content', description: 'Core material' },
          { timestamp: '5:00', title: 'Conclusion', description: 'Final thoughts' }
        ],
        keyPoints: [
          'Watch full video for complete details',
          `Published by ${channel}`,
          `Duration: ${videoDuration}`
        ],
        targetAudience: 'General viewers',
        analyzedAt: new Date(),
        note: 'Basic summary (AI temporarily unavailable)'
      });
    }

    // Parse AI response
    let parsed;
    try {
      const cleaned = aiResponse.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error('❌ Parse Error:', parseError.message);
      
      // FALLBACK: Return simple response
      return res.json({
        success: true,
        videoId: actualVideoId,
        url: url || `https://youtube.com/watch?v=${actualVideoId}`,
        title: videoTitle,
        summary: `"${videoTitle}" - ${videoDesc.substring(0, 100)}`,
        chapters: [
          { timestamp: '0:00', title: 'Start', description: 'Beginning' },
          { timestamp: '3:00', title: 'Middle', description: 'Main content' },
          { timestamp: '6:00', title: 'End', description: 'Closing' }
        ],
        keyPoints: ['See video for details'],
        targetAudience: 'All viewers',
        analyzedAt: new Date(),
        note: 'Simplified summary'
      });
    }

    // Success response
    res.json({
      success: true,
      videoId: actualVideoId,
      url: url || `https://youtube.com/watch?v=${actualVideoId}`,
      title: videoTitle,
      channel: channel,
      duration: videoDuration,
      summary: parsed.summary || 'Video analyzed',
      chapters: Array.isArray(parsed.chapters) ? parsed.chapters : [],
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      targetAudience: parsed.targetAudience || 'General viewers',
      analyzedAt: new Date()
    });

    console.log(`✅ Success: ${parsed.chapters?.length || 0} chapters`);

  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    
    // NEVER CRASH - Always return something
    res.status(500).json({
      success: false,
      message: 'Analysis failed - please try again',
      error: error.message,
      fallback: {
        summary: 'Unable to analyze right now',
        chapters: [{ timestamp: '0:00', title: 'Video Content', description: 'Watch video for details' }],
        keyPoints: ['Try again in a moment', 'Refresh the page'],
        note: 'Temporary issue'
      }
    });
  }
};