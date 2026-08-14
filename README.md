# 🐝 BeeVoiceApp — Hive Inspector

**BeeVoiceApp** is a voice-first mobile assistant for beekeepers.  
It helps record hive inspections, manage apiary information, create tasks, and work with the data using voice interaction.

The application is designed with a strong focus on **offline operation**, **multilingual voice interaction**, and a guided inspection workflow.

---

## 📱 Main features

### 🐝 Hive inspection

The application guides the beekeeper through a structured inspection of a hive.

During an inspection you can record:

- hive strength;
- number of brood frames;
- queen presence;
- queen breed;
- queen birth year;
- honey amount;
- additional observations and actions.

Important values can be confirmed by voice before they are saved.

The inspection engine uses a sequence of independent steps, so the same business logic can be reused for different languages.

---

### 🎙️ Voice-first interaction

BeeVoiceApp is designed to be used with minimal interaction with the screen.

The voice pipeline includes:

**Wake word → Speech recognition → Normalization → Intent detection → Conversation Flow → Domain action → Persistence**

The application currently uses:

- **Porcupine** — wake-word detection;
- **Vosk** — offline speech recognition;
- **Text-to-Speech** — spoken feedback;
- a modular **ConversationDriver** — conversation runtime;
- language-independent parsers and flow logic.

---

### 🌍 Multilingual support

The application supports:

- 🇺🇦 Ukrainian
- 🇩🇪 German
- 🇬🇧 English

Localization is implemented using `i18next`.

The goal is not simply to translate interface text. Voice processing is separated from business logic so that:

- speech recognition language;
- normalization;
- number parsing;
- intent detection;
- conversation flow;
- domain events

can evolve independently.

---

### 🔢 Voice number recognition

The application contains a language-independent `NumberEngine`.

It can recognize numbers spoken in different forms and languages.

For example:

- simple numbers;
- compound numbers;
- numbers such as 24, 245, 581, 985, 999;
- voice selections such as queen breed `1`, `2`, `3`.

Language-specific vocabulary is stored in separate lexicons.

---

### 👑 Queen management

During inspection the application can record:

- whether a queen is present;
- queen breed;
- queen birth year.

Existing information is taken into account.

For example, if a hive already contains a known queen breed, the application does not ask for the breed again during every inspection.

The same principle is used for the queen's birth year.

---

### 🐝 Apiary overview

The application can provide an overview of the apiary and group hives into categories such as:

- all hives;
- hives requiring inspection;
- hives requiring feeding;
- hives with recent problems.

The overview is built from inspection data and tasks.

---

### 📋 Tasks

BeeVoiceApp can work with tasks related to apiary management, including:

- feeding;
- swarm-related actions;
- disease-related actions;
- splitting colonies;
- AI-generated tasks.

Tasks are stored locally and synchronized with the cloud.

---

## 💾 Offline-first architecture

One of the important design goals of BeeVoiceApp is reliable operation in the field.

The beekeeper should not depend on a permanent Internet connection while inspecting hives.

The application therefore uses local storage as an important source of truth and synchronizes data with Firebase when available.

### Current persistence architecture

The application uses:

- `AsyncStorage` for local data;
- Firebase for cloud synchronization/backup;
- repositories for domain persistence;
- synchronization services for bringing cloud data into the local cache.

For hive contexts, the synchronization flow is approximately:

```text
Firebase
   ↓
loadHiveContextsFromFirebase()
   ↓
HiveContextRepository
   ↓
AsyncStorage
   ↓
UI / domain services
```

Inspection data and tasks follow the same general local/cloud architecture.

---

## 🔄 Synchronization

The application has a full synchronization mechanism.

A typical synchronization flow is:

```text
User starts synchronization
        ↓
runFullSync()
        ↓
Hive contexts sync
        ↓
Tasks sync
        ↓
Other application data
        ↓
Local cache updated
        ↓
UI reads synchronized data
```

The application should be tested carefully with:

1. a newly created hive;
2. an existing hive;
3. data modified on another device/session;
4. synchronization after creating new records;
5. synchronization after editing existing records.

---

## 🧠 Conversation engine

The conversation system is built around a reusable `ConversationFlow`.

A flow contains a sequence of steps.

Conceptually:

```text
ConversationDriver
       ↓
ConversationFlow
       ↓
Step
       ↓
Normalize
       ↓
Validate
       ↓
Apply
       ↓
Effects
       ↓
Persistence / UI / Voice feedback
```

