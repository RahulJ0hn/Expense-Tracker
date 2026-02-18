import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.BEDROCK_SECRET_KEY || '',
  },
});

const MODEL_ID = process.env.MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';

async function invokeModel(
  system: string,
  userMessage: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    system,
    messages: [
      {
        role: 'user',
        content: userMessage,
      },
    ],
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await bedrock.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights.
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only a valid JSON array. Do not include any text before or after the JSON. All property names and string values must use double quotes. No comments, no trailing commas, no markdown, no explanations.`;

    const response = await invokeModel(
      'You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only.',
      prompt,
      1000,
      0.7
    );

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    // Parse AI response
    let parsed = null;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch {
      const fixed = cleanedResponse
        .replace(/([,{\s])([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        .replace(/'/g, '"');
      parsed = JSON.parse(fixed);
    }
    const insights = parsed;

    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights:', error);

    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    const category = await invokeModel(
      'You are an expense categorization AI. Categorize expenses into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Alcohol, Cigarettes, Other. Respond with only the category name.',
      `Categorize this expense: "${description}"`,
      20,
      0.1
    );

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Alcohol',
      'Cigarettes',
      'Other',
    ];

    const trimmed = category.trim();
    return validCategories.includes(trimmed) ? trimmed : 'Other';
  } catch (error) {
    console.error('❌ Error categorizing expense:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)

    Return only the answer text, no additional formatting.`;

    const response = await invokeModel(
      'You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough.',
      prompt,
      200,
      0.7
    );

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}

export async function generateAIHealthAdvice(prompt: string): Promise<string> {
  try {
    const response = await invokeModel(
      'You are a health and lifestyle advisor for bachelors in India. Respond with a short, practical, and motivating suggestion or congratulation based on the user\'s prompt. Do not include any markdown or code blocks. Respond in 2-3 sentences.',
      prompt,
      120,
      0.6
    );
    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI health advice:', error);
    return '';
  }
}
