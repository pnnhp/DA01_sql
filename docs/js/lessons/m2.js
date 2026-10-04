export default [
  {
    id: 'm2-1', mod: 2, lo: '2.1', title: 'Relevant costs: only the future matters', mins: 10, game: 'runner',
    slides: [
      { h: 'The golden rule', b: `<div class="pic">🔮💵➕</div><div class="say">When making a decision, only count money that will <b>change because of the decision</b>.</div><div class="formula">Relevant cost = <b>Future</b> + <b>Cash</b> + <b>Incremental</b> (extra)</div>` },
      { h: 'Sunk costs: spilled milk 🥛', b: `<p>Lily spent $50 on a fancy sign last month. Now she wonders whether to move to the beach.</p><p>The $50 is <b>sunk</b>. It's already spent and she can't get it back, so it does <b>not</b> matter for the decision.</p><div class="trap">⚠️ Past costs are ALWAYS irrelevant, even if they were big!</div>` },
      { h: 'Other "ignore me" costs', b: `<ul><li><b>Committed costs</b>: future costs you must pay anyway (e.g. a lease already signed). They won't change, so ignore them.</li><li><b>Depreciation</b>: not a cash flow. Ignore.</li><li><b>Absorbed (allocated) overheads</b>: just an accounting share-out. Ignore unless the total really changes.</li><li><b>Costs paid whether you say yes or no</b>, e.g. a worker paid $100 anyway.</li></ul>` },
      { h: 'Costs that DO matter', b: `<ul><li><b>Incremental</b>: extra cost caused by the decision.</li><li><b>Differential</b>: the difference between two options' costs. Option A $300 vs B $360 → differential $60.</li><li><b>Avoidable</b>: costs that disappear if you stop an activity.</li><li><b>Opportunity cost</b>: the benefit you <b>give up</b> by choosing something else. 💭</li></ul><div class="eg">You quit a $60k job to start a business. The $60k salary you give up is an <b>opportunity cost</b>, so it's relevant!</div>` },
      { h: 'Fixed vs variable as a rule of thumb', b: `<p>Usually:</p><ul><li><b>Variable</b> costs (lemons, cups) → relevant ✅</li><li>Existing <b>fixed</b> costs (rent already paid) → not relevant ❌</li></ul><p>BUT watch for <b>attributable fixed costs</b>: e.g. hiring an extra supervisor only if the order is accepted. That IS relevant.</p><p><b>Controllable</b> costs can be changed by a manager in a time span. <b>Discretionary</b> fixed costs (advertising, R&D) can be changed quickly. <b>Committed</b> fixed costs (rent) can't.</p>` },
    ],
    check: [
      ['$250,000 already spent on research for a project is…', ['A sunk cost (irrelevant)', 'An opportunity cost', 'An incremental cost', 'A relevant cost'], 'Past spending can\'t change.'],
      ['Your salary given up to start your own business is…', ['An opportunity cost', 'A sunk cost', 'Irrelevant', 'A committed cost'], 'The benefit you sacrifice.'],
      ['Which IS relevant?', ['Special material that must be bought for the job', 'Depreciation of an old machine', 'Rent already committed', 'Absorbed overhead'], 'Future, cash, extra.'],
    ],
  },
  {
    id: 'm2-2', mod: 2, lo: '2.1', title: 'Relevant cost of materials, labour & assets', mins: 12, game: 'runner',
    slides: [
      { h: 'Materials: the decision tree', b: `<ol class="reveal"><li>Need to buy new? → <b>current purchase price</b>.</li><li>Already in stock and <b>used regularly</b>? → <b>replacement cost</b> (you'll have to buy more).</li><li>In stock but <b>not used anymore</b>? → the <b>higher</b> of resale value or its value in another use.</li><li>No resale and no use? → <b>nil</b> ($0)!</li></ol><div class="trap">⚠️ What you originally paid is a SUNK cost. Never use it!</div>` },
      { h: 'Example: materials', b: `<div class="eg">100 kg in stock (paid $200). Resale $3/kg. Market price now $4/kg. Used regularly. A job needs 200 kg.<ol class="reveal"><li>Used regularly → we'll replace everything we use.</li><li>200 kg × $4 = <b>$800</b> ✅</li><li>Wrong answers: $200 (sunk), $500 (mixing resale), $600…</li></ol></div>` },
      { h: 'Labour', b: `<ul><li>Must hire extra workers → relevant cost = their wages.</li><li><b>Spare capacity</b> (workers paid anyway, nothing to do) → <b>nil</b>.</li><li>Labour is <b>scarce</b>, so you take workers off another product → <b>wage + contribution lost</b> from that product.</li></ul><div class="eg">Product L earns $22 contribution using 5 hours → $4.40 per hour lost. Wage $6/hr. Moving scarce labour costs 6 + 4.40 = <b>$10.40 per hour</b>.</div>` },
      { h: 'Deprival value of an asset', b: `<p>"How much would we need to get back to be no worse off if this asset vanished?"</p><div class="formula">Deprival value = LOWER of [Replacement cost] and [HIGHER of (NRV, Economic value)]</div><ul><li>NRV = what you'd get selling it (scrap)</li><li>Economic value = future revenue from using it</li></ul><div class="eg">RC $9,000, NRV $8,000, revenues $10,000. Higher of 8,000/10,000 = 10,000. Lower of 9,000/10,000 = <b>$9,000</b>.</div>` },
    ],
    check: [
      ['Material in stock, used regularly. Relevant cost?', ['Replacement cost', 'Original price', 'Resale value', 'Nil'], 'You\'ll need to replace it.'],
      ['Obsolete stock, no use, scrap value $300, cost $2,000. Relevant cost?', ['$300', '$2,000', '$0', '$1,700'], 'Using it loses the $300 scrap money.'],
      ['Spare paid labour hours used on a new job cost…', ['Nil', 'The wage rate', 'The overtime rate', 'Wage + contribution'], 'They\'re paid anyway.'],
    ],
  },
  {
    id: 'm2-3', mod: 2, lo: '2.1', title: 'Cost behaviour: how costs move', mins: 10, game: 'runner',
    slides: [
      { h: 'More cups = more cost?', b: `<p><b>Cost behaviour</b> = how costs change when <b>activity</b> (cups made) changes.</p><div class="say">There are 4 shapes to remember. Picture them as lines on a graph where → is cups made and ↑ is total cost.</div>` },
      { h: 'Fixed & variable', b: `<table class="t"><tr><th>Type</th><th>Shape</th><th>Lily example</th></tr>
        <tr><td><b>Fixed</b></td><td>➖ flat line</td><td>Stand rent $100/month whether she sells 10 or 1,000 cups</td></tr>
        <tr><td><b>Variable</b></td><td>↗️ straight line from zero</td><td>Lemons & cups: 50c per cup</td></tr></table>
        <div class="trap">⚠️ PER UNIT is opposite! Fixed cost PER cup FALLS as you sell more ($100/10 = $10, $100/1000 = 10c). Variable cost PER cup stays the SAME.</div>` },
      { h: 'Semi-variable & step-fixed', b: `<table class="t"><tr><th>Type</th><th>Shape</th><th>Example</th></tr>
        <tr><td><b>Semi-variable</b> (mixed)</td><td>↗️ line that starts above zero</td><td>Phone bill: line rental (fixed) + calls (variable). Salesperson: salary + commission</td></tr>
        <tr><td><b>Step-fixed</b></td><td>📶 stairs</td><td>One supervisor per 20,000 cups. A 2nd one when you go over</td></tr></table>
        <p>Also <b>curvilinear</b> = a curved line (cost grows faster or slower than output).</p>` },
      { h: 'Relevant range', b: `<p>These shapes are only true within a normal range of activity (the <b>relevant range</b>). Make 10× more and the "fixed" rent might jump!</p><div class="eg">Worker paid $650 a month + 5c per unit → <b>semi-variable</b>. Rent of one factory → <b>fixed</b>. Packing materials per box → <b>variable</b>.</div>` },
    ],
    check: [
      ['As output rises, fixed cost PER UNIT…', ['Falls', 'Rises', 'Stays the same', 'Doubles'], 'Same total spread over more units.'],
      ['Phone bill = line rental + call charges. It is…', ['Semi-variable', 'Fixed', 'Variable', 'Step-fixed'], 'Fixed part + variable part.'],
      ['A supervisor needed for every 20,000 units is…', ['Step-fixed', 'Variable', 'Fixed', 'Curvilinear'], 'Jumps in steps.'],
    ],
  },
  {
    id: 'm2-4', mod: 2, lo: '2.2', title: 'The high-low method', mins: 12, game: 'runner',
    slides: [
      { h: 'Splitting a mixed cost', b: `<p>Lily's electricity bill is semi-variable. How much is fixed and how much per cup? We use the <b>high-low method</b>, a quick trick using just 2 months.</p><div class="formula">Variable cost per unit = (Cost at HIGH − Cost at LOW) ÷ (Units at HIGH − Units at LOW)</div>` },
      { h: 'The 4 steps', b: `<ol class="reveal"><li>Find the period with the <b>highest ACTIVITY</b> and the <b>lowest ACTIVITY</b>.</li><li>Write down their costs and units.</li><li>Variable cost per unit = difference in cost ÷ difference in units.</li><li>Fixed cost = high total cost − (high units × variable cost per unit).</li></ol><div class="trap">⚠️ Pick HIGH & LOW by ACTIVITY (units), NOT by cost! Exam questions hide a month with a weird high cost to trick you.</div>` },
      { h: 'Worked example', b: `<div class="eg">High: 90,000 units cost $170,000. Low: 60,000 units cost $140,000.<ol class="reveal"><li>Δcost = 170,000 − 140,000 = $30,000</li><li>Δunits = 90,000 − 60,000 = 30,000</li><li>Variable = 30,000 ÷ 30,000 = <b>$1 per unit</b></li><li>Fixed = 170,000 − (90,000 × $1) = <b>$80,000</b></li><li>Forecast for 85,000 units: 80,000 + 85,000 × 1 = <b>$165,000</b></li></ol></div>` },
      { h: 'Twists & other methods', b: `<ul><li><b>Step in fixed costs</b> between low and high? Remove the step from the high cost first, then do high-low.</li><li><b>Wage rise</b>? Add it to the variable cost per unit after you split.</li><li><b>Scatter graph</b>: plot all points, draw a line by eye (uses more data but is subjective).</li><li><b>Regression</b>: y = a + bx, where a = fixed and b = variable per unit (most accurate).</li></ul><p>High-low's weakness: it only uses <b>2</b> data points.</p>` },
    ],
    check: [
      ['High-low: you choose the two periods with the highest and lowest…', ['Activity level', 'Total cost', 'Fixed cost', 'Profit'], 'Always by activity.'],
      ['4,000 units cost $20,000; 20,000 units cost $40,000. Variable cost per unit?', ['$1.25', '$0.80', '$2.00', '$1.20'], '20,000 ÷ 16,000 = $1.25.'],
      ['In y = a + bx, "a" is…', ['Fixed cost', 'Variable cost per unit', 'Units', 'Total cost'], 'a = intercept = fixed cost.'],
    ],
  },
];
