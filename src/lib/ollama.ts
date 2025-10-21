import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function generateAIResponse(prompt: string, context: string[] = [], personalityConfig: { personality: string; traits: string; lore: string }): Promise<string> {
  try {
    const systemPrompt = `You are an AI agent with personality: ${personalityConfig.personality}. Your traits include: ${personalityConfig.traits}. Your lore/backstory is: ${personalityConfig.lore}. Respond in character.`;

    const messages = [
      ...context.map(msg => ({ role: 'user', content: msg })),
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ];

    const response = await ollama.chat({
      model: 'llama3',
      messages,
      options: { temperature: 0.7 },
    });

    return response.message.content;
  } catch (error) {
    console.error('Ollama error:', error);
    return 'Sorry, I encountered an issue. Try again!';
  }
}