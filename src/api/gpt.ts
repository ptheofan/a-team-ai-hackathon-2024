import { HumeMessage } from '../structs/chat.interface.ts';
import { TMessageOwner } from '../components/Message.tsx';

export const getChatGPTAnalysis = async (prompt: string, humeChat: HumeMessage[]): Promise<string> => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ import.meta.env.VITE_OPENAI_API_KEY }`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_OPENAI_MODEL_ID,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        ...humeChat.map((message) => {
          let content;
          if (message.message.role === TMessageOwner.User) {
            content = JSON.stringify({
              message: message.message.content,
              scores: message.models?.scores,
            });
          } else {
            content = message.message.content;
          }

          return {
            role: message.message.role === TMessageOwner.User ? 'user' : 'assistant',
            content: content
          };
        }),
      ],
      top_p: 1,
      max_tokens: 4095,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data from OpenAI');
  }

  const data = await response.json();
  console.log(data.choices[0].message.content.replace("\n", ''));
  return data.choices[0].message.content.replace("\n", '');
}
