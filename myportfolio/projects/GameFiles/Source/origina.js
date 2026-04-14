// This variable controls which screen is currently visible.  
// We start with the title screen.  
let gameState = "title";

function setup() {  
  createCanvas(800, 600);  
    
  // This makes all text draw from its center point, making alignment much easier  
  textAlign(CENTER, CENTER);  
}
function draw() {  
  // A dark background to clear the screen every frame  
  background(30);

  // Check which state the game is currently in  
  if (gameState === "title") {  
    // We will build this function in Step 3  
    // If using mouse start, change this to drawTitleScreenMouseSelect()
    drawTitleScreenKeyboardSelect();   
  } else if (gameState === "play") {  
    // We will build this function in Step 4  
    runGame();  
  } else if (gameState === "gameover") {  
    // We will build this function in Step 4  
    drawGameOverScreen();  
  }  
}
// OPTION A: Keyboard Start Screen  
// Add this below draw()
function drawTitleScreenKeyboardSelect() {  
  // A dark blue background for the title  
  background(20, 40, 80);

  // Main Title  
  fill(255);  
  textSize(48);  
  // width/2 and height/3 place the text perfectly in the upper middle  
  text("My Awesome Game", width / 2, height / 3);

  // Instructions  
  textSize(24);  
  text("Press SPACE to Start", width / 2, height / 2);

  // Controls  
  textSize(16);  
  text("Use arrow keys to move", width / 2, height / 2 + 50);  
}
function runGame() {  
  // Black background for the game  
  background(0);  
    
  fill(255);  
  textSize(40);  
  text("Game is running", width / 2, height / 2 - 30);

  // A temporary way to test ending the game  
  textSize(20);  
  text("Press E to End Game", width / 2, height / 2 + 30);  
}

function drawGameOverScreen() {  
  // Dark red background to indicate the game is over  
  background(80, 0, 0);

  fill(255);  
  textSize(40);  
  text("Game Over", width / 2, height / 2 - 30);

  // Instructions to play again  
  textSize(20);  
  text("Press R to Restart", width / 2, height / 2 + 30);  
}
// IF YOU CHOSE OPTION A (Keyboard Selection), ADD THESE TWO FUNCTIONS:

// This function listens for physical keyboard presses  
function keyPressed() {  
    
  // If we are on the title screen AND they press Space  
  if (gameState === "title" && key === " ") {  
    // Change the state to play! The draw loop will take over from here.  
    gameState = "play";  
  }

  // If the game is over AND they press the 'r' or 'R' key  
  if (gameState === "gameover" && (key === "r" || key === "R")) {  
    gameState = "play"; // Restart the game  
  }

  // A temporary command to let us test our Game Over screen  
  if (gameState === "play" && (key === "e" || key === "E")) {  
    gameState = "gameover";  
  }  
}
