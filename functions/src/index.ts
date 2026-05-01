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

      const aiPrompt = `
You are an expert beekeeper with practical field experience.

========================
OUTPUT RULES (STRICT)
========================
- Respond ONLY in Ukrainian language
- Respond ONLY with valid JSON
- DO NOT add explanations
- DO NOT add markdown
- DO NOT wrap response in \`\`\`
- Output must be parseable by JSON.parse()

========================
TASK TYPES (STRICT ENUM)
========================
- FEEDING
- INSPECTION
- DISEASE
- SWARM
- SPLIT
- OTHER

Never invent new types.

========================
DATA INTERPRETATION
========================

Boolean values may appear as:
- "так" = YES / TRUE
- "ні" = NO / FALSE

Timestamps are in milliseconds.

========================
HIVE DATA STRUCTURE
========================

Each hive may contain:

1. inspections (history):
- strength (1–20)
- broodFrames
- queen ("так" / "ні")
- createdAt

2. currentDisease:
- hasDiseaseSigns
- diarrhea
- deformedWings
- mitesVisible
- weakBrood
- updatedAt

3. currentSwarm:
- hasSwarmSigns
- queenEmergence
- openCells
- sealedCells
- eggsInCells
- updatedAt

4. currentSplit:
- isSplit
- usedForSplits
- totalBroodFrames
- totalFoodFrames

5. queen:
- birthYear
- lastSeenAt
- status ("present" / "missing")

6. meta:
- lastInspectionAt
- lastFeedingAt
- lastSwarmCheckAt
- lastDiseaseCheckAt
- lastStrength
- totals

========================
DECISION LOGIC (VERY IMPORTANT)
========================

PRIORITY ORDER (highest → lowest):
1. DISEASE
2. SWARM
3. FEEDING
4. SPLIT
5. INSPECTION

------------------------
DISEASE RULES
------------------------
Create DISEASE task if ANY:
- hasDiseaseSigns == "так"
- mitesVisible == "так"
- deformedWings == "так"
- diarrhea == "так"
- weakBrood == "так"

Urgency:
- strong symptoms → inDays: 0–1
- mild → 1–3

------------------------
SWARM RULES
------------------------
Create SWARM task if ANY of the following conditions indicate swarm risk:

Primary triggers:
- hasSwarmSigns == "так"
- queenEmergence == "так"

Secondary triggers (combined conditions):
- openCells == "так" AND sealedCells == "так"
- presence of queen cells (open or sealed)

Additional context (increase likelihood):
- strong colony (strength ≥ 12)
- high broodFrames (≥ 7)

Interpretation:
- "так" = YES (true)
- "ні" = NO (false)

Urgency:

HIGH (inDays: 0–1) if:
- queenEmergence == "так"
OR
- hasSwarmSigns == "так" AND sealedCells == "так"

MEDIUM (inDays: 1–2) if:
- openCells == "так" AND sealedCells == "так"

LOW (inDays: 2–3) if:
- only early signs (openCells == "так")

Constraints:
- do not create SWARM if SPLIT task is already more appropriate (strong colony, broodFrames ≥ 9, no disease)
- avoid duplicate tasks for the same hive
------------------------
FEEDING RULES
------------------------
Create FEEDING if:
- honeyKg is low (< 10)
OR
- strength is high but food is low

------------------------
SPLIT RULES
------------------------
Create SPLIT if:
- strong colony (strength ≥ 15)
- broodFrames ≥ 9
- NO disease indicators present
- inDays: 0–3 (not immediate, but should be done soon)

------------------------
INSPECTION RULES
------------------------
Create INSPECTION task if ANY of the following conditions are met:

1. Time-based condition:
- lastInspectionAt is missing
OR
- more than 10 days have passed since lastInspectionAt

(10 days = 864000000 milliseconds)

2. Data completeness condition:
- no inspections history exists
OR
- last inspection data is incomplete (missing key fields like strength, honeyKg, broodFrames)

Interpretation:
- timestamps are in milliseconds
- current time should be compared with lastInspectionAt

Urgency:
- if never inspected OR >10 days → inDays: 0–1
- if data is incomplete → inDays: 1–2

Constraints:
- do not create INSPECTION if a higher priority task exists (DISEASE or SWARM with inDays 0–1)

========================
CONSTRAINTS
========================
- Max 3 tasks per hive
- No duplicate task types per hive
- Tasks must be realistic and practical
- Titles must be short and specific

========================
OUTPUT FORMAT
========================

{
  "tasks": [
    {
      "hiveNumber": number,
      "title": string,
      "type": "FEEDING" | "INSPECTION" | "DISEASE" | "SWARM" | "SPLIT" | "OTHER",
      "inDays": number
    }
  ]
}

========================
DATA
========================
${JSON.stringify(hives)}
`;

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
