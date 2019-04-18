function GameZone(canvas) {
    this.blockSize      =  Math.floor(canvas.width > canvas.height ? canvas.height / 100 : canvas.width / 100);
    this.width          =  50 * this.blockSize;
    this.height         =  100 * this.blockSize;
    this.paddingWidth    = canvas.width - this.width;
    this.paddingHeight   = canvas.height - this.height;
    this.x2 =   canvas.width - this.paddingWidth/2;
    this.x1 =   this.x2 - this.width;
    this.y2 =   canvas.height - this.paddingHeight/2;
    this.y1 =   this.y2 - this.height;
    this.blockZone  = {
        x1: this.x1 + this.blockSize * 4,
        x2: this.x1 + this.blockSize * 42,
        y1: this.y1 + this.blockSize * 4,
        y2: this.y1 + this.blockSize * 18
    }
}
function getRandom(start,end){
    return Math.round(Math.random() * ( end - start) + start);
}
function getRandom(end){
    return getRandom(0,end);
}

function Game(canvas) {
    this.active     =   false;
    this.canvas     =   canvas;
    this.gameZone    =   new GameZone(canvas);
    this.context    =   this.canvas.getContext('2d');
    this.actionLoopBusy = false;
    this.blockArray = [];
    this.score = new ObservableCounter(0);

    this.animate = function () {
        requestAnimationFrame(this.animate.bind(this));
        this.drowLoop();
    };

    this.drowLoop = function () {
        this.context.clearRect(
            this.gameZone.x1 - this.gameZone.blockSize,
            this.gameZone.y1 - this.gameZone.blockSize,
            this.gameZone.width + 2 * this.gameZone.blockSize,
            this.gameZone.height + 2 * this.gameZone.blockSize);
        this.context.strokeRect(this.gameZone.x1,this.gameZone.y1,this.gameZone.width,this.gameZone.height);
        this.platform.drow();
        this.ball.drow();
            for (var i in this.blockArray) {
                for (var j in  this.blockArray[i]) {
                    this.blockArray[i][j].drow();
                }
            }

        if(!this.active) {
            this.showMessage("CLICK TO START");
        }
    };

    this.onScoreChange = function (callback) {
        this.scoreObserver = callback;
        this.score.onChange(this.scoreObserver);
    };

    this.build = function () {
        if(this.platform) {
            this.platform.stop();
        }
        delete this.platform;
        delete this.ball;
        delete this.score;
        this.score = new ObservableCounter(0);
        if(this.scoreObserver) {
            this.score.onChange(this.scoreObserver);
            this.scoreObserver.call(this.score,0);
        }
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.platform   = new Platform(this.gameZone,14,this.context);
        this.ball       = new Ball(this.gameZone,this.context);
        delete this.blockArray;
        this.blockArray = [];

        var startY = this.gameZone.blockZone.y1;

        for(var i = 0;i<=8;i++) {
            var startX = this.gameZone.blockZone.x1;
            var line = [];
            for(var j = 0;j<=20;j++) {
                line.push(new Block(
                    this.gameZone,
                    this.context,
                    startX + this.gameZone.blockSize * j,
                    startY + this.gameZone.blockSize * i
                ));
                startX += this.gameZone.blockSize;
            }
            startY += this.gameZone.blockSize;
            this.blockArray.push(line);
        }
        this.gameSpeed = 10;
        this.ready = true;
        this.animate();
    };

    this.showMessage = function (text) {
        this.context.font = "30px Arial";
        this.context.textAlign="center";
        this.context.fillText(text,this.gameZone.x1 + this.gameZone.width/2,
            this.gameZone.y1 + this.gameZone.height/2);
    };

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



        if( this.ball.getY1() <= this.blockArray[this.blockArray.length - 1][0].getY2() ) {
            mainLoop: for (var i = 0; i < this.blockArray.length; i++) {
                var line = this.blockArray[i];
                for (var j = 0; j < line.length; j++) {
                    var block = line[j];
                    if (block && block.test(this.ball)) {
                        this.score.increment();
                        line.splice(j, 1);
                        if (line.length === 0) {
                            this.blockArray.splice(i, 1);
                        }
                        break mainLoop;
                    }
                }
            }
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