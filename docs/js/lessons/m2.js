export default [
  {
    id: 'm2-1', mod: 2, lo: '2.1', title: 'Relevant costs: only the future matters', mins: 14, game: 'runner',
    slides: [
      { h: 'The golden rule', b: `<div class="pic">🔮💵➕</div><div class="say">When making a decision, only count money that will <b>change because of the decision</b>.</div><div class="formula">Relevant cost = <b>Future</b> + <b>Cash flow</b> + <b>Incremental</b> (extra), and it arises as a direct consequence of the decision</div>` },
      { h: '1. Future costs: sunk costs don\'t count', b: `<p>A decision can only change the future. Costs already incurred are <b>past</b> or <b>sunk</b> costs, so they're irrelevant.</p><div class="eg">A company spent $250,000 developing a new service. Research now says it might flop. Should they abandon it? The $250,000 is <b>sunk</b>, so ignore it, however painful!</div><p>Also ignore <b>committed costs</b>: future cash outflows that will happen <b>regardless</b> of the decision (e.g. a lease already signed). A cost "incurred" includes one committed but not yet paid.</p>` },
      { h: '2. Cash flows only', b: `<p>Ignore costs that aren't extra cash spending:</p><ul><li><b>Depreciation</b>: not a cash flow</li><li><b>Arbitrarily apportioned / absorbed overheads</b>: notional accounting shares. Only include overheads that really change because of the decision.</li></ul>` },
      { h: '3. Incremental costs', b: `<p>An <b>incremental cost</b> is an extra cost caused by a decision.</p><div class="eg">A worker paid $100 a week has nothing to do next week. A job would earn $40 revenue. The $100 is paid <b>anyway</b>, so it's irrelevant. Doing the job gains <b>$40</b>, so do it!</div>` },
      { h: 'Avoidable, differential & opportunity', b: `<ul><li><b>Avoidable costs</b>: would NOT be incurred if the activity didn't exist (used when deciding to drop a product: usually variable costs plus some specific costs). Costs incurred either way = <b>unavoidable</b>.</li><li><b>Differential cost</b>: the difference in total cost between alternatives. Option A $300 vs B $360 → $60.</li><li><b>Opportunity cost</b>: the benefit you <b>give up</b> by choosing one option over another. 💭</li></ul><div class="eg">Options A, B, C earn $80, $100, $70. Choose B, not just because it earns $100, but because it beats the next best (A) by $20.</div><div class="eg">You quit a job to start a business. Your salary given up is an <b>opportunity cost</b>, so it's relevant!</div>` },
      { h: 'Controllable, discretionary & committed', b: `<ul><li><b>Controllable costs</b>: can be directly influenced by a given manager within a given time span.</li><li><b>Committed fixed costs</b> (rent of plant, equipment, buildings): set by long-term decisions, so largely <b>uncontrollable</b> in the short term.</li><li><b>Discretionary fixed costs</b> (advertising, R&D, training): set by management choice and changeable at short notice, so <b>controllable</b>.</li></ul>` },
      { h: 'Fixed vs variable as a rule of thumb', b: `<p>Unless told otherwise:</p><ul><li><b>Variable</b> costs → relevant ✅</li><li><b>Existing fixed</b> costs → not relevant ❌ (incurred anyway)</li></ul><p>But watch out for exceptions:</p><ul><li><b>Non-relevant variable costs</b>: materials already bought and obsolete → their cost is sunk</li><li><b>Directly attributable fixed costs</b>: fixed costs that would <b>increase</b> (an extra supervisor hired only for this order) or <b>decrease</b> (closing a department) because of the decision → relevant</li><li><b>General fixed overheads</b>: unaffected → not relevant</li></ul>` },
      { h: 'Worked example: the abandoned machine', b: `<div class="eg">A customer went bust. Costs so far $50,000; deposits received $15,000. Another buyer offers $34,000 once finished.<ol class="reveal"><li>$50,000 spent and $15,000 received: <b>past</b>, so ignore</li><li>Materials already bought ($6,000), no other use, scrap $2,000 → relevant cost = <b>$2,000</b> (scrap money lost)</li><li>Labour $8,000 is scarce; otherwise it would earn $30,000 − $12,000 direct costs elsewhere → cost = wages + lost contribution</li><li>Consultant: $4,000 if finished vs $1,500 cancellation → incremental <b>$2,500</b></li><li>General/absorbed overheads → ignore</li><li>Compare total relevant costs with the $34,000 revenue</li></ol></div>` },
    ],
    check: [
      ['$250,000 already spent on research for a project is…', ['A sunk cost (irrelevant)', 'An opportunity cost', 'An incremental cost', 'A relevant cost'], 'Past spending can\'t change.'],
      ['Your salary given up to start your own business is…', ['An opportunity cost', 'A sunk cost', 'Irrelevant', 'A committed cost'], 'The benefit you sacrifice.'],
      ['Which IS relevant?', ['Special material that must be bought for the job', 'Depreciation of an old machine', 'Rent already committed', 'Absorbed overhead'], 'Future, cash, extra.'],
    ],
    pool: [
      ['A worker paid $100/week anyway could do a job earning $40. The relevant gain is…', ['$40', '−$60', '$140', '$0'], 'The $100 is paid regardless.'],
      ['Option A costs $300, option B $360. The differential cost is…', ['$60', '$660', '$300', '$360'], 'The difference between alternatives.'],
      ['When deciding whether to discontinue a product, which costs matter most?', ['Avoidable costs', 'Unavoidable costs', 'Sunk costs', 'Absorbed costs'], 'Only costs that would be saved.'],
      ['Rent arising from long-term leases is usually…', ['A committed fixed cost, uncontrollable in the short term', 'A discretionary cost', 'A variable cost', 'An opportunity cost'], 'Set by long-term decisions.'],
      ['General fixed overheads unaffected by a decision are…', ['Not relevant', 'Relevant', 'Opportunity costs', 'Avoidable'], 'Unless there\'s an incremental element.'],
      ['Progress payments already received from a customer are…', ['Irrelevant to a future decision', 'Relevant revenue', 'An opportunity cost', 'A committed cost'], 'Past cash flows don\'t change.'],
    ],
  },
  {
    id: 'm2-2', mod: 2, lo: '2.1', title: 'Relevant cost of materials, labour & assets', mins: 14, game: 'runner',
    slides: [
      { h: 'Materials: the decision tree', b: `<ol class="reveal"><li>Need to buy new? → <b>current purchase price</b>.</li><li>Already in stock and <b>used regularly</b> (will be replaced)? → <b>current replacement cost</b>.</li><li>In stock but <b>won't be replaced</b>? → the <b>higher</b> of (resale value) or (value in another use).</li><li>No resale value and no other use? → <b>nil</b> ($0)!</li></ol><div class="trap">⚠️ What you originally paid is a SUNK cost. Never use it!</div>` },
      { h: 'Example 1: regular use', b: `<div class="eg">100 kg in stock (paid $200). Resale $3/kg. Market price now $4/kg. Used regularly. Job needs 200 kg.<ol class="reveal"><li>Used regularly → everything used will be replaced</li><li>200 kg × $4 = <b>$800</b> ✅</li><li>Traps: $200 (sunk), $500 or $700 (mixing in resale/original price)</li></ol></div><div class="eg">500 kg in stock, used regularly; market $3.25/kg but must buy 1,000 kg lots. Job needs 600 kg → 600 × $3.25 = <b>$1,950</b> (the spare 400 kg is kept for later use).</div>` },
      { h: 'Example 2: not replaced', b: `<div class="eg">Material C: need 1,000, have 700 (no other use; resale $2.50). Extra bought at $4.<ol class="reveal"><li>700 in stock → resale lost: 700 × $2.50 = $1,750</li><li>300 to buy → 300 × $4 = $1,200</li><li>Relevant cost = <b>$2,950</b></li></ol></div><div class="eg">Material D in stock: could be sold for $1,200, OR used instead of buying material E costing $1,500. Relevant = the <b>higher</b> benefit given up = <b>$1,500</b>.</div><div class="eg">Obsolete stock cost $2,000, no use: relevant = <b>$0</b>. If it has $300 scrap value: <b>$300</b>.</div>` },
      { h: 'Labour: three situations', b: `<table class="t"><tr><th>Situation</th><th>Relevant cost</th></tr>
        <tr><td>Must hire extra labour</td><td>The wages paid (variable cost)</td></tr>
        <tr><td><b>Spare capacity</b> (paid anyway)</td><td><b>Nil</b></td></tr>
        <tr><td>Labour <b>scarce</b>, taken off another product</td><td><b>Wage + contribution lost</b> from that product</td></tr></table>
        <div class="eg">Product L earns $22 contribution in 5 hours → $4.40 lost per hour. Wage $6. Moving scarce labour costs $6 + $4.40 = <b>$10.40/hour</b>.</div>` },
      { h: 'Labour: pick the cheaper option', b: `<div class="eg">New contract needs 500 hours. 400 spare hours exist. The other 100: overtime at time-and-a-half, OR divert from product X (contribution $4 per 2 hours). Wage $12/hour.<ol class="reveal"><li>400 spare hours → $0</li><li>Overtime: 100 × $12 × 1.5 = $1,800</li><li>Divert: 100 × ($12 + $2 lost) = $1,400</li><li>Choose the cheaper → relevant cost = <b>$1,400</b></li></ol></div>` },
      { h: 'Deprival value of an asset', b: `<p>"How much would we need to receive to be no worse off if we lost this asset?"</p><div class="formula">Deprival value = LOWER of [Replacement cost] and [HIGHER of (NRV, Economic value)]</div><ul><li><b>NRV</b> = what you'd get selling it (scrap proceeds)</li><li><b>Economic value</b> = future revenues from using it</li><li>Its original cost is <b>sunk</b></li></ul><div class="eg">Machine cost $14,000 ten years ago. RC $9,000, NRV $8,000, future revenues $10,000.<br>Higher of 8,000/10,000 = 10,000. Lower of 9,000/10,000 = <b>$9,000</b>.</div>` },
      { h: 'Using an existing machine', b: `<div class="eg">Idle machine, book value $1,000. Could be sold now for $1,200. After a 1-year contract it'd be worthless and cost $800 to dispose of.<ol class="reveal"><li>Using it means losing the $1,200 sale now</li><li>Plus paying $800 disposal later</li><li>Relevant cost = <b>$2,000</b> (book value is irrelevant)</li></ol></div>` },
    ],
    check: [
      ['Material in stock, used regularly. Relevant cost?', ['Replacement cost', 'Original price', 'Resale value', 'Nil'], 'You\'ll need to replace it.'],
      ['Obsolete stock, no use, scrap value $300, cost $2,000. Relevant cost?', ['$300', '$2,000', '$0', '$1,700'], 'Using it loses the $300 scrap money.'],
      ['Spare paid labour hours used on a new job cost…', ['Nil', 'The wage rate', 'The overtime rate', 'Wage + contribution'], 'They\'re paid anyway.'],
    ],
    pool: [
      ['Material not used elsewhere, resale $1,200, OR can replace another material costing $1,500. Relevant cost?', ['$1,500', '$1,200', '$2,700', '$0'], 'Higher of resale and alternative-use value.'],
      ['RC $105,000, NRV $75,000, future income $90,000. Deprival value?', ['$90,000', '$75,000', '$105,000', '$60,000'], 'Lower of 105k and higher(75k, 90k)=90k.'],
      ['Idle machine: sale value now $1,200, disposal cost after the contract $800. Relevant cost?', ['$2,000', '$400', '$1,200', '$800'], 'Lose sale + pay disposal.'],
      ['Labour must be hired from outside for a job. Relevant cost?', ['The wages paid to the extra labour', 'Nil', 'Wages + lost contribution', 'Absorbed overhead'], 'Variable cost incurred.'],
      ['The original purchase price of materials in stock is…', ['A sunk cost', 'Always relevant', 'The replacement cost', 'An opportunity cost'], 'Past cost.'],
    ],
  },
  {
    id: 'm2-3', mod: 2, lo: '2.1', title: 'Cost behaviour: how costs move', mins: 13, game: 'runner',
    slides: [
      { h: 'More cups = more cost?', b: `<p><b>Cost behaviour</b> = how costs change when the <b>level of activity</b> changes. The main influence is volume of output, but drivers can also be number of invoices, units of electricity, value or number of items sold.</p><p>Why care? For <b>cost control</b> and <b>budgeting / decision making</b> (what activity level, cut price to sell more, make or buy, accept a contract?).</p><div class="say">There are a few shapes to remember. Picture a graph: → is cups made, ↑ is total cost.</div>` },
      { h: 'Fixed & step-fixed', b: `<table class="t"><tr><th>Type</th><th>Shape</th><th>Examples</th></tr>
        <tr><td><b>Fixed</b></td><td>➖ flat line</td><td>Rent of one factory; straight-line depreciation of one machine. A <b>period cost</b>: grows with time, not output</td></tr>
        <tr><td><b>Step-fixed</b></td><td>📶 stairs</td><td>A 2nd machine above 1,000 units; more rental space as output grows; supervisor per 20,000 units; royalty $10k below 5,000 units, $15k above</td></tr></table>` },
      { h: 'Variable', b: `<p>Rises in direct proportion with output. <b>Same amount per unit</b>.</p><ul><li>Raw materials (if no bulk discounts)</li><li>Direct labour (usually treated as variable)</li><li>Sales commission</li><li>Productivity <b>bonus</b>: variable only after a certain output is reached</li></ul><p><b>Curvilinear</b> = a curved line: each extra unit costs <b>less</b> than proportionately (flattening curve) or <b>more</b> than proportionately (steepening, e.g. piecework with rising rates).</p>` },
      { h: 'Semi-variable (mixed) & others', b: `<p>Part fixed + part variable:</p><ul><li>Electricity & gas: standing charge + usage</li><li>Salesperson: basic salary + commission</li><li>Car: registration & insurance + petrol, oil, repairs</li><li>Worker: $650/month + 5c per unit</li></ul><p>Other patterns: variable <b>up to a maximum</b> cost; variable <b>with a minimum</b> (fixed) charge.</p>` },
      { h: 'Per unit is upside down!', b: `<div class="eg">VC $5 per "zed", fixed costs $5,000.<table class="t"><tr><th>Units</th><th>Fixed/unit</th><th>Variable/unit</th><th>Total/unit</th></tr><tr><td>1,000</td><td>$5.00</td><td>$5</td><td>$10.00</td></tr><tr><td>2,000</td><td>$2.50</td><td>$5</td><td>$7.50</td></tr><tr><td>5,000</td><td>$1.00</td><td>$5</td><td>$6.00</td></tr></table></div><div class="trap">⚠️ As activity rises: variable cost PER UNIT stays the SAME, fixed cost PER UNIT FALLS, total cost per unit FALLS.</div>` },
      { h: 'Assumptions & the relevant range', b: `<ul><li>Within the normal (<b>relevant</b>) range, costs are assumed fixed, variable or semi-variable.</li><li>Departmental costs are assumed <b>mixed</b> and <b>linear</b> (straight lines).</li><li>Outside the relevant range, behaviour may change (fixed costs may step up).</li></ul><div class="eg">Telephone bill → mixed · Warehouse wages → variable · Chief accountant's salary → fixed · Packing materials for each box → variable · Accountant's membership fee → fixed.</div>` },
      { h: 'Components of a product\'s cost', b: `<p>For inventory valuation and profit measurement we need the cost of one unit, made up of:</p><ul><li>🍋 <b>Materials</b></li><li>👷 <b>Labour</b></li><li>💡 <b>Other expenses</b></li></ul><p>Each can be <b>direct</b> or <b>indirect</b>, which we'll cover in Module 3.</p>` },
    ],
    check: [
      ['As output rises, fixed cost PER UNIT…', ['Falls', 'Rises', 'Stays the same', 'Doubles'], 'Same total spread over more units.'],
      ['Phone bill = line rental + call charges. It is…', ['Semi-variable', 'Fixed', 'Variable', 'Step-fixed'], 'Fixed part + variable part.'],
      ['A supervisor needed for every 20,000 units is…', ['Step-fixed', 'Variable', 'Fixed', 'Curvilinear'], 'Jumps in steps.'],
    ],
    pool: [
      ['Fixed costs are also called period costs because…', ['They relate to a span of time', 'They change every period with output', 'They are only paid once', 'They vary with sales'], 'Longer time span = more fixed cost.'],
      ['A royalty of $10,000 below 5,000 units and $15,000 above is a…', ['Step-fixed cost', 'Variable cost', 'Semi-variable cost', 'Curvilinear cost'], 'Steps at 5,000 units.'],
      ['A productivity bonus paid only after output reaches a certain level is…', ['Variable above that level', 'Fixed at all levels', 'Step-fixed', 'Sunk'], 'Zero until the threshold, then variable.'],
      ['The wages of warehouse employees are best described as…', ['Variable', 'Fixed', 'Step-fixed', 'Sunk'], 'Per the study guide example.'],
      ['VC $5/unit, fixed $5,000. Total cost per unit at 2,000 units?', ['$7.50', '$5.00', '$10.00', '$2.50'], '$2.50 fixed + $5 variable.'],
      ['The three elements making up a product\'s cost are…', ['Materials, labour and other expenses', 'Fixed, variable and mixed', 'Sales, costs and profit', 'Plan, do and check'], 'Then classify as direct/indirect.'],
    ],
  },
  {
    id: 'm2-4', mod: 2, lo: '2.2', title: 'Cost estimation & the high-low method', mins: 14, game: 'runner',
    slides: [
      { h: 'Ways to estimate costs', b: `<p><b>Cost estimation</b> uses historical costs to predict future costs.</p><ul><li><b>Account classification</b>: go through each expense, label it fixed/variable/semi-variable, adjust for inflation. Simple but subjective (only approximately accurate).</li><li><b>High-low method</b>: uses 2 records. Simple, but only a "loose approximation".</li><li><b>Scatter graph</b>: plot all points and draw a line of best fit by eye. More data, but subjective.</li><li><b>Regression analysis</b>: statistical line of best fit, <b>y = a + bx</b> (a = fixed cost, b = variable cost per unit, x = output). Most accurate.</li></ul>` },
      { h: 'The high-low formula', b: `<div class="formula">Variable cost per unit = (Cost at HIGH − Cost at LOW) ÷ (Units at HIGH − Units at LOW)</div><div class="formula">Fixed cost = Total cost at HIGH − (Units at HIGH × Variable cost per unit)</div>` },
      { h: 'The 4 steps', b: `<ol class="reveal"><li>Find the period with the <b>highest ACTIVITY</b> and the <b>lowest ACTIVITY</b></li><li>Note the total costs and units at each</li><li>Variable cost per unit = difference in cost ÷ difference in units</li><li>Fixed cost = high total cost − (high units × variable cost per unit)</li></ol><div class="trap">⚠️ Pick HIGH & LOW by ACTIVITY (units), NOT by cost! Exam questions hide a month with a weird high cost to trick you.</div>` },
      { h: 'Worked example', b: `<div class="eg">DG Co.: High 90,000 units cost $170,000. Low 60,000 units cost $140,000.<ol class="reveal"><li>Δcost = $30,000; Δunits = 30,000</li><li>Variable = <b>$1 per unit</b></li><li>Fixed = 170,000 − 90,000 × $1 = <b>$80,000</b></li><li>Forecast for 85,000 units: 80,000 + 85,000 = <b>$165,000</b></li><li>85,000 is inside the relevant range, so the forecast is sensible</li></ol></div>` },
      { h: 'Twist 1: a step in fixed costs', b: `<div class="eg">Cleaning: 15,100 m² costs $83,585, but above 14,000 m² fixed costs step up by $4,700.<ol class="reveal"><li>Remove the step from the HIGH cost: 83,585 − 4,700 = $78,885</li><li>Now do high-low normally with the low point</li><li>For an activity above 14,000 m², add the $4,700 step back into fixed costs</li></ol></div>` },
      { h: 'Twist 2: a change in the variable rate', b: `<p>If wages rise by $1 per m², do high-low first, then <b>add $1 to the variable cost per unit</b> before forecasting.</p><div class="eg">4,000 units cost $20,000; 20,000 units cost $40,000 (fixed unchanged). VC = 20,000 ÷ 16,000 = <b>$1.25</b>.</div><div class="say">High-low assumes costs are <b>linear</b> and only uses 2 points, so it may not represent the whole range.</div>` },
    ],
    check: [
      ['High-low: you choose the two periods with the highest and lowest…', ['Activity level', 'Total cost', 'Fixed cost', 'Profit'], 'Always by activity.'],
      ['4,000 units cost $20,000; 20,000 units cost $40,000. Variable cost per unit?', ['$1.25', '$0.80', '$2.00', '$1.20'], '20,000 ÷ 16,000 = $1.25.'],
      ['In y = a + bx, "a" is…', ['Fixed cost', 'Variable cost per unit', 'Units', 'Total cost'], 'a = intercept = fixed cost.'],
    ],
    pool: [
      ['Labelling each expense as fixed, variable or semi-variable from the accounts is the…', ['Account classification method', 'High-low method', 'Regression method', 'Scatter graph'], 'Subjective, approximate.'],
      ['The most accurate method for a line of best fit is…', ['Regression analysis', 'High-low', 'Account classification', 'Guesswork'], 'Statistical.'],
      ['An advantage of the scatter graph over high-low is…', ['It uses more historical data', 'It is objective', 'It needs only 2 points', 'It is exact'], 'But the line is drawn by eye.'],
      ['High 90,000 units $170,000; low 60,000 units $140,000. Total cost at 85,000 units?', ['$165,000', '$170,000', '$155,000', '$85,000'], 'VC $1, fixed $80,000.'],
      ['High-low assumes semi-variable costs are…', ['Linear', 'Curvilinear', 'Stepped', 'Random'], 'Straight-line relationship.'],
    ],
  },
];
