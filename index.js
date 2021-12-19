let app;
let titleScreen;
let mainScreen;
let endScreen;
let playButton;
let appWidth = 800;
let appHeight = 600;
let bgBack;
let bg1;
let bg2;
let bgDownWhite;
let bgDownGrey;
let bgX = 0;
let bgSpeed = 1;
let plane1;
let planeSheet = {};
let pinkEnemySheet = {};
let greenEnemySheet = {};
let featherSheet = {};
let player;
let startPlayerScore = 10;
let playerScoreObject;
let numberOfLifes = 3;
let hearts = [];
let keys = {};
let keysDiv;
let bullets = [];
let bulletSpeed = 10;
let isFire = false;
let isHereEnemy = false;
let isHereFeather = false;
let numberOfEnemies = 3;
let enemies = [];
let enemySpeed = 1;
let feathers = [];
let featherIterator = 0;

window.onload = function () {
  app = new PIXI.Application({
    width: appWidth,
    height: appHeight,
  });
  document.getElementById("gameDiv").appendChild(app.view);

  app.loader
    .add("plane1", "images/Plane/Fly (1).png")
    .add("bgBack", "images/bg_back.png")
    .add("bg1", "images/bg_1.png")
    .add("bg2", "images/bg_2.png")
    .add("bgDownWhite", "images/bg_down_white.png")
    .add("bgDownGrey", "images/bg_down_grey.png");
  app.loader.onComplete.add(initLevel);
  app.loader.load();

  titleScreen = new PIXI.Container();
  mainScreen = new PIXI.Container();
  endScreen = new PIXI.Container();
  createTitleScreen();
};

function createTitleScreen() {
  titleScreen.visible = true;
  mainScreen.visible = false;
  endScreen.visible = false;

  let button = new PIXI.Sprite.from("images/playButton.png");
  button.anchor.set(0.5);
  button.x = appWidth / 2;
  button.y = appHeight / 2.5;
  button.scale.set(2, 2);
  button.interactive = true;
  button.buttonMode = true;
  button.defaultCursor = "pointer";
  titleScreen.addChild(button);

  button.on("click", () => {
    createMainScreen();
  });
}

function createMainScreen() {
  titleScreen.visible = false;
  mainScreen.visible = true;
  endScreen.visible = false;

  createPlayerSheet();
  createPinkEnemySheet();
  createGreenEnemySheet();
  createFeatherSheet();
  createPlayer();
  if (playerScoreObject == null) playerScoreObject = createText();
  createHearts();

  // keybord event handlers
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);

  app.ticker.add(gameLoop);
}

function createEndScreen() {
  titleScreen.visible = false;
  mainScreen.visible = false;
  endScreen.visible = true;

  let loseElement = new PIXI.Sprite.from("images/youLose.png");
  loseElement.anchor.set(0.5);
  loseElement.x = appWidth / 2;
  loseElement.y = appHeight / 2.5;
  loseElement.scale.set(1, 1);
  endScreen.addChild(loseElement);

  let playAgainButton = new PIXI.Sprite.from("images/playAgain.png");
  playAgainButton.anchor.set(0.5);
  playAgainButton.x = appWidth / 2;
  playAgainButton.y = appHeight / 1.5;
  playAgainButton.scale.set(0.8, 0.8);
  playAgainButton.interactive = true;
  playAgainButton.buttonMode = true;
  playAgainButton.defaultCursor = "pointer";
  endScreen.addChild(playAgainButton);

  playAgainButton.on("click", () => {
    // remove enemy
    for (let i = 0; i < enemies.length; i++) {
      mainScreen.removeChild(enemies[i]);
      enemies.splice(i, 1);
    }
    createMainScreen();
  });
}

function gameLoop(delta) {
  updateBg();
  if (mainScreen.visible == true) {
    keyHandler();
    updateBullet();
    updateHearts();
    updateEnemy();
    updateScore();
    updateFeather();
    updatePlayer();
  }
}

function initLevel() {
  bgBack = createBg(app.loader.resources["bgBack"].texture);
  bg2 = createBg(app.loader.resources["bg2"].texture);
  bgDownGrey = createBg(app.loader.resources["bgDownGrey"].texture);
  bg1 = createBg(app.loader.resources["bg1"].texture);
  bgDownWhite = createBg(app.loader.resources["bgDownWhite"].texture);

  app.stage.addChild(titleScreen);
  app.stage.addChild(mainScreen);
  app.stage.addChild(endScreen);

  app.ticker.add(gameLoop);
}

