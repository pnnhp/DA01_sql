// Lessons are written like a friendly teacher talking to a 10-year-old, but they cover EVERY section of the
// CPA Australia Management Accounting study guide. Each lesson also owns practice questions:
//   check = the 3-question end-of-lesson quiz, pool = extra practice questions for that lesson.
// Game questions in content/bank.js and generators also name the lesson that teaches them.
// Running story: Lily starts a lemonade stand that grows into "Lily's Juice Co." factory.
// Slide HTML helpers (style.css): .say (Penny the piggy-bank teacher), .pic, .formula, .eg, ol.reveal, .trap, table.t
export default [
  {
    id: 'm0-start', mod: 0, lo: null, title: 'Start here: what is this exam?', mins: 7, game: null,
    slides: [
      { h: 'Hi! I\'m Penny 🐷', b: `<div class="pic">🐷💰</div><div class="say">I'm a piggy bank and I LOVE money questions. I'll be your teacher. You don't need to know anything about accounting. If you can count pocket money, you can do this!</div>` },
      { h: 'What is the exam?', b: `<p>The <b>CPA Australia Management Accounting</b> Foundation exam is:</p><ul><li>📝 <b>100 questions</b>, each with 4 choices (A, B, C, D)</li><li>⏱ <b>3 hours 15 minutes</b>, so about <b>2 minutes per question</b></li><li>✅ No penalty for wrong answers, so <b>never leave a blank</b>!</li><li>🧮 Lots of questions need a little maths (just + − × ÷)</li><li>🚩 You can <b>flag</b> questions and come back to them at the end</li></ul>` },
      { h: 'How to answer a multiple-choice question', b: `<ol class="reveal"><li>Read the question carefully. What EXACTLY is it asking?</li><li>Try to work out the answer BEFORE looking at the options.</li><li>Careful! Wrong options are often answers you get by making a common mistake.</li><li>If no option matches, re-read, cross out silly options, pick the most likely.</li><li>Still stuck? Flag it, move on, come back later.</li></ol>` },
      { h: 'The 7 "worlds" (modules)', b: `<table class="t"><tr><th>Module</th><th>About</th><th>Exam %</th></tr>
        <tr><td>M1</td><td>What management accountants do</td><td>7%</td></tr><tr><td>M2</td><td>Kinds of costs</td><td>15%</td></tr>
        <tr><td>M3</td><td>Working out what a product costs</td><td><b>23%</b></td></tr><tr><td>M4</td><td>Budgets & "variances"</td><td><b>20%</b></td></tr>
        <tr><td>M5</td><td>Measuring performance</td><td>12%</td></tr><tr><td>M6</td><td>Making decisions</td><td><b>18%</b></td></tr><tr><td>M7</td><td>Stock & pricing</td><td>5%</td></tr></table>
        <div class="say">M3, M4 and M6 are 61% of the exam, so we'll spend the most time there.</div>` },
      { h: 'Meet Lily 🍋', b: `<div class="pic">👧🍋🥤</div><p>In every lesson we follow <b>Lily</b>. She starts a <b>lemonade stand</b>, and it slowly grows into a big juice factory called <b>Lily's Juice Co.</b></p><p>Every hard word in accounting is just a fancy name for something Lily already does. I promise!</p>` },
      { h: 'How to use the app each day', b: `<ol><li>📖 Do <b>today's lessons</b>. Tap 🔊 if you'd like me to read to you.</li><li>✅ Answer the quick check questions at the end.</li><li>🎮 Then play the module's game. <b>Games only ask about lessons you've finished</b>, so every question has been taught first.</li><li>❌ Got one wrong? The results screen tells you which lesson to revisit.</li><li>🏆 Watch your rank go up and beat the bot!</li></ol><div class="say">Little and often wins. 30–60 minutes a day beats one huge cram.</div>` },
    ],
    check: [
      ['How many questions are in the exam?', ['100', '50', '200', '75'], '100 multiple-choice questions in 3 hours 15 minutes.'],
      ['If you don\'t know an answer, you should…', ['Guess. There\'s no penalty for wrong answers', 'Leave it blank', 'Skip the exam', 'Pick nothing'], 'Wrong answers lose nothing, so always pick something.'],
      ['Which three modules are the biggest?', ['M3, M4 and M6', 'M1, M2 and M7', 'M5, M6 and M7', 'M1, M3 and M5'], 'Product costing 23%, budgets 20%, decisions 18%.'],
    ],
    pool: [
      ['About how long should you spend per question?', ['About 2 minutes', 'About 30 seconds', 'About 5 minutes', 'About 10 minutes'], '195 minutes ÷ 100 questions ≈ 2 minutes.'],
      ['None of the four options matches your answer. Best next step?', ['Re-read the question and eliminate obviously wrong options', 'Leave it blank', 'Always pick C', 'End the exam'], 'Re-read, eliminate, choose the most likely, or flag it.'],
    ],
  },

  // ───────── MODULE 1 ─────────
  {
    id: 'm1-1', mod: 1, lo: '1.1', title: 'What does a management accountant do?', mins: 10, game: 'ninja',
    slides: [
      { h: 'Lily needs answers', b: `<div class="pic">🍋❓</div><p>Lily's stand is busy. She keeps wondering:</p><ul><li>"How much lemonade should I make tomorrow?" (<b>planning</b>)</li><li>"Did I spend more on sugar than I meant to?" (<b>control</b>)</li><li>"Should I sell cookies too?" (<b>decision making</b>)</li></ul><div class="say">A <b>management accountant</b> gives decision makers the numbers AND advice to answer these questions.</div>` },
      { h: 'The big three jobs', b: `<div class="formula">Management accounting = information for <b>Planning</b> + <b>Control</b> + <b>Decision making</b></div><p>The information is for people <b>inside</b> the business (the managers). It covers both strategy and day-to-day operations.</p>` },
      { h: 'What managers use MA information for', b: `<ul><li>🤔 To make <b>decisions</b></li><li>📅 To <b>plan</b> for the future</li><li>📏 To <b>monitor performance</b> against goals and targets</li><li>💵 To <b>measure profits</b> and put a <b>value on inventory</b> (stock)</li><li>⚙️ To make sure resources are used <b>effectively and efficiently</b> to create value for customers and stakeholders (IFAC)</li></ul>` },
      { h: 'Three things MA info should do (1950s idea)', b: `<ol class="reveal"><li><b>Scorekeeping</b>: "How are we doing overall?" Like a football scoreboard. 🏆</li><li><b>Attention-directing</b>: "Look here, there's a problem!" Like a flashing warning light. 🚨</li><li><b>Problem-solving</b>: "Which choice is best?" Comparing options. 🧩</li></ol>` },
      { h: 'The modern management accountant', b: `<ul><li>Computers now do the boring routine reports, so MAs spend more time on <b>complex analysis and advice</b>.</li><li>MA now also covers <b>strategic</b> information, <b>non-financial</b> information, and support for <b>risk management</b>.</li><li>Technology makes it easier to give accounting info to <b>non-financial managers</b>.</li></ul>` },
      { h: 'Cross-functional teams', b: `<p>A <b>cross-functional team</b> is a small group of people with <b>different expertise</b> from different parts and levels of the organisation, working towards one goal.</p><p>👍 Better coordination, solving problems across department boundaries, more innovation.</p><p>The MA helps by:</p><ul><li>providing, collecting and assessing the team's key information</li><li>helping set goals and priorities</li><li>helping solve problems and make decisions (using decision models)</li><li>keeping the team looking at the <b>whole organisation</b></li></ul>` },
      { h: 'Objectives of the MA function', b: `<p>The managers are the MA team's <b>internal customers</b>. The overall objective is <b>quality service and decision-making information</b>, which breaks down into:</p><table class="t"><tr><th>Sub-objective</th><th>Means</th></tr>
        <tr><td>Provide <b>good information</b></td><td>Relevant, reliable (accurate enough), timely, clear and well communicated</td></tr>
        <tr><td><b>Value for money</b></td><td>The MA function's cost is justified by its benefits</td></tr>
        <tr><td><b>Informed personnel available</b></td><td>Staff around to answer questions when needed</td></tr></table>
        <p>Then decide the <b>activities</b>: "What information do we want?" and "What size of function do we need, and what will it cost?"</p>` },
      { h: 'Is the MA team doing a good job?', b: `<ul><li>⭐ <b>Quality</b> of info: useful, timely, reliable, judged by users</li><li>💸 <b>Value for money</b>: compare cost with other providers</li><li>🙋 <b>Availability</b>: time spent with managers, speed of response</li><li>🤸 <b>Flexibility</b>: meets agreed service levels, handles ad-hoc reports</li><li>📋 <b>User satisfaction surveys</b>: very useful!</li><li>⏰ Timeliness of reports, attendance at management meetings, involvement in strategic projects</li></ul>` },
    ],
    check: [
      ['The three main uses of management accounting info are…', ['Planning, control and decision making', 'Tax, audit and law', 'Selling, buying and hiring', 'Printing, filing and posting'], 'MA supports planning, control and decision making.'],
      ['Info that says "look here, there\'s a problem" is…', ['Attention-directing', 'Scorekeeping', 'Problem-solving', 'Auditing'], 'Attention-directing points managers to problems.'],
      ['A good way to measure the MA team\'s performance is…', ['User satisfaction surveys from managers', 'The company share price', 'Number of pens used', 'The tax bill'], 'Managers are the internal customers of MA.'],
    ],
    pool: [
      ['Who are the "internal customers" of the management accounting function?', ['Managers inside the organisation', 'Shareholders', 'The tax office', 'Suppliers'], 'MA serves internal managers.'],
      ['Which is a benefit of cross-functional teams?', ['Solving problems across departmental boundaries', 'Fewer people involved', 'Only accountants decide', 'No need for information'], 'Also coordination and innovation.'],
      ['Why do MAs now spend less time on routine reports?', ['Much routine work is computerised', 'Routine reports are illegal', 'Managers don\'t want any reports', 'Auditors prepare them'], 'Technology frees MAs for analysis and advice.'],
      ['Which is NOT a sub-objective of the MA function?', ['Maximising the number of reports produced', 'Providing good information', 'Value for money', 'Availability of informed staff'], 'More reports isn\'t a goal; useful information is.'],
    ],
  },
  {
    id: 'm1-2', mod: 1, lo: '1.2', title: 'Financial vs cost vs management accounting', mins: 10, game: 'ninja',
    slides: [
      { h: 'Two different audiences', b: `<div class="pic">🏠 vs 🌍</div><p><b>Management accounts</b> are for people <b>inside</b> (Lily and her managers).</p><p><b>Financial accounts</b> are for people <b>outside</b>: shareholders, customers, suppliers, the tax office (ATO), the regulator (ASIC), unions and other groups.</p><p>Much of the <b>data is the same</b>; it's just analysed differently. MA also uses <b>non-financial</b>, <b>external</b> and <b>future</b> data.</p>` },
      { h: 'Side by side', b: `<table class="t"><tr><th>Financial accounts</th><th>Management accounts</th></tr>
        <tr><td>Show past performance and position, for third parties</td><td>Help managers record, plan, control and decide; measure activities vs strategic objectives</td></tr>
        <tr><td>Required by <b>law</b> (limited companies)</td><td><b>No law</b> says you must</td></tr>
        <tr><td>Format set by law and standards (IAS/IFRS), so firms can be compared</td><td>Any format managers like</td></tr>
        <tr><td>Whole business added together; an end in themselves</td><td>Can zoom into one product or department; produced to <b>aid a decision</b></td></tr>
        <tr><td>Mostly <b>money</b></td><td>Money <b>and</b> non-money (tonnes, machine hours, km)</td></tr>
        <tr><td>Mostly the <b>past</b> (history)</td><td>Both a historical record <b>and</b> a future planning tool</td></tr></table>
        <p>MA tools include <b>Corporate Performance Management (CPM)</b> and <b>Business Intelligence (BI)</b> software.</p>` },
      { h: 'Where does cost accounting fit?', b: `<div class="say">Cost accounting is a <b>part of</b> management accounting. It's the kitchen where the ingredients (cost data) are prepared. Don't use the two names as if they mean the same thing!</div><p><b>Cost accounting</b> = preparing cost estimates, collecting cost data, measuring inventory and product/service costs.</p><p><b>Management accounting</b> = <b>interpreting</b> that data and <b>communicating</b> it as information (targets, performance measures).</p>` },
      { h: 'What cost accounts are used for', b: `<ul><li>Cost of goods made or services provided</li><li>Cost of a department or business unit</li><li>Revenues and <b>profitability</b> of products, services, departments</li><li>Setting selling prices with regard to costs</li><li><b>Inventory values</b> (raw materials, WIP, finished goods) for the statement of financial position</li><li><b>Future costs</b>: budgeting</li><li><b>Actual vs budget</b>: variances and budgetary control</li></ul><p>Cost accounting is used in manufacturing, but also in services, government and non-profits, and in every department.</p>` },
      { h: 'How fast?', b: `<ol class="reveal"><li>Management accounting info: needed <b>immediately</b> ⚡</li><li>Cost accounting: <b>quickly</b> 🏃</li><li>Financial accounting: usually <b>delayed</b> 🐢 (year-end reports)</li></ol><div class="trap">⚠️ Exam traps: "There is a legal requirement to prepare management accounts" is FALSE. "Management accounts are only a planning tool, not a historical record" is FALSE (they're both). "Cost accounting can only be used for inventory valuation" is FALSE.</div>` },
    ],
    check: [
      ['Which is TRUE about management accounts?', ['There is no legal requirement to prepare them', 'Their format is set by IFRS', 'They only show the past', 'They only use money amounts'], 'Free format, no law, past + future, money + non-money.'],
      ['Cost accounting is…', ['Part of management accounting', 'The same as financial accounting', 'Only used by the tax office', 'Not related to MA'], 'It provides the data bank for management accountants.'],
      ['"Tonnes of lemons used this month" is most likely in…', ['Management accounts', 'Published financial statements', 'A tax return', 'An audit report'], 'MA includes non-money measures.'],
    ],
    pool: [
      ['Which statement about management accounts is correct?', ['They are both a historical record and a planning tool', 'They are required by law', 'Their format is set by IFRS', 'They are only for shareholders'], 'Past and future, no legal format.'],
      ['Which is an external user of financial accounts?', ['The Australian Taxation Office', 'The production manager', 'The sales manager', 'The management accountant'], 'Financial accounts are for third parties.'],
      ['Which is a management accounting software tool mentioned in the syllabus?', ['Business Intelligence (BI) software', 'A tax return form', 'A share register', 'An audit opinion'], 'CPM and BI software support MA.'],
      ['Interpreting data and communicating it as targets and performance measures is…', ['Management accounting', 'Cost accounting', 'Financial accounting', 'Auditing'], 'Cost accounting collects; MA interprets and communicates.'],
      ['Which is NOT a use of cost accounts?', ['Issuing an audit opinion', 'Valuing inventory', 'Budgeting future costs', 'Comparing actual with budget'], 'Auditing is a separate function.'],
    ],
  },
  {
    id: 'm1-3', mod: 1, lo: '1.3', title: 'Goals, plans and control', mins: 12, game: 'ninja',
    slides: [
      { h: 'Dreams → goals → plans', b: `<ul><li>🌈 <b>Vision</b>: a short statement of future aspirations. "Every kid in town drinks Lily's juice."</li><li>🎯 <b>Mission</b>: the fundamental purpose (plus strategy, standards and values). "Fresh, healthy juice at fair prices."</li><li>🏁 <b>Objective</b> (goal, aim): a target. "Sell 1,000 cups this summer."</li><li>🗺 <b>Strategy</b>: a possible course of action to reach the objective. "Open a 2nd stand near the park."</li></ul><div class="trap">⚠️ Objective = the TARGET. Strategy = the ROUTE to the target. "An objective is a course of action" is FALSE!</div>` },
      { h: 'Planning', b: `<p>Planning makes managers think ahead. It involves:</p><ol class="reveal"><li>Establishing overall <b>objectives</b></li><li>Selecting <b>strategies</b> to achieve them</li><li>Setting <b>targets</b> for each strategy</li><li>Making <b>detailed plans</b> to hit those targets</li></ol>` },
      { h: 'What do organisations aim for?', b: `<ul><li>💼 <b>Profit-making</b>: usually <b>maximise shareholder wealth</b> (create value for shareholders by maximising profit). A secondary aim might be <b>growth</b>. Careful: chasing short-term profit can hurt long-term survival.</li><li>❤️ <b>Not-for-profit</b>: usually <b>provide goods/services</b>; secondary aim to minimise the cost of doing so.</li></ul><p>Typical stated objectives: maximise profits, maximise revenue, maximise shareholder value, increase market share, minimise costs.</p>` },
      { h: 'Long-term (strategic) planning', b: `<p>Also called <b>corporate planning</b>. Covers 2, 5, 7, 10 years or more. Four elements:</p><ol class="reveal"><li>Assess the organisation and its environment</li><li>Determine corporate objectives</li><li>Devise strategies to achieve them</li><li>Create a corporate plan</li></ol>` },
      { h: 'Short-term (tactical) planning', b: `<p>The corporate plan is turned into <b>short-term plans (usually one year)</b> for business units, functions and departments. Each is a step towards the long-term objectives.</p><p>The MA helps by providing information for <b>targets and standards</b> and the <b>assumptions</b> (growth rates, costs, efficiency savings, inflation).</p><div class="eg">A sales manager prepares a direct labour plan so this year's sales targets are met → that's <b>tactical planning</b>.</div>` },
      { h: 'Control: check and fix', b: `<p>Two stages of control:</p><ol class="reveal"><li>Compare <b>actual</b> performance with the <b>plan</b> regularly; find big differences; take <b>corrective action</b>.</li><li>Review the <b>corporate plan</b> itself in light of the comparisons and changes (new competitors, new laws). Modify it if needed.</li></ol><p>Planning and control are linked: no control without a plan; plans fail without control. Bigger firms use regular management reports; small firms may use informal or ad-hoc reports.</p>` },
      { h: 'The management control system', b: `<p>A system that <b>measures and corrects</b> the performance of subordinates so objectives are met and plans carried out. Its elements:</p><ol class="reveal"><li>Plan what to do and the desired results</li><li>Record the plan, with standards or targets</li><li>Carry out the plan and measure actual results</li><li>Compare actual with the plan</li><li>Evaluate the comparison: is action needed?</li><li>Take corrective action where necessary</li></ol>` },
      { h: 'Example', b: `<div class="eg"><b>Lily's costs were 15% higher than planned.</b><br>Best response? <b>Investigate!</b> The cause may be <b>controllable</b> (someone wasted sugar → fix it) or <b>uncontrollable</b> (sugar prices rose everywhere → revise the forecast or target).</div>` },
    ],
    check: [
      ['"Sell 1,000 cups this summer" is an…', ['Objective', 'Strategy', 'Mission', 'Vision'], 'An objective is a target to reach.'],
      ['A strategy is…', ['A course of action to achieve objectives', 'The goal itself', 'A dream statement', 'A tax rule'], 'Strategy = the how.'],
      ['Costs came in 15% over budget. Best response?', ['Investigate: fix it if controllable, revise plans if not', 'Cut all costs by 15% at once', 'Ignore it', 'Fire everyone'], 'Always find the cause first.'],
    ],
    pool: [
      ['The main objective of a profit-making organisation is usually to…', ['Maximise shareholder wealth', 'Minimise tax', 'Maximise staff numbers', 'Provide free services'], 'Create value for shareholders.'],
      ['The main objective of a not-for-profit organisation is usually to…', ['Provide goods and services', 'Maximise profit', 'Maximise share price', 'Increase market share'], 'Secondary aim: minimise the cost of providing them.'],
      ['Long-term planning is also called…', ['Corporate (strategic) planning', 'Operational planning', 'Daily scheduling', 'Variance analysis'], 'It covers several years.'],
      ['Short-term (tactical) plans usually cover…', ['About one year', '10 years', 'One day', 'The whole life of the company'], 'The annual budget.'],
      ['Which is the FIRST element of a management control system?', ['Planning what to do and the desired results', 'Taking corrective action', 'Comparing actual with plan', 'Measuring results'], 'Plan → record → do & measure → compare → evaluate → act.'],
      ['The second stage of control involves…', ['Reviewing the corporate plan itself in light of results and changes', 'Firing managers', 'Paying dividends', 'Auditing the accounts'], 'Plans may need modifying.'],
      ['A succinct statement of an organisation\'s future aspirations is its…', ['Vision', 'Mission', 'Strategy', 'Budget'], 'Mission = fundamental purpose.'],
    ],
  },
  {
    id: 'm1-4', mod: 1, lo: '1.3', title: 'Data, information and the 3 levels', mins: 13, game: 'ninja',
    slides: [
      { h: 'Data vs information', b: `<p><b>Data</b> = raw facts, events and transactions. Like a messy pile of receipts. 🧾🧾🧾</p><p><b>Information</b> = data that has been <b>processed</b> so it means something to the person who receives it. "We sold 30% more on hot days." 💡</p><div class="eg">Questionnaires filled in by the public = <b>data</b>. The report summarising them = <b>information</b>.</div><p>An MAS is only as good as the information it provides.</p>` },
      { h: 'What makes info GOOD? (1)', b: `<ul><li><b>Relevant</b>: has a purpose; fits what the manager needs</li><li><b>Complete</b>: users have the full picture</li><li><b>Reliable / accurate enough</b>: free from material error. It does NOT need to be perfect; uncertainty (e.g. forecasts) should be understood</li><li><b>Clear</b>: easy to understand, sensible format</li><li><b>Inspires confidence</b>: trusted (depends on reliability, relevance, clarity)</li></ul>` },
      { h: 'What makes info GOOD? (2)', b: `<ul><li><b>Communicated</b> to the right person (the one with authority to act)</li><li><b>Volume</b> manageable: too much can't be handled, so report by <b>exception</b></li><li><b>Timely</b>: in time to be used; not too often either (weekly reports for a monthly decision waste effort)</li><li>Right <b>channel</b> of communication (email, phone, formal report)</li><li><b>Cost < benefit</b></li><li><b>Comparable</b> over time</li></ul><div class="trap">⚠️ "Information must be 100% accurate" is FALSE. Sufficiently accurate is enough.</div>` },
      { h: 'Three levels of information (Anthony)', b: `<p>Robert Anthony split management activity into strategic planning, management control and operational control.</p><table class="t"><tr><th>Level</th><th>Who</th><th>Features</th></tr>
        <tr><td>🏔 <b>Strategic</b></td><td>Senior managers</td><td>Internal AND external sources; summarised; long term; whole organisation; often ad hoc; quantitative + qualitative; uncertain. E.g. overall profitability, segment profitability, capital equipment needs</td></tr>
        <tr><td>🏙 <b>Tactical</b></td><td>Middle managers</td><td>Mainly internal; short–medium term; departments/activities; routine and regular; mostly quantitative. E.g. <b>productivity</b> measures, <b>budget & variance reports</b>, <b>cash flow forecasts</b></td></tr>
        <tr><td>🏠 <b>Operational</b></td><td>Front-line (foremen, supervisors)</td><td>Almost entirely internal; highly detailed; immediate; very frequent; task-specific. E.g. hours each employee worked this week</td></tr></table>` },
      { h: 'Why information matters', b: `<p>Better information → better decisions. Examples:</p><ul><li>Pricing at cost + 20% needs the <b>product's cost</b></li><li>Broken machine: repair, buy or hire? Needs <b>each option's cost</b></li><li>Early-payment discount: needs current <b>customer payment patterns</b></li></ul><p>Hospitals, councils, charities and clubs need information too.</p>` },
      { h: 'Financial + non-financial', b: `<div class="eg">ABC Co. opens a staff cafeteria.<br>💲 Financial: staff costs, meal subsidies, gas and electricity.<br>😀 Non-financial: staff morale, meals served per day, meter readings.<br>Together → average cost per meal.</div><p>Non-financial info covers quality, speed, flexibility, creativity, motivation, customer satisfaction and competitive advantage.</p>` },
      { h: 'Meeting management\'s needs today', b: `<ul><li>⚠️ <b>Information overload</b>: so much info that key points get missed → present it clearly; short reports more often</li><li>🔒 <b>Security</b>: protect against viruses, spyware, leaks → an <b>ISMS</b> (information security management system) makes staff aware of security</li><li>📊 <b>Self-service BI (SSBI)</b>: lets non-statisticians turn raw data into information</li><li>🔗 <b>Data integration software</b>: combines data from different systems (e.g. accounting + operations)</li></ul>` },
    ],
    check: [
      ['Monthly variance reports are which type of information?', ['Tactical', 'Strategic', 'Operational', 'External'], 'Middle managers, routine reports = tactical.'],
      ['Which is NOT needed for good information?', ['It must be 100% accurate', 'It must be timely', 'It must be relevant', 'Benefit must exceed cost'], 'Accurate ENOUGH for its purpose.'],
      ['Customer survey forms (before processing) are…', ['Data', 'Information', 'Strategy', 'A budget'], 'Raw facts = data.'],
    ],
    pool: [
      ['Strategic information is mainly derived from…', ['Both internal and external sources', 'Internal sources only', 'Payroll records only', 'Daily production logs'], 'Strategic info looks outward too.'],
      ['Which describes operational information?', ['Highly detailed, frequent and task-specific', 'Summarised and long-term', 'Prepared ad hoc for the board', 'Mostly external'], 'For front-line supervisors.'],
      ['A cash flow forecast for the next quarter is…', ['Tactical information', 'Strategic information', 'Operational information', 'Not information'], 'Middle-management, short–medium term.'],
      ['Software that lets non-statisticians turn raw data into usable information is…', ['Self-service business intelligence (SSBI)', 'An ISMS', 'A budget manual', 'A Kanban'], 'SSBI.'],
      ['The main objective of an ISMS is to…', ['Make staff fully aware of information security', 'Prepare budgets', 'Value inventory', 'Calculate variances'], 'Information security management system.'],
      ['Weekly reports for a decision made monthly breach which quality of good information?', ['Timeliness (prepared too frequently)', 'Relevance of format', 'Completeness', 'Comparability'], 'Info should match the decision timing.'],
      ['Meals served per day in a staff cafeteria is…', ['Non-financial information', 'Financial information', 'A sunk cost', 'A variance'], 'Not measured in money.'],
    ],
  },
  {
    id: 'm1-5', mod: 1, lo: '1.3', title: 'Modern ideas: JIT, TQM, Kaizen, lean, target & life-cycle costing', mins: 10, game: 'ninja',
    slides: [
      { h: 'World-class manufacturing', b: `<p>Many "modern" methods belong to <b>World-Class Manufacturing (WCM)</b>: gaining and keeping competitive advantage through <b>strategic cost reduction</b>.</p><p>Management accountants responded to JIT, TQM and lean with techniques like <b>target costing, life-cycle costing and Kaizen</b>.</p>` },
      { h: 'JIT: Just-in-Time', b: `<div class="pic">🍋⏱🥤</div><p>Produce or buy things <b>only as they're needed</b> by a customer or for use, not for inventory.</p><ul><li>A <b>pull</b> system (demand pulls production). The old way is <b>push</b> (inventory as buffers between buying, making and selling).</li><li><b>JIT production</b>: each component is made only when needed for the next stage.</li><li><b>JIT purchasing</b>: buying is arranged so receipt and usage of materials coincide as much as possible.</li></ul>` },
      { h: 'TQM & Kaizen', b: `<p><b>TQM (Total Quality Management)</b> is a <b>culture</b>, not one technique: continuous improvement, however small, so customer needs are met better and better. <b>Zero defects</b>, "right first time".</p><p><b>Kaizen</b>: Japanese for <b>continuous improvement</b> in all aspects, at every level. It's a feature of TQM.</p>` },
      { h: 'Lean management accounting', b: `<p><b>Lean</b> = eliminate <b>waste</b> + continuous improvement. Customer demand drives the flow; focus on <b>processes and value streams</b>, not departments.</p><p>MA must show where waste is, and remove distortions like making unit costs look lower by producing huge batches.</p>` },
      { h: 'Life-cycle & target costing', b: `<ul><li><b>Life-cycle costing</b>: plan and track a product's costs and revenues over its <b>whole life</b>, from design to the end of its commercial life, to see its total profitability.</li><li><b>Target costing</b>:<br>Traditional way: design product → work out its cost → set price → hope for profit (control with monthly variances).<br>Target way: product concept → price customers will pay → <b>minus profit wanted = target cost</b>. If it can't be made for that, it's not made!<div class="formula">Target cost = target price − profit wanted</div></li></ul>` },
    ],
    check: [
      ['Producing only when customers demand it is…', ['JIT', 'TQM', 'Target costing', 'Life-cycle costing'], 'Just-in-time is a pull system.'],
      ['Kaizen means…', ['Continuous improvement', 'Zero inventory', 'A big one-off change', 'A type of tax'], 'Many small improvements, always.'],
      ['Target cost =', ['Target price − profit wanted', 'Cost + mark-up', 'Actual cost − variance', 'Sales × 2'], 'Price first, then work backwards to the cost.'],
    ],
    pool: [
      ['A system where inventories act as buffers between purchasing, production and sales is a…', ['Push system', 'Pull system', 'Kanban', 'Kaizen'], 'JIT is the opposite: pull.'],
      ['JIT purchasing aims to make…', ['Receipt and usage of materials coincide', 'Bulk purchases yearly', 'Inventory as large as possible', 'Suppliers deliver monthly'], 'Arrive just when needed.'],
      ['TQM is best described as…', ['A culture of continuous improvement with zero defects', 'A one-off cost-cutting project', 'A pricing technique', 'An inventory formula'], 'Right first time.'],
      ['World-class manufacturing aims for…', ['Competitive advantage through strategic cost reduction', 'Maximum inventory', 'Long production runs only', 'Higher prices'], 'WCM.'],
      ['In a lean system, the focus is on…', ['Processes and value streams', 'Departments', 'Large batches', 'Maximum inventory'], 'Customer demand drives flow.'],
    ],
  },
  {
    id: 'm1-6', mod: 1, lo: '1.3', title: 'Sustainability and creating value', mins: 10, game: 'ninja',
    slides: [
      { h: 'What is sustainability?', b: `<div class="pic">🌍♻️</div><p>Meeting the needs of <b>today</b> without hurting the ability of <b>future generations</b> to meet theirs (Brundtland report).</p><p>For a business: use resources only as fast as they can be <b>replenished</b>, and keep waste/emissions within what the environment can <b>absorb</b>.</p><div class="trap">⚠️ It's not ONLY about the environment. It applies to banks and shops too, not just mining and oil.</div>` },
      { h: 'Objectives of sustainability', b: `<p>Make sure the business can continue into the foreseeable future: identify risks to its existence and protect against them. A better quality of life through:</p><ul><li>Social progress that recognises everyone's needs</li><li>Effective protection of the environment</li><li>Prudent use of natural resources</li><li>High, stable economic growth and employment</li></ul><p>(But remember: businesses don't exist mainly to benefit society. Be realistic!)</p>` },
      { h: 'Sustainability accounting', b: `<p>New accounting and reporting tools for decisions that are not just about economic rationality, but also <b>ecological and social sustainability</b>.</p><p>The MA's role includes:</p><ul><li>Public reports on <b>carbon emissions, energy use</b>, local economic impact</li><li>Using them in an environmental/sustainability management system</li><li><b>CSR</b> (corporate social responsibility) reporting</li><li>Reporting them alongside the financial accounts</li><li><b>KPIs</b> showing progress on sustainability</li><li>Costs of <b>preventing, monitoring and reporting</b> environmental impacts</li></ul><p>IFAC: such a system helps define sustainability objectives, identify challenges/risks/opportunities, and make sure practices respond.</p>` },
      { h: 'Triple bottom line & GRI', b: `<div class="formula">💵 Economic + 🌳 Environmental + 👥 Social</div><ul><li><b>Economic</b>: impact on stakeholders' economic conditions and economic systems</li><li><b>Environmental</b>: impact on living and non-living natural systems (land, air, water)</li><li><b>Social</b>: impact on the social systems it operates in</li></ul><p>The <b>Global Reporting Initiative (GRI)</b>, founded 1997, is the world-wide <b>standard setter</b> for sustainability reporting (GRI Standards since 2016).</p>` },
      { h: 'How MA creates value', b: `<p>Management accounting is a <b>value-added process</b> that:</p><ul><li>guides management action</li><li>motivates behaviour</li><li>supports and creates the cultural values needed to achieve objectives</li></ul><p>The MA creates value by: giving relevant info for planning and decisions; helping direction and control; <b>motivating</b> people towards objectives; <b>measuring performance</b>; and assessing the organisation's <b>competitive position</b>.</p><div class="say">It helps the business win, but it can't <i>guarantee</i> profit!</div>` },
    ],
    check: [
      ['Triple bottom line reporting covers…', ['Economic, environmental and social', 'Sales, costs and tax', 'Cash, profit and assets', 'Staff, suppliers and banks'], 'The three pillars of sustainability.'],
      ['The world standard-setter for sustainability reporting is the…', ['GRI', 'IASB', 'ATO', 'ASIC'], 'Global Reporting Initiative.'],
      ['MA as a value-adding process does NOT…', ['Guarantee profit', 'Guide action', 'Motivate behaviour', 'Support culture'], 'Nothing can guarantee profit.'],
    ],
    pool: [
      ['Sustainability is defined as development that…', ['Meets present needs without compromising future generations', 'Maximises this year\'s profit', 'Only protects the environment', 'Only applies to mining'], 'Brundtland definition.'],
      ['Which is part of the MA\'s role in sustainability accounting?', ['Reporting carbon emissions and energy use', 'Setting interest rates', 'Auditing tax returns', 'Paying dividends'], 'Plus CSR reporting and sustainability KPIs.'],
      ['"Impacts on living and non-living natural systems" describes which GRI aspect?', ['Environmental performance', 'Economic performance', 'Social performance', 'Financial performance'], 'Land, air, water, ecosystems.'],
      ['Sustainability applies…', ['To all types of business, including banks and retailers', 'Only to mining and oil', 'Only to charities', 'Only to government'], 'Not just environmental industries.'],
      ['CSR stands for…', ['Corporate social responsibility', 'Cost saving report', 'Cash sales ratio', 'Capital spending review'], 'Reporting social/environmental initiatives.'],
    ],
  },
  {
    id: 'm1-7', mod: 1, lo: '1.4', title: 'Management accounting systems', mins: 12, game: 'ninja',
    slides: [
      { h: 'What\'s in an MAS?', b: `<p>MASs grew out of cost accounting systems. They're used for scorekeeping, directing attention and solving problems. A <b>management accounting system</b> is made of:</p><ul><li>👩‍💼 People with accounting knowledge</li><li>💻 The technology they use</li><li>🗂 Paper or computer records of transactions</li><li>🧮 The cost accounting system (codes like "Rent", "Factory A")</li><li>📐 MA techniques (simple and complex maths)</li><li>📊 Reports (or info available online)</li><li>👔 The <b>users</b>: managers</li></ul><p>Key parts: <b>inputs → processes → outputs</b>. It supports strategic decisions, performance measurement, operational control and costing, so it enables <b>strategic management</b>.</p>` },
      { h: 'Risks: things that go wrong', b: `<ul><li>💲 <b>Excessive emphasis on financial measures</b>: forgets quality, flexibility, customers, skills</li><li>🏠 <b>Internal orientation</b>: ignores customers, competitors, suppliers outside</li><li>🎯 <b>Lack of goal congruence</b>: managers chase departmental targets that hurt the whole organisation</li><li>🔙 <b>Lack of future perspective</b>: reports the past, no relevant costs for future decisions</li><li>🦖 <b>Failure to adapt</b> measures to changing circumstances</li></ul>` },
      { h: 'Designing an MAS', b: `<table class="t"><tr><th>Factor</th><th>Means</th></tr>
        <tr><td>1. <b>Information and timing</b></td><td>Start with the OUTPUT: what do managers need, how detailed, how accurate, how often?</td></tr>
        <tr><td>2. <b>Sources of input data</b></td><td>Internal and external data, and how to collect and store it</td></tr>
        <tr><td>3. <b>Processing</b></td><td>Which techniques; monthly reports, online, or on request</td></tr>
        <tr><td>4. <b>Response required</b></td><td>How managers should act on it, which depends on presentation</td></tr></table>
        <div class="eg">If MA info isn't relevant, reliable, timely and well communicated, it still gets used, but the <b>quality of decision making will be poor</b>.</div>` },
      { h: 'Services & not-for-profits', b: `<p><b>Service businesses</b>: production and consumption happen together, no finished goods inventory, satisfaction is hard to measure. Performance dimensions: <b>flexibility, excellence, innovation, financial performance, resource utilisation, competitiveness</b>.</p><p><b>Public sector / not-for-profit</b>: value for money = the 3 Es:</p><div class="formula">Economy = suitable inputs at lowest cost · Efficiency = the process working as expected · Effectiveness = achieving goals</div>` },
      { h: 'Strategic info from an MAS', b: `<p><b>Strategic management accounting</b> = MA that emphasises <b>external</b> factors and <b>non-financial</b> info as well as internal info. Examples:</p><ul><li>Competitors' costs; financial effect of competitor response</li><li>Product profitability and customer profitability</li><li>Pricing decisions; value of market share</li><li>Capacity expansion; brand values</li><li>Shareholder wealth (future profitability)</li><li><b>Cash flow</b>: a loss-making firm can survive with cash, but a profitable firm can't survive without liquidity!</li></ul>` },
      { h: 'Control & operational info from an MAS', b: `<ul><li><b>Management control (tactical) info</b>: covers the whole organisation; budgeting, planning and monitoring. Often quantitative (labour hours, material used, volumes), usually in money, sometimes non-financial. E.g. <b>profit forecasts, variance reports, productivity statistics</b>, often weekly or monthly.</li><li><b>Operational control info</b>: day-to-day "transaction data" (customer orders, purchase orders, cash receipts and payments). More detailed; often in units, hours and quantities.</li></ul><p>Detail increases as you go down: operational > management control > strategic.</p>` },
    ],
    check: [
      ['Managers chasing their own targets at the company\'s expense = lack of…', ['Goal congruence', 'Materiality', 'Liquidity', 'Comparability'], 'Goals should line up.'],
      ['When designing an MAS, start with…', ['The information managers need', 'Buying software', 'The audit', 'The tax return'], 'Output first.'],
      ['"Economy" in the public sector means…', ['Getting inputs at the lowest cost', 'Achieving goals', 'Processes working well', 'Maximising profit'], 'Economy, efficiency, effectiveness.'],
    ],
    pool: [
      ['If MA information lacks relevance, reliability and timeliness, the most likely consequence is…', ['Poor quality decision making', 'None of it will be used', 'Reliance on external info only', 'Reliance on financial statements only'], 'Info is still used, but decisions suffer.'],
      ['"Effectiveness" in the 3 Es means…', ['Achieving goals', 'Lowest cost inputs', 'Processes working as expected', 'Maximum profit'], 'Economy, efficiency, effectiveness.'],
      ['Which is a performance dimension for service businesses?', ['Flexibility', 'Inventory turnover of finished goods', 'Machine hours', 'Scrap value'], 'Also excellence, innovation, resource utilisation, competitiveness.'],
      ['Customer orders and cash receipts data are…', ['Operational control information', 'Strategic information', 'Management control information', 'External information'], 'Day-to-day transaction data.'],
      ['Profit forecasts and productivity statistics are…', ['Management control information', 'Operational information', 'Strategic only', 'Non-financial only'], 'Tactical / management control level.'],
      ['Why is cash flow strategic information?', ['A profitable company cannot survive without liquidity', 'Cash equals profit', 'Cash is never relevant', 'Only tax depends on cash'], 'Liquidity keeps a business alive.'],
      ['The key components of an MAS are…', ['Inputs, processes and outputs', 'Debits, credits and balances', 'Land, labour and capital', 'Price, product and place'], 'Inputs → processes → outputs.'],
    ],
  },
];
