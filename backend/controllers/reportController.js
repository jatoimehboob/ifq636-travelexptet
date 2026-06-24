const Expense = require('../models/Expense');
const { ReportContext, getStrategy } = require('../designpatterns/strategy/reportStrategies');
const {
    BaseReport,
    TotalsDecorator,
    CategoryBreakdownDecorator,
    BudgetRemainingDecorator,
} = require('../designpatterns/decorator/reportDecorators');

// GET /api/reports?type=date-range&startDate=...&endDate=...&category=...&budget=...
//
// STRATEGY picks how the expenses are filtered/aggregated at runtime based on
// the ?type query param. DECORATOR then layers dashboard enhancements
// (grand total, category breakdown, remaining budget) onto the result.
exports.getReport = async (req, res) => {
    try {
        const { type, startDate, endDate, category, budget } = req.query;

        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

        // --- STRATEGY ---
        const context = new ReportContext(getStrategy(type));
        const report = context.generate(expenses, { startDate, endDate, category });

        // --- DECORATOR ---
        // Wrap a base report built from the strategy's filtered expenses, then
        // stack enhancements. Budget decorator is only added if a budget is given.
        let decorated = new TotalsDecorator(
            new CategoryBreakdownDecorator(new BaseReport(report.expenses))
        );
        if (budget) {
            decorated = new BudgetRemainingDecorator(decorated, budget);
        }

        res.json({
            ...report,
            enhanced: decorated.build(),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
