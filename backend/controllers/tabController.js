const { analyzeTabsWithAI, findDuplicateTabs } = require('../utils/openaiHelper');
const Tab = require('../models/Tab');

// Analyze tabs and provide suggestions
exports.analyzeTabs = async (req, res) => {
  try {
    const { tabs, userId = 'default_user', useAI = true } = req.body;

    if (!tabs || !Array.isArray(tabs) || tabs.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of tabs' 
      });
    }

    console.log(`🔍 Analyzing ${tabs.length} tabs for user: ${userId}`);

    let suggestions = [];

    if (useAI) {
      // Use AI for smart analysis
      try {
        suggestions = await analyzeTabsWithAI(tabs);
        console.log(`🤖 AI found ${suggestions.length} suggestions`);
      } catch (error) {
        console.error('AI analysis failed, falling back to simple logic:', error);
        suggestions = findDuplicateTabs(tabs);
      }
    } else {
      // Use simple duplicate detection
      suggestions = findDuplicateTabs(tabs);
    }

    // Save analysis to database
    const tabAnalysis = new Tab({
      userId,
      tabData: tabs.map(tab => ({
        tabId: tab.id,
        title: tab.title,
        url: tab.url
      })),
      suggestions: suggestions.map(s => ({
        tabId: tabs[s.tabIndex]?.id,
        reason: s.reason,
        confidence: s.confidence
      }))
    });

    await tabAnalysis.save();

    res.json({
      success: true,
      totalTabs: tabs.length,
      suggestionsCount: suggestions.length,
      suggestions: suggestions.map(s => ({
        ...s,
        tab: tabs[s.tabIndex]
      })),
      message: suggestions.length > 0 
        ? `Found ${suggestions.length} tabs you might want to close` 
        : 'All tabs look good! No suggestions.'
    });

  } catch (error) {
    console.error('❌ Error analyzing tabs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze tabs',
      error: error.message 
    });
  }
};

// Get tab statistics
exports.getTabStats = async (req, res) => {
  try {
    const { tabs } = req.body;

    if (!tabs || !Array.isArray(tabs)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide an array of tabs' 
      });
    }

    // Calculate statistics
    const stats = {
      total: tabs.length,
      domains: {},
      protocols: {
        https: 0,
        http: 0,
        other: 0
      }
    };

    tabs.forEach(tab => {
      try {
        const url = new URL(tab.url);
        
        // Count by domain
        const domain = url.hostname;
        stats.domains[domain] = (stats.domains[domain] || 0) + 1;
        
        // Count by protocol
        if (url.protocol === 'https:') stats.protocols.https++;
        else if (url.protocol === 'http:') stats.protocols.http++;
        else stats.protocols.other++;
        
      } catch (error) {
        // Invalid URL, skip
      }
    });

    // Find most common domains
    const sortedDomains = Object.entries(stats.domains)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));

    res.json({
      success: true,
      stats: {
        ...stats,
        topDomains: sortedDomains
      }
    });

  } catch (error) {
    console.error('❌ Error calculating stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to calculate statistics' 
    });
  }
};

// Get analysis history
exports.getHistory = async (req, res) => {
  try {
    const { userId = 'default_user' } = req.query;

    const history = await Tab.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      history: history.map(h => ({
        id: h._id,
        date: h.createdAt,
        totalTabs: h.tabData.length,
        suggestions: h.suggestions.length
      }))
    });

  } catch (error) {
    console.error('❌ Error fetching history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch history' 
    });
  }
};