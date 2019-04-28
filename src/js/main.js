setInterval(()=>{
    try {
        let participantLen = participantArray.length;
        let is_won = true;
        for(let i=0;i<participantLen;i++){
            if(participantArray[i].isAlive){
                participantArray[i].update();
                if(participantArray[i].type.startsWith("brick"))
                    is_won = false;

                for(let j=i+1;j<participantLen;j++){
                    if(participantArray[j].isAlive){
                        if(isCollided(participantArray[i],participantArray[j])){
                            if(participantArray[i].collisionSensitive || participantArray[j].collisionSensitive){
                                participantArray[i].onCollide(participantArray[j]);
                                participantArray[j].onCollide(participantArray[i]);
                            }
                        }
                    }
                }
            }
        }
        __garbageCollect();

        if(is_won)
            moveNextLevel();
    }catch (e) {
        debugger;
    }
},10);