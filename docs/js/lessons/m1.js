// Lessons are written like a friendly teacher talking to a 10-year-old.
// Running story: Lily starts a lemonade stand that grows into "Lily's Juice Co." factory.
// Slide HTML helpers (styled in style.css): .say (Penny the piggy-bank teacher), .pic (big emoji),
// .formula, .eg (example), ol.reveal (tap to reveal steps), .trap (exam trap), table.t
export default [
  {
    id: 'm0-start', mod: 0, lo: null, title: 'Start here: what is this exam?', mins: 6, game: null,
    slides: [
      { h: 'Hi! I\'m Penny 🐷', b: `<div class="pic">🐷💰</div><div class="say">I'm a piggy bank and I LOVE money questions. I'll be your teacher. You don't need to know anything about accounting. If you can count pocket money, you can do this!</div>` },
      { h: 'What is the exam?', b: `<p>The <b>CPA Australia Management Accounting</b> exam is:</p><ul><li>📝 <b>100 questions</b>, each with 4 choices (A, B, C, D)</li><li>⏱ <b>3 hours 15 minutes</b>, so about <b>2 minutes per question</b></li><li>✅ No penalty for wrong answers, so <b>never leave a blank</b>!</li><li>🧮 Lots of questions need a little maths (just + − × ÷)</li></ul>` },
      { h: 'The 7 "worlds" (modules)', b: `<table class="t"><tr><th>Module</th><th>About</th><th>Exam %</th></tr>
        <tr><td>M1</td><td>What management accountants do</td><td>7%</td></tr><tr><td>M2</td><td>Kinds of costs</td><td>15%</td></tr>
        <tr><td>M3</td><td>Working out what a product costs</td><td><b>23%</b></td></tr><tr><td>M4</td><td>Budgets & "variances"</td><td><b>20%</b></td></tr>
        <tr><td>M5</td><td>Measuring performance</td><td>12%</td></tr><tr><td>M6</td><td>Making decisions</td><td><b>18%</b></td></tr><tr><td>M7</td><td>Stock & pricing</td><td>5%</td></tr></table>
        <div class="say">M3, M4 and M6 are 61% of the exam, so we'll spend the most time there.</div>` },
      { h: 'Meet Lily 🍋', b: `<div class="pic">👧🍋🥤</div><p>In every lesson we follow <b>Lily</b>. She starts a <b>lemonade stand</b>, and it slowly grows into a big juice factory called <b>Lily's Juice Co.</b></p><p>Every hard word in accounting is just a fancy name for something Lily already does. I promise!</p>` },
      { h: 'How to use the app each day', b: `<ol><li>📖 Do <b>today's lessons</b> (5–10 minutes each). Tap 🔊 if you'd like me to read to you.</li><li>✅ Answer the 3 quick check questions at the end.</li><li>🎮 Then play the module's game to practise. The games repeat the lessons in action.</li><li>🏆 Watch your rank go up and beat the bot!</li></ol><div class="say">Little and often wins. 20–40 minutes a day beats one huge cram.</div>` },
    ],
    check: [
      ['How many questions are in the exam?', ['100', '50', '200', '75'], '100 multiple-choice questions in 3 hours 15 minutes.'],
      ['If you don\'t know an answer, you should…', ['Guess. There\'s no penalty for wrong answers', 'Leave it blank', 'Skip the exam', 'Pick nothing'], 'Wrong answers lose nothing, so always pick something.'],
      ['Which three modules are the biggest?', ['M3, M4 and M6', 'M1, M2 and M7', 'M5, M6 and M7', 'M1, M3 and M5'], 'Product costing 23%, budgets 20%, decisions 18%.'],
    ],
  },

  // ───────── MODULE 1 ─────────
  {
    id: 'm1-1', mod: 1, lo: '1.1', title: 'What does a management accountant do?', mins: 8, game: 'ninja',
    slides: [
      { h: 'Lily needs answers', b: `<div class="pic">🍋❓</div><p>Lily's stand is busy. She keeps wondering:</p><ul><li>"How much lemonade should I make tomorrow?" (<b>planning</b>)</li><li>"Did I spend more on sugar than I meant to?" (<b>control</b>)</li><li>"Should I sell cookies too?" (<b>decision making</b>)</li></ul><div class="say">A <b>management accountant</b> is the person who gives Lily the numbers and advice to answer these questions.</div>` },
      { h: 'The big three jobs', b: `<div class="formula">Management accounting = information for <b>Planning</b> + <b>Control</b> + <b>Decision making</b></div><p>The information is for people <b>inside</b> the business (the managers), to help them run it better.</p>` },
      { h: 'Three things good MA info does', b: `<p>Back in the 1950s someone said MA information should be good for:</p><ol class="reveal"><li><b>Scorekeeping</b>: "How are we doing overall?" Like a football scoreboard. 🏆</li><li><b>Attention-directing</b>: "Look here, there's a problem!" Like a flashing warning light. 🚨</li><li><b>Problem-solving</b>: "Which choice is best?" Comparing options. 🧩</li></ol>` },
      { h: 'Modern management accountants', b: `<ul><li>Computers now do the boring routine reports, so MAs spend more time on <b>analysis and advice</b>.</li><li>They often join <b>cross-functional teams</b>: small groups of people from different departments working on one goal. The MA brings the numbers and keeps everyone looking at the whole organisation.</li><li>They also give <b>non-financial</b> info (like customer happiness) and help with risk.</li></ul>` },
      { h: 'Is the MA team doing a good job?', b: `<p>The managers are the MA team's "customers" (internal customers). So we measure the MA team by:</p><ul><li>⭐ <b>Quality</b> of info (useful, timely, reliable). User satisfaction surveys!</li><li>💸 <b>Value for money</b>: cost less than the benefit</li><li>🙋 <b>Availability</b>: are they there to help when needed?</li><li>🤸 <b>Flexibility</b>: can they make one-off reports?</li></ul>` },
    ],
    check: [
      ['The three main uses of management accounting info are…', ['Planning, control and decision making', 'Tax, audit and law', 'Selling, buying and hiring', 'Printing, filing and posting'], 'MA supports planning, control and decision making.'],
      ['Info that says "look here, there\'s a problem" is…', ['Attention-directing', 'Scorekeeping', 'Problem-solving', 'Auditing'], 'Attention-directing points managers to problems.'],
      ['A good way to measure the MA team\'s performance is…', ['User satisfaction surveys from managers', 'The company share price', 'Number of pens used', 'The tax bill'], 'Managers are the internal customers of MA.'],
    ],
  },
  {
    id: 'm1-2', mod: 1, lo: '1.2', title: 'Financial vs cost vs management accounting', mins: 8, game: 'ninja',
    slides: [
      { h: 'Two different audiences', b: `<div class="pic">🏠 vs 🌍</div><p><b>Management accounts</b> are for people <b>inside</b> (Lily and her managers).</p><p><b>Financial accounts</b> are for people <b>outside</b>: shareholders, the bank, the tax office, the government.</p>` },
      { h: 'Side by side', b: `<table class="t"><tr><th>Financial accounts</th><th>Management accounts</th></tr>
        <tr><td>Required by <b>law</b> (for companies)</td><td><b>No law</b> says you must</td></tr>
        <tr><td>Format set by rules (IFRS)</td><td>Any format managers like</td></tr>
        <tr><td>Whole business added together</td><td>Can zoom into one product or department</td></tr>
        <tr><td>Mostly <b>money</b></td><td>Money <b>and</b> non-money (kg, hours, km)</td></tr>
        <tr><td>Mostly the <b>past</b> (history)</td><td>The past <b>and</b> the future (plans)</td></tr></table>` },
      { h: 'Where does cost accounting fit?', b: `<div class="say">Cost accounting is a <b>part of</b> management accounting. It's the kitchen where the ingredients (cost data) are prepared.</div><p>Cost accounting:</p><ul><li>collects cost data</li><li>works out the cost of products, departments and inventory (stock)</li><li>prepares budgets and compares actual vs budget</li></ul><p>Management accounting then <b>interprets</b> that data and <b>communicates</b> it as information.</p>` },
      { h: 'How fast?', b: `<ol class="reveal"><li>Management accounting info: needed <b>immediately</b> ⚡</li><li>Cost accounting: <b>quickly</b> 🏃</li><li>Financial accounting: usually <b>delayed</b> 🐢 (year-end reports)</li></ol><div class="trap">⚠️ Exam trap: "There is a legal requirement to prepare management accounts." FALSE! Only financial accounts are legally required.</div>` },
    ],
    check: [
      ['Which is TRUE about management accounts?', ['There is no legal requirement to prepare them', 'Their format is set by IFRS', 'They only show the past', 'They only use money amounts'], 'Free format, no law, past + future, money + non-money.'],
      ['Cost accounting is…', ['Part of management accounting', 'The same as financial accounting', 'Only used by the tax office', 'Not related to MA'], 'It provides the data bank for management accountants.'],
      ['"Tonnes of lemons used this month" is most likely in…', ['Management accounts', 'Published financial statements', 'A tax return', 'An audit report'], 'MA includes non-money measures.'],
    ],
  },
  {
    id: 'm1-3', mod: 1, lo: '1.3', title: 'Goals, plans and control', mins: 9, game: 'ninja',
    slides: [
      { h: 'Dreams → goals → plans', b: `<ul><li>🌈 <b>Vision</b>: Lily's big dream. "Every kid in town drinks Lily's juice."</li><li>🎯 <b>Mission</b>: why the business exists. "Fresh, healthy juice at fair prices."</li><li>🏁 <b>Objective</b>: a goal or target. "Sell 1,000 cups this summer."</li><li>🗺 <b>Strategy</b>: <b>how</b> to reach it. "Open a 2nd stand near the park."</li></ul><div class="trap">⚠️ Objective = the TARGET. Strategy = the ROUTE to the target. Don't mix them up!</div>` },
      { h: 'Long-term vs short-term plans', b: `<p><b>Long-term (strategic/corporate) planning</b> covers 2, 5, 7 or 10 years. Steps: look at the business and its world → set objectives → choose strategies → write a corporate plan.</p><p><b>Short-term (tactical) planning</b> is usually <b>one year</b> (the budget). It's the next step on the long-term road.</p>` },
      { h: 'Control = check and fix', b: `<div class="pic">🎯➡️📏➡️🔧</div><ol class="reveal"><li>Make a plan with targets</li><li>Do the work and measure what really happened</li><li>Compare actual vs plan</li><li>If there's a big difference, find out why</li><li>Fix it (control action) or change the plan if the plan was unrealistic</li></ol><div class="say">That loop is called a <b>management control system</b>.</div>` },
      { h: 'Example', b: `<div class="eg"><b>Lily's sugar costs were 15% higher than planned.</b><br>Best response? Investigate! Maybe the cause is <b>controllable</b> (someone wasted sugar → fix it), or <b>uncontrollable</b> (sugar prices went up everywhere → update the plan).</div>` },
    ],
    check: [
      ['"Sell 1,000 cups this summer" is an…', ['Objective', 'Strategy', 'Mission', 'Vision'], 'An objective is a target to reach.'],
      ['A strategy is…', ['A course of action to achieve objectives', 'The goal itself', 'A dream statement', 'A tax rule'], 'Strategy = the how.'],
      ['Costs came in 15% over budget. Best response?', ['Investigate: fix it if controllable, revise plans if not', 'Cut all costs by 15% at once', 'Ignore it', 'Fire everyone'], 'Always find the cause first.'],
    ],
  },
  {
    id: 'm1-4', mod: 1, lo: '1.3', title: 'Data, information and the 3 levels', mins: 9, game: 'ninja',
    slides: [
      { h: 'Data vs information', b: `<p><b>Data</b> = raw facts. Like a messy pile of receipts. 🧾🧾🧾</p><p><b>Information</b> = data that has been <b>processed</b> so it means something. "We sold 30% more on hot days." 💡</p><div class="eg">Survey forms filled in by customers = <b>data</b>. The report summarising them = <b>information</b>.</div>` },
      { h: 'What makes info GOOD?', b: `<ul><li><b>Relevant</b>: useful for the purpose</li><li><b>Complete</b> enough to decide</li><li><b>Accurate enough</b>: it doesn't need to be perfect, just reliable for its purpose</li><li><b>Clear</b> and trusted (<b>confidence</b>)</li><li>Sent to the <b>right person</b> through the right channel</li><li>Not too much (<b>volume</b>). Report by <b>exception</b>!</li><li><b>Timely</b>: on time</li><li><b>Costs less than its benefit</b></li><li><b>Comparable</b> over time</li></ul><div class="trap">⚠️ "Information must be 100% accurate" is FALSE. Sufficiently accurate is enough.</div>` },
      { h: 'Three levels of information', b: `<table class="t"><tr><th>Level</th><th>Who</th><th>What</th></tr>
        <tr><td>🏔 <b>Strategic</b></td><td>Top bosses</td><td>Long-term, whole business, inside + outside info, often one-off. "Should we open in Sydney?"</td></tr>
        <tr><td>🏙 <b>Tactical</b></td><td>Middle managers</td><td>Short/medium term, regular reports. <b>Budgets, variance reports</b>, cash forecasts</td></tr>
        <tr><td>🏠 <b>Operational</b></td><td>Supervisors</td><td>Day-to-day detail, internal. "Hours each worker did this week"</td></tr></table>` },
      { h: 'Financial + non-financial', b: `<p>Managers need both:</p><ul><li>💲 Financial: cost of staff, electricity, meals</li><li>😀 Non-financial: staff happiness, meals served per day, quality, customer satisfaction</li></ul><p>Also watch out for <b>information overload</b> (too much info) and keep data safe (an <b>ISMS</b> = information security management system).</p>` },
    ],
    check: [
      ['Monthly variance reports are which type of information?', ['Tactical', 'Strategic', 'Operational', 'External'], 'Middle managers, routine reports = tactical.'],
      ['Which is NOT needed for good information?', ['It must be 100% accurate', 'It must be timely', 'It must be relevant', 'Benefit must exceed cost'], 'Accurate ENOUGH for its purpose.'],
      ['Customer survey forms (before processing) are…', ['Data', 'Information', 'Strategy', 'A budget'], 'Raw facts = data.'],
    ],
  },
  {
    id: 'm1-5', mod: 1, lo: '1.3', title: 'Modern ideas: JIT, TQM, Kaizen & friends', mins: 8, game: 'ninja',
    slides: [
      { h: 'JIT: Just-in-Time', b: `<div class="pic">🍋⏱🥤</div><p>Lily only squeezes lemons <b>when a customer orders</b>. No big piles of lemonade going warm.</p><p>This is a <b>pull</b> system (demand pulls production). The old way is <b>push</b> (make lots and store it).</p><p>Goal: <b>zero inventory</b> and perfect quality. (More in Module 7.)</p>` },
      { h: 'TQM & Kaizen', b: `<p><b>TQM (Total Quality Management)</b>: everyone, everywhere, all the time, aims for <b>zero defects</b>. Get it "right first time".</p><p><b>Kaizen</b>: Japanese for <b>continuous improvement</b>. Lots of tiny improvements at every level. Kaizen is part of TQM.</p>` },
      { h: 'Lean, target & life-cycle costing', b: `<ul><li><b>Lean</b>: cut out <b>waste</b>, keep improving, focus on value streams.</li><li><b>Target costing</b>: decide the price customers will pay, subtract the profit you want, and what's left is the cost you must hit.<div class="formula">Target cost = target price − profit wanted</div></li><li><b>Life-cycle costing</b>: track a product's costs and revenues over its <b>whole life</b>, from design to the day it's dropped.</li></ul>` },
    ],
    check: [
      ['Producing only when customers demand it is…', ['JIT', 'TQM', 'Target costing', 'Life-cycle costing'], 'Just-in-time is a pull system.'],
      ['Kaizen means…', ['Continuous improvement', 'Zero inventory', 'A big one-off change', 'A type of tax'], 'Many small improvements, always.'],
      ['Target cost =', ['Target price − profit wanted', 'Cost + mark-up', 'Actual cost − variance', 'Sales × 2'], 'Price first, then work backwards to the cost.'],
    ],
  },
  {
    id: 'm1-6', mod: 1, lo: '1.3', title: 'Sustainability and value creation', mins: 7, game: 'ninja',
    slides: [
      { h: 'Sustainability', b: `<div class="pic">🌍♻️</div><p>Sustainability = meeting the needs of <b>today</b> without hurting the ability of <b>future generations</b> to meet theirs.</p><p>For Lily: use lemons only as fast as trees can regrow, and don't make more waste than nature can handle.</p>` },
      { h: 'Triple bottom line & GRI', b: `<p>Report on three things, not just profit:</p><div class="formula">💵 Economic + 🌳 Environmental + 👥 Social</div><p>The <b>GRI (Global Reporting Initiative)</b> is the world's standard-setter for sustainability reporting.</p><p>The MA's role: report emissions and energy use, measure sustainability KPIs, and show the costs of preventing environmental damage.</p>` },
      { h: 'How MA creates value', b: `<p>Management accounting is a <b>value-adding process</b>. It:</p><ul><li>guides management action</li><li>motivates behaviour</li><li>supports the culture needed to hit objectives</li></ul><div class="say">It helps the business win, but it can't <i>guarantee</i> profit!</div>` },
    ],
    check: [
      ['Triple bottom line reporting covers…', ['Economic, environmental and social', 'Sales, costs and tax', 'Cash, profit and assets', 'Staff, suppliers and banks'], 'The three pillars of sustainability.'],
      ['The world standard-setter for sustainability reporting is the…', ['GRI', 'IASB', 'ATO', 'ASIC'], 'Global Reporting Initiative.'],
      ['MA as a value-adding process does NOT…', ['Guarantee profit', 'Guide action', 'Motivate behaviour', 'Support culture'], 'Nothing can guarantee profit.'],
    ],
  },
  {
    id: 'm1-7', mod: 1, lo: '1.4', title: 'Management accounting systems', mins: 9, game: 'ninja',
    slides: [
      { h: 'What\'s in an MAS?', b: `<p>A <b>management accounting system (MAS)</b> is made of:</p><ul><li>👩‍💼 People (management accountants)</li><li>💻 Technology</li><li>🗂 Records of transactions</li><li>🧮 The cost accounting system</li><li>📐 Techniques (maths and analysis)</li><li>📊 Reports</li><li>👔 The <b>users</b>: the managers</li></ul>` },
      { h: 'Things that go wrong', b: `<ul><li>💲 <b>Too much focus on money</b>: forgets quality and customers</li><li>🏠 <b>Internal orientation</b>: ignores competitors and customers outside</li><li>🎯 <b>Lack of goal congruence</b>: managers chase their own targets and hurt the whole company</li><li>🔙 <b>No future perspective</b>: only reports the past</li><li>🦖 <b>Stuck in old methods</b></li></ul>` },
      { h: 'Designing an MAS', b: `<ol class="reveal"><li>Start with <b>what info managers need</b> (output first!)</li><li>Find the <b>input data</b> (internal and external)</li><li>Decide the <b>processing</b> and how often</li><li>Think about the <b>response</b>: how will managers act on it?</li></ol>` },
      { h: 'Other sectors', b: `<p><b>Services</b> (no stock, made and consumed at once): measure flexibility, excellence, innovation, finance, resource use, competitiveness.</p><p><b>Not-for-profit</b>: the 3 Es of value for money.</p><div class="formula">Economy = cheap inputs · Efficiency = process works well · Effectiveness = goals achieved</div>` },
    ],
    check: [
      ['Managers chasing their own targets at the company\'s expense = lack of…', ['Goal congruence', 'Materiality', 'Liquidity', 'Comparability'], 'Goals should line up.'],
      ['When designing an MAS, start with…', ['The information managers need', 'Buying software', 'The audit', 'The tax return'], 'Output first.'],
      ['"Economy" in the public sector means…', ['Getting inputs at the lowest cost', 'Achieving goals', 'Processes working well', 'Maximising profit'], 'Economy, efficiency, effectiveness.'],
    ],
  },
];
