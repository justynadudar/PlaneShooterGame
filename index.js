let app;
let bgBack;
let bg1;
let bg2;
let bgDownWhite;
let bgDownGrey;
let bgX = 0;
let bgSpeed = 1;
let plane1;
let planeSheet = {};
let player;
let keys = {};
let keysDiv;

window.onload = function () {
    app = new PIXI.Application(
        {
            width: 800,
            height: 600
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
    

    // keybord event handlers
    //keyDown code 40
    window.addEventListener("keydown", keyDown);
    //keyDown code 38
    window.addEventListener("keyup", keyUp);

}

function gameLoop(delta){
    updateBg();
    keyHendler();
}

function initLevel(){
    bgBack = createBg(app.loader.resources["bgBack"].texture);
    bg2 = createBg(app.loader.resources["bg2"].texture);
    
    bgDownGrey = createBg(app.loader.resources["bgDownGrey"].texture);
    
    plane1 = createPlayer(app.loader.resources["plane1"].texture);
    bg1 = createBg(app.loader.resources["bg1"].texture);
    bgDownWhite = createBg(app.loader.resources["bgDownWhite"].texture);
    
    app.ticker.add(gameLoop);
}

function createPlayer(texture){
    player = new PIXI.Sprite.from(texture);
    player.anchor.set(0.5);
    player.x = app.view.width / 8;
    player.y = app.view.height / 1.5;
    player.scale.set(0.25, 0.25);
    console.log(player);

    app.stage.addChild(player);

}

function createBg(texture){
    let tiling = new PIXI.TilingSprite(texture, 800, 600);
    tiling.position.set(0,0);
    app.stage.addChild(tiling);

    return tiling;
}

function updateBg(){
    bgX = (bgX - bgSpeed);
    bg1.tilePosition.x = bgX;
    bg2.tilePosition.x = bgX / 3;
    bgDownWhite.tilePosition.x = bgX / 5;
    bgDownGrey.tilePosition.x = bgX / 7 - 200;
}

function keyDown (e) {
    keys[e.keyCode] = true;
}
function keyUp (e) {
    keys[e.keyCode] = false;
}

function keyHendler(){
    if(keys["40"]){
        player.y += 5;
    }
    if(keys["38"]){
        player.y -= 5;
    }
}




