// Syllabus map for CPA Australia Foundation – Management Accounting (7th edn study guide).
// Weightings and study hours come from the official study map.

export const MODULES = [
  { id: 1, name: 'Nature & purpose of MA', short: 'M1', weight: 7, hours: 8.5, color: '#ffd23f',
    los: { '1.1': 'Role & objectives of management accounting', '1.2': 'Financial vs cost vs management accounting',
      '1.3': 'How MA provides information & creates value', '1.4': 'Management accounting systems & strategic management' } },
  { id: 2, name: 'Cost classification', short: 'M2', weight: 15, hours: 18, color: '#3fd2ff',
    los: { '2.1': 'Cost classifications & characteristics (relevant costs, behaviour)', '2.2': 'Separating fixed & variable costs (high-low)' } },
  { id: 3, name: 'Types of product costing', short: 'M3', weight: 23, hours: 27.5, color: '#ff7a3f',
    los: { '3.1': 'Product costing concepts & absorption costing', '3.2': 'Overhead allocation & apportionment',
      '3.3': 'Overhead absorption & marginal costing', '3.4': 'Activity-based costing (ABC)',
      '3.5': 'Job vs process costing', '3.6': 'Applying job & process costing' } },
  { id: 4, name: 'Budgeting & variance analysis', short: 'M4', weight: 20, hours: 24, color: '#b04bff',
    los: { '4.1': 'Nature & purpose of budgets', '4.2': 'Operating, cash & flexible budgets', '4.3': 'Incremental & zero-based budgeting',
      '4.4': 'Behavioural aspects of budgeting', '4.5': 'Standard costing', '4.6': 'Variances & control action' } },
  { id: 5, name: 'Performance measurement', short: 'M5', weight: 12, hours: 14.5, color: '#3fff8b',
    los: { '5.1': 'Purpose of performance measurement & responsibility centres', '5.2': 'Financial measures (ROI, RI, margins, ratios)',
      '5.3': 'Balanced scorecard', '5.4': 'Reward systems' } },
  { id: 6, name: 'Short & long-term decisions', short: 'M6', weight: 18, hours: 21.5, color: '#ff3f7a',
    los: { '6.1': 'Steps in decision making', '6.2': 'Relevant costing, limiting factors, make/buy, CVP',
      '6.3': 'Capital expenditure tools (payback, ARR)', '6.4': 'Risk & the investment process' } },
  { id: 7, name: 'Inventory & pricing', short: 'M7', weight: 5, hours: 6, color: '#3f7aff',
    los: { '7.1': 'Just-in-time', '7.2': 'Inventory control levels & EOQ', '7.3': 'Pricing decisions & transfer pricing' } },
];

export const ALL_LOS = MODULES.flatMap(m => Object.keys(m.los));
export const loModule = lo => +lo.split('.')[0];
export const modById = id => MODULES.find(m => m.id === id);
export const loName = lo => modById(loModule(lo)).los[lo];

