// ============================================================================
// DESIGN PATTERN DEMO  --  run with:  node designpatterns/demoPatterns.js
// ----------------------------------------------------------------------------
// Exercises all four patterns end-to-end with in-memory sample data, so it
// runs WITHOUT a live MongoDB connection. Good for a screenshot / video demo.
// ============================================================================

const NotificationCenter = require('./observer/NotificationCenter');
const { ConsoleLogObserver, InAppNotificationObserver } = require('./observer/observers');
const ExpenseService = require('./facade/ExpenseService');
const { ReportContext, getStrategy } = require('./strategy/reportStrategies');
const {
    BaseReport,
    TotalsDecorator,
    CategoryBreakdownDecorator,
    BudgetRemainingDecorator,
} = require('./decorator/reportDecorators');

// Sample data shared by the report demos.
const sampleExpenses = [
    { title: 'Flight to Sydney', amount: 450, category: 'Transport', paymentMethod: 'Card', date: '2026-05-02' },
    { title: 'Hotel', amount: 600, category: 'Accommodation', paymentMethod: 'Card', date: '2026-05-03' },
    { title: 'Dinner', amount: 80, category: 'Meals', paymentMethod: 'Cash', date: '2026-05-03' },
    { title: 'Taxi', amount: 40, category: 'Transport', paymentMethod: 'Card', date: '2026-06-10' },
];

async function run() {
    // --- OBSERVER + FACADE + SINGLETON ------------------------------------
    console.log('\n=== OBSERVER + FACADE ===');
    const notifier = NotificationCenter.getInstance();
    notifier.clear();
    const inApp = new InAppNotificationObserver();
    notifier.subscribe(new ConsoleLogObserver()).subscribe(inApp);

    // Fake model so the Facade runs without a database.
    const fakeModel = {
        create: async (doc) => ({ _id: 'demo123', ...doc }),
    };
    const service = new ExpenseService(fakeModel, notifier);

    await service.addExpense(
        { title: 'Conference ticket', amount: 300, category: 'Misc', paymentMethod: 'Card', date: '2026-06-20' },
        'user-1',
        { budget: 1000, spentThisMonth: 800 } // triggers BUDGET_LIMIT_REACHED
    );

    console.log('In-app notifications stored:', inApp.getAll().length);

    // Prove the Singleton: a second getInstance() is the same object.
    console.log('Singleton check (same instance):', NotificationCenter.getInstance() === notifier);

    // --- STRATEGY ----------------------------------------------------------
    console.log('\n=== STRATEGY ===');
    const ctx = new ReportContext(getStrategy('category-summary'));
    console.log('Category summary:', JSON.stringify(ctx.generate(sampleExpenses), null, 2));

    ctx.setStrategy(getStrategy('date-range'));
    const may = ctx.generate(sampleExpenses, { startDate: '2026-05-01', endDate: '2026-05-31' });
    console.log(`Date-range (May) -> ${may.count} expenses, $${may.total}`);

    // --- DECORATOR ---------------------------------------------------------
    console.log('\n=== DECORATOR ===');
    const enhanced = new BudgetRemainingDecorator(
        new TotalsDecorator(new CategoryBreakdownDecorator(new BaseReport(sampleExpenses))),
        2000
    );
    console.log('Enhanced report:', JSON.stringify(enhanced.build(), null, 2));
}

run().then(() => console.log('\nDemo complete.'));
