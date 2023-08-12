const tbody = document.querySelector('tbody');
const descItem = document.querySelector('#desc');
const amount = document.querySelector('#amount');
const type = document.querySelector('#type');
const btnNew = document.querySelector('#btnNew');
const incomes = document.querySelector('.incomes');
const expenses = document.querySelector('.expenses');
const total = document.querySelector('.total');


let itens;

// Função que verifica se os campos estão vazios
btnNew.onclick = () => {
    if (descItem.value === '' || amount.value === '' || type.value === '') {
        return alert('Preencha todos os campos!');
    }

    itens.push({
        desc: descItem.value,
        amount: Math.abs(amount.value).toFixed(2),
        type: type.value,
    });

    setItensBD();

    loadItens();

    descItem.value = '';
    amount.value = '';
};

// Função para apagar os itens
function deleteItem(index) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
}

// Função para inserir os itens
function insertItem (item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td class="columnType">${
            item.type === 'Entrada'
                ? '<i class="bx bxs-chevron-up-circle"></i>'
                : '<i class="bx bxs-chevron-down-circle"></i>'
        }</td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
        `;

    tbody.appendChild(tr);
}

// Função para carregar os itens
function loadItens() {
    itens = getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });

    getTotals();
}

// Função para calcular o total
function getTotals() {
    const amountIncomes = itens
        .filter((item) => item.type === 'Entrada')
        .map((transaction) => Number(transaction.amount));

    const amountExpenses = itens
        .filter((item) => item.type === 'Saída')
        .map((transaction) => Number(transaction.amount));

    const totalIncomes = amountIncomes
        .reduce((acc, cur) => acc + cur, 0)
        .toFixed(2);

    const totalExpenses = Math.abs(
       amountExpenses.reduce((acc, cur) => acc + cur, 0) 
    ).toFixed(2);

    const totalItens = (totalIncomes - totalExpenses).toFixed(2);

    incomes.innerHTML = totalIncomes;
    expenses.innerHTML = totalExpenses;
    total.innerHTML = totalItens;
}

const getItensBD = () => JSON.parse(localStorage.getItem('db_itens')) ?? [];
const setItensBD = () =>
    localStorage.setItem('db_itens', JSON.stringify(itens));

loadItens();


//Calendário

const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const monthYear = document.getElementById('monthYear');
const calendarGrid = document.getElementById('calendarGrid');
const selectedDateDisplay = document.getElementById('selectedDate');
const addTransactionButton = document.getElementById('addTransaction');
const transactionsList = document.getElementById('transactionsList');
const transactionDescription = document.getElementById('transactionDescription');
const transactionAmount = document.getElementById('transactionAmount');
const transactionType = document.getElementById('transactionType');

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDate;

prevMonthButton.addEventListener('click', showPrevMonth);
nextMonthButton.addEventListener('click', showNextMonth);
calendarGrid.addEventListener('click', handleCalendarClick);
addTransactionButton.addEventListener('click', addTransaction);

function showCalendar(year, month) {
  calendarGrid.innerHTML = '';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  for (let i = 0; i < firstDay; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    calendarGrid.appendChild(dayElement);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = i;
    calendarGrid.appendChild(dayElement);
  }
}

function showPrevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  showCalendar(currentYear, currentMonth);
}

function showNextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  showCalendar(currentYear, currentMonth);
}

function handleCalendarClick(event) {
    const selectedDay = event.target.textContent;
    if (selectedDay !== '') {
      selectedDate = new Date(currentYear, currentMonth, parseInt(selectedDay));
      selectedDateDisplay.textContent = selectedDate.toLocaleDateString('en-US');
      showTransactions();
    }
  }
  
  function addTransaction() {
    if (!selectedDate) {
      alert('Selecione uma data no calendário.');
      return;
    }
  
    const description = transactionDescription.value.trim();
    const amount = parseFloat(transactionAmount.value);
    const type = transactionType.value;
  
    if (description === '' || isNaN(amount)) {
      alert('Preencha todos os campos corretamente.');
      return;
    }
  
    const transaction = {
      date: selectedDate,
      description: description,
      amount: amount,
      type: type,
    };
  
    saveTransaction(transaction);
  
    transactionDescription.value = '';
    transactionAmount.value = '';
    showTransactions();
  }
  
  function saveTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
  
  function getTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(transaction => {
        transaction.date = new Date(transaction.date);
    });
    return transactions;
  }
  
  function showTransactions() {
    const transactions = getTransactions();
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction.date.getFullYear() === selectedDate.getFullYear() &&
        transaction.date.getMonth() === selectedDate.getMonth() &&
        transaction.date.getDate() === selectedDate.getDate()
    );
  
    transactionsList.innerHTML = '';
  
    filteredTransactions.forEach((transaction) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${transaction.description} - ${
        transaction.type === 'income' ? '+' : '-'
      }$${transaction.amount.toFixed(2)}`;
      transactionsList.appendChild(listItem);
    });
  }
  
  showCalendar(currentYear, currentMonth);
