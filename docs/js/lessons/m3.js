export default [
  {
    id: 'm3-1', mod: 3, lo: '3.1', title: 'Direct vs indirect costs', mins: 10, game: 'factory',
    slides: [
      { h: 'Can you point at it?', b: `<div class="pic">🍋👉🥤</div><p>Lily now runs a small juice factory.</p><ul><li><b>Direct cost</b>: you can trace it <b>in full</b> to one bottle. The lemons IN the bottle, the worker who squeezes them.</li><li><b>Indirect cost (overhead)</b>: shared, so you can't trace it to one bottle. Factory rent, the supervisor, cleaning stuff.</li></ul>` },
      { h: 'The building blocks', b: `<div class="formula">Prime cost = Direct materials + Direct labour + Direct expenses</div><div class="formula">Overheads = Indirect materials + Indirect labour + Indirect expenses</div><ul><li><b>Direct expense</b> example: a royalty paid <b>per bottle</b>, or hiring a special tool for one job.</li><li>Primary packaging (the bottle and label) = direct material.</li></ul>` },
      { h: 'Tricky labour items', b: `<ul><li>🏪 <b>Stores assistant</b> → indirect (not traceable to products)</li><li>😴 <b>Idle time</b> of direct workers → overhead</li><li>⏰ <b>Overtime premium</b> (the extra bit) → <b>production overhead</b>…<br>…UNLESS a customer asked for that rush job → then it's direct for that job.</li></ul>` },
      { h: 'Costs by function', b: `<table class="t"><tr><th>Function</th><th>Examples</th></tr>
        <tr><td>🏭 Production</td><td>Machine oil, factory supervisor, factory depreciation, protective clothing</td></tr>
        <tr><td>🗂 Administration</td><td>Finance director's secretary, office printer toner</td></tr>
        <tr><td>📣 Marketing</td><td>Sales commission, advertising agency</td></tr>
        <tr><td>🚚 Distribution</td><td>Finished goods warehouse rent, delivery trucks, packing cases</td></tr>
        <tr><td>🔬 R&D</td><td>Lab chemicals, scientists</td></tr></table>` },
    ],
    check: [
      ['A 20c royalty paid per unit made is a…', ['Direct expense', 'Production overhead', 'Marketing cost', 'Admin overhead'], 'Traceable to each unit.'],
      ['Which is indirect labour?', ['A stores assistant in the factory', 'Assembly workers', 'Plasterers on a building job', 'Packers on the production line'], 'Can\'t trace stores work to one product.'],
      ['Prime cost is…', ['Total of all direct costs', 'All production costs', 'Variable cost only', 'Total cost'], 'DM + DL + DE.'],
    ],
  },
  {
    id: 'm3-2', mod: 3, lo: '3.1', title: 'Why share out overheads? Absorption costing', mins: 8, game: 'factory',
    slides: [
      { h: 'The bottle needs a full price tag', b: `<p>Each bottle of juice uses lemons (direct). But it ALSO needed the factory, the electricity and the supervisor.</p><div class="say"><b>Absorption costing</b> adds a fair share of the <b>production overheads</b> to every unit, so each bottle carries its "full" cost.</div>` },
      { h: 'Why bother?', b: `<ul><li>📦 <b>Inventory valuation</b>: the accounting rules (IAS 2) say stock must include production overheads.</li><li>🏷 <b>Pricing</b>: "full cost + profit %" (cost-plus pricing).</li><li>📊 Working out the <b>profitability</b> of each product.</li></ul>` },
      { h: 'The 3 stages', b: `<div class="pic">📥 ➗ 🍾</div><ol class="reveal"><li><b>Allocation</b>: whole costs go straight to the cost centre that caused them.</li><li><b>Apportionment</b>: shared costs are split fairly between cost centres.</li><li><b>Absorption</b>: production centre costs are added into each unit.</li></ol>` },
    ],
    check: [
      ['Absorption costing is required for inventory by…', ['IAS 2', 'The tax office', 'The GRI', 'Nobody'], 'Inventory at full production cost.'],
      ['Main reasons for absorption costing include…', ['Inventory valuation and pricing', 'Cash budgets', 'Variance investigation', 'Transfer pricing only'], 'Plus product profitability.'],
      ['The order of the stages is…', ['Allocation → apportionment → absorption', 'Absorption → allocation → apportionment', 'Apportionment → absorption → allocation', 'Any order'], 'Allocate, apportion, absorb.'],
    ],
  },
  {
    id: 'm3-3', mod: 3, lo: '3.2', title: 'Allocation & apportionment', mins: 12, game: 'factory',
    slides: [
      { h: 'Allocation', b: `<p>If a cost clearly belongs to one department, give it <b>all</b> of it.</p><div class="eg">The warehouse security guard → warehouse cost centre. Packing staff wages → packing department.</div>` },
      { h: 'Apportionment: fair sharing', b: `<p>Shared costs are split using a <b>fair basis</b>:</p><table class="t"><tr><th>Overhead</th><th>Basis</th></tr>
        <tr><td>Rent, rates, heating, building repairs</td><td>📐 Floor area</td></tr>
        <tr><td>Canteen, personnel, superannuation</td><td>👥 Number of employees</td></tr>
        <tr><td>Equipment depreciation & insurance</td><td>💻 Value of equipment</td></tr>
        <tr><td>Gas & electricity (sometimes)</td><td>📦 Volume of space</td></tr></table>` },
      { h: 'Example', b: `<div class="eg">Rent $120,000. Machining 500 m², Assembly 300 m², Stores 200 m² (total 1,000).<ol class="reveal"><li>Machining: 120,000 × 500/1,000 = <b>$60,000</b></li><li>Assembly: 120,000 × 300/1,000 = <b>$36,000</b></li><li>Stores: 120,000 × 200/1,000 = <b>$24,000</b></li></ol></div>` },
      { h: 'Service departments', b: `<p>Only <b>production</b> departments make bottles that are sold. So service departments' costs (stores, maintenance, canteen) must be passed on to production departments.</p><ul><li>Stores → by number/value of <b>material requisitions</b></li><li>Maintenance → by <b>maintenance hours</b> worked for each dept</li><li>Production planning → by direct labour hours</li></ul><p>If one service dept serves another, do that one first (step-down).</p>` },
    ],
    check: [
      ['Best basis to apportion factory rent:', ['Floor area', 'Number of employees', 'Equipment value', 'Units sold'], 'Building costs follow space.'],
      ['Canteen costs are best apportioned by…', ['Number of employees', 'Floor area', 'Machine hours', 'Sales'], 'People eat in the canteen.'],
      ['Why re-apportion service department costs?', ['Only production depts make saleable output', 'To save tax', 'The law says so', 'To avoid variances'], 'Costs must end up where units are made.'],
    ],
  },
  {
    id: 'm3-4', mod: 3, lo: '3.3', title: 'Overhead absorption rates (OAR)', mins: 12, game: 'factory',
    slides: [
      { h: 'Setting the rate in advance', b: `<div class="formula">OAR = Budgeted overhead ÷ Budgeted activity</div><div class="eg">Budget overhead $50,000, budget labour hours 100,000 → OAR = <b>$0.50 per labour hour</b>. A product taking 2 hours absorbs $1.00; one taking 5 hours absorbs $2.50.</div>` },
      { h: 'Which activity to use?', b: `<ul><li>🤖 Machine-heavy department → <b>machine hour rate</b></li><li>👷 Labour-heavy department → <b>direct labour hour rate</b></li><li>🍾 All units identical → rate <b>per unit</b></li><li>Also possible: % of materials, % of labour cost, % of prime cost (less fair)</li></ul><p>A <b>blanket</b> (single factory-wide) rate is unfair when products spend different times in different departments. Use <b>departmental rates</b> then.</p>` },
      { h: 'Under- and over-absorption', b: `<p>The rate was based on <b>guesses</b> (budget), so at year end:</p><div class="formula">Absorbed = OAR × ACTUAL activity</div><ul><li>Absorbed <b>more</b> than actual overhead → <b>OVER</b>-absorbed → add to profit 😀</li><li>Absorbed <b>less</b> than actual overhead → <b>UNDER</b>-absorbed → reduce profit 😟</li></ul>` },
      { h: 'Example', b: `<div class="eg">OAR $16/hr. Actual hours 52,000. Actual overhead $886,000.<ol class="reveal"><li>Absorbed = 52,000 × 16 = $832,000</li><li>Actual = $886,000</li><li>Absorbed &lt; actual → <b>under-absorbed by $54,000</b></li></ol></div><div class="trap">⚠️ Use ACTUAL hours × the BUDGETED rate. Not budget hours!</div>` },
    ],
    check: [
      ['OAR is calculated using…', ['Budgeted overhead ÷ budgeted activity', 'Actual ÷ actual', 'Actual overhead ÷ budget activity', 'Budget overhead ÷ actual activity'], 'Set in advance from the budget.'],
      ['Absorbed $100k, actual overhead $90k. This is…', ['Over-absorbed by $10k', 'Under-absorbed by $10k', 'No difference', 'A sales variance'], 'Absorbed more than spent.'],
      ['A machine-heavy department should use…', ['A machine hour rate', 'A labour hour rate', '% of materials', 'Rate per customer'], 'Match the main activity.'],
    ],
  },
  {
    id: 'm3-5', mod: 3, lo: '3.3', title: 'Marginal costing & contribution', mins: 10, game: 'factory',
    slides: [
      { h: 'A simpler view', b: `<p><b>Marginal cost</b> = the <b>variable</b> cost of making one more unit (materials, labour, variable overhead).</p><div class="formula">Contribution = Sales price − Variable costs</div><div class="say">Contribution is money that "contributes" towards paying the fixed costs, and after that it's profit!</div>` },
      { h: 'Lily\'s example', b: `<div class="eg">Bottle price $10, variable cost $6 → contribution <b>$4</b> per bottle. Fixed costs $45,000 a month.<ol class="reveal"><li>Sell 10,000: 40,000 − 45,000 = <b>−$5,000</b> loss</li><li>Sell 15,000: 60,000 − 45,000 = <b>$15,000</b> profit</li><li>Each extra bottle adds exactly $4 profit</li></ol></div>` },
      { h: 'Rules of marginal costing', b: `<ul><li>Fixed costs are <b>period costs</b>: charged in full each period, NOT put into units.</li><li>Inventory is valued at <b>variable (marginal) production cost</b> only.</li><li>Contribution per unit stays the same; profit per unit changes with volume.</li></ul><table class="t"><tr><th>Marginal</th><th>Absorption</th></tr><tr><td>Stock at variable cost</td><td>Stock at full production cost</td></tr><tr><td>Fixed OH = period cost</td><td>Fixed OH absorbed into units</td></tr></table>` },
    ],
    check: [
      ['Contribution =', ['Sales − variable costs', 'Sales − total costs', 'Sales − fixed costs', 'Profit + tax'], 'Contribution towards fixed costs and profit.'],
      ['Under marginal costing, inventory is valued at…', ['Variable production cost', 'Full production cost', 'Selling price', 'Nil'], 'Fixed costs are period costs.'],
      ['Price $38, VC $15, sold 12,000, fixed $200,000. Profit?', ['$76,000', '$276,000', '$256,000', '$176,000'], '23 × 12,000 − 200,000.'],
    ],
  },
  {
    id: 'm3-6', mod: 3, lo: '3.3', title: 'Marginal vs absorption profit', mins: 12, game: 'factory',
    slides: [
      { h: 'Why do the two profits differ?', b: `<p>Under absorption costing, some fixed overhead is "hidden" inside closing stock and carried into next period.</p><div class="formula">Profit difference = Change in inventory (units) × Fixed overhead per unit</div>` },
      { h: 'Which is higher? Use "SIAH"', b: `<div class="say">Stock Increases → Absorption Higher. 📈</div><ul><li>Inventory <b>increases</b> (made more than sold) → <b>absorption</b> profit higher</li><li>Inventory <b>decreases</b> (sold more than made) → <b>marginal</b> profit higher</li><li>No change → <b>same</b> profit</li></ul>` },
      { h: 'Example', b: `<div class="eg">Made 280,000, sold 240,000, no opening stock. Fixed OH absorbed at $1.25/unit.<ol class="reveal"><li>Stock increase = 40,000 units</li><li>Difference = 40,000 × 1.25 = <b>$50,000</b></li><li>Stock went UP → absorption profit is $50,000 <b>higher</b></li></ol></div><div class="trap">⚠️ Quarterly question with annual budget figures? Convert to the quarter first!</div>` },
    ],
    check: [
      ['Production 17,000, sales 23,000, FOH $4/unit. Which profit is higher and by how much?', ['Marginal by $24,000', 'Absorption by $24,000', 'Marginal by $68,000', 'Equal'], 'Stock fell 6,000 × $4.'],
      ['If production equals sales, the two profits are…', ['Equal', 'Absorption higher', 'Marginal higher', 'Unknown'], 'No overhead deferred.'],
      ['Stock increases → which is higher?', ['Absorption profit', 'Marginal profit', 'Neither', 'Cash'], 'Overhead carried forward in stock.'],
    ],
  },
  {
    id: 'm3-7', mod: 3, lo: '3.4', title: 'Activity-based costing (ABC): the idea', mins: 12, game: 'factory',
    slides: [
      { h: 'The problem with old costing', b: `<p>Lily makes 2 juices: <b>Orange</b> (100,000 bottles, long batches) and <b>Dragonfruit</b> (500 bottles, lots of tiny batches and special set-ups).</p><p>Old costing shares overheads by labour hours, so Orange gets most of the overheads, even though Dragonfruit causes loads of set-ups!</p><div class="trap">⚠️ Traditional costing OVER-costs high-volume products and UNDER-costs low-volume ones.</div>` },
      { h: 'ABC in 4 steps', b: `<ol class="reveal"><li>Find the main <b>activities</b> (set-ups, ordering, inspecting…)</li><li>Find each activity's <b>cost driver</b>: what makes its cost go up (number of set-ups, number of orders…)</li><li>Collect the costs into <b>activity cost pools</b></li><li>Charge products: <b>pool ÷ driver = rate</b>, then × how much each product uses</li></ol>` },
      { h: 'Worked example', b: `<div class="eg">Set-up costs $200,000 for 40 set-ups → <b>$5,000 per set-up</b>.<br>X: 150,000 units in batches of 5,000 = 30 set-ups → $150,000 → <b>$1 per unit</b>.<br>Y: 500,000 units in batches of 50,000 = 10 set-ups → $50,000 → <b>$0.10 per unit</b>.</div>` },
      { h: 'Common drivers', b: `<table class="t"><tr><th>Cost</th><th>Driver</th></tr><tr><td>Ordering</td><td>No. of orders</td></tr><tr><td>Set-ups / scheduling / materials handling</td><td>No. of production runs</td></tr><tr><td>Despatch</td><td>No. of despatches</td></tr><tr><td>Quality control</td><td>No. of inspections</td></tr><tr><td>Short-run variable costs (oil, power)</td><td>Machine or labour hours</td></tr></table>` },
    ],
    check: [
      ['Traditional absorption costing tends to…', ['Over-cost high-volume products', 'Under-cost high-volume products', 'Cost everything correctly', 'Ignore overheads'], 'Volume-based rates.'],
      ['Likely driver for production scheduling costs:', ['Number of production runs', 'Units produced', 'Floor area', 'Sales value'], 'Scheduling happens per run.'],
      ['Pool $180,000, 60 set-ups. Driver rate?', ['$3,000 per set-up', '$60 per set-up', '$180 per set-up', '$10,800'], '180,000 ÷ 60.'],
    ],
  },
  {
    id: 'm3-8', mod: 3, lo: '3.4', title: 'ABC: levels, pros & cons', mins: 10, game: 'factory',
    slides: [
      { h: 'Four levels of activity', b: `<table class="t"><tr><th>Level</th><th>Depends on</th><th>Example</th></tr>
        <tr><td>Unit (product) level</td><td>Each unit</td><td>Machine power, inspecting every bottle</td></tr>
        <tr><td>Batch level</td><td>Each batch</td><td>Set-ups</td></tr>
        <tr><td>Product-sustaining</td><td>Each product line</td><td>Brand management, product design</td></tr>
        <tr><td>Facility-sustaining</td><td>Being in business</td><td>Factory rent, general admin</td></tr></table>` },
      { h: 'When is ABC worth it?', b: `<ul><li>Overheads are big compared with direct costs</li><li>Overheads aren't driven by volume</li><li>Lots of different products</li><li>Products use overheads very differently</li></ul><p>It also helps with <b>customer profitability</b>, pricing, cost control (ABM) and <b>activity-based budgeting</b>.</p>` },
      { h: 'Downsides', b: `<ul><li>Still needs some <b>arbitrary</b> sharing (rent, building depreciation)</li><li>One driver may not explain a whole pool</li><li>Can be <b>costly and complex</b></li><li>An ABC cost is a long-run average, NOT always a relevant cost</li></ul><p><b>Marginal costing's weakness</b>: costs "fixed" to volume may actually vary with other drivers (like batches).</p>` },
    ],
    check: [
      ['Brand management is a…', ['Product-sustaining activity', 'Batch-level activity', 'Unit-level activity', 'Facility-sustaining activity'], 'Exists because the product exists.'],
      ['Machine set-ups are…', ['Batch level', 'Unit level', 'Facility level', 'Product-sustaining'], 'Per batch.'],
      ['A disadvantage of ABC is…', ['Some arbitrary apportionment is still needed', 'It ignores overheads', 'It can\'t be used in services', 'It only uses labour hours'], 'Facility costs still need splitting.'],
    ],
  },
  {
    id: 'm3-9', mod: 3, lo: '3.5', title: 'Job costing vs process costing', mins: 10, game: 'factory',
    slides: [
      { h: 'Two ways of making things', b: `<table class="t"><tr><th>🎂 Job costing</th><th>🛢 Process costing</th></tr>
        <tr><td>Each order is special (custom birthday cake)</td><td>Endless flow of identical units (bottled juice, soap, oil)</td></tr>
        <tr><td>Short duration, customer's spec</td><td>Continuous production</td></tr>
        <tr><td>Costs collected per job (job card)</td><td>Costs collected per process, then averaged</td></tr></table>` },
      { h: 'Job costing', b: `<p>Job card collects: materials issued (minus returns), labour hours × rate, overhead absorbed (OAR × hours), then admin/selling overhead.</p><div class="eg">Overtime premium worked because ANOTHER customer was in a rush → overhead, not this job. Overtime because THIS customer asked → direct cost of this job.</div>` },
      { h: 'Cost-plus pricing (mark-up vs margin)', b: `<div class="formula">Mark-up on COST: Price = Cost × (1 + %)</div><div class="formula">Margin on SALES: Price = Cost ÷ (1 − %)</div><div class="eg">Job cost $4,200.<br>25% mark-up on cost → 4,200 × 1.25 = <b>$5,250</b><br>25% margin on sales → 4,200 ÷ 0.75 = <b>$5,600</b></div><div class="trap">⚠️ The exam LOVES mixing these two!</div>` },
      { h: 'Cost-plus: good & bad', b: `<p>👍 Simple, covers costs, easy to justify to customers, stable prices.</p><p>👎 No incentive to control costs, ignores competitors and demand, overheads shared arbitrarily.</p>` },
    ],
    check: [
      ['Oil refining would use…', ['Process costing', 'Job costing', 'Batch pricing', 'Target costing'], 'Continuous identical output.'],
      ['Cost $4,200, price with 25% MARGIN on sales?', ['$5,600', '$5,250', '$1,050', '$3,150'], '4,200 ÷ 0.75.'],
      ['Usual pricing method for job work:', ['Cost-plus', 'Skimming', 'Penetration', 'Transfer pricing'], 'Cost + a profit margin.'],
    ],
  },
  {
    id: 'm3-10', mod: 3, lo: '3.6', title: 'Process costing & losses', mins: 14, game: 'factory',
    slides: [
      { h: 'Some juice always spills', b: `<p>In a process, some loss is <b>expected</b> (evaporation, spills). That's <b>normal loss</b>.</p><ul><li>Loss <b>bigger</b> than expected → extra = <b>abnormal loss</b> 😟</li><li>Loss <b>smaller</b> than expected → <b>abnormal gain</b> 😀</li></ul>` },
      { h: 'The golden rules', b: `<ol class="reveal"><li><b>Normal loss</b> carries <b>no cost</b>. It's valued at its scrap value (or nil). The good units carry its cost.</li><li>Cost per unit = (Total costs − scrap value of normal loss) ÷ <b>EXPECTED output</b></li><li><b>Abnormal loss/gain</b> units are valued <b>exactly like good units</b>, so they don't change the good units' cost.</li><li>Scrap money from abnormal loss goes to the <b>abnormal loss account</b>, not the process account.</li></ol>` },
      { h: 'Worked example', b: `<div class="eg">Input 1,000 units costing $4,500. Normal loss 10%, no scrap value. Actual output 860.<ol class="reveal"><li>Expected output = 1,000 × 90% = 900</li><li>Cost per unit = 4,500 ÷ 900 = <b>$5</b></li><li>Actual loss 140; normal 100 → abnormal loss <b>40 units</b></li><li>Good output 860 × $5 = $4,300; abnormal loss 40 × $5 = <b>$200</b></li><li>Check: 4,300 + 200 = 4,500 ✔</li></ol></div>` },
      { h: 'Working backwards', b: `<div class="eg">Need 340 litres of good output. Normal loss 10% + abnormal 5% of INPUT. Input?<br>Output = 85% of input → 340 ÷ 0.85 = <b>400 litres</b>.</div><div class="trap">⚠️ Losses are a % of INPUT, so don't just add 15% to the output!</div><p>Process account four steps: <b>1</b> output & losses → <b>2</b> cost per unit → <b>3</b> total costs → <b>4</b> complete the accounts.</p>` },
    ],
    check: [
      ['Normal loss (no scrap value) is valued at…', ['Nil', 'Full cost per unit', 'Materials cost', 'Selling price'], 'Good units carry its cost.'],
      ['Abnormal losses are valued…', ['The same as good output', 'At zero', 'At scrap value', 'At materials cost only'], 'They don\'t affect good unit cost.'],
      ['Input 1,000, cost $4,500, normal loss 10% (nil scrap). Cost per unit?', ['$5.00', '$4.50', '$5.23', '$4.95'], '4,500 ÷ 900 expected.'],
    ],
  },
  {
    id: 'm3-11', mod: 3, lo: '3.6', title: 'Equivalent units & work in process', mins: 12, game: 'factory',
    slides: [
      { h: 'Half-made bottles', b: `<p>At month end some bottles are half-done: work in process (<b>WIP</b>). A half-done bottle shouldn't carry a full bottle's cost!</p><div class="formula">Equivalent units (EU) = units × % complete</div><div class="eg">1,000 bottles 60% complete = <b>600 equivalent units</b>.</div>` },
      { h: 'Worked example', b: `<div class="eg">No opening WIP. 5,000 units started, costs $29,440. 4,000 finished; 1,000 left 60% complete.<ol class="reveal"><li>EU = 4,000 + 1,000 × 60% = <b>4,600</b></li><li>Cost per EU = 29,440 ÷ 4,600 = <b>$6.40</b></li><li>Finished goods = 4,000 × 6.40 = $25,600</li><li>Closing WIP = 600 × 6.40 = $3,840</li></ol></div>` },
      { h: 'Different % for different costs', b: `<p>Often materials are 100% added at the start, but conversion costs (labour + overhead) are only 50% done. Then work out EU <b>separately</b> for each cost type.</p><div class="eg">50 litres WIP: materials 100% → 50 EU; conversion 50% → 25 EU.</div><p>With losses: normal loss = 0 EU, abnormal loss = full EU (add), abnormal gain = subtract.</p>` },
    ],
    check: [
      ['800 units 75% complete = how many EU?', ['600', '800', '200', '1,067'], '800 × 75%.'],
      ['50 litres WIP, 100% materials, 50% conversion. EU for conversion?', ['25', '50', '100', '0'], 'Only half the conversion done.'],
      ['Normal loss counts as how many equivalent units?', ['Zero', 'One each', 'Half each', 'Its % complete'], 'It carries no cost.'],
    ],
  },
];
