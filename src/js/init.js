let envMaxX = window.innerWidth;
let envMaxY = window.innerHeight;

let participantArray = [];
let brickPowers = ["brick-fireball","brick-rowblast"];

let __brickPattern = ["     ##     \n     ##     \n###########\n#         #\n#  ## ##  #\n#         #\n#    #    #\n# #     # #\n#  #####  #\n#         #\n###########",
"########\n########\n########"];
let __level = -1;

let __paddleWidth = envMaxX * 0.1;
__paddleWidth = (__paddleWidth < 85) ? 85 : __paddleWidth;

let __paddleHeight = envMaxY * 0.02;
let paddle = new Paddle(envMaxX/2,envMaxY-__paddleHeight,__paddleWidth,__paddleHeight,document.getElementById("paddle"));
paddle.update();

//Walls on four side
let wallWidth = 0.01;
new Participant("wall",0,0,wallWidth,envMaxY); //left
new Participant("wall",0,0,envMaxX,wallWidth); //top
new Participant("wall",envMaxX-wallWidth,0,wallWidth,envMaxY); //right
new Participant("wall",0,envMaxY-wallWidth,envMaxX,wallWidth); //bottom

//Ball
let __mainballRadius = envMaxX * 0.01;
__mainballRadius = __mainballRadius > 10 ? __mainballRadius : 10;

let __mainball = new Participant("ball",paddle.position.x,paddle.position.y-__mainballRadius-1,__mainballRadius,__mainballRadius);

__mainball.onCollide = target => {
    if(!target.isSolid || (__mainball.mode === "fireball" && target.type.startsWith("brick"))){
        return;
    }

    __mainball.position = __mainball.previousPosition.clone();

    if(target.considerMultiPartDeflect){
        __mainball.angle = Math.abs(__mainball.position.x - target.position.x) / (target.shape.x/180);
    }
    else if(__mainball.angle){
        let targetC = formCoordinates(target);
        let selfC = formCoordinates(__mainball);

        //Bottom
        if(targetC.bottom <= selfC.top){
            let polarity = (__mainball.angle >=90 && __mainball.angle <= 180) ? -1 : 1;
            __mainball.angle = 270 + ( polarity * Math.abs(__mainball.angle - 90) );
        }
        //Right
        else if(targetC.left >= selfC.right){
            if(__mainball.angle >=180 && __mainball.angle <= 270){
                __mainball.angle = 360 - (__mainball.angle-180);
            }else{
                __mainball.angle = 180 - __mainball.angle;
            }
        }
        //Left
        else if(targetC.right <= selfC.left){
            if(__mainball.angle >=0 && __mainball.angle <= 90){
                __mainball.angle = 180 - __mainball.angle;
            }else{
                __mainball.angle = 180 + (360 - __mainball.angle);
            }
        }
        //top
        else if(targetC.top >= selfC.bottom){
            let polarity = (__mainball.angle >=180 && __mainball.angle <= 270) ? 1 : -1;
            __mainball.angle = 90 + ( polarity * Math.abs(__mainball.angle - 270) );
        }
    }
};

__mainball.updateCollisionSensitive(true);
__mainball.setSpeed(5);
__mainball.setAngle(90);

paddle.move((envMaxX/2) - (paddle.shape.x/2));

window.document.onmousemove = event => {
    paddle.move(event.clientX);
    paddle.update();
};

window.document.ontouchmove = event => {
    paddle.move(event.touches[0].clientX);
    paddle.update();
};

moveNextLevel();