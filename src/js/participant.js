class Participant{
    constructor(type,posX,posY,sizeX,sizeY,velX=0,velY=0,isSolid=true,self){
        this.type = type;
        this.position = new Vector(posX,posY);
        this.shape = new Vector(sizeX,sizeY);
        this.velocity = new Vector(velX,velY);
        this.self = self ? self : giveLife(this);
        this.isSolid = isSolid;
        this.mode = null;
        this.collisionSensitive = false;
        this.isAlive = true;
        this.previousPosition = this.position.clone();
        participantArray.push(this);
    }

    updateAliveStatus(val){
        this.isAlive = val;
    }

    setMode(mode){
        this.mode = mode;
    }

    setSolidity(val){
        this.isSolid = val;
    }

    setMultiPartDeflect(val){
        this.considerMultiPartDeflect = val;
    }

    setSpeed(speed){
        this.speed = speed;
    }

    setAngle(angle){
        this.angle = angle;
    }

    updateCollisionSensitive(val){
        this.collisionSensitive = val;
    }

    update(){
        if(this.angle){
            let angle = this.angle * (Math.PI / 180);

            this.velocity.y = -Math.sin(angle);
            this.velocity.x = -Math.cos(angle);
        }

        if(this.speed){
            this.velocity.y *= this.speed;
            this.velocity.x *= this.speed;
        }

        if(this.position.y > 0 && this.position.x > 0 && this.position.y < envMaxY && this.position.x < envMaxX)
            this.previousPosition = this.position.clone();

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.show();
    }

    onCollide(target){}

    show(){
        let style = this.self.style;
        style.left = `${this.position.x}px`;
        style.top = `${this.position.y}px`;
        style.height = `${this.shape.y}px`;
        style.width = `${this.shape.x}px`;
    }
}