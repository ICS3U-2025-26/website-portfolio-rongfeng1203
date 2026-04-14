let gameState = "title";
let duck, ring;
let tiles = [];
let score = 0;
let timer = 0; 
let canBreakTile = true; 
let isPaused = false;

// --- ADJUSTABLE SETTINGS ---
let baseRingSpeed = 4;       
let globalMaxSpeed = 7;      // Keeps the ring controllable on all browsers
let baseDuckHeight = 65;     
let baseRingSize = 55; 

let titleScreenColor = [65, 207, 209]; 
let gameOverScreenColor = [232, 92, 37];
let titleFontColor = [255, 251, 171]; 
let endFontColor = [255, 200, 0];    

let gameplayBGColor = [168, 247, 234];
let hudFontColor = [142, 102, 222];
let brickColors = [
  [106, 199, 230],
  [113, 229, 235],
  [108, 176, 224],
  [114, 147, 219]
];
// ---------------------------

let duckSpeed = 0;
let maxDuckSpeed = 14; 
let acceleration = 0.9;

let duckImg, ringImg;
let myFont;

function preload() {
  duckImg = loadImage('assets/duck.png');
  ringImg = loadImage('assets/ring.png');
  myFont = loadFont('assets/font.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  textAlign(CENTER, CENTER);
  textFont(myFont); 
  initGame(); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initGame();
}

function draw() {
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "play") {
    runGame();
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

function drawTitleScreen() {
  background(titleScreenColor);
  fill(titleFontColor);
  textSize(width * 0.05); 
  text("Duck BBreaker", width / 2, height * 0.2);
  
  textSize(width * 0.018);
  let instructions = [
    "HOW TO PLAY:",
    "• Use ARROWS to move the Duck",
    "• Bounce the Ring to break pool tiles",
    "• RULE: Hit the Duck after every break to recharge!",
    "• Press 'P' to Pause / Resume",
    "• Clear all tiles before the timer hits 0!"
  ];
  
  for(let i = 0; i < instructions.length; i++) {
    text(instructions[i], width / 2, height * 0.4 + (i * 35));
  }
  
  textSize(width * 0.025);
  text("Press SPACE to Start", width / 2, height * 0.85);
}

function runGame() {
  background(gameplayBGColor); 
  drawHUD();

  image(duckImg, duck.x, duck.y, duck.w, duck.h); 
  
  noStroke(); 
  for (let t of tiles) {
    fill(t.color);
    rect(t.x, t.y, t.w, t.h);
  }

  image(ringImg, ring.x - ring.r, ring.y - ring.r, ring.size, ring.size);

  if (isPaused) {
    fill(0, 150);
    rect(0, 0, width, height);
    fill(255);
    textSize(width * 0.05);
    text("PAUSED", width / 2, height / 2);
    return;
  }

  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }
  if (timer <= 0) gameState = "gameover";

  // Duck Movement
  if (keyIsDown(LEFT_ARROW)) duckSpeed -= acceleration;
  else if (keyIsDown(RIGHT_ARROW)) duckSpeed += acceleration;
  else duckSpeed *= 0.85; 
  
  duckSpeed = constrain(duckSpeed, -maxDuckSpeed, maxDuckSpeed);
  duck.x += duckSpeed;
  duck.x = constrain(duck.x, 0, width - duck.w);
  
  // --- UPDATED RING PHYSICS ---
  ring.x += ring.vx;
  ring.y += ring.vy;

  // Horizontal Boundary Fix
  if (ring.x - ring.r < 0) {
    ring.vx = abs(ring.vx); // Force move right
    ring.x = ring.r + 1;    // Teleport out of wall
  } else if (ring.x + ring.r > width) {
    ring.vx = -abs(ring.vx); // Force move left
    ring.x = width - ring.r - 1; // Teleport out of wall
  }

  // Vertical Boundary Fix
  if (ring.y - ring.r < 0) {
    ring.vy = abs(ring.vy); // Force move down
    ring.y = ring.r + 1;    // Teleport out of ceiling
  }

  // ANTI-TRAP LOGIC: If horizontal speed is too low, give it a nudge
  if (abs(ring.vx) < 1.5) {
    ring.vx = (ring.vx >= 0) ? 1.5 : -1.5;
  }

  checkCollisions();

  if (ring.y > height) gameState = "gameover";
  
  if (tiles.length === 0) {
    gameState = "gameover";
  }
}

function drawHUD() {
  fill(hudFontColor);
  textSize(width * 0.035); 
  textAlign(LEFT, TOP);
  text("Score: " + floor(score), 40, 40);
  textAlign(RIGHT, TOP);
  if (timer < 10) fill(255, 0, 0);
  text("Time: " + timer, width - 40, 40);
  textAlign(CENTER, CENTER);
}

function drawGameOverScreen() {
  background(gameOverScreenColor);
  fill(endFontColor);
  textSize(width * 0.06);
  
  let resultText = tiles.length === 0 ? "Victory!" : "Game Over";
  text(resultText, width / 2, height / 2 - 50);
  
  textSize(width * 0.025);
  text("Final Score: " + floor(score), width / 2, height / 2 + 30);
  text("Press R to Restart", width / 2, height / 2 + 100);
}

function keyPressed() {
  if (gameState === "title" && key === " ") gameState = "play";
  if (gameState === "play" && (key === 'p' || key === 'P')) isPaused = !isPaused;
  if (gameState === "gameover" && (key === 'r' || key === 'R')) {
    score = 0; 
    initGame();
    gameState = "play";
  }
}

function initGame() {
  duckSpeed = 0;
  canBreakTile = true;
  isPaused = false;

  let aspect = duckImg.width / duckImg.height;
  let scaledWidth = baseDuckHeight * aspect;

  duck = { 
    x: width / 2 - scaledWidth / 2, 
    y: height - baseDuckHeight - 40, 
    w: scaledWidth, 
    h: baseDuckHeight 
  };

  ring = { 
    x: width / 2, y: height / 2, 
    size: baseRingSize, r: baseRingSize / 2, 
    vx: baseRingSpeed, vy: -baseRingSpeed 
  }; 
  
  tiles = [];
  let cols = 22; 
  let spacing = 6;
  let gridTopMargin = 120;
  let maxGridHeight = (height * 0.5) - gridTopMargin;
  
  let tileSize = (width - (spacing * (cols + 1))) / cols; 
  let rows = floor(maxGridHeight / (tileSize + spacing)); 
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      tiles.push({ 
        x: spacing + i * (tileSize + spacing), 
        y: gridTopMargin + j * (tileSize + spacing), 
        w: tileSize, h: tileSize,
        color: random(brickColors)
      });
    }
  }

  // Timer: 3 seconds per tile generated
  timer = tiles.length * 3;
}