function createPlayerSheet() {
  planeSheet["flying"] = [
    new PIXI.Sprite.from("images/Plane/Fly (1).png").texture,
    new PIXI.Sprite.from("images/Plane/Fly (2).png").texture,
  ];

  planeSheet["dead"] = [
    new PIXI.Sprite.from("images/Plane/Dead (1).png").texture,
  ];
}

function createPinkEnemySheet() {
  pinkEnemySheet["flying"] = [
    new PIXI.Sprite.from("images/Enemy/pinkEnemy/fly/frame-1.png").texture,
    new PIXI.Sprite.from("images/Enemy/pinkEnemy/fly/frame-2.png").texture,
  ];

  pinkEnemySheet["gotHit"] = [
    new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-1.png").texture,
    new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-2.png").texture,
  ];

  pinkEnemySheet["dead"] = [
    new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-3.png").texture,
  ];
}

function createGreenEnemySheet() {
  greenEnemySheet["flying"] = [
    new PIXI.Sprite.from("images/Enemy/greenEnemy/fly/frame-1.png").texture,
    new PIXI.Sprite.from("images/Enemy/greenEnemy/fly/frame-2.png").texture,
  ];

  greenEnemySheet["gotHit"] = [
    new PIXI.Sprite.from("images/Enemy/greenEnemy/got hit/frame-1.png").texture,
    new PIXI.Sprite.from("images/Enemy/greenEnemy/got hit/frame-2.png").texture,
  ];

  greenEnemySheet["dead"] = [
    new PIXI.Sprite.from("images/Enemy/greenEnemy/got hit/frame-3.png").texture,
  ];
}

function createFeatherSheet() {
  featherSheet["flying"] = [
    new PIXI.Sprite.from("images/feather.png").texture,
    new PIXI.Sprite.from("images/feather_right.png").texture,
    new PIXI.Sprite.from("images/feather.png").texture,
    new PIXI.Sprite.from("images/feather_left.png").texture,
  ];
}

function createPlayer() {
  player = new PIXI.AnimatedSprite(planeSheet.flying);
  player.anchor.set(0.5);
  player.animationSpeed = 0.3;
  player.x = appWidth / 8;
  player.y = appHeight / 1.5;
  player.scale.set(0.25, 0.25);
  playerScore = startPlayerScore;
  mainScreen.addChild(player);
  player.play();
}

function createBg(texture) {
  let tiling = new PIXI.TilingSprite(texture, 800, 600);
  tiling.position.set(0, 0);
  app.stage.addChild(tiling);

  return tiling;
}

function createBullet() {
  let bullet = new PIXI.Sprite.from("images/Bullet/Bullet (1).png");
  bullet.anchor.set(0.5);
  bullet.x = player.x + player.width / 4;
  bullet.y = player.y + player.height / 4;
  bullet.speed = bulletSpeed;
  bullet.scale.set(0.25, 0.25);
  mainScreen.addChild(bullet);

  return bullet;
}

function createEnemy(option) {
  if (option <= 9) return createPinkEnemy();
  if (option == 10) return createGreenEnemy();
}

function createPinkEnemy() {
  let pinkEnemy = new PIXI.AnimatedSprite(pinkEnemySheet.flying);
  pinkEnemy.sheet = pinkEnemySheet;
  pinkEnemy.isHit = false;
  pinkEnemy.anchor.set(0.5);
  pinkEnemy.animationSpeed = 0.1;
  pinkEnemy.loop = true;
  pinkEnemy.x = appWidth + 100;
  pinkEnemy.y = Math.floor(Math.random() * (appHeight / 1.4)) + 75;
  pinkEnemy.scale.set(0.35, 0.35);
  pinkEnemy.speed = enemySpeed;
  pinkEnemy.life = 3;
  pinkEnemy.color = "pink";
  mainScreen.addChild(pinkEnemy);
  pinkEnemy.play();
  return pinkEnemy;
}

