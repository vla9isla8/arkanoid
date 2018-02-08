function Platform(gameZone, length, context) {
    this.context    = context;
    this.width      = gameZone.blockSize * length;
    this.heigth     = gameZone.blockSize;
    this.x          = gameZone.x1 + gameZone.width / 2 - Math.floor(length / 2) * gameZone.blockSize;
    this.y          = gameZone.y1 + gameZone.height - this.heigth;
    this.lastX      = this.x;
    this.step       = gameZone.blockSize;
    this.vector     = new Victor(0,0);
    this.drow = function () {
        context.fillRect(this.x, this.y, this.width, this.heigth);
    };
    this.actionTimestamp = new Date().getTime();
    this.moveLeft = function (step) {
        if(step !== undefined) {
            this.x -= step;
        } else {
            this.x -= this.step;
        }
    };
    this.moveRight = function (step) {
        if(step !== undefined) {
            this.x += step;
        } else {
            this.x += this.step;
        }
    };

    this.checkAction = function () {
         if ( this.lastX > this.x ) {
             this.vector.x = (-1) * this.step / 8 ;
         } else if (this.lastX < this.x) {
             this.vector.x = this.step / 8;
         } else {
             this.vector.x = 0
         }
         this.lastX = this.x;
         console.log(this.vector);
    };

    this.loop = setInterval(this.checkAction.bind(this),80);

    this.stop = function () {
        if ( this.loop) {
            clearTimeout(this.loop);
        }
    };

    this.getPlatformPosition = function () {
        return this.x + Math.round(this.width / 2);
    }
}