let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

// Game
let gameOver = false;

// Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth + 60;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler= {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

// Platform
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

// Physics
let velocityX = 0;
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Character selection
    document.querySelectorAll(".character-btn").forEach(button => {
        button.addEventListener("click", function() {
            const character = this.dataset.character;

            // Load right-facing image
            doodlerRightImg = new Image();
            doodlerRightImg.src = `./Assets/Doodler-${character}-right.png`;

            // Load left-facing image
            doodlerLeftImg = new Image();
            doodlerLeftImg.src = `./Assets/Doodler-${character}-left.png`;

            doodler.img = doodlerRightImg;
        });
    });

    // Background selection
    document.querySelectorAll(".bg-btn").forEach(button => {
        button.addEventListener("click", function() {
            const bgName = this.dataset.bg;
            document.body.style.backgroundImage = `url('./Assets/bg-${bgName}.png')`;
            document.body.style.backgroundSize = "cover";
        });
    });
}


// Load Image
doodlerRightImg = new Image();
doodlerRightImg.src = "./Assets/doodler-right.png";
doodler.img = doodlerRightImg;
doodlerRightImg.onload = function(){
    context.drawImage(doodler.img, doodlerX, doodlerY, doodler.width, doodler.height);
}

doodlerLeftImg = new Image();
doodlerLeftImg.src = "./Assets/doodler-left.png";
platformImg = new Image();
platformImg.src = "./Assets/platform.png";
placePlatform();

requestAnimationFrame(update);
document.addEventListener("keydown", movedoodler);

function update(){
    if(gameOver) return;
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    doodler.x += velocityX;
    if(doodler.x > board.width)
        doodler.x = 0;
    else if (doodler.x + doodler.width < 0)
        doodler.x = boardWidth;

    if(doodler.y <= 50){
        velocityY = gravity*20;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    for( let i = 0; i < platformArray.length ; i++){
        let platform = platformArray[i];
        if(detectCollision(doodler, platform)){
            velocityY = initialVelocityY;
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    if(velocityY < 0 && doodler.y < boardHeight*3/4) {
        for (let i = 0; i < platformArray.length; i++) {
            platformArray[i].y -= initialVelocityY;
        }
    }    

    if (doodler.y > boardHeight) {
        gameOver = true;
        alert("Game Over");
        reload();
    }
    

    while(platformArray.length > 0 && platformArray[0].y >= boardHeight ){
        platformArray.shift();
        newplatform();
    }
}

function reload(){
    let message = "Game Over press space to restart";
    console.log(message);
    document.addEventListener("keydown", function(e){
        if(e.code == "Space")
            location.reload();
    });
}

function movedoodler(e){
    if(e.code =="ArrowRight" || e.code == "keyD" ){
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if( e.code == "ArrowLeft" || e.code =="keyA" ){
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function placePlatform(){
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
    
    for(let i = 0; i < 6 ; i++){
        let randomX = Math.floor(Math.random()* boardWidth*3/4);
        let platform = {
         img : platformImg, 
         x : randomX,
         y : boardHeight- 75*i -150,
         width : platformWidth,
         height : platformHeight
        }
        platformArray.push(platform);
    }
}

function newplatform(){
    let randomX = Math.floor(Math.random()* boardWidth*3/4);
    let platform = {
        img : platformImg, 
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }
    platformArray.push(platform);
}