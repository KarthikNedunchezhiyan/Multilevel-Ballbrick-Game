class Paddle{
    constructor(posX,posY,sizeX,sizeY,self){
        this.type = "paddle";
        this.self = self;
        this.isAlive = true;
        this.position = new Vector(posX,posY);
        this.shape = new Vector(sizeX,sizeY);

        this.considerMultiPartDeflect = true;
        this.isSolid = true;
        this.self.setAttribute("data-type",this.type);
        participantArray.push(this);
    }

    move(posX){
        posX = (posX<0) ? 0 : ( (this.shape.x+posX) > envMaxX ) ? (envMaxX - this.shape.x) : posX;
        this.position.x = posX;
    }

    onCollide(target){}

    update(){
        let style = this.self.style;
        style.left = `${this.position.x}px`;
        style.top = `${this.position.y}px`;
        style.height = `${this.shape.y}px`;
        style.width = `${this.shape.x}px`;
    }
}