# Cost Commando 🎯

Management Accounting (CPA Australia Foundation, 7th edn) exam prep, built as action games.
It's an installable web app (PWA) that runs on iPhone, Android and laptops, and works offline after the first visit.

## Play / install
1. Turn on GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch → `cpa` / `/docs` → Save**.
2. Open `https://pnnhp.github.io/DA01_sql/`. The first deploy takes 1–2 minutes.
3. **iPhone:** open the page in Safari → Share → **Add to Home Screen**.
   **Laptop:** use Chrome/Edge's install icon, or just bookmark it.

## 📚 Lessons (start here!)
56 lessons (about 12½ hours, roughly 420 slides) cover the whole CPA Management Accounting study guide, with the published errata applied. Everything is explained in simple words through one running story: Lily's lemonade stand growing into a juice factory.

Each lesson has:
- swipeable slides
- worked examples you tap to reveal one step at a time
- exam-trap warnings
- a 🔊 read-aloud button
- a 5-question check drawn from that lesson's own question pool, including fresh calculations

The **Learn** tab schedules lessons day by day up to your exam date, with catch-up for missed days. The home screen shows **Today's class**.

### Lessons and games match
Every question in the app belongs to the lesson that teaches it: the 260 concept questions, every lesson's question pool, all 53 calculation generators and every sorting set.
- **Games use only what you've learned:** they ask only about lessons you've finished. If you open a module game before doing any of its lessons, it suggests the lesson first. You can still choose *Play anyway*.
- **Turning it off:** go to *More → Games only ask about finished lessons*.
- **Revising mistakes:** in the results screen, every mistake has a **📖 Revise** button that opens the lesson behind it.
- **Final Boss:** the mock exam always uses the whole syllabus, like the real exam.
- **Checking it:** `node tools/check_coverage.mjs` confirms that every question maps to a lesson and that each correct answer's key words appear in that lesson's slides.

## 📕 Book practice (every study-guide question)
- **All 391 questions from the study guide** are in the app, reworded and sorted into 82 sets in book order. That covers every *Before you begin* question, every in-module *Question*, every *Quick revision* question and every end-of-book *Revision* question. Open questions were turned into multiple choice, and the book's figures, answers and errata were kept.
- **Order to use them in:**
  - 🌱 Before you begin = warm-up.
  - ❓ In-module questions and ⚡ Quick revision unlock once you've done the lessons they use.
  - 🏁 Revision questions = end-of-module exam practice.
- **Where to find them:** the **Learn** tab, each module screen, and *Book questions on this lesson* at the end of every lesson. The home screen suggests your next set.
- **They also appear elsewhere:** in games (short ones only), in the Final Boss mock exam (scenario questions included) and in Fix-it. Every mistake is remembered there.

## 🎬 Fix-it Reels (mistake memory)
- **The app remembers your mistakes.** Every question you get wrong in a game, lesson check or mock exam is saved on your device, along with how many times you missed it and what you picked.
- **Short videos for your weak spots.** The **Fix** tab turns your worst topics into a TikTok-style feed: swipe-up reels with animated captions and an optional voice-over.
- **What the reels show:** each one replays a question you got wrong ("You picked X ❌ → ✅ Y"), followed by the lesson slides that explain it.
- **A re-test after watching.** It asks the same questions again, with new numbers for calculations, plus one similar question per topic.
- **How a mistake gets fixed.** It counts as fixed once you get it right **2 times in a row**. The results say *Fixed ✅*, *Getting there 💪* or *Still tricky 🤔*, with buttons to re-watch the reels or redo the full lesson.
- **Where to find it:** after any game, **🎬 Fix these mistakes** jumps straight to the reels for what you just got wrong.

## What's inside
| Mode | Module | Style |
|---|---|---|
| Info Ninja | M1 Nature & purpose of MA | slice the matching labels, dragon boss |
| Cost Runner | M2 Cost classification | retro pixel lane runner, high-low number gates |
| Overhead Factory | M3 Product costing | diverter chutes + crane-grab calculations |
| Variance Strike | M4 Budgets & variances | synthwave shooter, operating-statement mothership |
| Division Tycoon | M5 Performance measurement | ROI vs RI goal congruence, balanced-scorecard drop |
| Factory Rush | M6 Decisions | scarce hours, break-even bridge, investment bubbles |
| Warehouse Panic | M7 Inventory & pricing | 8-bit stock simulator, pricing shelf |
| Audit Royale | all modules | PUBG-style battle royale: the safe zone forms around the **correct** answer's flag. Solo or online duo. |
| Ledger Tanks | all modules | DDTank-style artillery: the right answer loads a MEGA shell. vs bot, same-device 2P or online. |
| Final Boss | all modules | timed mock exam (100 Q / 3h15), flag & review |

- **Calculation questions are generated fresh every round** (variances, CVP, high-low, OAR, EU, ROI/RI, EOQ, payback, ARR…). The wrong options are built from typical exam mistakes.
- **Rival bot:** it starts knowing nothing and studies the same topics you play at a typical learner's pace. Compare readiness on the Ranks tab.
- **Ranks:** readiness = your mastery × exam weighting, from Intern up to CPA Legend.
- **Study plan:** set your exam date and the plan splits the remaining weeks using the study-map hours.
- **Multiplayer:** peer-to-peer WebRTC via the free PeerJS broker. One player hosts and shares the invite link.
- **Progress** is stored on each device. Use *More → Copy my save code* to move it between devices.

Content is written in original wording from the CPA Australia learning objectives, with the published errata applied. Not affiliated with CPA Australia.
