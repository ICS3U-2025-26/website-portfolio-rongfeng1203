let gameState = "title";
let duck, ring;
let tiles = [];
let score = 0;
let highScore = 0;
let timer = 0; 
let level = 1;
let lives = 3; 
let isPaused = false;
let ringAttached = true; 

// --- ADJUSTABLE SETTINGS ---
let baseRingSpeed = 6;       // Increased slightly for "Medium" default feel
let globalMaxSpeed = 12;      
let baseDuckHeight = 65;     // Maintained per request
let baseRingSize = 55;       // Maintained per request

// Speed Setting Logic
let currentSpeedSetting = "Medium";
const speedConfigs = {
  "Slow": { ring: 5, duckMax: 20, accel: 1.5 },
  "Medium": { ring: 5.5, duckMax: 23, accel: 1.7 },
  "Fast": { ring: 8, duckMax: 25, accel: 2.3 }
};

let titleScreenColor = [65, 207, 209]; 
let gameOverScreenColor = [232, 92, 37];
let titleFontColor = [255, 251, 171]; 
let endFontColor = [255, 200, 0];    

let gameplayBGColor = [168, 247, 234];
let hudFontColor = [142, 102, 222];
let brickColors = [[106, 199, 230], [113, 229, 235], [108, 176, 224], [114, 147, 219]];

let duckSpeed = 0;
let maxDuckSpeed = 20; 
let acceleration = 2;

let duckImg, ringImg, myFont, breakSound;

function preload() {
  duckImg = loadImage('Assets/duck.png');
  ringImg = loadImage('Assets/ring.png');
  myFont = loadFont('Assets/Font.ttf');
  breakSound = loadSound('Assets/SFX.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  let savedScore = localStorage.getItem("duckBreakerHighScore");
  if (savedScore !== null) highScore = parseInt(savedScore);
  applySpeedSettings();
  initLevel(); 
}

function applySpeedSettings() {
  let config = speedConfigs[currentSpeedSetting];
  baseRingSpeed = config.ring;
  maxDuckSpeed = config.duckMax;
  acceleration = config.accel;
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
  drawLives();

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
    drawPauseMenu();
    return;
  }

  if (frameCount % 60 === 0 && timer > 0) timer--;
  if (timer <= 0) handleGameOver();

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
    if (ring.y > height) {
      lives--;
      if (lives > 0) ringAttached = true;
      else handleGameOver();
    }
  }
  
  if (tiles.length === 0) {
    if (level < 3) { level++; initLevel(); } 
    else handleGameOver();
  }
}

function drawPauseMenu() {
  fill(0, 150);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(width * 0.05);
  text("PAUSED", width / 2, height * 0.35);
  
  textSize(width * 0.02);
  text("CHOOSE SPEED:", width / 2, height * 0.45);
  
  let options = ["Slow", "Medium", "Fast"];
  for (let i = 0; i < options.length; i++) {
    if (options[i] === currentSpeedSetting) fill(255, 255, 0); // Highlight current
    else fill(200);
    text("[" + (i+1) + "] " + options[i], width / 2, height * 0.52 + (i * 40));
  }
  fill(255);
  text("Press 'P' to Resume", width / 2, height * 0.75);
}

function keyPressed() {
  if (gameState === "title" && key === " ") gameState = "play";
  
  if (gameState === "play") {
    if (key === 'p' || key === 'P') isPaused = !isPaused;
    
    // Speed Selection while paused
    if (isPaused) {
      if (key === '1') { currentSpeedSetting = "Slow"; applySpeedSettings(); }
      if (key === '2') { currentSpeedSetting = "Medium"; applySpeedSettings(); }
      if (key === '3') { currentSpeedSetting = "Fast"; applySpeedSettings(); }
    }
  }
  
  if (gameState === "gameover" && (key === 'r' || key === 'R')) {
    score = 0; level = 1; 
    initLevel();
    gameState = "play";
  }
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
      
      if (abs(ring.x - (t.x + t.w/2)) > abs(ring.y - (t.y + t.h/2))) ring.vx *= -1; 
      else ring.vy *= -1; 
      
      // PLAY SOUND ON BREAK
      if (breakSound.isLoaded()) breakSound.play();
      
      tiles.splice(i, 1);
      score += 25 * level + (timer * 0.1); 
      break; 
    }
  }
}

function initLevel() {
  duckSpeed = 0;
  isPaused = false;
  ringAttached = true;
  lives = 3;
  applySpeedSettings();

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
  timer = tiles.length * max(1, 4 - level);
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

// Prevent Space and arrow keys from scrolling the page
window.addEventListener("keydown", function(e) {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
    e.preventDefault();
  }
}, false);
