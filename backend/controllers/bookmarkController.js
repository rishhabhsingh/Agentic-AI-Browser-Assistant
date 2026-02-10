const Bookmark = require('../models/Bookmark');
const { getGroqCompletion } = require('../utils/groqHelper');

// Add bookmark with AI categorization
exports.addBookmark = async (req, res) => {
  try {
    const { userId = 'default_user', title, url, description } = req.body;

    console.log('🔖 Adding bookmark:', title);

    // Use AI to categorize and generate tags
    const systemPrompt = "You are a bookmark organization assistant. Categorize bookmarks and generate relevant tags. Return ONLY valid JSON.";

    const userPrompt = `Analyze this bookmark and provide:
1. A category (choose ONE from: Technology, Education, News, Entertainment, Shopping, Social Media, Tools, Work, Finance, Health, Travel, Other)
2. 3-5 relevant tags

Title: ${title}
URL: ${url}
Description: ${description || 'No description'}

Return JSON:
{
  "category": "Technology",
  "tags": ["programming", "tutorial", "web-dev"],
  "summary": "Brief one-line summary"
}`;

    let aiData = {
      category: 'Other',
      tags: [],
      summary: title
    };

    try {
      const aiResponse = await getGroqCompletion(systemPrompt, userPrompt, {
        temperature: 0.5,
        maxTokens: 200,
        model: "llama-3.3-70b-versatile"
      });

      const cleanResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      aiData = JSON.parse(cleanResponse);
      console.log('✅ AI categorized as:', aiData.category);
    } catch (aiError) {
      console.warn('AI categorization failed, using defaults:', aiError.message);
    }

    // Create bookmark
    const bookmark = new Bookmark({
      userId,
      title,
      url,
      description,
      category: aiData.category,
      tags: aiData.tags,
      summary: aiData.summary
    });

    await bookmark.save();

    console.log('✅ Bookmark saved');

    res.json({
      success: true,
      message: 'Bookmark added successfully',
      bookmark: bookmark
    });

  } catch (error) {
    console.error('❌ Error adding bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bookmark',
      error: error.message
    });
  }
};

// List bookmarks
exports.listBookmarks = async (req, res) => {
  try {
    const { userId = 'default_user', category, limit = 50 } = req.query;

    console.log('📚 Listing bookmarks for:', userId);

    const query = { userId };
    if (category && category !== 'all') {
      query.category = category;
    }

    const bookmarks = await Bookmark.find(query)
      .sort({ dateAdded: -1 })
      .limit(parseInt(limit));

    // Get categories for filtering
    const categories = await Bookmark.distinct('category', { userId });

    res.json({
      success: true,
      bookmarks: bookmarks,
      categories: categories,
      total: bookmarks.length
    });

  } catch (error) {
    console.error('❌ Error listing bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list bookmarks',
      error: error.message
    });
  }
};

// Smart search
exports.searchBookmarks = async (req, res) => {
  try {
    const { userId = 'default_user', query } = req.body;

    console.log('🔍 Searching bookmarks:', query);

    // Text search
    const bookmarks = await Bookmark.find({
      userId,
      $text: { $search: query }
    }).limit(20);

    res.json({
      success: true,
      bookmarks: bookmarks,
      count: bookmarks.length
    });

  } catch (error) {
    console.error('❌ Error searching bookmarks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search bookmarks',
      error: error.message
    });
  }
};

// Delete bookmark
exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting bookmark:', id);

    await Bookmark.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Bookmark deleted'
    });

  } catch (error) {
    console.error('❌ Error deleting bookmark:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bookmark',
      error: error.message
    });
  }
};
