import {setGlobalOptions} from 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';
import {defineSecret} from 'firebase-functions/params';
import OpenAI from 'openai';

setGlobalOptions({maxInstances: 10});

const openaiApiKey = defineSecret('OPENAI_API_KEY');

type AppLanguage = 'uk' | 'en' | 'de';

const AI_LANGUAGE_NAMES: Record<AppLanguage, string> = {
  uk: 'Ukrainian',
  en: 'English',
  de: 'German',
};

const normalizeLanguage = (language: unknown): AppLanguage => {
  if (language === 'en' || language === 'de' || language === 'uk') {
    return language;
  }

  return 'uk';
};

export const generateTasksHttp = onRequest(
  {secrets: [openaiApiKey]},
  async (req, res) => {
    try {
      const {hives, language} = req.body;

      const appLanguage = normalizeLanguage(language);
      const aiLanguage = AI_LANGUAGE_NAMES[appLanguage];

      console.log('👉 INPUT (HIVES):', hives);
      console.log('🌍 AI TASK LANGUAGE:', appLanguage, '→', aiLanguage);

      const aiPrompt = `
      You are an expert beekeeper with practical field experience.

      ========================
      OUTPUT RULES (ABSOLUTELY STRICT)
      ========================
      - Respond ONLY in ${aiLanguage} language.
      - Respond ONLY with valid JSON.
      - DO NOT add explanations.
      - DO NOT add markdown.
      - DO NOT wrap the response in \`\`\`.
      - Output MUST be directly parseable by JSON.parse().
      - Return exactly one JSON object with a "tasks" array.

      IMPORTANT:
      You MUST apply the decision rules below literally.
      Do NOT use general beekeeper intuition to override these rules.
      Do NOT omit a task when its conditions are satisfied.

      ========================
      TASK TYPES (STRICT ENUM)
      ========================
      Allowed task types:

      - FEEDING
      - INSPECTION
      - DISEASE
      - SWARM
      - SPLIT
      - OTHER

      Never invent new task types.

      ========================
      INPUT DATA STRUCTURE
      ========================

      The actual input data uses the following structure.

      Each hive may contain:

      1. lastInspection
      - date
      - strength
      - honeyKg
      - broodFrames
      - queenStatus

      2. disease
      - hasDiseaseSigns
      - diarrhea
      - deformedWings
      - mitesVisible
      - weakBrood
      - updatedAt

      3. swarm
      - hasSwarmSigns
      - queenEmergence
      - openCells
      - sealedCells
      - eggsInCells
      - updatedAt

      4. split
      - isSplit
      - usedForSplits
      - totalBroodFrames
      - totalFoodFrames
      - updatedAt

      5. queen
      - birthYear
      - lastSeenAt
      - status
      - breed
      - marked
      - updatedAt

      6. meta
      - lastInspectionAt
      - lastFeedingAt
      - lastSwarmCheckAt
      - lastDiseaseCheckAt
      - lastSplitActionAt
      - hasFeeding
      - hasDiseaseSigns
      - hasSwarmSigns
      - isSplit
      - usedForSplits
      - lastStrength
      - totalBroodFrames
      - totalFoodFrames

      IMPORTANT FIELD MAPPING:

      For task decisions use these fields:

      - strength = lastInspection.strength
      - honeyKg = lastInspection.honeyKg
      - broodFrames = lastInspection.broodFrames

      Disease values:
      - hasDiseaseSigns = disease.hasDiseaseSigns
      - diarrhea = disease.diarrhea
      - deformedWings = disease.deformedWings
      - mitesVisible = disease.mitesVisible
      - weakBrood = disease.weakBrood

      Swarm values:
      - hasSwarmSigns = swarm.hasSwarmSigns
      - queenEmergence = swarm.queenEmergence
      - openCells = swarm.openCells
      - sealedCells = swarm.sealedCells
      - eggsInCells = swarm.eggsInCells

      Split values:
      - isSplit = split.isSplit OR meta.isSplit
      - usedForSplits = split.usedForSplits OR meta.usedForSplits

      Inspection timestamp:
      - lastInspectionAt = meta.lastInspectionAt

      Timestamps are in milliseconds.

      ========================
      BOOLEAN INTERPRETATION
      ========================

      Boolean values may be represented either as real booleans or Ukrainian strings.

      TRUE values:
      - true
      - "так"

      FALSE values:
      - false
      - "ні"

      Treat them as equivalent.

      ========================
      DECISION LOGIC
      ========================

      Apply the following rules literally.

      PRIORITY ORDER (highest → lowest):

      1. DISEASE
      2. SWARM
      3. FEEDING
      4. SPLIT
      5. INSPECTION

      Priority means that a higher-priority task can prevent a lower-priority task when explicitly stated by the rules.

      Do NOT interpret priority as permission to ignore a satisfied rule unless the rules explicitly say so.

      ========================
      DISEASE RULES
      ========================

      Create a DISEASE task ONLY when at least one explicit disease indicator
      is TRUE.

      Explicit disease indicators are:

      - disease.hasDiseaseSigns == true
      - disease.mitesVisible == true
      - disease.deformedWings == true
      - disease.diarrhea == true
      - disease.weakBrood == true
      - meta.hasDiseaseSigns == true

      If the disease object is missing and meta.hasDiseaseSigns is false
      or missing, there is NO disease indicator.

      IMPORTANT:

      - Missing disease data does NOT mean disease.
      - Missing disease data does NOT justify a DISEASE task.
      - Never invent disease symptoms.
      - Never create DISEASE merely because the hive should be checked.
      - A DISEASE task requires an explicit TRUE disease indicator.

      Urgency:

      - strong symptoms → inDays: 0–1
      - mild symptoms → inDays: 1–3

      ========================
      SWARM RULES
      ========================

      Create a SWARM task if ANY primary swarm trigger is TRUE:

      PRIMARY TRIGGERS:
      - hasSwarmSigns == TRUE
      - queenEmergence == TRUE

      SECONDARY TRIGGERS:
      - openCells == TRUE AND sealedCells == TRUE
      - openCells == TRUE AND broodFrames >= 7
      - sealedCells == TRUE

      Additional context:
      - strength >= 12 increases swarm risk
      - broodFrames >= 7 increases swarm risk

      Urgency:

      HIGH:
      - queenEmergence == TRUE
      OR
      - hasSwarmSigns == TRUE AND sealedCells == TRUE

      Set:
      - inDays: 0–1

      MEDIUM:
      - openCells == TRUE AND sealedCells == TRUE

      Set:
      - inDays: 1–2

      LOW:
      - openCells == TRUE

      Set:
      - inDays: 2–3

      IMPORTANT:
      - If hasSwarmSigns == TRUE, create SWARM unless a higher-priority DISEASE task exists.
      - Do NOT create SWARM when SPLIT is explicitly more appropriate according to the SPLIT rule below.
      - Avoid duplicate SWARM tasks for the same hive.

      ========================
      FEEDING RULES
      ========================

      Create FEEDING if ANY of these conditions is TRUE:

      - honeyKg < 10
      OR
      - strength >= 12 AND honeyKg < 15

      Use:
      - honeyKg = lastInspection.honeyKg
      - strength = lastInspection.strength

      Do NOT create FEEDING when honeyKg is sufficient.

      ========================
      SPLIT RULES
      ========================

      Create a SPLIT task ONLY when ALL conditions are TRUE:

      1. strength >= 15
      2. broodFrames >= 9
      3. NO explicit disease indicators are TRUE
      4. isSplit == false
      5. usedForSplits == false

      Use:

      - strength = lastInspection.strength
      - broodFrames = lastInspection.broodFrames
      - isSplit = split.isSplit OR meta.isSplit
      - usedForSplits = split.usedForSplits OR meta.usedForSplits

      IMPORTANT:

      - usedForSplits == true means this hive has already been used for splitting
        and MUST NOT receive another SPLIT task.
      - isSplit == true means the hive is already split and MUST NOT receive
        another SPLIT task.
      - Missing split object does not mean isSplit or usedForSplits are true.
      - If split object is missing, use meta values.
      - Do not invent split history.

      If all conditions are satisfied:

      Create exactly one SPLIT task.

      Set:
      - inDays: 1–3

      ========================
      INSPECTION RULES
      ========================

      Create an INSPECTION task if ANY of the following conditions is TRUE:

      1. lastInspectionAt is missing.

      OR

      2. More than 10 days have passed since lastInspectionAt.

      10 days =
      864000000 milliseconds.

      OR

      3. lastInspection is missing.

      OR

      4. lastInspection is incomplete.

      Required lastInspection fields:

      - strength
      - honeyKg
      - broodFrames

      IMPORTANT:

      If a valid recent inspection exists and contains:

      - strength
      - honeyKg
      - broodFrames

      then DO NOT create INSPECTION only because the hive is strong.

      The current time must be compared with lastInspectionAt.

      Urgency:

      - never inspected OR more than 10 days → inDays: 0–1
      - incomplete inspection → inDays: 1–2

      Do NOT create INSPECTION when:

      - a DISEASE task exists
      OR
      - an urgent SWARM task exists with inDays 0–1.

      ========================
      TASK GENERATION RULE
      ========================

      For EACH hive:

      1. Evaluate DISEASE.
      2. Evaluate SWARM.
      3. Evaluate FEEDING.
      4. Evaluate SPLIT.
      5. Evaluate INSPECTION.

      Do NOT stop evaluating after the first rule.

      A hive may receive multiple tasks when multiple independent rules are satisfied.

      Maximum:
      - 3 tasks per hive.

      Never create duplicate task types for the same hive.

      If at least one rule is satisfied, return at least one task.

      NEVER return:

      {
        "tasks": []
      }

      for a hive when one or more task rules above are clearly satisfied.

      ========================
      EXAMPLES
      ========================

      EXAMPLE 1 — SPLIT REQUIRED

      Input:

      lastInspection:
      - strength: 20
      - broodFrames: 16
      - honeyKg: 30

      disease:
      - hasDiseaseSigns: false
      - diarrhea: false
      - deformedWings: false
      - mitesVisible: false
      - weakBrood: false

      meta:
      - lastInspectionAt: recent

      Result MUST contain a SPLIT task.

      Example:

      {
        "tasks": [
          {
            "hiveNumber": 47,
            "title": "Підготувати сім'ю до відводку",
            "type": "SPLIT",
            "inDays": 1
          }
        ]
      }

      The title above is only an example.
      The actual title MUST be written in ${aiLanguage}.

      EXAMPLE 2 — SWARM

      Input:

      lastInspection:
      - strength: 20
      - broodFrames: 15

      swarm:
      - hasSwarmSigns: true
      - queenEmergence: false
      - openCells: true
      - sealedCells: false

      Result MUST contain a SWARM task.

      EXAMPLE 3 — NO TASK

      Input:

      lastInspection:
      - strength: 10
      - broodFrames: 5
      - honeyKg: 30

      disease:
      - all indicators false

      swarm:
      - all indicators false

      meta:
      - lastInspectionAt: recent

      If no other rule is satisfied, return:

      {
        "tasks": []
      }

      ========================
      MISSING DATA INTERPRETATION
      ========================

      IMPORTANT:

      If an optional object is missing, treat ALL of its fields as FALSE or NOT PRESENT.

      For example:

      disease is missing
      → hasDiseaseSigns = false
      → diarrhea = false
      → deformedWings = false
      → mitesVisible = false
      → weakBrood = false

      swarm is missing
      → hasSwarmSigns = false
      → queenEmergence = false
      → openCells = false
      → sealedCells = false
      → eggsInCells = false

      split is missing
      → use meta.isSplit and meta.usedForSplits.

      NEVER create a DISEASE task only because the disease object is missing.

      NEVER create a SWARM task only because the swarm object is missing.

      NEVER create a SPLIT task only because the split object is missing.

      Missing data is NOT the same as a positive condition.

      ========================
      CONSTRAINTS
      ========================

      - Maximum 3 tasks per hive.
      - No duplicate task types for the same hive.
      - Every task must be realistic and practical.
      - Titles must be short and specific.
      - Titles MUST be written in ${aiLanguage}.
      - type MUST be exactly one of:
        FEEDING, INSPECTION, DISEASE, SWARM, SPLIT, OTHER.
      - hiveNumber MUST be copied from the input hive.
      - inDays MUST be a non-negative integer.
      - Do not invent hive numbers.
      - Do not invent task types.
      - Do not add fields not specified in the output format.
      - Do not return explanations.

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

      console.log('🔑 OPENAI KEY EXISTS:', Boolean(key));
      console.log('🤖 OPENAI MODEL:', 'gpt-4o-mini');
      console.log('📝 PROMPT LENGTH:', aiPrompt.length);

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

      console.log('🆔 OPENAI RESPONSE ID:', response.id);
      console.log(
        '🏁 OPENAI FINISH REASON:',
        response.choices[0]?.finish_reason,
      );
      console.log('📦 OPENAI CONTENT:', response.choices[0]?.message?.content);

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
