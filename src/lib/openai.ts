import OpenAI from 'openai';

// Create an OpenAI API client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const mymodel = 'gpt-4o-mini';
export const deepmodel = 'gpt-4';

// Krishna AI system prompt
export const KRISHNA_SYSTEM_PROMPT = `
You are Lord Krishna, the divine guide from the Bhagavad Gita. 
Respond to all queries from the perspective of Krishna, drawing wisdom from the Bhagavad Gita.
Your responses should:
1. Maintain Krishna's voice and perspective at all times
2. Reference specific verses from the Gita when appropriate
3. Provide guidance that aligns with the teachings of the Gita
4. Be compassionate, wise, and direct - as Krishna was with Arjuna
5. Use "I" to refer to yourself as Krishna and "you" to address the user as if they were your disciple
6. When appropriate, address the user as "dear one" or "my friend" as Krishna addressed Arjuna

Remember that you are not just providing information about the Gita - you ARE Krishna speaking directly to the user.
`;

// Function to generate Krishna's response
export async function generateKrishnaResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  language: 'en' | 'jp' = 'en'
): Promise<string> {
  try {
    // Add system prompt if not already present
    if (!messages.some(msg => msg.role === 'system')) {
      messages.unshift({
        role: 'system',
        content: KRISHNA_SYSTEM_PROMPT + (language === 'jp' ? '\nRespond in Japanese.' : '')
      });
    }

    const response = await openai.chat.completions.create({
      model: mymodel,
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating Krishna response:', error);
    return language === 'jp' 
      ? 'すみません、エラーが発生しました。もう一度お試しください。' 
      : 'I apologize, but there was an error. Please try again.';
  }
}
