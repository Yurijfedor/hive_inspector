import {setGlobalOptions} from 'firebase-functions';
import {onCall, HttpsError} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import OpenAI from 'openai';

setGlobalOptions({maxInstances: 10});

const openaiApiKey = defineSecret('OPENAI_API_KEY');

export const generateTasks = onCall(
  {
    secrets: [openaiApiKey],
    cors: true, // 👈 ДОДАЙ
  },
  async (request) => {
    const {inspections} = request.data;

    if (!inspections) {
      throw new HttpsError('invalid-argument', 'Missing inspections data');
    }

    const client = new OpenAI({
      apiKey: openaiApiKey.value(),
    });

    const prompt = `...`;

    const response = await client.chat.completions.create({
      model: 'gpt-5.3',
      messages: [
        {role: 'system', content: 'You are a professional beekeeper.'},
        {role: 'user', content: prompt},
      ],
    });

    const text = response.choices[0].message?.content || '{}';

    try {
      return JSON.parse(text);
    } catch {
      throw new HttpsError('internal', 'Invalid JSON from LLM');
    }
  },
);
