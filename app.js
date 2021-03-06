let budgetController = (function () {
    let Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    }

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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

        deleteItem: function (type, id) {

            let ids, index;
            ids = data.allItems[type].map(function (curr) {
                return curr.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        calculatePercentage: function () {
            data.allItems.exp.forEach(function (curr) {
                curr.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function () {
            let allPercentage;
            allPercentage = data.allItems.exp.map(function (curr) {
                return curr.getPercentage();
            });
            return allPercentage;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        datelabel: '.budget__title--month',
        expensesPercentageLabel: '.item__percentage'
    };

    let formatNumber = function (num, type) {
        let sign = ' ';
        num = num.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigit: 2
        })
        if (type === 'exp') {
            sign = '-';
        } else if (type === 'inc') {
            sign = '+';
        }
        return sign + ' ' + num;
    };

    let nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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
                html = `<div class="item clearfix" id="inc-${obj.id}">
                                <div class="item__description">${obj.description}</div>
                                <div class="right clearfix">
                                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                                    <div class="item__delete">
                                        <button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button>
                                    </div>
                                </div>
                            </div>`
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button>
                                </div>
                            </div>
                        </div>`
            }
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },

        deleteListItem: function (selectorID) {

            let el;
            el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
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

        displayBudget: function (obj) {

            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "--";
            }

        },

        displayPercentages: function (percentages) {
            let fields;
            fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

            nodeListForEach(fields, function (curr, index) {
                if (percentages[index] > 0) {
                    curr.textContent = percentages[index] + '%';
                } else {
                    curr.textContent = '--';
                }

            });
        },

        displayDate: function () {
            let date, month, year;
            date = new Date();
            year = date.getFullYear();
            month = date.toLocaleDateString('default', {
                month: 'long'
            });
            document.querySelector(DOMstrings.datelabel).textContent = month + ', ' + year;

        },

        changedType: function() {
            let fields;
            fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(curr) {
                curr.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
    }

    let updateBudget = function () {
        budgetController.calculateBudget();

        let budget = budgetController.getBudget();

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

            updatePercentage();
        } else {
            alert("Please enter a valid Value");
        }

    }

    let ctrlDeleteItem = function (event) {

        let itemID, splitID, type, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            budgetController.deleteItem(type, ID);
        }

        UIController.deleteListItem(itemID);

        updateBudget();
    }

    let updatePercentage = function () {
        budgetController.calculatePercentage();

        let Perc = budgetController.getPercentages();
        UIController.displayPercentages(Perc);
    }

    return {
        init: function () {
            console.log("Application has started.");
            setupEventListeners();
            UIController.displayDate();
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