import {setGlobalOptions} from 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import OpenAI from 'openai';

setGlobalOptions({maxInstances: 10});

const openaiApiKey = defineSecret('OPENAI_API_KEY');

export const generateTasksHttp = onRequest(
  {secrets: [openaiApiKey]},
  async (req, res) => {
    try {
      const {inspections} = req.body;

      console.log('👉 INPUT:', inspections);

      const aiPrompt = `
You are an expert beekeeper.

Based on hive inspection data, generate a list of tasks.

Return STRICT JSON:
{
  "tasks": [
    {
      "hiveNumber": number,
      "title": string,
      "type": "FEEDING" | "INSPECTION" | "TREATMENT",
      "inDays": number
    }
  ]
}

Data:
${JSON.stringify(inspections)}
`;

      const key = openaiApiKey.value();
      console.log('👉 API KEY EXISTS:', !!key);

      const client = new OpenAI({
        apiKey: key,
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini', // 👈 ЗМІНИ НА ЦЕ
        messages: [
          {role: 'system', content: 'You are a professional beekeeper.'},
          {role: 'user', content: aiPrompt},
        ],
      });

      console.log('👉 OPENAI RESPONSE:', response);

      const text = response.choices[0].message?.content || '{}';

      console.log('👉 RAW:', text);

      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      console.log('👉 CLEAN:', cleanText);

      const parsed = JSON.parse(cleanText);

      res.json(parsed);
    } catch (e: any) {
      console.error('❌ FULL ERROR:', e);

      res.status(500).json({
        error: 'LLM error',
        message: e.message,
      });
    }
  },
);
