export default [
  {
    id: 'm4-1', mod: 4, lo: '4.1', title: 'What is a budget and why bother?', mins: 10, game: 'strike',
    slides: [
      { h: 'A plan written in numbers', b: `<div class="pic">📋💵</div><p>A <b>budget</b> = a plan in numbers for a set period (usually a year): expected sales, costs, assets, cash.</p><div class="say">It's like planning your pocket money for the month before you spend it!</div>` },
      { h: 'Why budget? (PCC-RCMA)', b: `<ul><li>📐 compel <b>P</b>lanning</li><li>📣 <b>C</b>ommunicate plans</li><li>🤝 <b>C</b>oordinate departments (sales → production → buying)</li><li>🧑‍💼 <b>R</b>esponsibility: each manager owns part of it</li><li>🔍 <b>C</b>ontrol: compare actual vs budget</li><li>🔥 <b>M</b>otivate staff</li><li>🍰 <b>A</b>llocate scarce resources</li></ul><p>All to help achieve the organisation's objectives.</p>` },
      { h: 'Who does what', b: `<ul><li><b>Budget committee</b> (senior managers + a budget officer, usually an accountant): coordinates, sets the timetable, issues the manual, monitors actual vs budget.</li><li><b>Budget manual</b>: the instruction book (objectives, who's responsible, timetable, forms).</li><li>Each manager drafts the budget for their own area.</li></ul>` },
      { h: 'The principal budget factor', b: `<p>The <b>principal (limiting) budget factor</b> is the thing that limits the business. It's usually <b>sales demand</b>, but it could be machines, materials or cash.</p><div class="say">Budget it FIRST! If sales limit you, do the sales budget first, then production, then materials, labour, overheads, and finally the cash budget and the master budget.</div>` },
    ],
    check: [
      ['The principal budget factor is usually…', ['Sales demand', 'Cash', 'Machines', 'Skilled labour'], 'So the sales budget comes first.'],
      ['Who coordinates and administers budgets?', ['The budget committee', 'The auditors', 'The shareholders', 'The bank'], 'Helped by a budget officer.'],
      ['Which is NOT a purpose of budgeting?', ['Guaranteeing profit', 'Coordination', 'Control', 'Motivation'], 'Budgets help, they don\'t guarantee.'],
    ],
  },
  {
    id: 'm4-2', mod: 4, lo: '4.2', title: 'Functional budgets: sales → production → materials', mins: 12, game: 'strike',
    slides: [
      { h: 'The chain', b: `<div class="pic">🛒 → 🏭 → 🍋 → 💵</div><ol><li>Sales budget (units × price)</li><li>Production budget (units)</li><li>Materials usage → materials purchases</li><li>Labour, overheads</li><li>Budgeted P&L, statement of financial position + cash budget = <b>master budget</b></li></ol>` },
      { h: 'Production budget', b: `<div class="formula">Production = Sales + Closing finished goods − Opening finished goods</div><div class="eg">Sell 1,200 bottles. Already have 450 in stock. Want 250 left at the end.<br>Make = 1,200 + 250 − 450 = <b>1,000</b></div><div class="say">Opening stock means you need to make LESS. Wanting stock at the end means you need to make MORE.</div>` },
      { h: 'Materials purchases budget', b: `<div class="formula">Purchases = Usage + Closing raw materials − Opening raw materials</div><div class="eg">Make 1,600 bottles × 3 kg lemons = 4,800 kg usage. Opening 1,700 kg, closing wanted 1,600 kg, price $8.<ol class="reveal"><li>Buy = 4,800 + 1,600 − 1,700 = 4,700 kg</li><li>× $8 = <b>$37,600</b></li></ol></div>` },
    ],
    check: [
      ['Production budget =', ['Sales + closing FG − opening FG', 'Sales − closing + opening', 'Sales + opening + closing', 'Sales only'], 'Opening stock reduces production.'],
      ['Sales 5,000; opening 400; closing 600. Production?', ['5,200', '4,800', '6,000', '5,000'], '5,000 + 600 − 400.'],
      ['Which budget is prepared first (sales-limited business)?', ['Sales budget', 'Cash budget', 'Purchases budget', 'Master budget'], 'Principal budget factor first.'],
    ],
  },
  {
    id: 'm4-3', mod: 4, lo: '4.2', title: 'Cash budgets', mins: 14, game: 'strike',
    slides: [
      { h: 'Cash ≠ profit', b: `<p>A <b>cash budget</b> shows money coming IN and going OUT each month, and the bank balance.</p><div class="say">Lily might sell lots on credit (customers pay later) and still run out of cash! Timing is everything.</div><div class="trap">⚠️ Depreciation is NOT cash, so it never goes in a cash budget.</div>` },
      { h: 'Timing example', b: `<div class="eg">Sales: Mar $136,000, Apr $60,000. 50% cash, 50% paid one month later.<br>Cash in April?<ol class="reveal"><li>April cash sales: 50% × 60,000 = $30,000</li><li>March credit sales collected in April: 50% × 136,000 = $68,000</li><li>Total = <b>$98,000</b></li></ol></div>` },
      { h: 'Building it', b: `<table class="t"><tr><th></th><th>Jan</th><th>Feb</th></tr><tr><td>Opening balance</td><td>1,200</td><td>3,500</td></tr><tr><td>+ Receipts</td><td>…</td><td>…</td></tr><tr><td>− Payments</td><td>…</td><td>…</td></tr><tr><td>Closing balance</td><td>3,500</td><td>(2,300)</td></tr></table><p>Closing balance of one month = opening balance of the next.</p>` },
      { h: 'What to do about it', b: `<table class="t"><tr><th>Position</th><th>Action</th></tr><tr><td>Short-term surplus</td><td>Pay suppliers early for discounts, short-term investments</td></tr><tr><td>Short-term deficit</td><td>Overdraft, chase customers, delay paying suppliers</td></tr><tr><td>Long-term surplus</td><td>Invest, expand, pay dividends, repay debt</td></tr><tr><td>Long-term deficit</td><td>Raise long-term finance (loans, shares)</td></tr></table><p>Budgeted P&L + statement of financial position = the <b>master budget</b>.</p>` },
    ],
    check: [
      ['Which item never appears in a cash budget?', ['Depreciation', 'Loan repayment', 'Dividend paid', 'Wages'], 'Not a cash flow.'],
      ['Sales Jan $100k, Feb $120k; 40% cash, rest next month. Cash in Feb?', ['$108,000', '$120,000', '$100,000', '$112,000'], '0.4×120k + 0.6×100k.'],
      ['A short-term cash deficit could be fixed by…', ['Arranging an overdraft', 'Paying dividends', 'Buying machines', 'Paying suppliers early'], 'Short-term finance.'],
    ],
  },
  {
    id: 'm4-4', mod: 4, lo: '4.2', title: 'Flexible budgets', mins: 10, game: 'strike',
    slides: [
      { h: 'Comparing fairly', b: `<p>Lily budgeted for 2,000 bottles but made 3,000. Of course her costs went up! Comparing with the original (<b>fixed/static</b>) budget is unfair.</p><div class="say">A <b>flexible budget</b> re-draws the budget for the ACTUAL level of activity.</div>` },
      { h: 'How to flex', b: `<ol class="reveal"><li>Split costs into fixed and variable (use high-low for mixed costs)</li><li>Variable costs × ACTUAL units</li><li>Fixed costs stay the same</li><li>Compare actual results with the flexed budget</li></ol><div class="eg">Budget 3,000 units, VC $7, fixed $45,000. Actual 3,900 units. Flexed cost = 45,000 + 3,900 × 7 = <b>$72,300</b></div><div class="trap">⚠️ Never flex fixed costs!</div>` },
      { h: 'Why it\'s useful', b: `<ul><li>Planning: "what if we sell 8,000 or 12,000?"</li><li>Control: fair comparison at month end</li></ul><p>The difference between the fixed budget profit and the flexed budget profit is purely due to <b>different activity levels</b> (that's the sales volume effect).</p>` },
    ],
    check: [
      ['A flexible budget…', ['Changes with actual activity', 'Is set for one level only', 'Ignores fixed costs', 'Is only for cash'], 'Flex variable costs.'],
      ['Fixed $10,000, VC $2/unit, actual 4,000 units. Flexed cost?', ['$18,000', '$10,000', '$8,000', '$20,000'], '10,000 + 8,000.'],
      ['Fixed budget profit vs flexed budget profit differ because of…', ['Different activity levels', 'Different efficiency', 'Different prices', 'Fraud'], 'Volume only.'],
    ],
  },
  {
    id: 'm4-5', mod: 4, lo: '4.3', title: 'Incremental, zero-based & rolling budgets', mins: 9, game: 'strike',
    slides: [
      { h: 'Incremental budgeting', b: `<p>"Last year + a bit for inflation." Quick and easy, but it keeps old waste and slack: managers spend it all so it doesn't get cut!</p><p>OK when operations are already efficient and nothing much changes.</p>` },
      { h: 'Zero-based budgeting (ZBB)', b: `<div class="say">Start from ZERO. Every dollar must be justified, like re-packing your school bag from empty each day.</div><ol class="reveal"><li>Define <b>decision packages</b> (activity + costs + benefits)</li><li>Evaluate and <b>rank</b> them</li><li><b>Allocate</b> resources by ranking</li></ol><p>👍 removes waste, challenges the status quo. 👎 takes LOTS of time; ranking is hard. Best for <b>support/admin/government</b> and discretionary costs (advertising, R&D, training), not direct manufacturing.</p>` },
      { h: 'Rolling budgets', b: `<p>Always looks a set time ahead (e.g. 4 quarters). When a quarter ends, add a new one.</p><p>👍 more up to date and realistic. 👎 more costly and more work.</p>` },
    ],
    check: [
      ['ZBB is MOST suitable for…', ['Government admin departments', 'Direct manufacturing', 'Mining', 'Construction'], 'Discretionary/support costs.'],
      ['The main drawback of ZBB is…', ['Time and effort', 'It encourages slack', 'It ignores costs', 'It can\'t cut costs'], 'Very time-consuming.'],
      ['Incremental budgeting can…', ['Keep past inefficiencies', 'Remove all waste', 'Start from zero', 'Rank decision packages'], 'Last year + a bit.'],
    ],
  },
  {
    id: 'm4-6', mod: 4, lo: '4.4', title: 'People and budgets', mins: 10, game: 'strike',
    slides: [
      { h: 'Top-down vs bottom-up', b: `<table class="t"><tr><th>Imposed (top-down)</th><th>Participative (bottom-up)</th></tr>
        <tr><td>Bosses set it alone</td><td>Managers help build it</td></tr><tr><td>👍 quick, links to long-term plans</td><td>👍 realistic, staff feel ownership → motivated</td></tr>
        <tr><td>👎 low morale, "they set me up to fail"</td><td>👎 slow, risk of <b>budget slack</b></td></tr>
        <tr><td>Good for new/small firms or when managers lack skill</td><td>Good when staff know their area best</td></tr></table><p>In real life it's usually <b>negotiated</b>: somewhere in between.</p>` },
      { h: 'Budget slack (padding)', b: `<p>Managers sneakily <b>overestimate costs</b> or <b>underestimate sales</b> so their targets are easy. Then they spend everything so next year's budget isn't cut!</p>` },
      { h: 'Targets that motivate', b: `<ul><li>Challenging, but not impossible</li><li>Accepted by staff as their own goal</li></ul><p><b>Goal congruence</b> = personal goals line up with company goals. <b>Dysfunctional behaviour</b> = chasing your own target at the company's expense (e.g. cutting quality to get good cost figures).</p>` },
    ],
    check: [
      ['Budget slack is…', ['Padding costs / understating revenue to make targets easy', 'A favourable variance', 'Spare cash', 'Unused machines'], 'Making it easy to hit.'],
      ['A budget set with no input from the budget holder is…', ['Top-down (imposed)', 'Participative', 'Zero-based', 'Rolling'], 'Imposed from the top.'],
      ['A motivating target should be…', ['Challenging but achievable', 'Impossible', 'Very easy', 'Kept secret'], 'Accepted and realistic.'],
    ],
  },
  {
    id: 'm4-7', mod: 4, lo: '4.5', title: 'Standard costing', mins: 10, game: 'strike',
    slides: [
      { h: 'The "should cost" card', b: `<p>A <b>standard cost</b> is what ONE unit SHOULD cost:</p><div class="eg">One bottle: 2 kg lemons × $1 = $2 · 0.1 hr labour × $20 = $2 · overhead $1 → <b>standard cost $5</b></div><p>Used for (1) valuing inventory and (2) <b>control</b>: compare actual with standard. Any difference is a <b>variance</b>.</p><p>Works best for <b>repetitive mass production</b> (phones, bottles), not one-off jobs (fashion design, printing jobs).</p>` },
      { h: '4 types of standard', b: `<table class="t"><tr><th>Type</th><th>Meaning</th><th>Effect</th></tr>
        <tr><td><b>Ideal</b></td><td>Perfect: no waste, no breakdowns</td><td>Always adverse variances, can demotivate</td></tr>
        <tr><td><b>Attainable</b></td><td>Efficient, but allows normal waste</td><td>Best motivator ⭐</td></tr>
        <tr><td><b>Current</b></td><td>Today's conditions</td><td>No push to improve</td></tr>
        <tr><td><b>Basic</b></td><td>Unchanged for years</td><td>Shows trends, least useful</td></tr></table>` },
      { h: 'Who sets the numbers?', b: `<ul><li>Material <b>price</b> → purchasing department (contracts, discounts, market prices)</li><li>Material <b>quantity</b> → production experts (product specification)</li><li>Labour <b>rate</b> → HR/payroll, union agreements</li><li>Labour <b>time</b> → production (operation sheets)</li></ul>` },
    ],
    check: [
      ['A standard that allows for normal waste is…', ['Attainable', 'Ideal', 'Basic', 'Current'], 'Realistic but challenging.'],
      ['Standard costing suits best…', ['Mobile phone manufacture', 'Fashion design', 'Jobbing printing', 'Varied postal deliveries'], 'Repetitive standard products.'],
      ['Ideal standards usually cause…', ['Adverse variances', 'Favourable variances', 'No variances', 'Tax refunds'], 'Perfection is never reached.'],
    ],
  },
  {
    id: 'm4-8', mod: 4, lo: '4.6', title: 'Variances 1: materials', mins: 12, game: 'strike',
    slides: [
      { h: 'F and U', b: `<p>A variance is the difference between standard (what <b>should</b> happen) and actual (what <b>did</b> happen).</p><ul><li><b>F</b> = Favourable (better: cheaper or more revenue) 😀</li><li><b>U</b> = Unfavourable / Adverse (worse) 😟</li></ul>` },
      { h: 'Price & usage', b: `<div class="formula">Price variance = (Std price − Actual price) × Actual quantity</div><div class="formula">Usage variance = (Std quantity for actual output − Actual quantity) × Std price</div><div class="say">Price: did we PAY more or less? Usage: did we USE more or less? Usage is always valued at the STANDARD price!</div>` },
      { h: 'Worked example', b: `<div class="eg">Std: 10 kg × $10 per unit. Made 1,000 units. Used 11,700 kg costing $98,600.<ol class="reveal"><li>Should have cost 11,700 kg × $10 = $117,000; did cost $98,600 → price <b>$18,400 F</b></li><li>Should have used 1,000 × 10 = 10,000 kg; used 11,700 → 1,700 × $10 = usage <b>$17,000 U</b></li><li>Total = 18,400 F − 17,000 U = <b>$1,400 F</b></li></ol></div>` },
      { h: 'When is price variance calculated?', b: `<p>Usually at the time of <b>purchase</b> (on the quantity bought), so managers hear about it earlier and stock is held at standard.</p>` },
    ],
    check: [
      ['Std $12/kg, bought 1,300 kg for $15,080. Price variance?', ['$520 F', '$520 U', '$1,040 F', '$0'], 'Actual price $11.60 vs $12.'],
      ['Usage variance is valued at…', ['Standard price', 'Actual price', 'Selling price', 'Average price'], 'Always standard price.'],
      ['Price variance is usually extracted at…', ['Purchase', 'Usage', 'Sale', 'Year end'], 'Earlier info.'],
    ],
  },
  {
    id: 'm4-9', mod: 4, lo: '4.6', title: 'Variances 2: labour, idle time & variable overhead', mins: 13, game: 'strike',
    slides: [
      { h: 'Labour rate & efficiency', b: `<div class="formula">Rate = (Std rate − Actual rate) × hours PAID</div><div class="formula">Idle time = idle hours × Std rate (always U)</div><div class="formula">Efficiency = (Std hours for actual output − hours WORKED) × Std rate</div><div class="trap">⚠️ Rate uses hours PAID. Efficiency uses hours WORKED (paid − idle).</div>` },
      { h: 'Worked example', b: `<div class="eg">Std 10 hrs × $7 per unit. Made 260 units. Paid 2,300 hrs costing $18,600; worked 2,200 (100 idle).<ol class="reveal"><li>Rate: 2,300 × 7 = 16,100 vs 18,600 → <b>$2,500 U</b></li><li>Idle: 100 × 7 = <b>$700 U</b></li><li>Efficiency: SH = 2,600 vs worked 2,200 → 400 × 7 = <b>$2,800 F</b></li></ol></div>` },
      { h: 'Variable overhead', b: `<p>Variable overhead happens only when people/machines are actually <b>working</b> (not during idle time).</p><div class="formula">Expenditure = (hours worked × std VOH rate) − actual VOH</div><div class="formula">Efficiency = (Std hours − hours worked) × std VOH rate</div><p>Same hours as the labour efficiency variance, just a different rate.</p>` },
    ],
    check: [
      ['The labour RATE variance uses…', ['Hours paid', 'Hours worked', 'Standard hours', 'Budget hours'], 'Rate is about what was paid.'],
      ['The idle time variance is always…', ['Unfavourable', 'Favourable', 'Zero', 'Either'], 'Paid for no output.'],
      ['Std 4 hrs/unit × $20, 1,000 units made, 3,840 hrs worked. Efficiency variance?', ['$3,200 F', '$3,200 U', '$800 F', '$4,000 F'], '(4,000 − 3,840) × 20.'],
    ],
  },
  {
    id: 'm4-10', mod: 4, lo: '4.6', title: 'Variances 3: fixed overhead', mins: 12, game: 'strike',
    slides: [
      { h: 'Explaining under/over absorption', b: `<p>Fixed overhead variances explain why fixed overhead was under- or over-absorbed. Remember the OAR = budget overhead ÷ budget activity. Two things can be wrong:</p><ul><li>The <b>top</b> (spending was different) → <b>expenditure</b> variance</li><li>The <b>bottom</b> (output was different) → <b>volume</b> variance</li></ul>` },
      { h: 'Formulas', b: `<div class="formula">Expenditure = Budgeted fixed OH − Actual fixed OH</div><div class="formula">Volume = (Actual units − Budgeted units) × Std fixed OH per unit</div><div class="formula">Total = Absorbed (actual units × rate) − Actual fixed OH</div><div class="say">Made MORE than budget → volume variance FAVOURABLE (more overhead absorbed).</div>` },
      { h: 'Worked example', b: `<div class="eg">Budget 1,000 units, fixed OH $20,000 ($20 per unit). Actual 1,100 units, actual OH $20,450.<ol class="reveal"><li>Expenditure: 20,000 − 20,450 = <b>$450 U</b></li><li>Volume: (1,100 − 1,000) × 20 = <b>$2,000 F</b></li><li>Total: absorbed 22,000 − 20,450 = <b>$1,550 F</b> (over-absorbed) ✔</li></ol></div>` },
    ],
    check: [
      ['FOH expenditure variance =', ['Budgeted FOH − actual FOH', 'Absorbed − actual', '(Actual − budget units) × rate', 'Std hours × rate'], 'Spending vs budget.'],
      ['Actual output above budget gives a volume variance that is…', ['Favourable', 'Unfavourable', 'Zero', 'Unknown'], 'More overhead absorbed.'],
      ['Budget 2,800 units, rate $28, actual 2,650. Volume variance?', ['$4,200 U', '$4,200 F', '$8,400 U', '$0'], '−150 × 28.'],
    ],
  },
  {
    id: 'm4-11', mod: 4, lo: '4.6', title: 'Sales variances & the operating statement', mins: 12, game: 'strike',
    slides: [
      { h: 'Two sales variances', b: `<div class="formula">Selling price = (Actual price − Std price) × Actual units sold</div><div class="formula">Sales volume profit = (Actual units − Budget units) × Std PROFIT per unit</div><div class="trap">⚠️ Sales volume uses standard PROFIT per unit, not the selling price!</div>` },
      { h: 'Example', b: `<div class="eg">Budget 8,000 units at $12; std full cost $7 (profit $5). Actual 7,700 units at $12.50.<ol class="reveal"><li>Price: (12.50 − 12) × 7,700 = <b>$3,850 F</b></li><li>Volume: (7,700 − 8,000) × 5 = <b>$1,500 U</b></li></ol></div>` },
      { h: 'Operating statement', b: `<p>A report that walks from budgeted profit to actual profit:</p><ol class="reveal"><li>Budgeted profit</li><li>± Sales volume & price variances</li><li>± Cost variances (materials, labour, idle, overheads)</li><li>= Actual profit</li></ol><div class="say">F variances are added, U variances are subtracted.</div>` },
    ],
    check: [
      ['The sales volume PROFIT variance uses…', ['Standard profit per unit', 'Selling price', 'Actual cost', 'Contribution only'], 'Volume × std profit.'],
      ['Std price $15, sold 2,000 at $15.30. Price variance?', ['$600 F', '$600 U', '$30,600 F', '$300 F'], '0.30 × 2,000.'],
      ['An operating statement reconciles…', ['Budgeted profit to actual profit', 'Cash to profit', 'Sales to purchases', 'Assets to liabilities'], 'Using variances.'],
    ],
  },
  {
    id: 'm4-12', mod: 4, lo: '4.6', title: 'Why variances happen & what to do', mins: 10, game: 'strike',
    slides: [
      { h: 'Common causes', b: `<table class="t"><tr><th>Variance</th><th>Favourable because…</th><th>Unfavourable because…</th></tr>
        <tr><td>Mat price</td><td>bulk discounts</td><td>price rises, careless buying</td></tr><tr><td>Mat usage</td><td>better quality material</td><td>defects, waste, theft</td></tr>
        <tr><td>Lab rate</td><td>cheaper apprentices</td><td>pay rise, higher-grade staff</td></tr><tr><td>Lab efficiency</td><td>motivated, better tools</td><td>poor materials, lack of training</td></tr></table>` },
      { h: 'Variances are linked', b: `<div class="eg">Buy CHEAP lemons → price F 😀 … but they're bad → more waste (usage U) and slower work (labour efficiency U) 😟</div><div class="eg">Use SKILLED workers → rate U, but efficiency F.</div><div class="say">This is called <b>interdependence</b>. Never judge a variance alone!</div>` },
      { h: 'Investigate or not?', b: `<p>Think about: <b>materiality</b> (size), <b>controllability</b>, the <b>type of standard</b>, <b>interdependence</b>, and the <b>cost of investigating</b>.</p><div class="formula">Expected value = chance of fixing × savings − cost of investigating</div><div class="eg">30% × $1,200 − $150 = $210 → worth investigating.</div><p>Use tolerance limits and control charts. Trends matter: gradually improving efficiency may be a <b>learning curve</b>. Uncontrollable cause → revise the budget.</p>` },
    ],
    check: [
      ['Cheaper, poor-quality material is bought. Likely variances?', ['Price F, usage U', 'Price U, usage F', 'Both F', 'Both U'], 'Interdependence.'],
      ['Gradually improving labour efficiency suggests…', ['A learning curve', 'Machine breakdowns', 'Inflation', 'Theft'], 'Getting faster with practice.'],
      ['Investigation costs $150; 30% chance to save $1,200. Expected net benefit?', ['$210', '$1,050', '$360', '−$150'], '360 − 150.'],
    ],
  },
];
