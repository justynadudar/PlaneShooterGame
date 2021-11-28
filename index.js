let app;
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
let player;
let playerScore = 10;
let playerScoreObject;
let keys = {};
let keysDiv;
let bullets = [];
let bulletSpeed = 10;
let isFire = false;
let isHere = false;
let numberOfEnemies = 3;
let enemies = [];
let enemySpeed = 3;
  
window.onload = function () {
    app = new PIXI.Application(
        {
            width: appWidth,
            height: appHeight
        }
    );
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
}

function gameLoop(delta){
    updateBg();
    keyHandler();
    updateBullet();
    updateEnemy();
    updateScore();
    updatePlayer();
}

function initLevel(){
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    bg2 = createBg(app.loader.resources["bg2"].texture);
    bgDownGrey = createBg(app.loader.resources["bgDownGrey"].texture);
    bg1 = createBg(app.loader.resources["bg1"].texture);
    createPlayerSheet();
    createPinkEnemySheet();
    createGreenEnemySheet();
    plane1 = createPlayer(app.loader.resources["plane1"].texture);
    bgDownWhite = createBg(app.loader.resources["bgDownWhite"].texture);
    playerScoreObject = createText();
   
    // keybord event handlers
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    app.ticker.add(gameLoop);
}

function createPlayerSheet(){
    planeSheet["flying"] = [
        new PIXI.Sprite.from("images/Plane/Fly (1).png").texture,
        new PIXI.Sprite.from("images/Plane/Fly (2).png").texture
    ];
} 

function createPinkEnemySheet(){
    pinkEnemySheet["flying"] = [
        new PIXI.Sprite.from("images/Enemy/pinkEnemy/fly/frame-1.png").texture,
        new PIXI.Sprite.from("images/Enemy/pinkEnemy/fly/frame-2.png").texture
    ];

    pinkEnemySheet["gotHit"] = [
        new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-1.png").texture,
        new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-2.png").texture
    ];

    pinkEnemySheet["dead"] = [
        new PIXI.Sprite.from("images/Enemy/pinkEnemy/got hit/frame-3.png").texture
    ];

} 

function createGreenEnemySheet(){
    greenEnemySheet["flying"] = [
        new PIXI.Sprite.from("images/Enemy/greenEnemy/fly/frame-1.png").texture,
        new PIXI.Sprite.from("images/Enemy/greenEnemy/fly/frame-2.png").texture
    ];

    greenEnemySheet['gotHit'] = [
        new PIXI.Sprite.from("images/Enemy/greenEnemy/got hit/frame-1.png").texture,
        new PIXI.Sprite.from("images/Enemy/greenEnemy/got hit/frame-2.png").texture
    ]
}

function createPlayer(texture){
    player = new PIXI.AnimatedSprite(planeSheet.flying);
    player.anchor.set(0.5);
    player.animationSpeed = .3;
    player.x = appWidth / 8;
    player.y = appHeight / 1.5;
    player.scale.set(0.25, 0.25);
    app.stage.addChild(player);
    player.play();

}

function createBg(texture){
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position.set(0,0);
    app.stage.addChild(tiling);

    return tiling;
}

function createBullet(){
    let bullet = new PIXI.Sprite.from("images/Bullet/Bullet (1).png");
    bullet.anchor.set(0.5);
    bullet.x = player.x + player.width/4;
    bullet.y = player.y + player.height/4;
    bullet.speed = bulletSpeed;
    bullet.scale.set(0.25, 0.25);
    app.stage.addChild(bullet);

    return bullet;
}

function createEnemy(option){
    if(option == 1) return createPinkEnemy();
    if(option == 2) return createGreenEnemy();
}

function createPinkEnemy(){
    let pinkEnemy = new PIXI.AnimatedSprite(pinkEnemySheet.flying);
    pinkEnemy.sheet = pinkEnemySheet;
    pinkEnemy.isHit = false;
    pinkEnemy.anchor.set(0.5);
    pinkEnemy.animationSpeed = 0.1;
    pinkEnemy.loop = true;
    pinkEnemy.x = appWidth + 100;
    pinkEnemy.y = Math.floor(Math.random() * (appHeight/1.4)) + 75;
    pinkEnemy.scale.set(0.35, 0.35);
    pinkEnemy.speed = enemySpeed;
    pinkEnemy.life = 3;
    pinkEnemy.color = 'pink';
    app.stage.addChild(pinkEnemy);
    pinkEnemy.play();
    return pinkEnemy;
}

function createGreenEnemy(){
    let greenEnemy = new PIXI.AnimatedSprite(greenEnemySheet.flying);
    greenEnemy.sheet = greenEnemySheet;
    greenEnemy.isHit = false;
    greenEnemy.anchor.set(0.5);
    greenEnemy.animationSpeed = .15;
    greenEnemy.x = appWidth + 100;
    greenEnemy.y = Math.floor(Math.random() * (appHeight/1.4)) + 75;
    greenEnemy.scale.set(0.35, 0.35);
    greenEnemy.speed = enemySpeed + 1;
    greenEnemy.life = 5;
    greenEnemy.color = 'green';
    app.stage.addChild(greenEnemy);
    greenEnemy.play();
    return greenEnemy;
}

