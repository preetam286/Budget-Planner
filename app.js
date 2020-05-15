let budgetController = (function () {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let calculateTotal = function (type) {
        let sum = 0;
        data.allItems[type].forEach(function (curr) {
            sum += curr.value;
        });
        data.totals[type] = sum;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }

    return {
        addItem: function (type, des, val) {
            let ID, newItem;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {
                ID = 0
            }

            if (type === "exp") {
                newItem = new Expense(ID, des, val);
            } else if (type === "inc") {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };

})();


let UIController = (function () {
    let DOMstrings = { //We did this so that if html tag changes we can just edit here
        inputType: '.add__type',
        inputButton: '.add__btn',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        getDOMstrings: function () {
            return DOMstrings;
        },

        addListItem: function (obj, type) {
            let html, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                                <div class="item__description">${obj.description}</div>
                                <div class="right clearfix">
                                    <div class="item__value">${obj.value}</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                    </div>
                                </div>
                            </div>`
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${obj.value}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        clearFeilds: function () {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (curr, i, arr) {
                curr.value = "";
            });

            fieldsArray[0].focus();

        },

        displayBudget: function(obj)
        {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            if(obj.percentage > 0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            }
            else{
                document.querySelector(DOMstrings.percentageLabel).textContent = "--";
            }

        }

    }
})();


let controller = (function (budgetCtrl, UICtrl) {
    let setupEventListeners = function () {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            if (event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }

    let updateBudget = function () {
        budgetController.calculateBudget();

        let budget = budgetController.getBudget();
        console.log(budget);

        UIController.displayBudget(budget);

    }

    let ctrlAddItem = function () {
        let input, newItem;

        input = UICtrl.getInput();

        if (input.value !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetController.addItem(input.type, input.description, input.value);

            UIController.addListItem(newItem, input.type);

            UIController.clearFeilds();

            updateBudget();
        } else {
            alert("Please enter a valid Value");
        }

    }

    return {
        init: function () {
            console.log("Application has started.");
            setupEventListeners();
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
        }
    }


})(budgetController, UIController);

controller.init();