A step can:

- ask a localized question;
- normalize voice input;
- validate the result;
- update the session;
- generate domain effects;
- generate runtime effects;
- skip itself depending on the current session or hive context.

This allows the same inspection flow to work for multiple languages without duplicating the business logic.

---

## 🧩 Inspection example

A simplified inspection flow looks like:

```text
STRENGTH
   ↓
CONFIRM_STRENGTH
   ↓
BROOD
   ↓
CONFIRM_BROOD
   ↓
QUEEN
   ↓
QUEEN_BREED
   ↓
CONFIRM_QUEEN_BREED
   ↓
QUEEN_YEAR
   ↓
CONFIRM_QUEEN_YEAR
   ↓
HONEY
   ↓
CONFIRM_HONEY
   ↓
SAVE_INSPECTION
```

Some steps are conditional.

For example:

```text
Queen absent?
      ↓
    YES → skip queen breed and queen year
      ↓
     NO
      ↓
Queen breed already known?
      ↓
    YES → skip breed
      ↓
     NO → ask breed
```

The same principle applies to the queen's birth year.

---

## 🛠️ Technology stack

### Mobile

- React Native CLI
- React
- TypeScript
- React Navigation

### Voice

- Vosk
- Porcupine
- React Native TTS

### Data

- AsyncStorage
- Firebase / React Native Firebase

### Localization

- i18next
- react-i18next

### Backend / AI

- Node.js
- Express
- OpenAI API
- Firebase services

### Development

- Jest
- TypeScript
- Git / GitHub

---

# 🧪 Testing the current version

The current version is suitable for **structured internal testing / alpha testing**.

It should not yet be considered a production release.

The best approach is to test the application in several stages.

---

## 1. Basic application test

First verify that:

- the application starts;
- the correct language is displayed;
- navigation works;
- the profile/language settings work;
- the application does not crash when opening major screens.

Test all three languages:

- Ukrainian
- German
- English

---

## 2. New hive test

Create a completely new hive.

Perform a full inspection.

Recommended test data:

```text
Strength: 8
Brood: 5
Queen: yes
Breed: Buckfast
Year: 2025
Honey: 12
```

Verify that:

- every question is asked;
- confirmation works;
- queen information is saved;
- the inspection is saved;
- the hive appears in the apiary;
- the hive can be opened again.

---

## 3. Existing hive test

This is especially important.

Open the hive created during the previous test.

Start another inspection.

Verify that already known information is skipped where appropriate.

For example:

```text
Queen already exists
        ↓
Queen breed already exists
        ↓
Do not ask breed again
```

Also verify the queen year.

Then change other inspection values and make sure the new inspection is saved correctly.

---

## 4. Synchronization test

This should be tested separately.

### Test A — create and sync

1. Create a new hive.
2. Complete an inspection.
3. Verify the data locally.
4. Run synchronization.
5. Close/reopen the relevant screens.
6. Verify that the hive is still visible.

### Test B — existing data

1. Open an existing hive.
2. Change inspection data.
3. Save it.
4. Run synchronization.
5. Reopen the hive.
6. Verify the new values.

### Test C — multiple hives

Create several hives.

Then synchronize.

Verify that the apiary contains all expected hive numbers.

---

## 5. Voice testing

Voice recognition should be tested in a quiet environment first.

Then test:

- normal speech;
- short answers;
- numbers;
- queen breed;
- yes/no confirmation;
- retry after incorrect recognition;
- pause/resume/cancel commands.

Repeat the same tests in:

- Ukrainian;
- German;
- English.

Pay special attention to numbers because speech recognition errors are more likely there.

---

## 6. Negative testing

Try deliberately incorrect input.

Examples:

- invalid number;
- number outside the allowed range;
- unknown queen breed;
- invalid year;
- unclear yes/no answer;
- silence;
- repeated answer;
- wrong language.

The expected behavior should be:

```text
Invalid input
      ↓
Validation fails
      ↓
Retry message
      ↓
Same step remains active
```

The application should not silently save invalid information.

---

# 🐛 What to record during testing

When you find a problem, record:

### 1. Language

```text
Ukrainian / German / English
```

### 2. Screen / flow

```text
Inspection
Hive
Apiary
Tasks
```

### 3. Exact step

For example:

```text
QUEEN_BREED
CONFIRM_QUEEN_BREED
QUEEN_YEAR
```

