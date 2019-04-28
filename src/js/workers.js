function giveLife(self) {
    let obj = document.createElement("div");
    let style = obj.style;
    obj.classList.add(self.type);
    obj.setAttribute("data-type",self.type);
    style.top = `${self.position.x}px`;
    style.left = `${self.position.y}px`;
    style.height = `${self.shape.y}px`;
    style.width = `${self.shape.x}px`;

    document.getElementById("env_container").appendChild(obj);

    return obj;
}


function isCollided(self,target) {
    if(target!==self){
        let selfC = formCoordinates(self);
        let targetC = formCoordinates(target);
        if((selfC.right >= targetC.left) && (selfC.left <= targetC.right) && (selfC.bottom >= targetC.top) && (selfC.top <= targetC.bottom)){
            return true;
        }
    }
    return false;
}


function formCoordinates(self){
    let sl = self.position.x;
    let st = self.position.y;

    return {
        left : sl,
        right : sl + self.shape.x,
        top : st,
        bottom : st + self.shape.y
    }
}


function formBricks(patternArray) {
    let container = document.getElementById("brick_container");
    container.style.setProperty("text-align","center");
    container.innerHTML = "";
    let brickArray = [];
    patternArray = patternArray.split("\n");
    let __brickHeight = envMaxX * 0.01;
    let __brickWidth = envMaxX * 0.05;
    __brickHeight = (__brickHeight<10) ? 10 : __brickHeight;

    for(let i=0;i<patternArray.length;i++){
        let row = patternArray[i].split("");
        for(let j=0;j<row.length;j++){
            let brick = document.createElement("div");
            brick.style.setProperty("width",`${__brickWidth}px`);
            brick.style.setProperty("height",`${__brickHeight}px`);
            let type = "brick";
            if(row[j] === " ")
                type = "brick-invisible";
            else{
                if(Math.random() > 0.9){
                    type = `${brickPowers[Math.floor(Math.random() * brickPowers.length)]}`;
                }
            }

            brick.classList.add(type);
            brick.setAttribute("data-type",type);
            container.appendChild(brick);
            brickArray.push(brick);
        }
        container.appendChild(document.createElement("br"));
    }


    for(let i=0;i<brickArray.length;i++){
        let prop = brickArray[i].getClientRects()[0];
        let type = brickArray[i].getAttribute("data-type");
        if(type==="brick" || brickPowers.indexOf(type) >=0 ){
            let __brick = new Participant(type,prop.left,prop.top,prop.width,prop.height,0,0,(type==="brick" || brickPowers.indexOf(type) >=0 ),brickArray[i]);
            // __brick.updateCollisionSensitive(true);
            __brick.onCollide = target =>{
                if(target.type === "ball" && !__brick.self.classList.contains("brick-destroy")){
                    destroyObjects(__brick);
                }
            }
        }
    }

    for(let i=0;i<brickArray.length;i++)
        brickArray[i].style.position = "absolute";

    for(let i=0;i<brickArray.length;i++)
        if(brickArray[i].classList.contains("brick-invisible")){
            brickArray[i].remove();
        }

    container.style.removeProperty("text-align");
}


function destroyObjects(target,producePow=true) {
    if(target.type === "brick" || brickPowers.indexOf(target.type) >= 0){
        target.self.classList.add("brick-destroy");
        target.updateAliveStatus(false);
        if(producePow)
            producePower(target);

        setTimeout(()=>{
            removeParticipant(target);
        },100);
    }
}

function removeParticipant(target) {
    target.self.remove();
    __garbageCollect(target,false);
}

function __garbageCollect(target,flush=true) {
    if(!this.garbageBag){
        this.garbageBag = [];
    }

    if(!flush){
        this.garbageBag.push(target);
        target.updateAliveStatus(false);
    }
    else{
        for(let i=0;i<this.garbageBag.length;i++){
            let index = participantArray.indexOf(this.garbageBag[i]);
            if(index>=0)
                participantArray.splice(index,1);
        }
        this.garbageBag = [];
    }
}

function removeAllPower(target) {
    let cl = target.self.classList;
    let __cl = [];
    for(let i=0;i<cl.length;i++)
        if(cl[i].startsWith("ball-"))
            __cl.push(cl[i]);

    for(let i=0;i<__cl.length;i++)
        cl.remove(__cl[i]);
}

function producePower(target) {
    let __powerRadius = (envMaxX * 0.02);
    __powerRadius = __powerRadius >= 20 ? __powerRadius : 20;
    let __power = target.type.split("-");
    if(__power.length>1){
        let participant = null;
        switch (__power[1]){
            case "fireball":
                participant = new Participant(`power-${__power[1]}`,target.position.x + (target.shape.x/2),target.position.y,__powerRadius,__powerRadius,0,2,false);
                let fingerPrint = getNewFingerPrint();
                participant.onCollide = target => {
                    if(target.type === "paddle" || (formCoordinates(participant).bottom >= envMaxY)){
                        if(target.type === "paddle"){
                            removeAllPower(__mainball);
                            participantArray.forEach(part=>{
                                if(part.type === "ball"){
                                    part.setMode(__power[1]);
                                    part.self.classList.add(`ball-${__power[1]}`);
                                    setTimeout(()=>{
                                        if(getNewFingerPrint(false) === fingerPrint){
                                            part.setMode(null);
                                            part.self.classList.remove(`ball-${__power[1]}`);
                                        }
                                    },10000);
                                }
                            });
                        }
                        removeParticipant(participant);
                    }
                };
                break;
            case "rowblast":
                let __participantCopy = participantArray.concat([]);
                for(let i=0;i<__participantCopy.length;i++)
                    if((target.position.y === __participantCopy[i].position.y) && __participantCopy[i].type.startsWith("brick")){
                        __participantCopy[i].self.classList.add("power-rowblast");
                        __participantCopy[i].onCollide({type:"ball"});
                    }
                break;
        }

        if(participant !== null){
            participant.updateCollisionSensitive(true);
        }
    }
}

function getNewFingerPrint(newCount=true){
    if(!this.count){
        this.count = 0;
    }

    if(newCount)
        this.count++;
    return this.count;
}


function moveNextLevel() {
    if(__brickPattern.length > __level){
        __level++;
        // __mainball.position = new Vector(paddle.position.x,paddle.position.y-__mainballRadius-1);
        formBricks(__brickPattern[__level]);
    }
}