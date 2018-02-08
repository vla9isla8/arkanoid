function GameZone(canvas) {
    this.blockSize      =  Math.floor(canvas.width > canvas.height ? canvas.height / 100 : canvas.width / 100);
    this.width          =  50 * this.blockSize;
    this.height         =  100 * this.blockSize;
    this.paddingWidth    = canvas.width - this.width;
    this.paddingHeight   = canvas.height - this.height;
    this.x1 =   this.paddingWidth/2;
    this.x2 =   this.width + this.x1;
    this.y1 =   this.paddingHeight/2;
    this.y2 =   this.height + this.y1;
}
function Game(canvas) {
    this.active     =   false;
    this.canvas     =   canvas;
    this.gameZone    =   new GameZone(canvas);
    this.context    =   this.canvas.getContext('2d');
    this.actionLoopBusy = false;
    this.drowLoop = function () {
        this.context.clearRect(this.gameZone.x1,this.gameZone.y1,this.gameZone.width,this.gameZone.height);
        this.context.strokeRect(this.gameZone.x1,this.gameZone.y1,this.gameZone.width,this.gameZone.height);
        // var x = this.gameZone.x1;
        // while ( x < this.gameZone.x2 ) {
        //     this.context.beginPath();
        //     this.context.moveTo(x,this.gameZone.y1);
        //     this.context.lineTo(x,this.gameZone.y2);
        //     x +=  this.gameZone.blockSize;
        //     this.context.stroke();
        // }
        this.platform.drow();
        this.ball.drow();
        if(!this.active) {
            this.showMessage("CLICK TO START");
        }
    };

    this.build = function () {
        if ( this.animationLoop ) {
            clearTimeout(this.animationLoop);
            delete this.animationLoop;
        }
        if(this.platform) {
            this.platform.stop();
        }
        delete this.platform;
        delete this.ball;
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.platform   = new Platform(this.gameZone,14,this.context);
        this.ball       = new Ball(this.gameZone,this.context);
        this.animationLoop = setInterval(this.drowLoop.bind(this),5);
        this.gameSpeed = 10;
        this.ready = true;
    };

    this.showMessage = function (text) {
        this.context.font = "30px Arial";
        this.context.fillText(text,this.gameZone.x1 +this.gameZone.width/2 - 100,this.gameZone.y1 + this.gameZone.height/2);
    };

    this.build();
    this.start  =   function () {
        while (this.actionLoopBusy) {}
        this.actionLoopBusy = true;
        if ( this.actionLoop) {
            clearTimeout(this.actionLoop);
        }
        if(!this.ready) {
            this.build();
        }
        this.ready      =   false;
        this.active     =   true;
        this.actionLoop = setInterval(this.motionLoop.bind(this),this.gameSpeed);
        this.actionLoopBusy = false;
    };

    this.stop = function () {
        while (this.actionLoopBusy) {}
        this.actionLoopBusy = true;
        if ( this.actionLoop ) {
            clearTimeout(this.actionLoop);
            delete this.actionLoop;
        }
        this.actionLoopBusy = false;
        this.active     =   false;
        this.build();
    };

    this.motionLoop = function () {
        if ( (this.ball.x + this.ball.size) >= this.gameZone.x2 ) {
            this.ball.touchRight();
        }
        if ( this.ball.x <= this.gameZone.x1 ) {
            this.ball.touchLeft();
        }
        if ( this.ball.y <= this.gameZone.y1 ) {
            this.ball.touchTop();
        }
        if ( (this.ball.y + this.ball.size) >= this.gameZone.y2 ) {
            if ( this.actionLoop ) {
                clearTimeout(this.actionLoop);
                delete this.actionLoop;
            }
            if ( this.animationLoop ) {
                clearTimeout(this.animationLoop);
                delete this.animationLoop;
            }
            this.active     =   false;
            this.showMessage("GAME OVER");
            var that = this;
            setTimeout(function() {
                if (!that.active) {
                    that.build();
                }
            },2000);
            return;
        }
        if ( this.ball.movingDown
            && ((this.ball.y + this.ball.size) >= this.platform.y)
            && (this.ball.x >= this.platform.x)
            && ((this.ball.x + this.ball.size) <= (this.platform.x + this.platform.width) )) {
                this.ball.touchBottom(this.platform.vector);
        }
        this.ball.step();
    };

    this.increaseActionSpeed = function (speed) {
        while (this.actionLoopBusy) {}
        this.actionLoopBusy = true;
        if ( this.actionLoop ) {
            clearTimeout(this.actionLoop);
            delete this.actionLoop;
        }
        this.gameSpeed-=speed;
        this.actionLoop = setInterval(this.motionLoop.bind(this),this.gameSpeed);
        this.actionLoopBusy = false;
    };

    this.movePlatformLeft = function (_step) {
        var leftOffset     = Math.floor(this.platform.x - this.gameZone.x1);
        var step = _step >=  leftOffset ? leftOffset : _step;
        if (!this.active) {
            this.ball.moveLeft(step);
        }
        this.platform.moveLeft(step);
    };

    this.movePlatformRight  = function (_step) {
        var rightOffset     = Math.floor(this.gameZone.x2 - this.platform.x - this.platform.width);
        var step = _step >=  rightOffset ? rightOffset : _step;
        if (!this.active) {
            this.ball.moveRight(step);
        }
        this.platform.moveRight(step);
    };

}