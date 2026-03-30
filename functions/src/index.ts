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
      const {hives} = req.body;

      console.log('👉 INPUT (HIVES):', hives);

      const aiPrompt = `You are an expert beekeeper.

IMPORTANT RULES:
- Respond ONLY in Ukrainian language
- Respond ONLY with valid JSON
- DO NOT add explanations
- DO NOT add markdown
- DO NOT wrap response in \`\`\`
- DO NOT add any text before or after JSON
- Output must be parseable by JSON.parse()

Task types MUST be one of:
- FEEDING (feeding bees)
- INSPECTION (check hive condition)
- DISEASE (treatment, mites, illness)
- SWARM (swarming control)
- SPLIT (splitting colony)
- OTHER (fallback)

NEVER invent new types.
ALWAYS use only the allowed list.

Each hive contains:
- lastInspection (strength, honey, queen)
- feeding (feeding status and last feeding)
- swarm (swarm signs)
- meta (history)

Use this context to generate realistic beekeeping tasks.

Return EXACTLY this structure:
{
  "tasks": [
    {
      "hiveNumber": number,
      "title": string,
      "type":
        | "FEEDING"
        | "INSPECTION"
        | "DISEASE"
        | "SWARM"
        | "SPLIT"
        | "OTHER",
      "inDays": number
    }
  ]
}

Data:
${JSON.stringify(hives)}`;

      const key = openaiApiKey.value();

      const client = new OpenAI({
        apiKey: key,
      });

      const response = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional beekeeper who gives practical hive management tasks.',
          },
          {role: 'user', content: aiPrompt},
        ],
        temperature: 0.3, // 🔥 стабільніші відповіді
      });

      const text = response.choices[0].message?.content || '{}';

      console.log('👉 RAW:', text);

      const cleanText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

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
