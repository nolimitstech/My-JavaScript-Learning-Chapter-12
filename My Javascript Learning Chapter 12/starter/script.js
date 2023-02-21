'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0); ///padstart alows to add 0 to days with single digit
    const month = `${date.getMonth() + 1}`.padStart(2, 0); ///padstart alows to add 0 to months with single digit
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.accmovements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // const date = new Date(acc.movementsDates[i]);
    // const day = `${date.getDate()}`.padStart(2, 0);///padstart alows to add 0 to days with single digit
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);///padstart alows to add 0 to months with single digit
    // const year = date.getFullYear();

    // const displayDate = `${day}/${month}/${year}`;

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
const startLogOutTimer = function () {
  /////setting logout countdown timer for app
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer); ////used to stop setInterval timer. N/B: its diff from clearTimeout
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--; ////means remov one sec anytime the call bck functn is called
  };

  // Set time to 5 minutes
  let time = 120; /////120 seconds

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount, timer;

///////COMPUTING/UPDATING THE DATE/TIME WE USE:
///experimenting API for intl time formating(an example code)
const now = new Date();
const options = {
  ///is used to format the time write up
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  // weekday: 'long',
};

const locale = navigator.language; ///to set the time to the format of the user/browsers location
console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now); ////visit ISO language code table on google to see diff country codes

//////////N/B: this is for non-Intl formating
// const now = new Date();
// const day = `${now.getDate()}`.padStart(2, 0);///padstart alows to add 0 to days with single digit
// const month = `${now.getMonth() + 1}`.padStart(2, 0);///padstart alows to add 0 to months with single digit
// const year = now.getFullYear();
// const hour = `${now.getHours()}`.padStart(2, 0);
// const Min = `${now.getMinutes()}`.padStart(2, 0);
// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${Min}`;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer); ////clears any previous timer runing
    timer = startLogOutTimer(); ///
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    ///Add the transfer Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //reset timer after transfer activity
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      ///adding settimer to loan booking is granted/disbursed
      // Add movement
      currentAccount.movements.push(amount);

      ///Add the loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      //reset timer after transfer activity
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
///////////////////////////////////////
// CONVERTING AND CHECKING NUMBERS
console.log(23 === 23.0);

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// Binary base 2 - 0 1
console.log(0.1 + 0.2); ///logs 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); ///wil log false

// Conversion
console.log(Number('23')); ////converts str to number
console.log(+'23'); ///conerts str to no

// Parsing
console.log(Number.parseInt('30px', 10)); ///logs 30. '10' here refers to base 10, can be base 2 etc respectivly
console.log(Number.parseInt('e23', 10)); ////logs NaN, needs to stat with a number for concersn to occur

console.log(Number.parseInt('  2.5rem  ')); //logs 2
console.log(Number.parseFloat('  2.5rem  ')); ////logs 2.5

// Check if value is NaN
console.log(Number.isNaN(20)); // logs false
console.log(Number.isNaN('20')); ///false
console.log(Number.isNaN(+'20X')); ///true
console.log(Number.isNaN(23 / 0)); ///false

// Checking if value is number
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));

///////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25)); ///logs squqre root
console.log(25 ** (1 / 2)); ///logs squareroot too. (1/2) refers to sqrt, ** means exponetiatn
console.log(8 ** (1 / 3)); ///logs cubic root

///to get maximum number from a grp
console.log(Math.max(5, 18, 23, 11, 2)); //logs 23
console.log(Math.max(5, 18, '23', 11, 2)); ///logs 23, cos Math.max does type coersion
console.log(Math.max(5, 18, '23px', 11, 2)); ///logs NaN. cos Math.max doesnt do parsing

///to get minimum number from a grp
console.log(Math.max(5, 18, 23, 11, 2)); //logs 2

///to calc area of a circle with radius 10px
console.log(Math.PI * Number.parseFloat('10px') ** 2); ///N/B: pI is constant

console.log(Math.trunc(Math.random() * 6) + 1); ///logs random no b/w 1-6. N/B Math.trunc remov decimals

////function that produces random nos btw a min and max values
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
// console.log(randomInt(10, 20));

// Rounding integers
console.log(Math.round(23.3)); //rounds to the nearest int
console.log(Math.round(23.9));

console.log(Math.ceil(23.3)); ///rounds up to 24
console.log(Math.ceil(23.9)); ///rounds up to 24

console.log(Math.floor(23.3)); ///rounds down to 23
console.log(Math.floor('23.9')); ///rounds down to 23, does type coersion