function checkCollisions() {
// --- Inside checkCollisions() ---
if (ring.y + ring.r > duck.y && ring.x > duck.x && ring.x < duck.x + duck.w) {
  if (ring.y < duck.y + duck.h) {
    ring.vy *= -1;
    ring.y = duck.y - ring.r;

    // Influence based on duck movement + hit position
    let impact = (ring.x - (duck.x + duck.w / 2)) * 0.15;
    ring.vx += impact;

    // FIX: Prevent vx from being exactly 0 or too slow
    if (abs(ring.vx) < 1.5) {
      // Nudge it in the direction it was already heading, or based on impact
      ring.vx = (ring.vx >= 0) ? 1.5 : -1.5;
    }

    ring.vx = constrain(ring.vx, -globalMaxSpeed, globalMaxSpeed);
    canBreakTile = true;
  }
}
  
  if (canBreakTile) {
    for (let i = tiles.length - 1; i >= 0; i--) {
      let t = tiles[i];
      if (ring.x > t.x && ring.x < t.x + t.w && ring.y - ring.r < t.y + t.h && ring.y + ring.r > t.y) {
        ring.vy *= -1;
        tiles.splice(i, 1);
        score += 25 + (timer * 0.1); 
        canBreakTile = false; 
        break; 
      }
    }
  }
}