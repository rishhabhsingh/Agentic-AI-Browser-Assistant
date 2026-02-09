const { getGroqCompletion } = require('../utils/groqHelper');
const { getSubtitles } = require('youtube-captions-scraper');

// Analyze YouTube video
exports.analyzeVideo = async (req, res) => {
  try {
    const { videoId, url } = req.body;

    console.log(`🎥 YouTube Analysis Request - Video ID: ${videoId}`);

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a video ID'
      });
    }

    // Step 1: Get captions
    console.log('📝 Fetching captions...');
    
    let captions;
    try {
      captions = await getSubtitles({
        videoID: videoId,
        lang: 'en' // English captions
      });
    } catch (captionError) {
      console.error('Caption fetch failed:', captionError.message);
      
      // Try with auto-generated captions
      try {
        console.log('Trying auto-generated captions...');
        captions = await getSubtitles({
          videoID: videoId,
          lang: 'en'
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: '❌ No English captions available for this video.\n\nTry a video with:\n• Auto-generated captions\n• Manual subtitles\n• Educational content (TED, Khan Academy)',
          error: error.message
        });
      }
    }

    if (!captions || captions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No captions found for this video'
      });
    }

    console.log(`✅ Captions fetched: ${captions.length} segments`);

    // Step 2: Process captions
    const transcriptText = captions.map(c => c.text).join(' ');
    
    const transcriptFormatted = captions.map(c => {
      const minutes = Math.floor(c.start / 60);
      const seconds = Math.floor(c.start % 60);
      return `[${minutes}:${seconds.toString().padStart(2, '0')}] ${c.text}`;
    }).join('\n');

    console.log(`📊 Total transcript length: ${transcriptText.length} chars`);

    // Step 3: Generate AI summary
    console.log('🤖 Generating AI summary...');

    const systemPrompt = "You are a helpful assistant that creates concise, informative summaries of YouTube videos.";

    const userPrompt = `Analyze this YouTube video transcript and provide:

1. **Brief Summary** (2-3 sentences)
2. **Key Points** (3-5 bullet points)
3. **Main Topics**
4. **Target Audience**

Transcript:
"""
${transcriptText.substring(0, 8000)}
"""

Format your response clearly with sections.`;

    let summary;
    try {
      summary = await getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.6,
        maxTokens: 1000,
        model: "llama-3.3-70b-versatile"
      });
    } catch (aiError) {
      console.error('AI summary failed:', aiError.message);
      summary = "**Summary:** AI summary unavailable. See transcript below for video content.";
    }

    console.log('✅ Summary generated');

    // Step 4: Extract key moments
    const keyMoments = captions
      .filter((_, index) => index % Math.floor(captions.length / 5) === 0)
      .slice(0, 5)
      .map(c => ({
        timestamp: Math.floor(c.start),
        text: c.text,
        formatted: `${Math.floor(c.start / 60)}:${Math.floor(c.start % 60).toString().padStart(2, '0')}`
      }));

    // Step 5: Calculate duration
    const lastCaption = captions[captions.length - 1];
    const estimatedDuration = lastCaption ? Math.floor(lastCaption.start / 60) : 0;

    res.json({
      success: true,
      videoId: videoId,
      url: url,
      transcript: {
        raw: captions,
        formatted: transcriptFormatted,
        text: transcriptText
      },
      summary: summary,
      keyMoments: keyMoments,
      stats: {
        segmentCount: captions.length,
        totalLength: transcriptText.length,
        estimatedDuration: estimatedDuration
      }
    });

  } catch (error) {
    console.error('❌ Error in analyzeVideo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze video',
      error: error.message
    });
  }
};