const ExpenseCategory = require('../oop/ExpenseCategory');

class CategoryFactory {

    static createCategory(name, description) {

        return new ExpenseCategory(
            name,
            description
        );

    }
}

module.exports = CategoryFactory;