function createGreenEnemy() {
  let greenEnemy = new PIXI.AnimatedSprite(greenEnemySheet.flying);
  greenEnemy.sheet = greenEnemySheet;
  greenEnemy.isHit = false;
  greenEnemy.anchor.set(0.5);
  greenEnemy.animationSpeed = 0.15;
  greenEnemy.x = appWidth + 100;
  greenEnemy.y = Math.floor(Math.random() * (appHeight / 1.4)) + 75;
  greenEnemy.scale.set(0.35, 0.35);
  greenEnemy.speed = enemySpeed + 1;
  greenEnemy.life = 5;
  greenEnemy.color = "green";
  mainScreen.addChild(greenEnemy);
  greenEnemy.play();
  return greenEnemy;
}

function createText() {
  let scoreText = new PIXI.Text("Score: ");
  scoreText.anchor.set(0.5);
  scoreText.x = 50;
  scoreText.y = appHeight - 40;
  mainScreen.addChild(scoreText);
  scoreText.style = new PIXI.TextStyle({
    fill: 0x350000,
    fontSize: 21,
    fontFamily: "Addis",
  });

  let text = new PIXI.Text(playerScore);
  text.anchor.set(0.5);
  text.x = 50;
  text.y = appHeight - 15;
  mainScreen.addChild(text);
  text.style = new PIXI.TextStyle({
    fill: 0x350000,
    fontSize: 18,
    fontFamily: "Addis",
  });

  return text;
}

function createHearts() {
  for (let i = 0; i < numberOfLifes; i++) {
    let heart = new PIXI.Sprite.from("images/playerHeart.png");
    heart.anchor.set(0.5);
    heart.x = appWidth + 20 - i * 50;
    heart.y = appHeight - 25;
    heart.scale.set(0.4, 0.4);
    hearts[i] = heart;
    mainScreen.addChild(heart);
  }
}

function createFeather() {
  let feather = new PIXI.AnimatedSprite(featherSheet.flying);
  feather.anchor.set(0.5);
  feather.animationSpeed = 0.06;
  feather.x = Math.floor(Math.random() * 500) + 200;
  feather.y = -50;
  feather.dead = false;
  feather.scale.set(0.2, 0.2);
  mainScreen.addChild(feather);
  feather.play();
  return feather;
}

function updateBg() {
  bgX = bgX - bgSpeed;
  bg1.tilePosition.x = bgX;
  bg2.tilePosition.x = bgX / 3;
  bgDownWhite.tilePosition.x = bgX / 5;
  bgDownGrey.tilePosition.x = bgX / 7 - 200;
}

function updatePlayer() {
  if (player.dead) {
    player.y += 1;
  }
  if (player.y - player.height > appHeight) {
    mainScreen.removeChild(player);
    createEndScreen();
  }
}

function updateBullet() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].position.x += bullets[i].speed;

    // bullet is off-screen
    if (bullets[i].position.x > 800) {
      bullets[i].dead = true;
    }

    collisionWithBullet(bullets[i]);
    collisionFeatherWithBullet(bullets[i]);
  }

  // remove bullet from stage and bullets[]
  for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].dead) {
      mainScreen.removeChild(bullets[i]);
      bullets.splice(i, 1);
    }
  }
}

function updateEnemy() {
  if (enemies.length < numberOfEnemies && !isHereEnemy) {
    isHereEnemy = true;
    setTimeout(() => {
      let enemy = createEnemy(Math.floor(Math.random() * 10) + 1);
      enemies.push(enemy);
      isHereEnemy = false;
    }, 2000);
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].position.x -= enemies[i].speed;

    //enemy got hit
    if (enemies[i].isHit) {
      enemies[i].isHit = false;
      setTimeout(() => {
        enemies[i].textures = enemies[i].sheet.flying;
        enemies[i].play();
      }, 300);
    }

    // enemy attack - AI
    if (enemies[i].position.x < appWidth && enemies[i].life > 0) {
      enemies[i].position.y +=
        (player.position.y - enemies[i].position.y) / player.position.y;
    }

    // enemy is off-screen
    if (enemies[i].position.x < -enemies[i].width) {
      enemies[i].dead = true;
    }

    //collision detection
    collision(enemies[i]);
  }

  // remove enemy
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].dead) {
      mainScreen.removeChild(enemies[i]);
      enemies.splice(i, 1);
    } else if (
      enemies[i].life <= 0 &&
      enemies[i].couseOfDeath != 1 &&
      enemies[i].couseOfDeath != 2
    ) {
      if (enemies[i].color == "green") {
        playerScore += 45;
      } else {
        playerScore += 15;
      }

      enemies[i].couseOfDeath = 2;
    } else if (enemies[i].life <= 0) {
      enemies[i].textures = enemies[i].sheet.dead;
      enemies[i].play();
      fallEnemy(enemies[i], i);
    }
  }
}

