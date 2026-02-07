const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Analyze tabs and find duplicates/unnecessary ones
async function analyzeTabsWithAI(tabs) {
  try {
    const tabList = tabs.map((tab, index) => 
      `${index + 1}. "${tab.title}" - ${tab.url}`
    ).join('\n');

    const prompt = `You are a smart tab manager AI. Analyze these browser tabs and identify:
1. Duplicate or very similar tabs (same website/content)
2. Unnecessary tabs (like "New Tab", blank pages, or very old tabs)
3. Tabs that are likely forgotten or not needed

Here are the tabs:
${tabList}

Respond in JSON format with an array of suggestions. Each suggestion should have:
- tabIndex: the tab number (0-based index)
- reason: why this tab should be closed (be brief and helpful)
- confidence: how confident you are (0-100)
- category: "duplicate", "unnecessary", or "forgotten"

Only suggest tabs that are clearly duplicates or unnecessary. Don't suggest important-looking tabs.

Example response:
{
  "suggestions": [
    {
      "tabIndex": 2,
      "reason": "Duplicate of tab 1 (same website)",
      "confidence": 95,
      "category": "duplicate"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using cheaper model for tab analysis
      messages: [
        {
          role: "system",
          content: "You are a helpful tab management assistant. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.suggestions || [];

  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to analyze tabs with AI');
  }
}

// Find duplicate tabs using simple logic (fallback)
function findDuplicateTabs(tabs) {
  const duplicates = [];
  const urlMap = new Map();

  tabs.forEach((tab, index) => {
    const baseUrl = new URL(tab.url).hostname;
    
    if (urlMap.has(baseUrl)) {
      duplicates.push({
        tabIndex: index,
        reason: `Duplicate of another ${baseUrl} tab`,
        confidence: 90,
        category: 'duplicate'
      });
    } else {
      urlMap.set(baseUrl, index);
    }
  });

  return duplicates;
}

module.exports = {
  analyzeTabsWithAI,
  findDuplicateTabs
};