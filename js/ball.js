function Ball(gameZone, context) {
    this.context = context;
    this.size   = gameZone.blockSize;
    this.x      = gameZone.x1 + Math.floor(gameZone.width / 2 );
    this.lastY  = this.y;
    this.y      = gameZone.y1 + gameZone.height - 2 * gameZone.blockSize;
    this.vector         = new Victor(this.size/Math.sqrt(2)/4, this.size/Math.sqrt(2)/4);
    this.movingDown     = false;
    this.step = function () {
        this.x+= this.vector.x;
        this.y-= this.vector.y;
        if(this.lastY  > this.y) {
            this.movingDown = false;
        } else {
            this.movingDown = true;
        }
        this.lastX  = this.x;
        this.lastY  = this.y;
    };
    this.drow = function () {
        this.context.fillRect(this.x, this.y, this.size, this.size);
    };
    this.touchRight = function () {
        this.vector.invertX();
    };
    this.touchLeft = function () {
        this.vector.invertX();
    };

    this.touchTop = function() {
        this.vector.invertY();
    };
    this.touchBottom = function(vector) {
        this.vector.invertY();
        this.vector.add(vector);
        console.log(this.vector.verticalAngleDeg());
    };
    this.moveLeft = function (step) {
        if(step !== undefined) {
            this.x -= step;
        } else {
            this.x -= this.size;
        }
    };
    this.moveRight = function (step) {
        if(step !== undefined) {
            this.x += step;
        } else {
            this.x += this.size;
        }
    };

}