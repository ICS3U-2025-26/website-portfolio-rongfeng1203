alert("You will take a quiz, yes = ok, no = cancel");

let finalAnswer = 0//initializing 

let ans1 = confirm("Is BSS's mascot a bobcat?");
console.log(ans1);
if (ans1 === true) {
    alert("You are correct!");
    finalAnswer = finalAnswer + 2//adding points
}
else if (ans1 === false) {
    alert("You are wrong!");
}

let ans2 = confirm("Do you take comp sci?");
console.log(ans2);
if (ans2 === true) {
    alert("You are correct!");
    finalAnswer = finalAnswer + 2//add more points
}
else if (ans2 === false) {
    alert("You are wrong!");
}

let ans3 = confirm("Is 2 + 2 = 4?");
console.log(ans3);
if (ans3 === true) {
    alert("You are correct!");
    finalAnswer = finalAnswer + 2
}
else if (ans3 === false) {
    alert("You are wrong!");
}

let ans4 = prompt("What is your grade?");
console.log(ans4);
ans4 = parseInt(ans4);//convert answer to number
if (ans4 >= 9) {
    alert("You are correct!");
    finalAnswer = finalAnswer + 2
}

let ans5 = prompt("What time is it?");
console.log(ans5);
ans5 = parseInt(ans5);
if (ans5 >= 0) {
    alert("You are correct!");
    finalAnswer = finalAnswer + 2
}

console.log(finalAnswer);
alert(`Your score is ${finalAnswer}/10`);//concatenation, combines string