console.log(Math.trunc(23.3)); ///removs decimal

///comparing trunc with floor
console.log(Math.trunc(-23.3)); ///logs -23
console.log(Math.floor(-23.3)); //logs -24

// Rounding decimals
console.log((2.7).toFixed(0)); ///logs 3(string) to 0 decimal places
console.log((2.7).toFixed(3)); ///logs 2.700 ie to 3 deciml places
console.log((2.345).toFixed(2)); //logs 2.35 to 2 decimal placs
console.log(+(2.345).toFixed(2)); ///logs 2.35(number), cos of the "+" sign added

///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2); ///logs 1. ie 2 remainder 1
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3); ///logs 2
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0; ///checks if a no is even, logs a boolean response
console.log(isEven(8)); //logs true
console.log(isEven(23)); //false
console.log(isEven(514)); ///true

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered'; ///to change row color rows with even division
    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue'; ///to change row color rows with even division
  });
});

///////////////////////////////////////
// Working with BigInt  N/B: BigInt cannot be combined mathematicaly with other numbers
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4838430248342043823408394839483204n); ////adds 'n' for it to be displayed correctly
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n));////doesnt work with BigInt, logs error

const huge = 20289830237283728378237n;
const num = 23; ///N/B: BigInt cannot be combined mathematicaly with other numbers
console.log(huge * BigInt(num)); ////number is convertd to BigInt in other for calc  to work

// Exceptions where BigInt is combined in maths with ordinary numbers
console.log(20n > 15);
console.log(`this is`, 20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!'); ///str concat works too

// Divisions
console.log(11n / 3n); //logs 3n, cuts the decimals off
console.log(10 / 3);

///////////////////////////////////////////////
// CREATING DATES

// Create a date

// const now = new Date();////logs the date right now
// console.log(now);

// console.log(new Date('Aug 02 2020 18:05:41'));
// console.log(new Date('December 24, 2015'));
// console.log(new Date(account1.movementsDates[2]));///logs the time frm the acct1 movs

// console.log(new Date(2037, 10, 19, 15, 23, 5));///sequence is year, month(0 based), day, hr, min and seconds
// console.log(new Date(2037, 10, 31));///auto corects to Dec 1, cos Nov doesnt ve 31

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));///to compute a date. sequence is no of days, hr/day, min/hr, sec/min and milisec/sec.

// Working with dates
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());///logs 2037
// console.log(future.getMonth());///logs 10
// console.log(future.getDate());//logs 19
// console.log(future.getDay());//logs 4(day of the week ie thurs)
// console.log(future.getHours());//logs 15
// console.log(future.getMinutes());//logs 23
// console.log(future.getSeconds());
// console.log(future.toISOString());////logs the intl standrd format
// console.log(future.getTime());///logs milisecs passed since jan 1st 1970

// console.log(new Date(2142256980000));////logs current time based on this milisecs passed since 1970

// console.log(Date.now());////logs the time stamp of today since 1970
// //console.log(new Date(1676217442648));//using the time stamp abov to compute todays date

// future.setFullYear(2040);///used to date details of Future(Nov 19, 15:23 etc)
// console.log(future);

///////////////////////////////////////
// HOW TO CALC DIFF BETWN DATES
const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24); ////divisn is thurs milisec, mins, hrs and days

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 24));
console.log(days1); //logs 10 days

///////////////////////////////////////
// Internationalizing Numbers (Intl)
const num2 = 3884764.23;

const options2 = {
  style: 'unit',
  unit: 'mile-per-hour',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US:      ', new Intl.NumberFormat('en-US', options2).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options2).format(num));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options2).format(num));
console.log(
  //registering number acording to user browser location
  navigator.language,
  new Intl.NumberFormat(navigator.language, options2).format(num2)
);

///////////////////////////////////////
// Timers

// setTimeout
// setTimeout(() => console.log('Here is your pizza'), 3000); ////code used to add a time interval before an event ocurs

///to pass argumnts to the setTimeout functn we use:
setTimeout(
  (ing1, ing2) => console.log(`'Here is your pizza with ${ing1} and ${ing2}'`),
  3000,
  'olives',
  'spinach'
); /////olives nd spinachs re the argumnts pased
console.log('waiting.....');

///to cancel timeout before the given time has elasped we use:
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer); ////timeout is canceld/deletd or wont run if spinach is included in ingrdients

// ////// setInterval: to set an event that will be repeated after a certain time interval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 2000); ///logs current date/time evry 2 seconds
