export default [
  {
    id: 'm6-1', mod: 6, lo: '6.1', title: 'How to make a decision', mins: 8, game: 'rush',
    slides: [
      { h: 'Five steps', b: `<ol class="reveal"><li>🔍 <b>Define the problem</b></li><li>📏 <b>Identify the decision criteria</b> (e.g. maximise profit)</li><li>💡 <b>Develop alternatives</b></li><li>🧮 <b>Analyse the alternatives</b></li><li>✅ <b>Select</b> one</li></ol><div class="say">Use RELEVANT costs (future, cash, extra) from Module 2, and think about non-money things too: quality, staff morale, customers.</div>` },
      { h: 'Quick recap: relevant costs', b: `<ul><li>Ignore sunk costs, committed costs, depreciation and absorbed overheads.</li><li>Include incremental, differential, avoidable and opportunity costs.</li></ul><div class="eg">Special order: VC $2.50, normal price $3.70. New customer wants 6,000 at $2.95 (spare capacity), but you'll lose 2 normal sales for every 15 to them.<ol class="reveal"><li>New contribution: 6,000 × 0.45 = $2,700</li><li>Lost sales: 6,000 × 2/15 = 800 × 1.20 = $960</li><li>Gain = <b>$1,740</b></li></ol></div>` },
    ],
    check: [
      ['First step in decision making:', ['Define the problem', 'Select an alternative', 'Analyse alternatives', 'Celebrate'], 'Then criteria, alternatives, analyse, select.'],
      ['Which cost do you IGNORE in a decision?', ['Absorbed fixed overhead', 'Extra materials bought', 'Lost contribution', 'Extra supervisor'], 'Notional allocation.'],
      ['The step after "identify criteria" is…', ['Develop alternatives', 'Define the problem', 'Select', 'Audit'], 'Then analyse.'],
    ],
  },
  {
    id: 'm6-2', mod: 6, lo: '6.2', title: 'Limiting factors: making the most of a scarce resource', mins: 12, game: 'rush',
    slides: [
      { h: 'Not enough hours!', b: `<p>Lily only has 2,000 labour hours this month but customers want more than she can make. Which juice should she make first?</p><div class="formula">Rank by CONTRIBUTION PER UNIT OF THE LIMITING FACTOR</div><div class="trap">⚠️ NOT by contribution per unit! A product with big contribution but lots of hours can lose.</div>` },
      { h: 'Worked example', b: `<div class="eg">Limited: 2,000 hrs.<br>X: contribution $10, 2 hrs → <b>$5/hr</b>, max demand 800<br>Y: contribution $16, 4 hrs → <b>$4/hr</b>, max demand 400<ol class="reveal"><li>Rank: X first ($5/hr), then Y</li><li>Make 800 X → uses 1,600 hrs</li><li>400 hrs left ÷ 4 = 100 Y</li><li>Contribution = 8,000 + 1,600 = <b>$9,600</b></li></ol></div>` },
      { h: 'Steps every time', b: `<ol class="reveal"><li>Check the limiting factor really limits you (need vs available)</li><li>Contribution per unit for each product</li><li>÷ limiting factor per unit</li><li>Rank and fill demand in order until the resource runs out</li></ol>` },
    ],
    check: [
      ['With scarce labour, rank products by…', ['Contribution per labour hour', 'Contribution per unit', 'Selling price', 'Profit per unit'], 'Per scarce resource.'],
      ['A: $12 contribution, 3 hrs. B: $10, 2 hrs. Which first?', ['B ($5/hr)', 'A ($4/hr)', 'Equal', 'Neither'], 'Per hour wins.'],
      ['Why not rank by contribution per unit?', ['It ignores how much scarce resource each uses', 'It\'s illegal', 'It always works', 'It uses profit'], 'The resource is the constraint.'],
    ],
  },
  {
    id: 'm6-3', mod: 6, lo: '6.2', title: 'Make or buy & outsourcing', mins: 10, game: 'rush',
    slides: [
      { h: 'Make it or buy it?', b: `<p>Should Lily make her own bottle caps or buy them?</p><div class="formula">Compare: variable cost to MAKE (+ fixed costs you'd save by not making) vs price to BUY</div><div class="eg">Make: VC $19. Buy: $21. 9,000 caps a year. Buying saves $8,000 fixed costs.<ol class="reveal"><li>Extra cost of buying: 9,000 × $2 = $18,000</li><li>Minus fixed saving: −$8,000</li><li>Buying costs $10,000 more → <b>MAKE</b></li></ol></div>` },
      { h: 'Not just money', b: `<ul><li>Is the supplier reliable? Is the quality good?</li><li>How would we use the freed-up capacity?</li><li>Will staff be upset (job losses)?</li><li>Do we lose control or skills?</li></ul>` },
      { h: 'Outsourcing', b: `<p><b>Outsourcing</b> = paying outside specialists to do work (cleaning, IT, parts).</p><p>Keep your <b>core activities</b> (what gives competitive advantage, e.g. Coca-Cola's secret formula). Outsource things you can't do to world-class standard.</p><table class="t"><tr><th>👍</th><th>👎</th></tr><tr><td>Frees staff time, specialist skills, may be cheaper, flexible capacity</td><td>Quality risk, may cost more, lose skills, data security, ethics, staff opposition</td></tr></table><p>Reduce the risks with long-term partnerships with a few key suppliers.</p>` },
    ],
    check: [
      ['Make or buy (no scarce resource): relevant costs are…', ['The differential costs between options', 'Full absorption costs', 'Only fixed costs', 'Sunk costs'], 'Variable + avoidable fixed.'],
      ['Which should a firm NOT outsource?', ['Its core competence', 'Office cleaning', 'Payroll', 'Catering'], 'Keep competitive advantage.'],
      ['A risk of outsourcing:', ['Losing in-house skills', 'Freeing up staff', 'Specialist expertise', 'Flexible capacity'], 'Plus quality and data risk.'],
    ],
  },
  {
    id: 'm6-4', mod: 6, lo: '6.2', title: 'Break-even (CVP) made easy', mins: 13, game: 'rush',
    slides: [
      { h: 'When do we stop losing money?', b: `<p><b>CVP</b> = Cost-Volume-Profit analysis. The <b>break-even point</b> is where profit = 0: sales just cover all costs.</p><div class="say">Each cup gives Lily a contribution. She needs enough cups for those contributions to pay the fixed costs. That's break-even!</div>` },
      { h: 'Formulas', b: `<div class="formula">Break-even (units) = Fixed costs ÷ Contribution per unit</div><div class="formula">C/S ratio = Contribution ÷ Sales</div><div class="formula">Break-even ($ revenue) = Fixed costs ÷ C/S ratio</div>` },
      { h: 'Worked example', b: `<div class="eg">Price $8, VC $5, fixed $21,000.<ol class="reveal"><li>Contribution = $3 per cup</li><li>BEP = 21,000 ÷ 3 = <b>7,000 cups</b></li><li>C/S ratio = 3 ÷ 8 = 37.5%</li><li>BEP revenue = 21,000 ÷ 0.375 = <b>$56,000</b> (= 7,000 × $8 ✔)</li></ol></div>` },
      { h: 'Tricky version', b: `<div class="eg">VC $44, C/S ratio 45%, fixed $396,000. BEP units?<ol class="reveal"><li>If C/S = 45%, VC is 55% of price</li><li>Price = 44 ÷ 0.55 = $80</li><li>Contribution = $36</li><li>BEP = 396,000 ÷ 36 = <b>11,000 units</b></li></ol></div><p>Exam tip: if BEP isn't a whole number, round UP.</p>` },
    ],
    check: [
      ['Price $40, VC $30, fixed $70,000. BEP units?', ['7,000', '1,750', '2,333', '10,000'], '70,000 ÷ 10.'],
      ['C/S ratio 20%, fixed $50,000. BEP revenue?', ['$250,000', '$10,000', '$62,500', '$60,000'], '50,000 ÷ 0.2.'],
      ['At break-even…', ['Total contribution = fixed costs', 'Sales = variable costs', 'Profit is maximum', 'Fixed costs are zero'], 'No profit, no loss.'],
    ],
  },
  {
    id: 'm6-5', mod: 6, lo: '6.2', title: 'Target profit, margin of safety & charts', mins: 12, game: 'rush',
    slides: [
      { h: 'Hitting a profit target', b: `<div class="formula">Units for target profit = (Fixed costs + Target profit) ÷ Contribution per unit</div><div class="eg">Price $30, VC $16, fixed $68,000, wants $16,000 profit.<br>(68,000 + 16,000) ÷ 14 = <b>6,000 units</b></div>` },
      { h: 'Margin of safety', b: `<p>How far can sales fall before we make a loss?</p><div class="formula">Margin of safety = Budgeted sales − Break-even sales</div><div class="formula">MoS % = (Budget − BEP) ÷ Budget × 100</div><div class="eg">Price $40, VC $30, fixed $70,000 → BEP 7,000. Budget 8,000.<br>MoS = 1,000 units = <b>12.5%</b></div>` },
      { h: 'Charts', b: `<ul><li><b>Break-even chart</b>: sales line and total cost line; they cross at the BEP.</li><li><b>Contribution chart</b>: shows variable cost and contribution.</li><li><b>Profit/volume (P/V) chart</b>: one profit line that starts at <b>−fixed costs</b> (at zero sales) and crosses zero at the BEP.</li></ul><p>Price up / VC down → BEP falls. Fixed costs up → BEP rises.</p>` },
      { h: 'Limitations of CVP', b: `<ul><li>Only works for one product (or a fixed mix)</li><li>Assumes price and VC per unit are constant</li><li>Assumes fixed costs are constant</li><li>Assumes production = sales (no stock changes)</li><li>Ignores uncertainty</li></ul>` },
    ],
    check: [
      ['Price $25, VC $10, fixed $30k, target profit $15k. Units needed?', ['3,000', '2,000', '1,000', '4,500'], '45,000 ÷ 15.'],
      ['Budget 5,000 units, BEP 4,000. MoS %?', ['20%', '25%', '80%', '1,000%'], '1,000 ÷ 5,000.'],
      ['On a P/V chart, the loss at zero sales equals…', ['Fixed costs', 'Variable costs', 'Contribution', 'Zero'], 'Line starts at −F.'],
    ],
  },
  {
    id: 'm6-6', mod: 6, lo: '6.3', title: 'Payback period', mins: 10, game: 'rush',
    slides: [
      { h: 'How fast do we get our money back?', b: `<p>Lily wants a $60,000 juice machine. <b>Payback</b> = how long until the cash it brings in repays the $60,000.</p><div class="say">Shorter = better (less risky, good for liquidity). Often used as a first screening test.</div>` },
      { h: 'Worked example', b: `<div class="eg">Cost $200,000. Cash in: Y1 30k, Y2 50k, Y3 20k, Y4 80k, Y5 80k (spread evenly through each year).<ol class="reveal"><li>Running total: −200 → −170 → −120 → −100 → −20 → +60</li><li>Turns positive during year 5</li><li>Need 20k of year 5's 80k = 20/80 = 0.25 year = 3 months</li><li>Payback = <b>4 years 3 months</b></li></ol></div><div class="trap">⚠️ Payback uses CASH. If only profit is given, add back depreciation.</div>` },
      { h: 'Good & bad', b: `<p>👍 simple, easy to understand, focuses on liquidity, near-term forecasts are more reliable.</p><p>👎 ignores cash <b>after</b> payback, ignores the <b>time value of money</b>, cut-off is arbitrary, can't separate projects with the same payback.</p>` },
    ],
    check: [
      ['Payback is based on…', ['Cash flows', 'Accounting profit', 'Sales', 'Market value'], 'Profit only as a rough proxy.'],
      ['Cost $100k, $40k cash per year (even). Payback?', ['2 years 6 months', '2 years', '3 years', '4 years'], '100 ÷ 40 = 2.5 years.'],
      ['A weakness of payback:', ['Ignores cash after payback', 'Too complicated', 'Ignores liquidity', 'Uses profit'], 'And time value of money.'],
    ],
  },
  {
    id: 'm6-7', mod: 6, lo: '6.3', title: 'Accounting rate of return (ARR)', mins: 10, game: 'rush',
    slides: [
      { h: 'A percentage return', b: `<div class="formula">ARR = Average annual PROFIT ÷ Average investment × 100%</div><div class="formula">Average investment = (Initial cost + Residual value) ÷ 2</div><p>Accept if ARR beats the target. ARR is the only method here that uses <b>profit</b> (after depreciation), not cash.</p>` },
      { h: 'Worked example', b: `<div class="eg">Machine $140,000, residual $20,000, life 3 years. Cash in $65,200 a year.<ol class="reveal"><li>Depreciation = (140,000 − 20,000) ÷ 3 = $40,000</li><li>Profit = 65,200 − 40,000 = $25,200</li><li>Average investment = (140,000 + 20,000) ÷ 2 = $80,000</li><li>ARR = 25,200 ÷ 80,000 = <b>31.5%</b></li></ol></div><div class="trap">⚠️ Cash − depreciation = profit. Don't divide cash by investment!</div>` },
      { h: 'Good & bad', b: `<p>👍 familiar %, uses the whole project life, easy, uses accounting profit.</p><p>👎 ignores timing and the time value of money, profit can be manipulated, ignores project size and length.</p>` },
    ],
    check: [
      ['ARR uses…', ['Accounting profit', 'Cash flows', 'Discounted cash', 'Sales'], 'Profit after depreciation.'],
      ['Average investment for cost $100k, residual $20k:', ['$60,000', '$50,000', '$80,000', '$120,000'], '(100 + 20) ÷ 2.'],
      ['Avg profit $12k, avg investment $60k. ARR?', ['20%', '12%', '5%', '72%'], '12 ÷ 60.'],
    ],
  },
  {
    id: 'm6-8', mod: 6, lo: '6.4', title: 'Risk, uncertainty & the investment process', mins: 10, game: 'rush',
    slides: [
      { h: 'Risk vs uncertainty', b: `<ul><li><b>Risk</b>: you can put numbers on it (probabilities). "70% chance returns exceed $100k."</li><li><b>Uncertainty</b>: no idea, so you can't measure it.</li></ul><table class="t"><tr><th>Type</th><th>Behaviour</th></tr><tr><td>Risk averse 🐢</td><td>Wants extra reward for taking risk</td></tr><tr><td>Risk neutral 😐</td><td>Only cares about expected return</td></tr><tr><td>Risk seeker 🎰</td><td>Loves the chance of a big win</td></tr></table><p><b>Scenario planning</b> asks "what if?" questions about the future.</p>` },
      { h: 'The investment process', b: `<ol class="reveal"><li>💡 <b>Origination</b> of proposals (ideas)</li><li>🔎 <b>Screening</b> (does it fit our strategy? is it mandatory? resources?)</li><li>🧮 <b>Analysis & acceptance</b> (payback, ARR, qualitative issues, approval)</li><li>📡 <b>Monitoring & review</b>: control spending, delays, benefits</li></ol><p>Hard capital rationing = limits from outside; soft = limits set inside.</p>` },
      { h: 'Post-completion audit (PCA)', b: `<p>After the project, look back: did it work as promised?</p><div class="say">A PCA can't undo the spending, but it helps make FUTURE decisions better and keeps forecasters honest.</div>` },
    ],
    check: [
      ['Risk differs from uncertainty because risk…', ['Can be measured with probabilities', 'Can\'t be measured', 'Is always bad', 'Only affects banks'], 'Quantifiable.'],
      ['A PCA…', ['Improves future decisions; can\'t reverse this one', 'Reverses bad projects', 'Happens before approval', 'Replaces budgets'], 'Learning tool.'],
      ['First stage of the investment process:', ['Origination of proposals', 'Monitoring', 'Screening', 'Analysis'], 'Ideas come first.'],
    ],
  },
];
