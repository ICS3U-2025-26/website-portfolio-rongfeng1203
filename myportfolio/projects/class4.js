console.log("Hello, world!");//finally this comment type, i miss u

/* 
aye I don't like this way of commenting
ALSO ALERT THIS QUIZ IS LOWKEY WEIRD, PREPARE YOURSLEF!!!
*/

//1. creating variables: use let only the FIRST time you create a variable
//let variables can be updated later
let year = 2024;
year = 2025; //updating
year = year + 1; //updating with math
console.log(year);//lets us debug and see variables

const myName = "RongFeng";//constant variable, cannot be updated
//myName = "Rongfeng" constant can't be changed
console.log(myName);

//2. popup box

//alert(), info
alert("I want your address");//popup box that stops the code until you click ok

//confirm() returns true or false, ok or cancel
let ans = confirm("Are you sure?");
console.log(ans);//true or false, depending on what you clicked
//prompt() returns a string
let address = prompt("Tell me your address");//popup box that asks for input, returns a string
console.log(address);//lets us see the input
//3. using variables

console.log(`Your address is ${address},and ${myName} want to send you a gift in ${year}`);//concatenation, combines string

//If statements
if (year > 2025) {
    console.log("The year is in the future");
}   

//conversion to interger: parseInt()
let age = prompt("How old are you?");
age = parseInt(age);//convert string to integer

if (age < 13) {
    alert("You are a child");
}
else if (age <= 19) {
    alert("You are a teenager");
}
else if (age >= 20) {
    alert("You are very old");
}
else {
    alert("You are very mysterious");
}

if (ans === true) {
    alert("You clicked ok, im coming to ur house");
} else {
    alert("You clicked cancel, i will find out where you live");
}
