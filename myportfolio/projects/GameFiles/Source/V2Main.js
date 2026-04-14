let gameState = "title";
let duck, ring;
let tiles = [];
let score = 0;
let highScore = 0;
let timer = 0; 
let level = 1;
let lives = 3; // NEW: Track player lives
let isPaused = false;
let ringAttached = true; 

// --- ADJUSTABLE SETTINGS ---
let baseRingSpeed = 4;       
let globalMaxSpeed = 9;      
let baseDuckHeight = 60;     
let baseRingSize = 55; 

let titleScreenColor = [65, 207, 209]; 
let gameOverScreenColor = [232, 92, 37];
let titleFontColor = [255, 251, 171]; 
let endFontColor = [255, 200, 0];    

let gameplayBGColor = [168, 247, 234];
let hudFontColor = [142, 102, 222];
let brickColors = [[106, 199, 230], [113, 229, 235], [108, 176, 224], [114, 147, 219]];
// ---------------------------

let duckSpeed = 0;
let maxDuckSpeed = 20; 
let acceleration = 2;

let duckImg, ringImg, myFont;

function preload() {
  duckImg = loadImage('assets/duck.png');
  ringImg = loadImage('assets/ring.png');
  myFont = loadFont('assets/font.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  let savedScore = localStorage.getItem("duckBreakerHighScore");
  if (savedScore !== null) highScore = parseInt(savedScore);
  
  initLevel(); 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initLevel();
}

function draw() {
  textFont(myFont);
  
  if (gameState === "title") drawTitleScreen();
  else if (gameState === "play") runGame();
  else if (gameState === "gameover") drawGameOverScreen();
}

function drawTitleScreen() {
  background(titleScreenColor);
  textAlign(CENTER, CENTER);
  fill(titleFontColor);
  
  textSize(width * 0.05); 
  text("Duck BBreaker", width / 2, height * 0.2);
  
  textSize(width * 0.018);
  text("CONTROLS: Arrow Keys to Move | 'P' to Pause", width / 2, height * 0.45);
  text("LAUNCH: Press UP ARROW to release the ring!", width / 2, height * 0.45 + 40);
  text("LIVES: 3 per level | HIGH SCORE: " + highScore, width / 2, height * 0.45 + 80);
  
  textSize(width * 0.025);
  text("Press SPACE to Start", width / 2, height * 0.85);
}

function runGame() {
  background(gameplayBGColor); 
  drawHUD();
  drawLives(); // NEW: Visual life icons

  image(duckImg, duck.x, duck.y, duck.w, duck.h); 
  
  noStroke(); 
  for (let t of tiles) {
    fill(t.color);
    rect(t.x, t.y, t.w, t.h);
  }

  if (ringAttached) {
    ring.x = duck.x + duck.w / 2;
    ring.y = duck.y - ring.r;
    if (keyIsDown(UP_ARROW)) {
      ringAttached = false;
      ring.vx = random(-2, 2); 
      ring.vy = -(baseRingSpeed + (level * 0.5));
    }
  }

  image(ringImg, ring.x - ring.r, ring.y - ring.r, ring.size, ring.size);

  if (isPaused) {
    fill(0, 150); rect(0, 0, width, height);
    fill(255); textAlign(CENTER, CENTER); textSize(width * 0.05); 
    text("PAUSED", width / 2, height / 2);
    return;
  }

  if (frameCount % 60 === 0 && timer > 0) timer--;
  if (timer <= 0) handleGameOver();

  // Duck Movement
  if (keyIsDown(LEFT_ARROW)) duckSpeed -= acceleration;
  else if (keyIsDown(RIGHT_ARROW)) duckSpeed += acceleration;
  else duckSpeed *= 0.85; 
  
  duckSpeed = constrain(duckSpeed, -maxDuckSpeed, maxDuckSpeed);
  duck.x += duckSpeed;
  duck.x = constrain(duck.x, 0, width - duck.w);
  
  if (!ringAttached) {
    ring.x += ring.vx;
    ring.y += ring.vy;

    if (ring.x - ring.r < 0) { ring.vx = abs(ring.vx); ring.x = ring.r + 1; }
    else if (ring.x + ring.r > width) { ring.vx = -abs(ring.vx); ring.x = width - ring.r - 1; }
    if (ring.y - ring.r < 0) { ring.vy = abs(ring.vy); ring.y = ring.r + 1; }

    checkCollisions();
    
    // LOST LIFE LOGIC
    if (ring.y > height) {
      lives--;
      if (lives > 0) {
        ringAttached = true; // Reset ring to duck
      } else {
        handleGameOver();
      }
    }
  }
  
  if (tiles.length === 0) {
    if (level < 3) { level++; initLevel(); } 
    else { handleGameOver(); }
  }
}

function handleGameOver() {
  if (tiles.length > 20) baseRingSize += 5;
  if (score > highScore) {
    highScore = floor(score);
    localStorage.setItem("duckBreakerHighScore", highScore.toString());
  }
  gameState = "gameover";
}

function drawHUD() {
  fill(hudFontColor);
  textSize(width * 0.02); 
  
  textAlign(LEFT, TOP);
  text("Score: " + floor(score), 40, 20);
  text("High: " + highScore, 40, 50);
  
  textAlign(RIGHT, TOP);
  text("Level: " + level, width - 40, 20);
  if (timer < 10) fill(255, 0, 0);
  text("Time: " + timer, width - 40, 50);
}

function drawLives() {
  // NEW: Draws 3 rings at top center
  let iconSize = 25;
  let spacing = 35;
  let startX = (width / 2) - (spacing * (3 - 1) / 2);
  
  for (let i = 0; i < lives; i++) {
    image(ringImg, startX + (i * spacing) - iconSize/2, 25, iconSize, iconSize);
  }
}

function drawGameOverScreen() {
  background(gameOverScreenColor);
  textAlign(CENTER, CENTER);
  fill(endFontColor);
  
  textSize(width * 0.06);
  let win = (tiles.length === 0 && level === 3);
  text(win ? "VICTORY!" : "GAME OVER", width / 2, height / 2 - 80);
  
  textSize(width * 0.03);
  text("Current Score: " + floor(score), width / 2, height / 2);
  text("All-Time High: " + highScore, width / 2, height / 2 + 50);
  
  textSize(width * 0.02);
  text("Press R to Restart", width / 2, height / 2 + 130);
}

function keyPressed() {
  if (gameState === "title" && key === " ") gameState = "play";
  if (gameState === "play" && (key === 'p' || key === 'P')) isPaused = !isPaused;
  if (gameState === "gameover" && (key === 'r' || key === 'R')) {
    score = 0; level = 1; 
    initLevel();
    gameState = "play";
  }
}

function initLevel() {
  duckSpeed = 0;
  isPaused = false;
  ringAttached = true;
  lives = 3; // Reset lives for each level

  let speedMult = 1 + (level - 1) * 0.25; 
  maxDuckSpeed = 14 * speedMult;
  acceleration = 0.9 * speedMult;

  let aspect = duckImg.width / duckImg.height;
  let scaledWidth = baseDuckHeight * aspect;

  duck = { x: width / 2 - scaledWidth / 2, y: height - baseDuckHeight - 40, w: scaledWidth, h: baseDuckHeight };
  ring = { x: width / 2, y: duck.y - baseRingSize/2, size: baseRingSize, r: baseRingSize / 2, vx: 0, vy: 0 }; 
  
  tiles = [];
  let cols = 22; 
  let spacing = 6;
  let gridTopMargin = 120;
  let maxGridHeight = (height * 0.5) - gridTopMargin;
  let tileSize = (width - (spacing * (cols + 1))) / cols; 
  let rows = floor(maxGridHeight / (tileSize + spacing)); 
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      tiles.push({ x: spacing + i * (tileSize + spacing), y: gridTopMargin + j * (tileSize + spacing), w: tileSize, h: tileSize, color: random(brickColors) });
    }
  }

  let timePerTile = max(1, 4 - level);
  timer = tiles.length * timePerTile;
}

function checkCollisions() {
  if (ring.y + ring.r > duck.y && ring.x > duck.x && ring.x < duck.x + duck.w) {
    if (ring.y < duck.y + duck.h) {
      ring.vy = -abs(ring.vy); 
      ring.y = duck.y - ring.r;
      ring.vx += (ring.x - (duck.x + duck.w / 2)) * 0.15; 
      ring.vx = constrain(ring.vx, -globalMaxSpeed, globalMaxSpeed);
    }
  }
  
  for (let i = tiles.length - 1; i >= 0; i--) {
    let t = tiles[i];
    if (ring.x + ring.r > t.x && ring.x - ring.r < t.x + t.w && 
        ring.y + ring.r > t.y && ring.y - ring.r < t.y + t.h) {
      
      if (abs(ring.x - (t.x + t.w/2)) > abs(ring.y - (t.y + t.h/2))) {
        ring.vx *= -1; 
      } else {
        ring.vy *= -1; 
      }
      
      tiles.splice(i, 1);
      score += 25 * level + (timer * 0.1); 
      break; 
    }
  }
}