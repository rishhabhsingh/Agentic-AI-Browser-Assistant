const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Generic AI completion
async function getGroqCompletion(systemPrompt, userPrompt, options = {}) {
  const {
    temperature = 0.7,
    maxTokens = 1000,
    model = "llama-3.3-70b-versatile"  // ✅ UPDATED MODEL
  } = options;

  try {
    console.log('🚀 Calling GROQ API...');

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: model,
      temperature: temperature,
      max_tokens: maxTokens
    });

    const response = chatCompletion.choices[0]?.message?.content || '';
    console.log('✅ GROQ Response received');
    return response;

  } catch (error) {
    console.error('❌ GROQ Error:', error.message);
    throw new Error(`GROQ API failed: ${error.message}`);
  }
}

// Analyze tabs with AI
async function analyzeTabsWithGroq(tabs) {
  try {
    const tabList = tabs.map((tab, index) => 
      `${index + 1}. "${tab.title}" - ${tab.url}`
    ).join('\n');

    const systemPrompt = "You are a smart tab manager. Analyze tabs and return ONLY valid JSON. No markdown, no explanation.";

    const userPrompt = `Analyze these browser tabs and find duplicates or unnecessary ones:

${tabList}

Return JSON with this exact structure:
{
  "suggestions": [
    {
      "tabIndex": 0,
      "reason": "brief reason",
      "confidence": 95,
      "category": "duplicate"
    }
  ]
}

Only suggest clearly duplicate or unnecessary tabs.`;

    const response = await getGroqCompletion(systemPrompt, userPrompt, {
      temperature: 0.3,
      maxTokens: 1000,
      model: "llama-3.3-70b-versatile"  // ✅ UPDATED
    });

    // Parse JSON response
    const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanResponse);
    
    return result.suggestions || [];

  } catch (error) {
    console.error('Tab analysis error:', error);
    return [];
  }
}

// Quick scan without AI
function quickScanTabs(tabs) {
  const suggestions = [];
  const urlMap = new Map();

  tabs.forEach((tab, index) => {
    try {
      const url = new URL(tab.url);
      const baseUrl = url.hostname + url.pathname;
      const title = tab.title.toLowerCase().trim();

      // Exact duplicates
      if (urlMap.has(baseUrl)) {
        suggestions.push({
          tabIndex: index,
          reason: `Duplicate of another tab`,
          confidence: 100,
          category: 'duplicate'
        });
      } else {
        urlMap.set(baseUrl, index);
      }

      // Empty/New tabs
      if (
        title === 'new tab' || 
        title === '' || 
        url.href.includes('newtab')
      ) {
        suggestions.push({
          tabIndex: index,
          reason: `Empty or new tab`,
          confidence: 95,
          category: 'unnecessary'
        });
      }

      // Error pages
      if (title.includes('error') || title.includes('404')) {
        suggestions.push({
          tabIndex: index,
          reason: `Error page`,
          confidence: 85,
          category: 'unnecessary'
        });
      }

    } catch (error) {
      // Skip invalid URLs
    }
  });

  return suggestions;
}

// Simplify text
async function simplifyTextWithGroq(text, level) {
  const levelInstructions = {
    eli5: 'Explain this like I\'m 5 years old. Use very simple words and short sentences.',
    simple: 'Simplify this for a general audience. Use clear language, avoid jargon.',
    medium: 'Explain this clearly for someone with basic knowledge.',
    technical: 'Provide a clear, technical explanation with proper terminology.'
  };

  const instruction = levelInstructions[level] || levelInstructions.simple;

  const systemPrompt = "You are a helpful teacher who explains complex topics clearly and concisely.";

  const userPrompt = `${instruction}

Original text:
"""
${text}
"""

Provide a clear, concise explanation.`;

  try {
    const simplified = await getGroqCompletion(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 800,
      model: "llama-3.3-70b-versatile"  // ✅ UPDATED
    });

    return simplified;

  } catch (error) {
    throw new Error('Failed to simplify text');
  }
}

// Summarize page
async function summarizePageWithGroq(content, url, level) {
  const levelInstructions = {
    eli5: 'Summarize this webpage like I\'m 5 years old.',
    simple: 'Provide a simple summary in 3-5 bullet points.',
    medium: 'Summarize the key points.',
    technical: 'Provide a detailed summary with main arguments.'
  };

  const instruction = levelInstructions[level] || levelInstructions.simple;

  const systemPrompt = "You are a helpful assistant that creates concise, accurate summaries.";

  const userPrompt = `${instruction}

Webpage: ${url}

Content:
"""
${content}
"""

Provide a clear summary.`;

  try {
    const summary = await getGroqCompletion(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 600,
      model: "llama-3.3-70b-versatile"  // ✅ UPDATED
    });

    return summary;

  } catch (error) {
    throw new Error('Failed to summarize page');
  }
}

module.exports = {
  getGroqCompletion,
  analyzeTabsWithGroq,
  quickScanTabs,
  simplifyTextWithGroq,
  summarizePageWithGroq
};