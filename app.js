let budgetController = (function()
{
    let Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let Income = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val)
        {
            let ID, newItem;

            if(data.allItems[type].length > 0)
            {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;

            }
            else
            {
                ID = 0
            }
            
            if(type === "exp")
            {
                newItem = new Expense(ID, des, val);
            }
            else if(type === "inc")
            {
                newItem = new Income(ID, des, val);
            }
        
            data.allItems[type].push(newItem);
            return newItem;
        },

        testing: function()
        {
            console.log(data);
        }
    }

})();


let UIController = (function()
{
    let DOMstrings = {          //We did this so that if html tag changes we can just edit here
        inputType: '.add__type',
        inputButton: '.add__btn',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };
    
    return {
        getInput: function()
        {
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        getDOMstrings: function()
        {
            return DOMstrings;
        },

        addListItem: function(obj, type)
        { 
            let html, element;

            if(type === 'inc')
            {
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
            }

            else if (type === 'exp')
            {
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

        clearFeilds: function()
        {
            let fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(curr, i, arr)
            {
                curr.value = "";
            });
            
            fieldsArray[0].focus();
            
        }
    }
})();


let controller = (function(budgetCtrl, UICtrl)
{
    let setupEventListeners = function()
    {
        let DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event)
        {
            if(event.keycode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });
    }


    let ctrlAddItem = function()
    {
        let input, newItem;

        input = UICtrl.getInput();

        newItem = budgetController.addItem(input.type, input.description, input.value);

        UIController.addListItem(newItem, input.type);

        UIController.clearFeilds();
    }

    return {
        init: function()
        {
            console.log("Application has started.");
            setupEventListeners();
        }
    }
    

})(budgetController, UIController);

controller.init();