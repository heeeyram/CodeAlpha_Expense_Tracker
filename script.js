document.addEventListener('DOMContentLoaded', loadExpenses);

const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
let editingId = null;

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('expense-name').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);

    if (name === '' || isNaN(amount) || amount <= 0) return;

    if (editingId === null) {
        addExpense(name, amount);
    } else {
        editExpense(editingId, name, amount);
    }

    form.reset();
    editingId = null;
}

function addExpense(name, amount) {
    const expense = {
        id: Date.now(),
        name,
        amount
    };

    const expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
}

function editExpense(id, name, amount) {
    const expenses = getExpenses();
    const updatedExpenses = expenses.map(expense => 
        expense.id === id ? { ...expense, name, amount } : expense
    );
    
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    loadExpenses();
}

function loadExpenses() {
    expenseList.innerHTML = '';
    const expenses = getExpenses();

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `${expense.name} - $${expense.amount.toFixed(2)} 
            <button class="edit-btn" onclick="startEditing(${expense.id})">Edit</button>
            <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>`;
        expenseList.appendChild(li);
    });
}

function startEditing(id) {
    const expenses = getExpenses();
    const expense = expenses.find(exp => exp.id === id);

    document.getElementById('expense-name').value = expense.name;
    document.getElementById('expense-amount').value = expense.amount;
    editingId = id;
}

function deleteExpense(id) {
    const expenses = getExpenses();
    const updatedExpenses = expenses.filter(expense => expense.id !== id);

    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    loadExpenses();
}

function getExpenses() {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
}
