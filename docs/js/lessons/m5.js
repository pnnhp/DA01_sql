export default [
  {
    id: 'm5-1', mod: 5, lo: '5.1', title: 'Responsibility centres', mins: 10, game: 'tycoon',
    slides: [
      { h: 'Who is responsible for what?', b: `<p>Lily's Juice Co. now has several managers. <b>Responsibility accounting</b> gives each manager the costs/revenues THEY control, and judges them on those.</p><div class="pic">🧑‍🔧 🧑‍💼 🧑‍✈️ 👑</div>` },
      { h: 'Four kinds of centre', b: `<table class="t"><tr><th>Centre</th><th>Manager controls</th><th>Example</th></tr>
        <tr><td>💸 Cost centre</td><td>Costs only</td><td>Maintenance dept, payroll</td></tr>
        <tr><td>🛒 Revenue centre</td><td>Revenue only</td><td>Sales office</td></tr>
        <tr><td>💰 Profit centre</td><td>Costs + revenue</td><td>A shop branch, a hotel</td></tr>
        <tr><td>🏦 Investment centre</td><td>Costs + revenue + <b>investment (capital)</b></td><td>A division that buys its own machines → ROI/RI</td></tr></table>
        <p>Cost centres can sit inside profit centres, and profit centres inside investment centres.</p>` },
      { h: 'Controllability & materiality', b: `<ul><li><b>Controllable costs</b>: ones the manager can influence in a given time. Don't blame a manager for a worldwide price rise or a company-wide pay rise!</li><li><b>Materiality</b>: only chase variances that are big enough to matter.</li></ul><div class="say">Judge people only on what they can control.</div>` },
    ],
    check: [
      ['A manager controlling costs, revenues AND investment runs a…', ['Investment centre', 'Profit centre', 'Cost centre', 'Revenue centre'], 'Measured by ROI/RI.'],
      ['An airline\'s operations centre at someone else\'s airport is likely a…', ['Cost centre', 'Profit centre', 'Revenue centre', 'Investment centre'], 'No revenue it controls.'],
      ['Least appropriate measure for a revenue centre:', ['Profitability', 'Speed of service', 'Customer satisfaction', 'On-time delivery'], 'It doesn\'t control costs.'],
    ],
  },
  {
    id: 'm5-2', mod: 5, lo: '5.2', title: 'Ratios, standard hours & control ratios', mins: 12, game: 'tycoon',
    slides: [
      { h: 'Simple ratios', b: `<div class="formula">Profit margin = Profit ÷ Sales × 100%</div><div class="formula">Gross profit margin = Gross profit ÷ Sales × 100%</div><div class="formula">Cost per unit = Total cost ÷ Units</div><p>A ratio only means something when you <b>compare</b> it: with budget, last year, other branches, or the industry.</p><p><b>Effectiveness</b> = hitting targets. <b>Efficiency/productivity</b> = output per input.</p>` },
      { h: 'Standard hours', b: `<p>Plates, mugs and eggcups are different, so "3,000 items" means nothing. Convert them to <b>standard hours</b> (how long the work SHOULD take) so they can be added together.</p><div class="eg">Plate ½ hr, mug ⅓ hr. 1,000 plates + 1,200 mugs = 500 + 400 = <b>900 standard hours</b>.</div>` },
      { h: 'The 3 control ratios', b: `<div class="formula">Efficiency = Std hours produced ÷ Actual hours worked</div><div class="formula">Capacity = Actual hours worked ÷ Budgeted hours</div><div class="formula">Activity = Std hours produced ÷ Budgeted hours</div><div class="say">Activity = Efficiency × Capacity. Memory trick: <b>E</b>fficiency uses <b>E</b>xactly-worked hours on the bottom.</div><div class="eg">Budget 1,100, std produced 1,125, actual 1,200 → efficiency 93.75%, capacity 109%, activity 102%.</div>` },
    ],
    check: [
      ['Efficiency ratio =', ['Std hrs produced ÷ actual hrs', 'Actual ÷ budget hrs', 'Std hrs ÷ budget hrs', 'Budget ÷ actual'], 'Output vs actual effort.'],
      ['Best way to add up output of different products:', ['Standard hours', 'Units', 'Sales value', 'Weight'], 'A common measure.'],
      ['Profit $50k, sales $400k. Profit margin?', ['12.5%', '8%', '50%', '20%'], '50 ÷ 400.'],
    ],
  },
  {
    id: 'm5-3', mod: 5, lo: '5.2', title: 'ROI and residual income', mins: 13, game: 'tycoon',
    slides: [
      { h: 'Return on investment', b: `<div class="formula">ROI = Profit before interest & tax ÷ Capital employed × 100%</div><div class="eg">Two divisions each make $10,000. A used $50,000 of capital (20%), B used $25,000 (40%). B did better!</div><p>Use <b>average</b> capital employed where possible.</p>` },
      { h: 'Residual income', b: `<div class="formula">RI = Profit − (Capital employed × Cost of capital)</div><p>The "notional interest" charge = what the money should earn at minimum.</p><div class="eg">Profit $100,000, capital $448,000, cost of capital 15%.<br>RI = 100,000 − 67,200 = <b>$32,800</b></div>` },
      { h: 'The ROI trap: goal congruence', b: `<div class="eg">Division ROI is 25%. Company cost of capital is 15%. A new project returns 20%.<ol class="reveal"><li>For the COMPANY: 20% &gt; 15% → good project ✅</li><li>For the MANAGER judged on ROI: 20% pulls 25% down → they REJECT it ❌</li><li>That's a goal congruence problem!</li><li>With RI: 20% − 15% = positive RI → the manager accepts ✅</li></ol></div>` },
      { h: 'Pros & cons', b: `<table class="t"><tr><th>ROI</th><th>RI</th></tr><tr><td>👍 % is easy to compare between divisions of different sizes</td><td>👍 encourages any project beating the cost of capital</td></tr><tr><td>👎 can make managers reject good projects</td><td>👎 absolute number, so hard to compare different-sized divisions</td></tr></table>` },
    ],
    check: [
      ['ROI usually uses…', ['Profit before interest and tax', 'Profit after tax', 'Sales', 'Cash'], 'PBIT ÷ capital.'],
      ['Profit $90k, capital $500k, cost of capital 12%. RI?', ['$30,000', '$60,000', '$90,000', '18%'], '90k − 60k.'],
      ['ROI 25%, cost of capital 15%, project 20%. ROI-judged manager will probably…', ['Reject it', 'Accept it', 'Not care', 'Double it'], 'It lowers their ROI.'],
    ],
  },
  {
    id: 'm5-4', mod: 5, lo: '5.3', title: 'The balanced scorecard', mins: 9, game: 'tycoon',
    slides: [
      { h: 'Not just money', b: `<p>Only looking at profit is like judging a football team only on ticket sales. The <b>balanced scorecard</b> (Kaplan & Norton) looks at 4 perspectives:</p><div class="pic">💰 😊 ⚙️ 🌱</div>` },
      { h: 'The 4 perspectives', b: `<table class="t"><tr><th>Perspective</th><th>Question</th><th>Measures</th></tr>
        <tr><td>💰 Financial</td><td>How do we create value for shareholders?</td><td>ROCE, cash flow, revenue growth, EPS</td></tr>
        <tr><td>😊 Customer</td><td>What do customers value?</td><td>Complaints, on-time deliveries, returns, new customers</td></tr>
        <tr><td>⚙️ Internal</td><td>Which processes must we excel at?</td><td>Rejects, set-up time, speed of management info</td></tr>
        <tr><td>🌱 Learning & growth</td><td>Can we keep improving?</td><td>Staff turnover, % revenue from new products, time to develop products</td></tr></table>` },
      { h: 'Why "balanced"?', b: `<p>Managers must think about all four at once, so they don't improve one by wrecking another.</p><p>👎 Problems: measures can <b>conflict</b>; choosing measures is hard; too many measures; interpretation is tricky.</p>` },
    ],
    check: [
      ['Labour turnover fits which perspective?', ['Learning & growth', 'Customer', 'Financial', 'Internal'], 'Staff and skills.'],
      ['On-time deliveries fits…', ['Customer', 'Internal', 'Financial', 'Learning'], 'Customers value it.'],
      ['The 4th perspective after financial, customer, internal is…', ['Learning and growth', 'External', 'Competitor', 'Supplier'], 'Kaplan & Norton.'],
    ],
  },
  {
    id: 'm5-5', mod: 5, lo: '5.4', title: 'Reward systems', mins: 8, game: 'tycoon',
    slides: [
      { h: 'Work for reward', b: `<p>Employment is a swap: you give work, the employer gives <b>reward</b>.</p><ul><li><b>Extrinsic</b> rewards come from the job <i>context</i>: pay, benefits, working conditions. 💵</li><li><b>Intrinsic</b> rewards come from the job <i>content</i>: feeling proud, learning, achievement. 🌟</li></ul>` },
      { h: '3 kinds of pay', b: `<ol><li><b>Base remuneration</b>: salary/wage for time worked</li><li><b>Performance-related</b>: commission, piecework, bonuses, profit share, share options</li><li><b>Indirect</b> (benefits): health insurance, car, childcare, extra holidays. "<b>Cafeteria</b>" = choose from a menu</li></ol>` },
      { h: 'What rewards should do', b: `<ul><li>Help <b>recruit and keep</b> staff</li><li><b>Motivate</b> high performance</li><li>Encourage <b>following rules</b></li><li>Support strategy and <b>goal congruence</b></li></ul><p>Pay levels depend on the labour market, the industry's cost pressure and laws (minimum wage).</p>` },
    ],
    check: [
      ['Pride in doing a great job is an…', ['Intrinsic reward', 'Extrinsic reward', 'Indirect remuneration', 'Base pay'], 'From job content.'],
      ['Health insurance for staff is…', ['Indirect remuneration', 'Base remuneration', 'Commission', 'Intrinsic'], 'A benefit.'],
      ['A cafeteria approach means…', ['Staff choose benefits from a menu', 'Free lunch', 'Same benefits for all', 'Paid in food'], 'Benefits match needs.'],
    ],
  },
];
