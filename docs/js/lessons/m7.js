export default [
  {
    id: 'm7-1', mod: 7, lo: '7.1', title: 'Just-in-time (JIT)', mins: 10, game: 'warehouse',
    slides: [
      { h: 'Make it when it\'s wanted', b: `<p><b>JIT</b> = produce or buy things only when they're needed, not to sit in a warehouse.</p><div class="pic">🛒 → 🏭 → 🍋</div><p>It's a <b>pull</b> system: a customer order "pulls" production. A <b>Kanban</b> card or signal tells the previous stage to make more.</p><p>Aim: <b>zero inventory, zero defects</b>, cut out non-value-added activities.</p>` },
      { h: 'Ingredients of JIT', b: `<ul><li>Small, frequent deliveries from a <b>few close, trusted suppliers</b> (they're responsible for quality)</li><li><b>Machine cells</b>: machines grouped by product so things flow</li><li>Short <b>set-up times</b>, even production speed</li><li><b>Preventive maintenance</b> (no breakdowns allowed!)</li><li><b>Multi-skilled</b> workers</li></ul>` },
      { h: 'Value-added?', b: `<p>Value is only added while the product is actually being <b>worked on</b>. Painting a car = value-added. Storing, moving, inspecting, waiting, fixing faults = <b>non-value-added</b> → remove them.</p><p>👍 less money tied up, saves space, happier customers, flexible.</p><p>👎 vulnerable to supply disruption (earthquakes!), demand is hard to predict, more set-ups.</p>` },
    ],
    check: [
      ['JIT aims for…', ['Zero inventory and perfect quality', 'Big safety stocks', 'Long production runs', 'Many suppliers'], 'Pull, no waste.'],
      ['Which is value-added for a car maker?', ['Painting the car', 'Storing parts', 'Fixing faulty work', 'Moving materials'], 'Product being processed.'],
      ['A major risk of JIT:', ['Supply chain disruption', 'Too much stock', 'Low quality', 'Huge warehouses'], 'No buffer stock.'],
    ],
  },
  {
    id: 'm7-2', mod: 7, lo: '7.2', title: 'Inventory control levels', mins: 13, game: 'warehouse',
    slides: [
      { h: 'Why hold stock at all?', b: `<p>So we don't run out (stock-outs lose customers 😡). But stock costs money:</p><ul><li><b>Holding</b> costs: storage, insurance, money tied up, things going off</li><li><b>Ordering</b> costs: admin and delivery per order</li><li><b>Stock-out</b> costs: lost sales, unhappy customers</li></ul>` },
      { h: 'The 3 warning lines', b: `<div class="formula">Reorder level = Max usage × Max lead time</div><div class="formula">Minimum level = Reorder level − (Avg usage × Avg lead time)</div><div class="formula">Maximum level = Reorder level + Reorder qty − (Min usage × Min lead time)</div><div class="say">Reorder level uses the WORST case (max × max) so you never run out while waiting for delivery.</div>` },
      { h: 'Worked example', b: `<div class="eg">Usage per day: min 180, avg 350, max 420. Lead time 11–15 days (avg 13). Reorder qty 6,500.<ol class="reveal"><li>Reorder level = 420 × 15 = <b>6,300</b></li><li>Minimum = 6,300 − 350 × 13 = <b>1,750</b></li><li>Maximum = 6,300 + 6,500 − 180 × 11 = <b>10,820</b></li></ol></div>` },
      { h: 'Average stock', b: `<div class="formula">Average inventory = Safety stock + ½ Reorder quantity</div><div class="eg">Safety 500, reorder qty 3,000 → 500 + 1,500 = <b>2,000</b></div>` },
    ],
    check: [
      ['Reorder level =', ['Max usage × max lead time', 'Avg usage × avg lead time', 'Min usage × min lead time', 'EOQ ÷ 2'], 'Worst case.'],
      ['Max usage 50/day, max lead 8 days. Reorder level?', ['400', '58', '200', '6.25'], '50 × 8.'],
      ['Safety stock 200, order qty 1,000. Average inventory?', ['700', '600', '1,200', '500'], '200 + 500.'],
    ],
  },
  {
    id: 'm7-3', mod: 7, lo: '7.2', title: 'EOQ and other stock systems', mins: 10, game: 'warehouse',
    slides: [
      { h: 'The best order size', b: `<p>Order a lot at once → few orders but high holding costs. Order a little → low holding costs but loads of orders. The <b>Economic Order Quantity</b> balances the two.</p><div class="formula">EOQ = √(2 × Co × D ÷ Ch)</div><p>Co = cost per order, D = annual demand, Ch = holding cost per unit per year. At the EOQ, holding cost = ordering cost.</p>` },
      { h: 'Example', b: `<div class="eg">D = 40,000 a year, Co = $20, Ch = $1.60.<ol class="reveal"><li>2 × 20 × 40,000 = 1,600,000</li><li>÷ 1.60 = 1,000,000</li><li>√ = <b>1,000 units</b></li></ol></div>` },
      { h: 'Other control systems', b: `<ul><li><b>Order cycling</b>: review stock at regular intervals</li><li><b>Two-bin</b>: when bin 1 is empty, reorder and use bin 2</li><li><b>ABC classification</b>: control expensive items tightly, cheap ones loosely</li><li><b>Pareto 80/20</b>: about 20% of items make up 80% of the value</li></ul>` },
    ],
    check: [
      ['At the EOQ, holding costs…', ['Equal ordering costs', 'Are zero', 'Are double ordering costs', 'Are maximum'], 'The two curves cross.'],
      ['In the EOQ formula, Ch is…', ['Holding cost per unit per year', 'Cost per order', 'Annual demand', 'Lead time'], '√(2CoD/Ch).'],
      ['When bin one empties you reorder. This is…', ['The two-bin system', 'Pareto', 'JIT', 'EOQ'], 'Visual control.'],
    ],
  },
  {
    id: 'm7-4', mod: 7, lo: '7.3', title: 'Cost-based pricing', mins: 10, game: 'warehouse',
    slides: [
      { h: 'Cost plus a bit', b: `<ul><li><b>Full cost-plus</b>: full cost (with overheads) + % mark-up. Simple, covers all costs, good for jobbing work. But ignores demand and competitors, and needs a budgeted volume to absorb overheads.</li><li><b>Marginal cost-plus</b>: variable cost + mark-up. Focuses on contribution, easy to adjust, common in retail. But may not cover fixed costs.</li></ul>` },
      { h: 'Mark-up vs margin again', b: `<div class="formula">Mark-up % = Profit ÷ COST</div><div class="formula">Margin % = Profit ÷ PRICE</div><div class="eg">Marginal cost $15, price $20 → profit $5.<br>Mark-up = 5 ÷ 15 = <b>33.3%</b>. Margin = 5 ÷ 20 = <b>25%</b>.</div><div class="eg">Full cost $4.70, sold at cost + 70% → 4.70 × 1.7 = <b>$7.99</b></div>` },
    ],
    check: [
      ['Cost $15, price $20. Mark-up on cost?', ['33.3%', '25%', '75%', '5%'], '5 ÷ 15.'],
      ['A drawback of full cost-plus pricing:', ['Ignores demand and competitors', 'Too complex', 'Never covers costs', 'Ignores overheads'], 'Price might be uncompetitive.'],
      ['Marginal cost-plus pricing focuses on…', ['Contribution', 'Net profit', 'Tax', 'Fixed costs'], 'VC + mark-up.'],
    ],
  },
  {
    id: 'm7-5', mod: 7, lo: '7.3', title: 'Market-based pricing, target costing & transfer pricing', mins: 13, game: 'warehouse',
    slides: [
      { h: 'Life cycle & strategies', b: `<p>Product life cycle: <b>Introduction</b> (low sales, profits lowest, maybe losses) → <b>Growth</b> → <b>Maturity</b> → <b>Decline</b>.</p><ul><li>🍦 <b>Skimming</b>: HIGH launch price, then lower it. For new, different products with unknown demand or short lives (new games console).</li><li>🚀 <b>Penetration</b>: LOW launch price to grab market share fast, deter competitors, gain economies of scale.</li><li>🎟 <b>Differential pricing</b>: same product, different prices by segment (seniors), place (theatre seats), time (peak trains) or version.</li></ul>` },
      { h: 'Price elasticity of demand', b: `<div class="formula">PED = % change in quantity ÷ % change in price</div><ul><li>PED &gt; 1 = <b>elastic</b>: price up → revenue DOWN</li><li>PED &lt; 1 = <b>inelastic</b>: price up → revenue UP (so raise prices!)</li></ul><div class="eg">Price +10%, quantity −40% → PED 4 → elastic.</div><p>Markets: perfect competition (many sellers), monopoly (one), oligopoly (a few big ones, often with a price leader).</p>` },
      { h: 'Target costing', b: `<div class="formula">Target cost = Target price − Required profit</div><p>Start from what customers will pay, then design the product to hit that cost. If the estimated cost is too high, close the <b>cost gap</b> or don't launch.</p>` },
      { h: 'Transfer pricing', b: `<p>When one division sells to another division (Lemon Farm → Juice Factory), the price charged is a <b>transfer price</b>.</p><ul><li>Aim: keep divisions independent (<b>autonomy</b>), measure them fairly, and keep company profit high (<b>goal congruence</b>)</li><li>Bases: <b>market price</b> (best if an outside market exists), cost-based, or negotiated</li></ul>` },
    ],
    check: [
      ['High launch price, lowered later =', ['Market skimming', 'Penetration', 'Price leadership', 'Cost-plus'], 'Skim the cream first.'],
      ['PED of 0.5 means demand is…', ['Inelastic', 'Elastic', 'Perfectly elastic', 'Unit elastic'], 'Less than 1.'],
      ['If an external market exists, transfer prices are ideally…', ['Market price', 'Zero', 'Full cost', 'Whatever the buyer likes'], 'Fair and goal congruent.'],
    ],
  },
];
