const BaseCategory = require('./BaseCategory');

class ExpenseCategory extends BaseCategory {

    constructor(name, description) {
        super(name, description);
    }

    getCategoryInfo() {

        return {
            ...super.getCategoryInfo(),
            type: "Expense Category"
        };
    }
}

module.exports = ExpenseCategory;