const { simplifyTextWithGroq, summarizePageWithGroq } = require('../utils/groqHelper');

// Simplify text
exports.simplifyText = async (req, res) => {
  try {
    const { text, level = 'simple' } = req.body;

    console.log(`📝 Simplify request: ${text?.length || 0} chars, level: ${level}`);

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide text to simplify'
      });
    }

    if (text.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Text too long (max 10,000 characters)'
      });
    }

    const simplified = await simplifyTextWithGroq(text, level);

    console.log('✅ Text simplified successfully');

    res.json({
      success: true,
      original: text,
      simplified: simplified,
      level: level,
      originalLength: text.length,
      simplifiedLength: simplified.length
    });

  } catch (error) {
    console.error('❌ Error in simplifyText:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to simplify text',
      error: error.message
    });
  }
};

// Summarize page
exports.simplifyPage = async (req, res) => {
  try {
    const { content, url, level = 'simple' } = req.body;

    console.log(`📄 Summarize request: ${url}, ${content?.length || 0} chars`);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide page content'
      });
    }

    const truncatedContent = content.substring(0, 5000);

    const summary = await summarizePageWithGroq(truncatedContent, url, level);

    console.log('✅ Page summarized successfully');

    res.json({
      success: true,
      url: url,
      summary: summary,
      level: level,
      originalLength: truncatedContent.length
    });

  } catch (error) {
    console.error('❌ Error in simplifyPage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to summarize page',
      error: error.message
    });
  }
};