### 4. What was said

Example:

```text
"Бакфаст"
```

### 5. What the application understood

Example:

```text
null
```

### 6. What happened

Example:

```text
The application repeated the question.
```

### 7. Console logs

Copy the relevant logs from Metro / Android Studio.

This information makes debugging much faster.

---

# 🧪 Automated tests

Before every significant change, run the relevant tests.

For example:

```bash
npm test
```

A specific Jest test can be executed with:

```bash
npm test -- src/path/to/test.ts
```

TypeScript should also be checked regularly:

```bash
npx tsc --noEmit
```

The project should ideally have:

```text
tests passing
+
TypeScript without errors
+
manual smoke test
```

before committing a significant architectural change.

---

# 🚀 Recommended alpha testing procedure

For the current version, I recommend this order:

### Phase 1 — Smoke test

Verify:

```text
App starts
↓
Login / user
↓
Language
↓
Apiary
↓
Hive
↓
Inspection
↓
Save
```

### Phase 2 — Inspection

Test:

```text
New hive
Existing hive
Queen present
Queen absent
Known queen breed
Unknown queen breed
Known queen year
Unknown queen year
```

### Phase 3 — Synchronization

Test:

```text
Create
↓
Save
↓
Sync
↓
Reload
↓
Verify
```

### Phase 4 — Voice

Test all supported languages.

### Phase 5 — Edge cases

Try to break the application intentionally.

---

# 📦 Suggested Play Store description

## Short description

**BeeVoiceApp — a voice-first assistant for beekeepers. Inspect hives, record observations and manage your apiary with voice interaction.**

## Full description

### 🐝 BeeVoiceApp — your voice assistant in the apiary

BeeVoiceApp is a mobile assistant designed specifically for beekeepers.

Record hive inspections directly in the apiary without constantly typing on your phone.

### 🎙️ Voice-first inspection

The application guides you through an inspection step by step.

Record:

- colony strength;
- brood frames;
- queen presence;
- queen breed;
- queen birth year;
- honey reserves;
- other apiary actions.

Important information can be confirmed before it is saved.

### 🌍 Multilingual

BeeVoiceApp is designed for multilingual use and currently supports:

🇺🇦 Ukrainian  
🇩🇪 German  
🇬🇧 English

### 📡 Designed for field use

The application uses offline-capable technologies so that voice interaction and local data processing can continue even when Internet connectivity is limited.

Data can be synchronized with the cloud when a connection is available.

### 📊 Manage your apiary

Keep track of your hives and quickly identify:

- hives requiring inspection;
- feeding needs;
- recent problems;
- inspection history;
- hive tasks.

### 🧠 Intelligent workflow

BeeVoiceApp remembers information already known about a hive and avoids asking unnecessary questions during subsequent inspections.

The goal is simple:

**less typing, less screen interaction, more attention to the bees.**

---

# ⚠️ Current status

BeeVoiceApp is currently in **active development / alpha testing**.

The application is functional, but some areas still require extensive testing, especially:

- multilingual speech recognition;
- recognition of spoken numbers;
- synchronization in unusual network conditions;
- long-term offline operation;
- handling of incorrect voice input;
- large apiaries and large amounts of historical data.

Data should therefore be considered test data during the alpha phase.

---

# 🔐 Privacy

The application may use cloud services for authentication, synchronization, and AI-assisted functionality.

Before public release, the project should include a final privacy review covering:

- Firebase data;
- user authentication;
- voice/audio processing;
- AI requests;
- stored hive information;
- analytics and crash reporting.

---

# 🗺️ Development roadmap

Planned development areas include:

- further improvement of multilingual voice recognition;
- improved German and English number parsing;
- more robust offline synchronization;
- richer hive history;
- improved apiary analytics;
- additional inspection flows;
- better error recovery;
- automated integration tests;
- production hardening;
- Play Store release preparation.

---

## 👨‍💻 Development principle

The project follows a simple principle:

> **Keep business logic independent from language, UI and voice technology.**

The voice layer should understand speech.

The conversation engine should manage interaction.

The domain layer should manage beekeeping data.

Persistence should manage storage.

Localization should manage language.

This separation makes it possible to expand BeeVoiceApp without duplicating the core inspection logic for every language.

---

**Project:** BeeVoiceApp / Hive Inspector  
**Status:** Alpha / active development
