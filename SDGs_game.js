// board的變數
let board;
let boardwidth = 1000;// 320
let boardheight = 562;// 640
let context;
// 主角變數
let birdwidth = 51;// 34 51
let birdheight = 36;// 24 36
let birdx = boardwidth / 8;
let birdy = boardheight / 2;
let birdImg;

let bird = {
    x : birdx, y : birdy, width : birdwidth, height : birdheight
}

let hbwidth = 300;
let hbheight = 30;
let hbx = boardwidth / 16;
let hby = boardheight / 32;
let hbImg;

let hb = {
    x : hbx, y : hby, width : hbwidth, height : hbheight
}

// 水管變數
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;

let toppipeImg;
let bottompipeImg;

// 水管向左飄移速度
let velocityx = -2;

// 鳥的跳動速度
let velocityy = 0;

let gravity = 0.4;

let gameover = false;

let hp = 10;
let Invincibletime = false;// 受擊保護時間判定

let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardwidth;
    board.height = boardheight;
    context = board.getContext("2d");// 決定繪圖方式

    // 畫出主角
    // 加入照片的部分在11:02
    //context.fillStyle = "yellow";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);
    hbImg = new Image(); 
    hbImg.src = "./hb.png";// 照片之後加  
    hbImg.onload = function(){
        context.drawImage(hbImg, hb.x, hb.y, hb.width, hb.height);
    }

    birdImg = new Image();
    birdImg.src = "./OceanGate.png";// 照片之後加
    //birdImg.src = "./icegif-813.gif"
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    toppipeImg = new Image();
    toppipeImg.src = "./top_pipe.png";// 照片之後加

    bottompipeImg = new Image();
    bottompipeImg.src = "./bottom_pipe.png";

    requestAnimationFrame(update);
    setInterval(placepipes, 1500);// 每1.5秒放一根水管
    document.addEventListener("keydown", movebird);
}

function update() {
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    

    // 主角
    velocityy += gravity;
    //bird.y += velocityy;
    bird.y = Math.max(bird.y + velocityy, 0);// 0是畫布的最頂端
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);// birdImg

    // 掉下去直接死
    if(bird.y > board.height){
        hp = 0;
        //Invincibletime = true;
        if(hp == 0){
            gameover = true;
        }
    }

    // 水管
    for(let i = 0; i < pipearray.length; i++){
        let pipe = pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);// pipe.img

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            Invincibletime = false;// 用一個水管滑過的時間來定義受擊保護時間的時長
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe) && Invincibletime == false){
            hp--;
            hb.width -= 30;// 用hbwidth不行
            Invincibletime = true;
            if(hp == 0){
                gameover = true;
            }
        }
    }

    // 清除陣列中已經滑出board外的水管
    while(pipearray.length > 0 && pipearray[0].x < -pipewidth){
        pipearray.shift();
    }

    // hb的背景，還附帶空血槽功能，酷
    context.fillStyle = "DarkRed";
    context.fillRect(hb.x - 50, hb.y - 1, hbwidth + 51, hbheight + 2);
    // hb
    context.drawImage(hbImg, hb.x, hb.y, hb.width, hb.height);

    context.fillStyle = "White";
    context.font = "30px sans-serif";
    context.fillText("HP|", 15, 44);

    // 分數
    context.fillStyle = "Black";
    context.font = "40px sans-serif";
    //context.fillText(score, 10, 50);// 分數、離board左邊的距離、離board上方邊邊的距離

    context.fillStyle = "Black";
    context.font = "40px sans-serif";
    //context.fillText(hp, 50, 100);

    if(gameover){
        context.fillStyle = "Black";
        context.font = "100px sans-serif";
        context.fillText("GAME OVER :(", 160, 320);
    }
}

function placepipes() {
    if(gameover){
        return;
    }

    let randompipey = pipey - pipeheight / 4 - Math.random()*(pipeheight / 2);
    let openingspace = board.height / 4;

    let toppipe = {
        img : toppipeImg,
        x : pipex, 
        y : randompipey, 
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(toppipe);

    let bottompipe = {
        img : bottompipeImg,
        x : pipex, 
        y : randompipey + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }

    pipearray.push(bottompipe);
}

function movebird(e){
    if(e.code == "Space" || e.code == "ArrowUp"){
        // 鳥的y軸為零，往上是負往下為正
        velocityy = -6;

        if(gameover){
            bird.y = birdy;
            pipearray = [];
            score = 0;
            gameover = false;
            hp = 10;
            hb.width = 300;
        }
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && a.x + a.width > b.x
        && a.y < b.y + b.height && a.y + a.height > b.y;
}