function createText(){
    let scoreText =  new PIXI.Text('Score: ');
    scoreText.anchor.set(0.5);
    scoreText.x = 50;
    scoreText.y = appHeight - 40;
    app.stage.addChild(scoreText);
    scoreText.style = new PIXI.TextStyle({
        fill: 0x350000,
        fontSize: 21,
        fontFamily: 'Addis',
    });

    let text = new PIXI.Text(playerScore);
    text.anchor.set(0.5);
    text.x = 50;
    text.y = appHeight - 15;
    app.stage.addChild(text);
    text.style = new PIXI.TextStyle({
        fill: 0x350000,
        fontSize: 18,
        fontFamily: 'Addis',
    });

    return text;
}

function updateBg(){
    bgX = (bgX - bgSpeed);
    bg1.tilePosition.x = bgX;
    bg2.tilePosition.x = bgX / 3;
    bgDownWhite.tilePosition.x = bgX / 5;
    bgDownGrey.tilePosition.x = bgX / 7 - 200;
}

function updatePlayer(){
    if(player.dead){
        app.stage.removeChild(player);
    }
}

function updateBullet(){
    for(let i = 0; i < bullets.length; i++){
        bullets[i].position.x += bullets[i].speed;

        // bullet is off-screen
        if(bullets[i].position.x > 800){
            bullets[i].dead = true;
        }

        collisionWithBullet(bullets[i]);
    }

    // remove bullet from stage and bullets[]
    for(let i = 0; i < bullets.length; i++){
        if(bullets[i].dead){
            app.stage.removeChild(bullets[i]);
            bullets.splice(i, 1);
        }
    }
}

function updateEnemy(){
    if(enemies.length < numberOfEnemies  && !isHere) {
        isHere = true;
        setTimeout(()=>{
            let enemy = createEnemy(Math.floor(Math.random() * 2) + 1);
            enemies.push(enemy);
            isHere = false;
        }, 2000)
    }
    

    for(let i = 0; i < enemies.length; i++){
        enemies[i].position.x -= enemies[i].speed;

        //enemy got hit
        if(enemies[i].isHit){
            enemies[i].isHit = false;
            setTimeout(()=>{
                enemies[i].textures = enemies[i].sheet.flying;
                enemies[i].play();
            }, 500)
        }

        // enemy is off-screen
        if(enemies[i].position.x < -enemies[i].width){
            enemies[i].dead = true;
        }

        //collision detection
        collision(enemies[i])
    }

    // remove enemy
    for(let i = 0; i < enemies.length; i++){
        if(enemies[i].dead){
            app.stage.removeChild(enemies[i]);
            enemies.splice(i, 1);
        }
        if(enemies[i].life < 0){
            enemies[i].textures = enemies[i].sheet.dead;
            enemies[i].play();
            playerScore += 10;
            fallEnemy(enemies[i], i);
           
        }
    }
}

function fallEnemy(enemy, i){
    enemy.y += 6;
    enemy.rotate = 2;
    if(enemy.y > appHeight){
        app.stage.removeChild(enemy);
        enemies.splice(i, 1);
    }

}

function updateScore(){
    playerScoreObject.text = playerScore;
}

function keyDown (e) {
    keys[e.keyCode] = true;
}

function keyUp (e) {
    keys[e.keyCode] = false;
}

function keyHandler(){
    if(keys["40"]){
        if((player.y + player.height/2) <= 600 - 5){
            player.y += 5;
        }
    }
    if(keys["38"]){
        if((player.y - player.height/2) > 0 + 5){
            player.y -= 5;
        }
    }
    if(keys["32"] && !isFire && playerScore > 0){
        isFire = true;
        setTimeout(()=>{
            let bullet = createBullet();
            playerScore -= 2;
            bullets.push(bullet);
            isFire = false;
        }, 200)
    }
}

function collision(enemy){
    //player dead
    if(enemy.life > 0 && (player.position.x + player.width/2) >= (enemy.position.x - enemy.width/2) &&
        ((player.position.y - player.height/2) <= (enemy.position.y + enemy.height/2) &&
        (player.position.y + player.height/2) >= (enemy.position.y - enemy.height/2))){
            player.dead = true;
    }
    

}

function collisionWithBullet(bullet){
    for(let i = 0; i < enemies.length; i++){
        if((bullet.position.x + bullet.width/2) >= (enemies[i].position.x) &&
    ((bullet.position.y - bullet.height/2) <= (enemies[i].position.y + enemies[i].height/2) &&
    (bullet.position.y + bullet.height/2) >= (enemies[i].position.y - enemies[i].height/2))){
        enemies[i].textures = enemies[i].sheet.gotHit;
        enemies[i].play();
        enemies[i].isHit = true;
        enemies[i].life -= 1;
        bullet.dead = true;
        }
    }
    
}