function updateScore() {
  playerScoreObject.text = playerScore;
}

function updateHearts() {
  if (hearts.length > 0 && hearts[hearts.length - 1].dead) {
    mainScreen.removeChild(hearts[hearts.length - 1]);
    hearts.splice(hearts.length - 1, 1);
  }
}

function updateFeather() {
  if (feathers.length < 1 && !isHereFeather) {
    isHereFeather = true;
    setTimeout(() => {
      let feather = createFeather();
      feathers.push(feather);
      isHereFeather = false;
    }, Math.floor(Math.random() * 4000) + 2000);
  }

  for (let i = 0; i < feathers.length; i++) {
    feathers[0].position.y += 0.5;

    if (feathers[0].isHit) {
      playerScore += 100;
      feathers[0].dead = true;
      feathers[0].isHit = false;
    }

    if (feathers[0].position.y > appHeight) {
      feathers[0].dead = true;
    }

    if (feathers[0].dead) {
      mainScreen.removeChild(feathers[0]);
      feathers.splice(0, 1);
    }
  }
}

function fallEnemy(enemy, i) {
  enemy.y += 6;
  if (enemy.y - enemy.height > appHeight) {
    mainScreen.removeChild(enemy);
    enemies.splice(i, 1);
  }
}

function keyDown(e) {
  keys[e.keyCode] = true;
}

function keyUp(e) {
  keys[e.keyCode] = false;
}

function keyHandler() {
  if (keys["40"]) {
    if (player.y + player.height / 2 <= 600 - 5) {
      player.y += 2;
    }
  }
  if (keys["38"]) {
    if (player.y - player.height / 2 > 0 + 5) {
      player.y -= 2;
    }
  }
  if (keys["32"] && !isFire && playerScore > 0 && !player.dead) {
    isFire = true;
    setTimeout(() => {
      let bullet = createBullet();
      playerScore -= 2;
      bullets.push(bullet);
      isFire = false;
    }, 300);
  }
}

function collision(enemy) {
  if (
    enemy.life > 0 &&
    player.position.x + player.width / 2 >=
      enemy.position.x - enemy.width / 2 &&
    player.position.y - player.height / 4 <=
      enemy.position.y + enemy.height / 2 &&
    player.position.y + player.height / 4 >= enemy.position.y - enemy.height / 2
  ) {
    if (hearts.length == 1) {
      hearts[hearts.length - 1].dead = true;
      player.dead = true;
      player.textures = planeSheet.dead;
      enemy.life = 0;
      enemy.couseOfDeath = 1;
    }
    if (hearts.length > 1) {
      hearts[hearts.length - 1].dead = true;
      enemy.life = 0;
      enemy.couseOfDeath = 1;
    }
  }
}

function collisionWithBullet(bullet) {
  for (let i = 0; i < enemies.length; i++) {
    if (
      bullet.position.x + bullet.width / 2 >= enemies[i].position.x &&
      bullet.position.y - bullet.height / 2 <=
        enemies[i].position.y + enemies[i].height / 2 &&
      bullet.position.y + bullet.height / 2 >=
        enemies[i].position.y - enemies[i].height / 2
    ) {
      enemies[i].textures = enemies[i].sheet.gotHit;
      enemies[i].play();
      enemies[i].isHit = true;
      enemies[i].life -= 1;
      bullet.dead = true;
    }
  }
}

function collisionFeatherWithBullet(bullet) {
  for (let i = 0; i < feathers.length; i++) {
    if (
      bullet.position.x + bullet.width / 2 >= feathers[0].position.x &&
      bullet.position.y - bullet.height / 2 <=
        feathers[0].position.y + feathers[0].height / 2 &&
      bullet.position.y + bullet.height / 2 >=
        feathers[0].position.y - feathers[0].height / 2
    ) {
      feathers[0].isHit = true;
      bullet.dead = true;
    }
  }
}
