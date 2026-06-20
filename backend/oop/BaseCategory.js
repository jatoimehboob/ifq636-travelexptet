class BaseCategory {

    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    getCategoryInfo() {
        return {
            name: this.name,
            description: this.description
        };
    }
}

module.exports = BaseCategory;