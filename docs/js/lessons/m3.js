export default [
  {
    id: 'm3-1', mod: 3, lo: '3.1', title: 'Direct vs indirect costs & costs by function', mins: 13, game: 'factory',
    slides: [
      { h: 'Can you point at it?', b: `<div class="pic">🍋👉🥤</div><p>Lily now runs a small juice factory. Total cost = materials + labour + other expenses (rent, power, depreciation).</p><ul><li><b>Direct cost</b>: can be traced <b>in full</b> to the product, service or department. The lemons IN the bottle.</li><li><b>Indirect cost (overhead)</b>: incurred making the product, but can't be traced directly and in full. Factory rent, the supervisor, cleaning materials, building insurance.</li></ul>` },
      { h: 'The building blocks', b: `<div class="formula">Prime cost = Direct materials + Direct labour + Direct expenses</div><div class="formula">Overheads = Indirect materials + Indirect labour + Indirect expenses</div><p>Overheads are then split into <b>production</b>, <b>administration</b> and <b>marketing & distribution</b>.</p>` },
      { h: 'Direct materials, labour, expenses', b: `<ul><li><b>Direct materials</b>: components bought for a specific job; part-finished work from department 1 used in department 2; <b>primary packing</b> (cartons, boxes, wrappers).</li><li><b>Direct wages</b>: all wages (basic or overtime) for work on the product itself: workers changing the product, inspectors/testers specifically needed, anyone identified with a particular product.</li><li><b>Direct expenses</b> (chargeable expenses): hire of tools for a particular job, maintenance of special tools, a <b>royalty per unit</b>.</li></ul><p>As production becomes more machine-based, direct labour becomes a smaller share of cost.</p>` },
      { h: 'Tricky labour items', b: `<ul><li>🏪 <b>Stores assistant</b> → indirect (can't trace to products)</li><li>😴 <b>Idle time</b> of direct workers → overhead</li><li>💼 <b>Payroll taxes</b>, work installing equipment → indirect</li><li>⏰ <b>Overtime premium</b> → <b>production overhead</b>, UNLESS worked at a specific <b>customer's request</b> for their job (→ direct to that job), or worked regularly as normal practice (built into the direct labour rate)</li></ul><div class="eg">Week 5 wages: basic hours on production are direct; the overtime premium and idle time are overhead.</div>` },
      { h: 'Overheads by function', b: `<table class="t"><tr><th>Function</th><th>Examples</th></tr>
        <tr><td>🏭 <b>Production</b> overhead</td><td>Consumable stores; supervisors; factory rent, rates, insurance; depreciation, fuel, power and maintenance of plant & machinery; machine oil; protective clothing; holiday pay of operators</td></tr>
        <tr><td>🗂 <b>Administration</b></td><td>Office buildings depreciation; office salaries (directors, accountants, finance director's secretary); lighting, cleaning, phone; printer toner</td></tr>
        <tr><td>📣 <b>Marketing</b></td><td>Catalogues & price lists; sales reps' salaries & commission; advertising; showroom rent</td></tr>
        <tr><td>🚚 <b>Distribution</b></td><td>Packing cases; packers, drivers, despatch clerks; finished goods warehouse; truck licences</td></tr>
        <tr><td>🔬 <b>Research & development</b></td><td>Lab chemicals, scientists</td></tr>
        <tr><td>🏦 <b>Financing</b></td><td>Loan interest</td></tr></table>` },
      { h: 'Functional cost definitions', b: `<ul><li><b>Production</b>: from supplying raw materials to the finished product ready for the warehouse (incl. primary packaging)</li><li><b>Administration</b>: managing the organisation (not production, sales, distribution or research)</li><li><b>Marketing</b>: creating demand and securing orders</li><li><b>Distribution</b>: from receiving finished goods to making them ready for despatch and delivery</li><li><b>Research</b>: searching for new/improved products. <b>Development</b>: from deciding to produce to the start of full manufacture</li></ul><div class="formula">Prime cost + production overhead = <b>production (factory) cost</b>; + admin, marketing & distribution = <b>full cost of sales</b></div>` },
    ],
    check: [
      ['A 20c royalty paid per unit made is a…', ['Direct expense', 'Production overhead', 'Marketing cost', 'Admin overhead'], 'Traceable to each unit.'],
      ['Which is indirect labour?', ['A stores assistant in the factory', 'Assembly workers', 'Plasterers on a building job', 'Packers on the production line'], 'Can\'t trace stores work to one product.'],
      ['Prime cost is…', ['Total of all direct costs', 'All production costs', 'Variable cost only', 'Total cost'], 'DM + DL + DE.'],
    ],
    pool: [
      ['Which labour costs are normally indirect? I payroll tax, II idle time, III bonus to direct workers, IV installing equipment, V overtime premium', ['I, II, IV and V (all except bonus)', 'III only', 'I and III only', 'II and III only'], 'Idle time, payroll tax, installation work and overtime premium are overheads.'],
      ['Cost of chemicals used in the laboratory is a…', ['Research & development cost', 'Production cost', 'Administration cost', 'Distribution cost'], 'Lab = R&D.'],
      ['Commission paid to sales representatives is a…', ['Marketing cost', 'Production cost', 'Admin cost', 'Financing cost'], 'Creating demand.'],
      ['Holiday pay of machine operators is a…', ['Production cost', 'Admin cost', 'Marketing cost', 'R&D cost'], 'Factory labour cost.'],
      ['Loan interest is a…', ['Financing cost', 'Production cost', 'Distribution cost', 'Marketing cost'], 'Cost of financing the business.'],
      ['Hire of a tool for one particular job is a…', ['Direct expense', 'Production overhead', 'Admin overhead', 'Indirect material'], 'Chargeable to that job.'],
      ['Prime cost plus production overhead equals…', ['Production (factory) cost', 'Full cost of sales', 'Marginal cost', 'Contribution'], 'Then add admin, marketing & distribution for full cost.'],
    ],
  },
  {
    id: 'm3-2', mod: 3, lo: '3.1', title: 'Why share out overheads? Absorption costing', mins: 10, game: 'factory',
    slides: [
      { h: 'The bottle needs a full price tag', b: `<p>Each bottle uses lemons (direct), but it also needed the factory, electricity and supervisor.</p><div class="say"><b>Absorption costing</b> includes in each product's cost an appropriate share of the organisation's overheads, reflecting the time and effort spent on it.</div>` },
      { h: 'An example', b: `<div class="eg">100 units a week. Prime cost $6/unit, price $10. Production overhead $200/week; admin, marketing & distribution $150/week.<ol class="reveal"><li>Production overhead per unit = $2, so factory cost = $6 + $2 = <b>$8</b></li><li>Other overhead per unit = $1.50, so full cost of sales = <b>$9.50</b></li><li>Profit = 100 × ($10 − $9.50) = <b>$50</b>, the same however it's presented</li><li>Closing inventory would be valued at the <b>$8 factory cost</b>, not $9.50 (only factory costs are incurred to produce stock)</li></ol></div>` },
      { h: 'Why use absorption costing?', b: `<ul><li>📦 <b>Inventory valuation</b>: for the statement of financial position AND cost of sales (opening + production − closing = cost of goods sold).</li><li>🏷 <b>Pricing</b>: "full cost-plus" pricing, especially for contract work where every job differs.</li><li>📊 <b>Profitability</b> of different products (more debatable).</li></ul><p><b>IAS 2 Inventories</b> requires inventory at the costs of bringing it to its present location and condition, <b>including production overheads</b>. So financial accounts use absorption costing.</p>` },
      { h: 'The 3 stages', b: `<div class="pic">📥 ➗ 🍾</div><ol class="reveal"><li><b>Allocation</b>: whole cost items charged directly to a cost centre or unit</li><li><b>Apportionment</b>: shared costs spread fairly between cost centres</li><li><b>Absorption</b>: production cost centre overheads added into units</li></ol><p>Two schools of thought for dealing with overheads: <b>absorption costing</b> and <b>marginal costing</b>.</p>` },
    ],
    check: [
      ['Absorption costing is required for inventory by…', ['IAS 2', 'The tax office', 'The GRI', 'Nobody'], 'Inventory at full production cost.'],
      ['Main reasons for absorption costing include…', ['Inventory valuation and pricing', 'Cash budgets', 'Variance investigation', 'Transfer pricing only'], 'Plus product profitability.'],
      ['The order of the stages is…', ['Allocation → apportionment → absorption', 'Absorption → allocation → apportionment', 'Apportionment → absorption → allocation', 'Any order'], 'Allocate, apportion, absorb.'],
    ],
    pool: [
      ['Under absorption costing, closing inventory of finished goods is valued at…', ['Full production (factory) cost', 'Full cost of sales including admin', 'Prime cost only', 'Selling price'], 'Only factory costs go into stock.'],
      ['Prime cost $6, production OH $2/unit, other OH $1.50/unit. Factory cost per unit?', ['$8.00', '$9.50', '$6.00', '$7.50'], '6 + 2.'],
      ['"Full cost-plus" pricing is especially useful for…', ['Contract work where every job differs', 'Commodity markets', 'Penetration pricing', 'Transfer pricing'], 'Needs a full cost.'],
    ],
  },
  {
    id: 'm3-3', mod: 3, lo: '3.2', title: 'Allocation & apportionment', mins: 14, game: 'factory',
    slides: [
      { h: 'Types of cost centre', b: `<ul><li>🏭 <b>Production departments</b> (e.g. machining, assembly)</li><li>🔧 <b>Service departments</b> (quality control, maintenance, stores)</li><li>🗂 Administrative departments</li><li>📣 Marketing or distribution departments</li><li>🏢 <b>Overhead cost centres</b> for shared items like rent, heat and light, later shared out</li></ul>` },
      { h: 'Allocation', b: `<p>If a cost clearly belongs to one cost centre, charge it <b>all</b> there.</p><div class="eg">Packing staff wages → packing department. Warehouse security guard → warehouse. Computer printer paper → computer department. Factory rent first goes in full to a rent cost centre, then gets apportioned.</div>` },
      { h: 'Apportionment: fair sharing', b: `<p>First classify overheads as production, service, admin or marketing & distribution. Then share general overheads using a <b>fair basis</b>:</p><table class="t"><tr><th>Overhead</th><th>Basis</th></tr>
        <tr><td>Rent, rates, heating & lighting, building repairs & depreciation</td><td>📐 Floor area</td></tr>
        <tr><td>Equipment depreciation & insurance (incl. computers)</td><td>💻 Cost or book value of equipment</td></tr>
        <tr><td>Personnel, canteen/cafeteria, superannuation</td><td>👥 Number of employees (or labour hours)</td></tr>
        <tr><td>Gas & electricity (sometimes)</td><td>📦 Volume of space</td></tr></table>` },
      { h: 'Example', b: `<div class="eg">Rent $120,000. Machining 500 m², Assembly 300 m², Stores 200 m² (total 1,000).<ol class="reveal"><li>Machining: 120,000 × 500/1,000 = <b>$60,000</b></li><li>Assembly: 120,000 × 300/1,000 = <b>$36,000</b></li><li>Stores: 120,000 × 200/1,000 = <b>$24,000</b></li></ol></div>` },
      { h: 'Re-apportioning service departments', b: `<p>Only <b>production</b> departments make goods that are sold, so service department costs must be passed on to production departments so the full cost of each unit can be found.</p><table class="t"><tr><th>Service centre</th><th>Basis</th></tr><tr><td>Stores</td><td>Number or cost value of <b>material requisitions</b></td></tr><tr><td>Maintenance</td><td><b>Hours of maintenance</b> work for each centre</td></tr><tr><td>Production planning</td><td>Direct labour hours in each production centre</td></tr></table><p>Methods: direct, step-down, repeated distribution (reciprocal). Only simple apportionment is examined.</p>` },
      { h: 'Step-down example', b: `<div class="eg">Maintenance does work for Stores, Dept A and Dept B. Stores serves A and B only.<ol class="reveal"><li>Apportion <b>Maintenance first</b> (it serves the other service department), by maintenance hours, to Stores, A and B</li><li>Stores' total = its own overheads + its share of maintenance</li><li>Apportion Stores' total to A and B by number of requisitions</li><li>Production depts A and B now hold ALL the overheads, ready for absorption</li></ol></div>` },
    ],
    check: [
      ['Best basis to apportion factory rent:', ['Floor area', 'Number of employees', 'Equipment value', 'Units sold'], 'Building costs follow space.'],
      ['Canteen costs are best apportioned by…', ['Number of employees', 'Floor area', 'Machine hours', 'Sales'], 'People eat in the canteen.'],
      ['Why re-apportion service department costs?', ['Only production depts make saleable output', 'To save tax', 'The law says so', 'To avoid variances'], 'Costs must end up where units are made.'],
    ],
    pool: [
      ['Insurance of computers is best apportioned by…', ['Book value of computers', 'Floor area', 'Number of employees', 'Units produced'], 'Value of the equipment insured.'],
      ['The cost of a warehouse security guard charged entirely to the warehouse cost centre is…', ['Allocation', 'Apportionment', 'Absorption', 'Re-apportionment'], 'Whole cost to one centre.'],
      ['In the step-down method, which service department is apportioned first?', ['The one that also serves other service departments', 'The smallest one', 'The production department', 'Any, at random'], 'So the second service dept gets its full cost.'],
      ['Gas and electricity may be apportioned using…', ['Volume of space occupied', 'Number of requisitions', 'Sales revenue', 'Units sold'], 'Or floor area.'],
      ['Rent $120,000; Assembly 300 m² of 1,000 m². Assembly\'s share?', ['$36,000', '$40,000', '$30,000', '$60,000'], '120,000 × 300/1,000.'],
    ],
  },
  {
    id: 'm3-4', mod: 3, lo: '3.3', title: 'Overhead absorption rates (OAR)', mins: 15, game: 'factory',
    slides: [
      { h: 'Four steps', b: `<ol class="reveal"><li>Estimate the <b>overhead</b> for the coming period</li><li>Estimate the <b>activity level</b> (labour hours, machine hours, units…)</li><li>Divide: <b>OAR = budgeted overhead ÷ budgeted activity</b></li><li>Absorb: product overhead = OAR × activity used by the product</li></ol><div class="eg">Athena: overhead $50,000, 100,000 labour hours → <b>$0.50/hour</b>. Greek (2 hrs) absorbs $1.00; Roman (5 hrs) absorbs $2.50.</div>` },
      { h: 'Bases of absorption', b: `<ul><li>% of direct materials cost · % of direct labour cost · % of prime cost</li><li><b>Rate per machine hour</b>: when production is machine-controlled</li><li><b>Rate per direct labour hour</b>: labour-intensive environments (preferred to % of labour cost when pay rates vary)</li><li><b>Rate per unit</b>: only if all units are identical</li><li>% of factory cost (for admin overhead); % of sales or factory cost (marketing & distribution)</li></ul><p>Time-based rates (hours) are usually fairest because most overheads grow with time.</p>` },
      { h: 'The choice changes the cost', b: `<div class="eg">Product: materials $80, labour $85, 36 labour hours, 23 machine hours. Overhead absorbed could be:<br>112.5% of materials = $90 · 90% of labour = $76.50 · 50% of prime cost = $82.50 · 23 × $3.60 = $82.80 · 36 × $2 = $72.</div><p>The choice is a matter of <b>judgement</b>, and this arbitrariness is a main criticism of absorption costing. Review the bases when things change (e.g. a department becomes mechanised → switch to machine hours).</p>` },
      { h: 'Blanket vs departmental rates', b: `<p>A <b>blanket (single factory-wide) rate</b> charges every job the same rate, wherever it was worked on.</p><div class="eg">Stoakley: Dept A $360,000 / 200,000 hrs = $1.80; Dept B $200,000 / 40,000 hrs = $5.00. Blanket = $560,000 / 240,000 = $2.33.<br>Job X (30 hrs all in B) and Job Y (28 hrs A + 2 hrs B) both get $70 overhead with the blanket rate. With departmental rates: X = $150, Y = $60.40. Much fairer!</div><p>Blanket rates are unfair when products pass through several departments and spend different times in each.</p>` },
      { h: 'Under- and over-absorption', b: `<p>Rates are set in advance from <b>budgets</b>. At year end:</p><div class="formula">Absorbed = OAR × ACTUAL activity, then compare with ACTUAL overhead</div><ul><li>Absorbed <b>more</b> than actual → <b>OVER</b>-absorbed → added to profit 😀</li><li>Absorbed <b>less</b> → <b>UNDER</b>-absorbed → deducted from profit 😟</li></ul><div class="eg">OAR $16/hr. Actual 52,000 hrs → absorbed $832,000. Actual OH $886,000 → <b>under-absorbed $54,000</b>.</div><div class="trap">⚠️ Use ACTUAL hours × the BUDGETED rate.</div>` },
      { h: 'Why predetermined rates?', b: `<ul><li>✅ Full production costs can be recorded <b>sooner</b> (no waiting for year-end actuals)</li><li>✅ Avoids unit costs jumping around because of unusually high or low overhead or activity</li><li>❌ They <b>cause</b> under/over absorption (they don't avoid it!)</li></ul>` },
    ],
    check: [
      ['OAR is calculated using…', ['Budgeted overhead ÷ budgeted activity', 'Actual ÷ actual', 'Actual overhead ÷ budget activity', 'Budget overhead ÷ actual activity'], 'Set in advance from the budget.'],
      ['Absorbed $100k, actual overhead $90k. This is…', ['Over-absorbed by $10k', 'Under-absorbed by $10k', 'No difference', 'A sales variance'], 'Absorbed more than spent.'],
      ['A machine-heavy department should use…', ['A machine hour rate', 'A labour hour rate', '% of materials', 'Rate per customer'], 'Match the main activity.'],
    ],
    pool: [
      ['Overhead $50,000, 100,000 labour hours. A product taking 5 hours absorbs…', ['$2.50', '$0.50', '$5.00', '$10.00'], '$0.50 × 5.'],
      ['Which statements about predetermined OARs are correct? I record costs sooner; II avoid under/over absorption; III avoid unit-cost fluctuations', ['I and III only', 'I, II and III', 'I and II only', 'II and III only'], 'They CAUSE under/over absorption.'],
      ['A blanket overhead rate is…', ['One rate used throughout the factory for all jobs', 'A separate rate for each department', 'A rate for admin only', 'A rate per customer'], 'Single factory-wide rate.'],
      ['Overhead absorption is also called…', ['Overhead recovery', 'Overhead allocation', 'Apportionment', 'Re-apportionment'], 'Same thing.'],
      ['Admin overhead is commonly absorbed as a…', ['% of factory cost', 'Rate per machine hour', 'Rate per requisition', '% of sales commission'], 'Per the list of bases.'],
    ],
  },
  {
    id: 'm3-5', mod: 3, lo: '3.3', title: 'Marginal costing & contribution', mins: 12, game: 'factory',
    slides: [
      { h: 'A different view', b: `<p><b>Marginal cost</b> = the <b>variable cost of one unit</b>: direct materials, direct labour, variable production overhead (+ variable selling costs like commission for the marginal cost of sales).</p><div class="formula">Contribution = Sales − Variable costs</div><div class="say">Contribution is short for "contribution towards covering fixed overheads and making a profit".</div><p>Direct labour is treated as variable unless the question clearly says otherwise.</p>` },
      { h: 'Principles of marginal costing', b: `<ul><li>Fixed costs are <b>period costs</b>: the same for any volume (in the relevant range), written off in full each period.</li><li>Sell one more unit → revenue up by its price, costs up by its VC, profit up by its <b>contribution</b>.</li><li>Inventory is valued at <b>variable (marginal) production cost</b> only.</li><li>Profit = total contribution − fixed costs.</li></ul>` },
      { h: 'Worked example', b: `<div class="eg">"Splash": price $10, variable cost $6 → contribution <b>$4</b>. Fixed costs $45,000/month. Made 20,000.<ol class="reveal"><li>Sell 10,000: 40,000 − 45,000 = <b>−$5,000</b> loss</li><li>Sell 15,000: 60,000 − 45,000 = <b>$15,000</b> profit</li><li>Sell 20,000: 80,000 − 45,000 = <b>$35,000</b></li><li>Sell 17,000: 68,000 − 45,000 = <b>$23,000</b></li></ol></div><p>Profit per unit changes with volume, but <b>contribution per unit stays constant</b>. That makes contribution great for "what if sales change?" and for decisions.</p>` },
      { h: 'Marginal vs absorption', b: `<table class="t"><tr><th>Marginal costing</th><th>Absorption costing</th></tr><tr><td>Stock at <b>marginal</b> production cost</td><td>Stock at <b>full</b> production cost</td></tr><tr><td>Fixed costs are <b>period costs</b></td><td>Fixed costs <b>absorbed into units</b></td></tr><tr><td>Cost of sales has no fixed overhead</td><td>Cost of sales includes fixed overhead (some from opening stock; some current overhead carried forward in closing stock)</td></tr><tr><td>Must split variable vs fixed</td><td>No need to split</td></tr></table>` },
    ],
    check: [
      ['Contribution =', ['Sales − variable costs', 'Sales − total costs', 'Sales − fixed costs', 'Profit + tax'], 'Contribution towards fixed costs and profit.'],
      ['Under marginal costing, inventory is valued at…', ['Variable production cost', 'Full production cost', 'Selling price', 'Nil'], 'Fixed costs are period costs.'],
      ['Price $38, VC $15, sold 12,000, fixed $200,000. Profit?', ['$76,000', '$276,000', '$256,000', '$176,000'], '23 × 12,000 − 200,000.'],
    ],
    pool: [
      ['If sales rise by one unit, marginal costing profit rises by…', ['The contribution per unit', 'The selling price', 'The profit per unit', 'Nothing'], 'Fixed costs don\'t change.'],
      ['Which is the same at every level of sales?', ['Contribution per unit', 'Profit per unit', 'Fixed cost per unit', 'Total contribution'], 'Constant VC and price.'],
      ['Splash: price $10, VC $6, fixed $45,000. Profit from selling 17,000?', ['$23,000', '$68,000', '$125,000', '$5,000'], '17,000 × 4 − 45,000.'],
      ['In absorption costing it is NOT necessary to…', ['Separate variable from fixed costs', 'Value inventory', 'Absorb overheads', 'Calculate a cost per unit'], 'Marginal costing needs the split.'],
    ],
  },
  {
    id: 'm3-6', mod: 3, lo: '3.3', title: 'Marginal vs absorption profit', mins: 13, game: 'factory',
    slides: [
      { h: 'Why do the two profits differ?', b: `<p>Under absorption costing, some of this period's fixed overhead is "parked" in closing stock and charged next period.</p><div class="formula">Profit difference = Change in inventory (units) × Fixed overhead absorbed per unit</div>` },
      { h: 'Which is higher?', b: `<div class="say">Stock Increases → Absorption Higher. 📈 (SIAH)</div><ul><li>Inventory <b>increases</b> (made more than sold) → <b>absorption</b> profit higher</li><li>Inventory <b>decreases</b> (sold more than made) → <b>marginal</b> profit higher</li><li>No change → <b>same</b> profit</li></ul>` },
      { h: 'Big Possum example', b: `<div class="eg">Budget: fixed production OH $1.6m a year, 1,280,000 units → <b>$1.25/unit</b>. Quarter: produced 280,000 (budget 320,000), sold 240,000. VC $66.<ol class="reveal"><li>Convert to the quarter: budget = 320,000 units, OH $400,000</li><li>Absorption cost/unit = 66 + 1.25 = $67.25</li><li>Closing stock = 40,000 units</li><li>Under-absorbed: (320,000 − 280,000) × 1.25 = <b>$50,000</b>, added to production costs</li><li>Profit difference = 40,000 × 1.25 = <b>$50,000</b>, absorption higher (stock rose)</li></ol></div><div class="trap">⚠️ Quarterly question with annual budget figures? Convert to the quarter first!</div>` },
      { h: 'Opening stock too', b: `<p>If there's opening stock valued with an old fixed overhead rate (say $4/unit, FIFO), the difference = closing stock × current rate − opening stock × old rate.</p><div class="eg">Opening 2,000 units at $4 FOH; closing 2,500 at $4 → difference = 500 × 4 = <b>$2,000</b>, absorption higher.</div>` },
    ],
    check: [
      ['Production 17,000, sales 23,000, FOH $4/unit. Which profit is higher and by how much?', ['Marginal by $24,000', 'Absorption by $24,000', 'Marginal by $68,000', 'Equal'], 'Stock fell 6,000 × $4.'],
      ['If production equals sales, the two profits are…', ['Equal', 'Absorption higher', 'Marginal higher', 'Unknown'], 'No overhead deferred.'],
      ['Stock increases → which is higher?', ['Absorption profit', 'Marginal profit', 'Neither', 'Cash'], 'Overhead carried forward in stock.'],
    ],
    pool: [
      ['Produced 280,000, sold 240,000, FOH $1.25/unit. Profit difference?', ['$50,000, absorption higher', '$50,000, marginal higher', '$300,000', 'Nil'], '40,000 × 1.25.'],
      ['Annual budget 1,280,000 units and FOH $1.6m. Quarterly budget output?', ['320,000 units', '1,280,000 units', '106,667 units', '640,000 units'], 'Divide by 4.'],
      ['Under absorption costing, part of this period\'s fixed overhead is…', ['Carried forward in closing inventory', 'Ignored', 'Treated as a variable cost', 'Charged to next year\'s sales budget'], 'That causes the profit difference.'],
    ],
  },
  {
    id: 'm3-7', mod: 3, lo: '3.4', title: 'Activity-based costing (ABC): the idea', mins: 15, game: 'factory',
    slides: [
      { h: 'Why ABC was invented', b: `<p>Old absorption costing was built when firms made few products, overheads were small, and labour was the main cost. Now, with <b>advanced manufacturing technology (AMT)</b>, overheads are huge and direct labour can be as little as 5% of cost.</p><p>Many overheads come from <b>support activities</b> (set-ups, scheduling, order handling, inspection, data processing) that depend on the <b>range and complexity</b> of products, not volume.</p><div class="eg">Factory X makes 10,000 of one product (1 set-up). Factory Y makes 1,000 each of 10 versions (10 set-ups). Same volume, but Y has far more support costs!</div>` },
      { h: 'The problem with old costing', b: `<div class="trap">⚠️ Traditional volume-based costing gives too MUCH overhead to high-volume products and too LITTLE to low-volume products (and too little to small, simple products, too much to large ones).</div><p>ABC traces overheads to <b>activities</b>, finds what <b>drives</b> each activity, then charges products by how much of each activity they use.</p>` },
      { h: 'Key words', b: `<ul><li><b>Activity / resource driver</b>: an activity that consumes resources and causes costs (ordering uses staff, space, IT)</li><li><b>Cost object</b>: the product/service/customer being costed</li><li><b>Activity cost pool</b>: all the costs of one activity grouped together</li><li><b>Cost driver</b>: the factor that influences the level of cost (number of purchase orders drives procurement cost)</li></ul>` },
      { h: 'ABC in 4 steps', b: `<ol class="reveal"><li>Identify major <b>activities</b>: unit-level (inspect each unit), batch-level (despatching an order box), product-level (design, marketing); also customer-level (help line, catalogues)</li><li>Identify each activity's <b>cost driver</b></li><li>Collect costs into <b>activity cost pools</b></li><li>Charge products: <b>cost driver rate = pool ÷ number of drivers</b>, × the drivers each product uses</li></ol>` },
      { h: 'Common drivers', b: `<table class="t"><tr><th>Cost</th><th>Driver</th></tr><tr><td>Ordering</td><td>No. of orders</td></tr><tr><td>Materials handling</td><td>No. of production runs</td></tr><tr><td>Production scheduling / set-ups</td><td>No. of production runs</td></tr><tr><td>Despatch</td><td>No. of despatches</td></tr><tr><td>Quality control</td><td>No. of inspections</td></tr><tr><td>Short-run variable costs (oil, power, repairs)</td><td><b>Volume</b>: machine or labour hours</td></tr></table><p>Volume-related costs use volume drivers; other costs use <b>transaction-based</b> drivers.</p>` },
      { h: 'Worked example', b: `<div class="eg">Set-up costs $200,000 for 40 set-ups → <b>$5,000 per set-up</b>.<ol class="reveal"><li>X: 150,000 units in batches of 5,000 = 30 set-ups → $150,000 → <b>$1.00 per unit</b></li><li>Y: 500,000 units in batches of 50,000 = 10 set-ups → $50,000 → <b>$0.10 per unit</b></li><li>X, the smaller-batch product, carries far more set-up cost per unit</li></ol></div>` },
      { h: 'Absorption vs ABC', b: `<ul><li>Both use a <b>two-stage</b> process (costs to centres/pools, then to products).</li><li>ABC uses pools for support activities and charges them directly, so <b>no re-apportionment</b> of service departments.</li><li>Absorption uses 1–2 bases (labour/machine hours). ABC uses <b>many drivers</b>, one rate per activity, closely linked to what causes the cost.</li></ul><div class="eg">Cooplan (products W, X, Y, Z): traditional costing under-costs low-volume W and X and over-costs high-volume Z.</div>` },
    ],
    check: [
      ['Traditional absorption costing tends to…', ['Over-cost high-volume products', 'Under-cost high-volume products', 'Cost everything correctly', 'Ignore overheads'], 'Volume-based rates.'],
      ['Likely driver for production scheduling costs:', ['Number of production runs', 'Units produced', 'Floor area', 'Sales value'], 'Scheduling happens per run.'],
      ['Pool $180,000, 60 set-ups. Driver rate?', ['$3,000 per set-up', '$60 per set-up', '$180 per set-up', '$10,800'], '180,000 ÷ 60.'],
    ],
    pool: [
      ['The growth of non-volume support activities is mainly due to…', ['Advanced manufacturing technology and product variety', 'Higher direct labour', 'Fewer products', 'Lower overheads'], 'AMT and complexity.'],
      ['In ABC, the product being costed is the…', ['Cost object', 'Cost pool', 'Resource driver', 'Cost driver'], 'Could be a product, service or customer.'],
      ['ABC avoids which step of traditional costing?', ['Re-apportioning service department costs', 'Collecting costs', 'Charging products', 'Identifying overheads'], 'Activities are charged directly.'],
      ['Ordering costs are most likely driven by…', ['Number of orders', 'Machine hours', 'Floor area', 'Units sold'], 'Transaction driver.'],
      ['Despatch costs are most likely driven by…', ['Number of despatches', 'Labour hours', 'Floor area', 'Value of equipment'], 'Transaction driver.'],
    ],
  },
  {
    id: 'm3-8', mod: 3, lo: '3.4', title: 'ABC: hierarchy, pros, cons & uses', mins: 14, game: 'factory',
    slides: [
      { h: 'Marginal costing vs ABC', b: `<p>Some say only marginal costing helps decisions. Not true! Marginal costing splits costs by <b>volume</b> only, but costs "fixed" to volume may be <b>variable with another driver</b> (batches, product lines).</p><p>If an expensive activity is mostly for one product, ABC shows that product may be unprofitable. Marginal costing hides it in period costs. This matters most when "fixed" costs are large.</p>` },
      { h: 'When should a firm introduce ABC?', b: `<p>Only if the extra information leads to action that <b>increases profitability</b>. Most useful when:</p><ul><li>Production overheads are <b>high</b> relative to direct costs</li><li>Overheads are <b>not driven by volume</b></li><li>There's a <b>wide product range</b></li><li>Overhead use <b>varies a lot</b> across products</li></ul>` },
      { h: 'The hierarchy of activities', b: `<table class="t"><tr><th>Level</th><th>Cost depends on</th><th>Examples</th></tr>
        <tr><td><b>Product (unit) level</b></td><td>Volume of production</td><td>Machine power; inspecting every unit</td></tr>
        <tr><td><b>Batch level</b></td><td>Number of batches</td><td>Set-ups, materials handling per run</td></tr>
        <tr><td><b>Product-sustaining</b></td><td>Existence of a product line</td><td>Product/brand management, product design</td></tr>
        <tr><td><b>Facility-sustaining</b></td><td>Simply being in business</td><td>Rent and rates, general factory admin</td></tr></table>
        <p>If overheads are mostly unit and facility level, ABC and absorption give similar costs. If mostly batch/product level, ABC differs a lot.</p>` },
      { h: 'Batch-level example', b: `<div class="eg">XYZ: overhead $500,000, 40,000 labour hours → traditional $12.50/hr → $1.25 per unit of both D and E.<br>But costs are batch-driven: 1,000 runs → $500 per run. D needs 5 runs, E needs 20 (500 units each).<br>ABC: D = 5 × 500 / 500 = <b>$5</b>; E = 20 × 500 / 500 = <b>$20</b>.</div>` },
      { h: 'Merits of ABC', b: `<ul><li>Recognises complexity: many cost drivers</li><li>Realistic product profitability</li><li>Covers ALL overheads (design, quality, customer service), beyond the factory floor</li><li>Controlling the driver controls the cost; questions non-value-adding activities</li><li>Spots changes in workload (e.g. fewer orders → fewer ordering costs needed)</li><li><b>Customer profitability analysis</b>: revenues and service costs per customer</li><li>Suits services with competition, diversity and big overheads (Post Office: unit = transactions, batch = close-outs/deposits, product = accounts)</li></ul>` },
      { h: 'Criticisms of ABC', b: `<ul><li>Some <b>arbitrary apportionment</b> is still needed (rent, building depreciation)</li><li>One cost driver may not explain a whole pool</li><li>Too many pools = too complex and expensive</li><li>Some costs have no measurable driver (external audit fee)</li><li>Introduced because it's fashionable, not used</li><li>Costs may exceed benefits</li></ul>` },
      { h: 'Using ABC information', b: `<ul><li>📅 <b>Planning</b>: <b>activity-based budgeting (ABB)</b>: budgeted activity levels × cost per activity → staffing and machine needs</li><li>🔍 <b>Control</b>: manage costs by managing activities and monitoring driver usage</li><li>🤔 <b>Decisions</b>: pricing, promoting/discontinuing products, redesign, new ways of doing business</li><li>🛠 <b>ABM</b> (activity-based management): improve profit by doing activities more efficiently or removing non-value-adding ones</li></ul><div class="trap">⚠️ An ABC cost is a <b>long-run average</b>, not a true or relevant cost for every decision. Drop a product and its share of rent doesn't disappear!</div>` },
    ],
    check: [
      ['Brand management is a…', ['Product-sustaining activity', 'Batch-level activity', 'Unit-level activity', 'Facility-sustaining activity'], 'Exists because the product exists.'],
      ['Machine set-ups are…', ['Batch level', 'Unit level', 'Facility level', 'Product-sustaining'], 'Per batch.'],
      ['A disadvantage of ABC is…', ['Some arbitrary apportionment is still needed', 'It ignores overheads', 'It can\'t be used in services', 'It only uses labour hours'], 'Facility costs still need splitting.'],
    ],
    pool: [
      ['ABC should be introduced only if…', ['The extra information leads to action that increases profitability', 'It is fashionable', 'Overheads are tiny', 'One product is made'], 'Cost-benefit.'],
      ['Using budgeted activity levels × cost per activity to build budgets is…', ['Activity-based budgeting (ABB)', 'Zero-based budgeting', 'Incremental budgeting', 'Flexible budgeting'], 'ABB.'],
      ['Analysing revenues and service costs for specific customers is…', ['Customer profitability analysis', 'Variance analysis', 'Break-even analysis', 'Life cycle costing'], 'ABC helps with this.'],
      ['XYZ: $500 per run; product E needs 20 runs for 500 units. ABC overhead per unit of E?', ['$20', '$5', '$1.25', '$12.50'], '20 × 500 ÷ 500.'],
      ['If most overheads are unit-level and facility-level, ABC unit costs will be…', ['Similar to traditional absorption costs', 'Very different', 'Zero', 'Always higher'], 'Differences come from batch/product-level costs.'],
      ['Which is NOT a criticism of ABC?', ['It considers many cost drivers', 'Some arbitrary apportionment remains', 'It may cost more than it\'s worth', 'One driver may not explain a pool'], 'Multiple drivers are a strength.'],
    ],
  },
  {
    id: 'm3-9', mod: 3, lo: '3.5', title: 'Job costing vs process costing (and cost-plus)', mins: 13, game: 'factory',
    slides: [
      { h: 'Two ways of making things', b: `<table class="t"><tr><th>🎂 Job costing</th><th>🛢 Process costing</th></tr>
        <tr><td>Customer order of relatively short duration to the customer's special requirements (a product, small batch, project, case)</td><td>Mass production in a continuous flow of identical units (oil refining, soap, food & drink, magazine printing)</td></tr>
        <tr><td>Job moves through the workshop as an identifiable unit</td><td>Production is an indistinguishable "homogeneous mass", so can't cost each unit</td></tr>
        <tr><td>Costs collected per job</td><td>Costs collected by department/process; average cost = total cost ÷ units</td></tr></table>` },
      { h: 'Special features of process costing', b: `<ul><li>Usually <b>closing work in process</b> to value</li><li>Often <b>losses</b> (spoilage, wastage, evaporation)</li><li>Output of one process becomes <b>input to the next</b></li><li>May have a <b>by-product</b> (small value) and/or <b>joint products</b> (two+ products from the same process)</li></ul>` },
      { h: 'How a job is handled', b: `<ol class="reveal"><li>Customer and supplier agree the specification (quantity, quality, delivery date)</li><li>Estimating department prepares an <b>estimate</b>: materials, wages, overheads, special equipment + profit = quoted price</li><li>The job is <b>"loaded"</b> onto the factory floor when resources are ready (not too early: storage costs!)</li></ol>` },
      { h: 'Collecting job costs', b: `<p>Each job has a <b>job cost card</b> (or job account).</p><ul><li>Materials issued (less returns), direct labour, direct expenses → job account in the WIP ledger</li><li>Production overhead absorbed with the OAR. Unfinished jobs at period end are valued at <b>factory cost</b>.</li><li>When complete: add admin, selling & distribution overhead → total cost → finished goods</li><li>Price − total cost = profit; on delivery it becomes cost of sales</li><li>Overtime premium: direct to the job if <b>this</b> customer asked for the rush; otherwise overhead</li></ul>` },
      { h: 'Example', b: `<div class="eg">Job 1357: Material Y 400 kg × $5 = $2,000; material Z 800 kg × $6 less 60 kg returned = 740 × $6 = $4,440 → materials <b>$6,440</b>.<br>Dept P: 320 hrs × $8 (the overtime premium is overhead, as overtime isn't normal there). Dept Q: 200 hrs × $10 + 100 × $3 premium (requested by ANOTHER customer → overhead, not this job).<br>Overhead: 520 hrs × $3 = $1,560.</div>` },
      { h: 'Cost-plus pricing (mark-up vs margin)', b: `<div class="formula">Mark-up on COST: Price = Cost × (1 + %)</div><div class="formula">Margin on SALES: Price = Cost ÷ (1 − %)</div><div class="eg">Job cost $4,200.<br>25% <b>on cost</b> → 4,200 × 1.25 = <b>$5,250</b><br>25% <b>of sales</b> → 4,200 ÷ 0.75 = <b>$5,600</b></div><div class="trap">⚠️ The exam LOVES mixing these two!</div>` },
      { h: 'Cost-plus: good & bad', b: `<p>👎 No incentive to control costs (profit guaranteed); no motive to tackle waste; ignores differences between actual and estimated volume (under/over absorption); arbitrary overheads may cause under/over-pricing; may price you out of a competitive market.</p><p>👍 Simple once overheads are allocated; covers costs and a profit on one-off contracts (less risk); easy to justify price rises; stable prices (limits discretionary pricing).</p>` },
    ],
    check: [
      ['Oil refining would use…', ['Process costing', 'Job costing', 'Batch pricing', 'Target costing'], 'Continuous identical output.'],
      ['Cost $4,200, price with 25% MARGIN on sales?', ['$5,600', '$5,250', '$1,050', '$3,150'], '4,200 ÷ 0.75.'],
      ['Usual pricing method for job work:', ['Cost-plus', 'Skimming', 'Penetration', 'Transfer pricing'], 'Cost + a profit margin.'],
    ],
    pool: [
      ['An extra product of insignificant value from a process is a…', ['By-product', 'Joint product', 'Abnormal gain', 'Job'], 'Joint products are significant.'],
      ['An incomplete job at the period end is valued at…', ['Factory (production) cost', 'Selling price', 'Prime cost only', 'Nil'], 'Under absorption costing.'],
      ['Cost $4,200 with a 25% MARK-UP on cost. Price?', ['$5,250', '$5,600', '$5,000', '$3,150'], '4,200 × 1.25.'],
      ['Overtime premium in Dept Q was worked to rush ANOTHER customer\'s job. For this job it is…', ['Overhead, not a direct cost of this job', 'A direct cost of this job', 'Ignored entirely', 'A direct expense'], 'Only the requesting job bears it directly.'],
      ['When should a job be "loaded" onto the factory floor?', ['When resources are available, timed to meet the delivery date', 'As early as possible', 'After delivery', 'At year end'], 'Too early = storage costs.'],
      ['An advantage of cost-plus pricing is…', ['It ensures costs are covered on one-off contracts', 'It encourages cost control', 'It reflects competitor prices', 'It ignores overheads'], 'Low risk of losses.'],
    ],
  },
  {
    id: 'm3-10', mod: 3, lo: '3.6', title: 'Process costing, losses & scrap', mins: 16, game: 'factory',
    slides: [
      { h: 'The process account', b: `<p>Costs are recorded in a <b>process account</b> with two sides, each having a <b>units</b> column and a <b>$</b> column:</p><ul><li><b>Left (debit)</b>: inputs: materials, labour, overheads (labour + overhead = <b>conversion cost</b>)</li><li><b>Right (credit)</b>: outputs: finished units, losses, closing WIP</li></ul><p>Units balance on both sides, and so do dollars. Output of process 1 becomes an input of process 2.</p><div class="say">Balance the UNITS first. It helps you check nothing is missing!</div>` },
      { h: 'The 4-step approach', b: `<ol class="reveal"><li><b>Determine output and losses</b> (expected output, loss or gain, equivalent units)</li><li><b>Cost per unit</b> of output, losses and WIP</li><li><b>Total cost</b> of output, losses and WIP (statement of evaluation)</li><li><b>Complete the accounts</b></li></ol>` },
      { h: 'Normal & abnormal loss', b: `<ul><li><b>Normal loss</b>: expected and budgeted (often a % of input). Valued at <b>scrap value or nil</b>. Good units carry its cost.</li><li><b>Abnormal loss</b>: loss above normal 😟</li><li><b>Abnormal gain</b>: loss below normal 😀</li></ul><p>Abnormal units are valued at the <b>same cost per unit as good output</b>, so they don't change the good units' cost. They go to a separate abnormal loss/gain account and then to profit or loss.</p>` },
      { h: 'Worked example (no scrap)', b: `<div class="eg">Input 1,000 units costing $4,500. Normal loss 10%.<ol class="reveal"><li>Expected output = 900, cost per unit = 4,500 ÷ 900 = <b>$5</b></li><li>(a) Output 860 → loss 140; normal 100 → <b>abnormal loss 40</b> × $5 = $200. Good output 860 × $5 = $4,300</li><li>(b) Output 920 → loss 80 → <b>abnormal gain 20</b> × $5 = $100. Good output 920 × $5 = $4,600</li><li>Either way the good units cost $5. Abnormal events don't change it!</li></ol></div>` },
      { h: 'Scrap', b: `<p><b>Scrap</b> = discarded material with some value. Scrap money is a <b>reduction in cost</b>, not sales revenue.</p><div class="formula">Cost per unit = (Process costs − scrap value of NORMAL loss) ÷ Expected output</div><table class="t"><tr><th>Item</th><th>Debit</th><th>Credit</th></tr><tr><td>Scrap value of normal loss</td><td>Scrap a/c</td><td>Process a/c</td></tr><tr><td>Scrap value of abnormal loss</td><td>Scrap a/c</td><td>Abnormal loss a/c</td></tr><tr><td>Scrap lost due to abnormal gain</td><td>Abnormal gain a/c</td><td>Scrap a/c</td></tr><tr><td>Cash for scrap sold</td><td>Cash/receivables</td><td>Scrap a/c</td></tr></table>` },
      { h: 'Scrap example', b: `<div class="eg">Input 3,200 units costing $19,200. Normal loss 20% with scrap value $2/unit. Output 2,540.<ol class="reveal"><li>Normal loss = 640 units × $2 = $1,280 scrap value</li><li>Expected output = 2,560</li><li>Cost/unit = (19,200 − 1,280) ÷ 2,560 = <b>$7.00</b></li><li>Abnormal loss = 2,560 − 2,540 = 20 units × $7 = <b>$140</b> in the process account</li><li>Its scrap value (20 × $2 = $40) reduces the abnormal loss written off → $100 to profit or loss</li></ol></div>` },
      { h: 'Working backwards', b: `<div class="eg">Need 340 litres of good output. Normal loss 10% + abnormal 5% of INPUT. Input?<br>Output = 85% of input → 340 ÷ 0.85 = <b>400 litres</b>.</div><div class="trap">⚠️ Losses are a % of INPUT, so don't just add 15% to the output!</div>` },
    ],
    check: [
      ['Normal loss (no scrap value) is valued at…', ['Nil', 'Full cost per unit', 'Materials cost', 'Selling price'], 'Good units carry its cost.'],
      ['Abnormal losses are valued…', ['The same as good output', 'At zero', 'At scrap value', 'At materials cost only'], 'They don\'t affect good unit cost.'],
      ['Input 1,000, cost $4,500, normal loss 10% (nil scrap). Cost per unit?', ['$5.00', '$4.50', '$5.23', '$4.95'], '4,500 ÷ 900 expected.'],
    ],
    pool: [
      ['Revenue from scrap is treated as…', ['A reduction in costs', 'Sales revenue', 'An abnormal gain', 'Other income'], 'Credit the process (normal loss) or abnormal loss account.'],
      ['Input 1,000 units, normal loss 10%, actual output 920. This is…', ['An abnormal gain of 20 units', 'An abnormal loss of 20 units', 'Normal', 'An abnormal loss of 80 units'], 'Expected 900, got 920.'],
      ['Labour plus production overhead in a process is called…', ['Conversion cost', 'Prime cost', 'Marginal cost', 'Scrap'], 'Converting materials into product.'],
      ['The scrap value of normal loss is credited to the…', ['Process account', 'Abnormal loss account', 'Sales account', 'Abnormal gain account'], 'Reduces the process cost.'],
      ['Which is the first of the four process-costing steps?', ['Determine output and losses', 'Complete the accounts', 'Calculate total cost', 'Calculate cost per unit'], 'Then cost/unit, total cost, accounts.'],
      ['Good output 340 L after normal loss 10% and abnormal loss 5% of input. Input?', ['400 L', '391 L', '374 L', '357 L'], '340 ÷ 0.85.'],
    ],
  },
  {
    id: 'm3-11', mod: 3, lo: '3.6', title: 'Equivalent units & work in process', mins: 13, game: 'factory',
    slides: [
      { h: 'Half-made bottles', b: `<p>At month end some bottles are half-done: work in process (<b>WIP</b>). A half-done bottle shouldn't carry a full bottle's cost!</p><div class="formula">Equivalent units (EU) = units × % complete</div><p>EU = the notional number of <b>whole</b> units that could have been made. 1,000 bottles 60% complete = <b>600 EU</b>.</p>` },
      { h: 'Worked example', b: `<div class="eg">Trotter Co: no opening WIP. 5,000 units started, costs $29,440. 4,000 finished; 1,000 left 60% complete (materials and conversion).<ol class="reveal"><li>EU = 4,000 + 1,000 × 60% = <b>4,600</b></li><li>Cost per EU = 29,440 ÷ 4,600 = <b>$6.40</b></li><li>Finished goods = 4,000 × 6.40 = <b>$25,600</b></li><li>Closing WIP = 600 × 6.40 = <b>$3,840</b></li><li>Check: 25,600 + 3,840 = 29,440 ✔</li></ol></div>` },
      { h: 'Different % for different costs', b: `<p>Often materials go in 100% at the start, but conversion costs (labour + overhead) are only partly done. Then calculate EU and cost per EU <b>separately</b> for each cost type.</p><div class="eg">300 litres input ($6,000 materials), conversion $4,500. 250 L finished; 50 L WIP: 100% materials, 50% conversion.<br>Materials EU = 250 + 50 = 300; conversion EU = 250 + 25 = 275.</div>` },
      { h: 'Losses and WIP together', b: `<ul><li><b>Normal loss</b> = 0 EU (carries no cost)</li><li><b>Abnormal loss</b> = full EU each (an <b>addition</b> to total EU)</li><li><b>Abnormal gain</b> = full EU each (<b>subtracted</b> from total EU)</li><li>If there's scrap value and different % for each cost, deduct normal-loss scrap from <b>materials</b> cost first</li></ul><div class="eg">Input 2,800 (cost $16,695), normal loss 10% = 280, total loss 350 → abnormal 70. Output 2,000; WIP 450 at 70% = 315 EU. Total EU = 2,000 + 70 + 315 = 2,385 → $7 per EU.</div><p>With <b>opening WIP</b> (weighted average method): add opening WIP cost to this period's costs; completed opening units count as full EU.</p>` },
    ],
    check: [
      ['800 units 75% complete = how many EU?', ['600', '800', '200', '1,067'], '800 × 75%.'],
      ['50 litres WIP, 100% materials, 50% conversion. EU for conversion?', ['25', '50', '100', '0'], 'Only half the conversion done.'],
      ['Normal loss counts as how many equivalent units?', ['Zero', 'One each', 'Half each', 'Its % complete'], 'It carries no cost.'],
    ],
    pool: [
      ['Costs $29,440; 4,000 finished; 1,000 WIP 60% complete. Cost per EU?', ['$6.40', '$5.89', '$7.36', '$6.00'], '29,440 ÷ 4,600.'],
      ['In EU calculations, abnormal loss units are…', ['Added as full equivalent units', 'Ignored', 'Subtracted', 'Counted at half'], 'They carry a full share of costs.'],
      ['In EU calculations, abnormal gain units are…', ['Subtracted from total EU', 'Added', 'Ignored', 'Counted twice'], 'Opposite of abnormal loss.'],
      ['Value of closing WIP: 1,000 units 60% complete at $6.40 per EU?', ['$3,840', '$6,400', '$2,560', '$3,200'], '600 × 6.40.'],
      ['Input 2,800, normal loss 10%, total loss 350. Abnormal loss units?', ['70', '280', '350', '630'], '350 − 280.'],
    ],
  },
];
