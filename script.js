//1
const balance = document.getElementById(
    "balance"
  );
  const money_plus = document.getElementById(
    "money-plus"
  );
  const money_minus = document.getElementById(
    "money-minus"
  );
  const list = document.getElementById("list");
  const form = document.getElementById("form");
  const text = document.getElementById("text");
  const amount = document.getElementById("amount");
  // const dummyTransactions = [
  //   { id: 1, text: "Flower", amount: -20 },
  //   { id: 2, text: "Salary", amount: 300 },
  //   { id: 3, text: "Book", amount: -10 },
  //   { id: 4, text: "Camera", amount: 150 },
  // ];
  
  // let transactions = dummyTransactions;
  
  //last 
  const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
  
  let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];
  
  //5
  //Add Transaction
  function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === ''){
      alert('please add text and amount')
    }else{
      const transaction = {
        id:generateID(),
        text:text.value,
        amount:+amount.value
      }
  
      transactions.push(transaction);
  
      addTransactionDOM(transaction);
      updateValues();
      updateLocalStorage();
      text.value='';
      amount.value='';
    }
  }
  
  
  //5.5
  //Generate Random ID
  function generateID(){
    return Math.floor(Math.random()*1000000000);
  }
  
  //2
  
  //Add Trasactions to DOM list
  function addTransactionDOM(transaction) {
    //GET sign
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
  
    //Add Class Based on Value
    item.classList.add(
      transaction.amount < 0 ? "minus" : "plus"
    );
  
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(
      transaction.amount
    )}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      `;
    list.appendChild(item);
  }
  
  //4
  
  //Update the balance income and expence
  function updateValues() {
    const amounts = transactions.map(
      (transaction) => transaction.amount
    );
    const total = amounts
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => (acc += item), 0)
      .toFixed(2);
    const expense =
      (amounts
        .filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) *
      -1).toFixed(2);
  
      balance.innerText=`₹ ${total}`;
      money_plus.innerText = `₹ ${income}`;
      money_minus.innerText = `₹ ${expense}`;
  }
  
  
  //6 
  
  //Remove Transaction by ID
  function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
  }
  //last
  //update Local Storage Transaction
  function updateLocalStorage(){
    localStorage.setItem('transactions',JSON.stringify(transactions));
  }
  
  //3
  
  //Init App
  function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
  }
  
  Init();
  
  form.addEventListener('submit',addTransaction);


  // Step 1: Add an edit function
function editTransaction(id) {
    const transactionToEdit = transactions.find(transaction => transaction.id === id);
    if (!transactionToEdit) return;

    // Populate form fields with transaction data
    text.value = transactionToEdit.text;
    amount.value = Math.abs(transactionToEdit.amount); // Make sure amount is positive for editing

    // Remove the transaction from the list temporarily while editing
    transactions = transactions.filter(transaction => transaction.id !== id);
    // updateLocalStorage();

    // Remove the transaction from the DOM
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);

    // Update values without the edited transaction
    updateValues();

    // Set focus to the text input field
    text.focus();

    // Add event listener to the form for editing the transaction
    form.removeEventListener('submit', addTransaction); // Remove the previous listener
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Update the transaction with edited details
        transactionToEdit.text = text.value;
        transactionToEdit.amount = +amount.value;
        transactions.push(transactionToEdit);
        updateLocalStorage();
        Init();
        form.removeEventListener('submit', arguments.callee); // Remove the listener after the transaction is edited
        form.addEventListener('submit', addTransaction); // Re-add the listener for adding transactions
        text.value = '';
        amount.value = '';
    });
}

// Step 2: Add event listener to the list items for editing
list.addEventListener('click', function(e) {
    if (e.target.classList.contains('edit-btn')) {
        const transactionId = parseInt(e.target.dataset.id);
        editTransaction(transactionId);
    }
});

// Step 3: Modify addTransactionDOM function to include an edit button
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        <button class="edit-btn" data-id="${transaction.id}">Edit</button>
    `;
    list.appendChild(item);
}