// "Power-up cards": the 30-second cheat sheet shown before a level. Written in plain words.
export const CARDS = {
  1: { title: 'Management accounting basics', lines: [
    'MA = info for <b>internal managers</b> → planning, control, decision making. No legal format, includes non-financial & future data.',
    'FA = for <b>external users</b>, required by law, IFRS format, mostly historic & monetary.',
    'Cost accounting is <b>part of</b> MA (collects cost data, values inventory).',
    'Info levels: <b>Strategic</b> (senior, long-term, external+internal, ad hoc) → <b>Tactical</b> (middle mgmt, budgets/variance reports, routine) → <b>Operational</b> (front-line, detailed, day-to-day).',
    'Good info: relevant, complete, <b>sufficiently</b> accurate (reliable), clear, inspires confidence, well communicated, manageable volume, timely, cost < benefit, comparable.',
    'Data = raw facts. Information = data processed to be meaningful. MA info: scorekeeping, attention-directing, problem-solving.',
    'Developments: JIT (pull, zero inventory), TQM (zero defects), Kaizen (continuous improvement), target costing, life-cycle costing, lean.',
    'Sustainability: triple bottom line – economic, environmental, social. GRI sets reporting standards.' ] },
  2: { title: 'Costs & behaviour', lines: [
    '<b>Relevant cost</b> = future + cash + incremental. Ignore sunk, committed, depreciation, absorbed overhead.',
    'Materials in regular use → <b>replacement cost</b>. Not replaced → higher of resale value or alternative-use value (nil if none).',
    'Labour: spare capacity → nil. Short supply → wage + contribution lost.',
    'Deprival value = LOWER of replacement cost and HIGHER of (NRV, economic value).',
    'Fixed = same total; Variable = same per unit; Semi-variable = both; Step-fixed = jumps at levels.',
    '<b>High-low</b>: pick highest & lowest <b>ACTIVITY</b> (not cost). VC/unit = Δcost ÷ Δunits. Fixed = total cost − units × VC.' ] },
  3: { title: 'Product costing', lines: [
    'Overheads: <b>allocate</b> (whole cost to one centre) → <b>apportion</b> (share fairly: floor area, employees, equipment value) → re-apportion service depts → <b>absorb</b> into units.',
    '<b>OAR</b> = budgeted overhead ÷ budgeted activity. Absorbed = OAR × actual activity.',
    'Absorbed > actual = <b>over</b>-absorbed (add to profit). Absorbed < actual = <b>under</b>-absorbed.',
    'Marginal costing: inventory at variable cost, fixed cost = period cost. Profit difference = Δinventory units × fixed OH per unit. Inventory ↑ → absorption profit higher.',
    'ABC: cost pool ÷ cost driver = driver rate. Levels: unit, batch, product-sustaining, facility-sustaining. Traditional costing over-costs high-volume products.',
    'Process: normal loss carries no cost (credit scrap value). Cost/unit = (costs − NL scrap) ÷ expected output. Abnormal loss/gain valued like good units.',
    'Equivalent units: WIP × % complete. Job costing = customer-specific short jobs, cost-plus pricing.' ] },
  4: { title: 'Budgets & variances', lines: [
    'Principal budget factor (usually sales) is set first. Production = sales + closing FG − opening FG.',
    'Purchases = usage + closing RM − opening RM. Cash budget: timing! Ignore depreciation.',
    'Flexible budget: flex variable costs to actual output. ZBB: justify every cost from zero.',
    'Standards: ideal, attainable, current, basic. Variances F (favourable) / U (unfavourable).',
    'Mat price = (SP − AP) × AQ purchased. Mat usage = (SQ − AQ) × SP.',
    'Lab rate = (SR − AR) × hrs <b>paid</b>. Idle time = idle hrs × SR (always U). Efficiency = (SH − hrs <b>worked</b>) × SR.',
    'VOH exp = (std rate × hrs worked) − actual VOH. VOH eff = (SH − hrs worked) × VOH rate.',
    'FOH exp = budget − actual. FOH volume = (actual units − budget units) × FOH per unit.',
    'Sales price = (AP − SP) × actual units. Sales volume profit = (actual − budget units) × std profit/unit.' ] },
  5: { title: 'Performance measurement', lines: [
    'Cost centre (costs) · Revenue centre (revenue) · Profit centre (both) · Investment centre (+ capital).',
    '<b>ROI</b> = PBIT ÷ capital employed × 100%. <b>RI</b> = profit − (capital × cost of capital).',
    'ROI can make managers reject projects that beat the cost of capital (goal congruence problem). RI avoids this.',
    'Profit margin = profit ÷ sales. Gross margin = gross profit ÷ sales.',
    'Efficiency = std hrs produced ÷ actual hrs. Capacity = actual hrs ÷ budgeted hrs. Activity = std hrs produced ÷ budgeted hrs.',
    'Balanced scorecard: Financial · Customer · Internal (business process) · Learning & growth.',
    'Rewards: extrinsic (pay, benefits) vs intrinsic (job content). Base, performance-related & indirect pay.' ] },
  6: { title: 'Decisions', lines: [
    'Steps: define problem → criteria → alternatives → analyse → select.',
    '<b>Limiting factor</b>: rank by contribution per unit of scarce resource.',
    'Make or buy: compare variable cost to make vs buy price, plus avoidable fixed costs.',
    '<b>BEP units</b> = fixed costs ÷ contribution per unit. BEP $ = fixed ÷ C/S ratio.',
    'C/S ratio = contribution ÷ sales. Target profit units = (fixed + profit) ÷ CPU.',
    'Margin of safety = budget sales − BEP (÷ budget for %).',
    '<b>Payback</b> = time for cash inflows to repay outlay (ignores time value & later cash).',
    '<b>ARR</b> = avg annual profit ÷ avg investment. Avg investment = (cost + residual) ÷ 2. Profit = cash − depreciation.',
    'Risk = measurable probabilities; uncertainty = can\'t be quantified. Risk averse / neutral / seeker. Post-completion audit = learn for future.' ] },
  7: { title: 'Inventory & pricing', lines: [
    'JIT: pull system, small frequent deliveries, close suppliers, zero defects, eliminate non-value-added activity.',
    '<b>Reorder level</b> = max usage × max lead time.',
    '<b>Minimum</b> = reorder level − (avg usage × avg lead time).',
    '<b>Maximum</b> = reorder level + reorder qty − (min usage × min lead time).',
    'Avg inventory = safety stock + ½ reorder qty. <b>EOQ</b> = √(2 × Co × D ÷ Ch).',
    'Full cost-plus vs marginal cost-plus. Mark-up on cost vs margin on sales!',
    'Skimming = high launch price; penetration = low launch price. PED = %Δqty ÷ %Δprice.',
    'Target cost = target price − required profit. Transfer price: market, cost-based or negotiated.' ] },
};

// Study plan helper: split remaining weeks by study-map hours.
export function buildPlan(examDate, today = new Date()) {
  const msDay = 86400000;
  const days = Math.max(7, Math.round((new Date(examDate) - today) / msDay));
  const revisionDays = Math.max(5, Math.round(days * 0.15));
  const studyDays = days - revisionDays;
  const totalH = MODULES.reduce((s, m) => s + m.hours, 0);
  let cursor = new Date(today);
  const plan = MODULES.map(m => {
    const d = Math.max(2, Math.round(studyDays * m.hours / totalH));
    const start = new Date(cursor); cursor = new Date(cursor.getTime() + d * msDay);
    return { mod: m.id, start, end: new Date(cursor.getTime() - msDay), days: d, hoursPerDay: +(m.hours / d).toFixed(1) };
  });
  plan.push({ mod: 0, start: new Date(cursor), end: new Date(examDate), days: revisionDays, hoursPerDay: +(14 / revisionDays).toFixed(1) });
  return { days, plan };
}
