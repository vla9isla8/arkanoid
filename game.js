function Game(canvas) {
    this.canvas =   canvas;
    this.width  = 600;
    this.height = 600;
    this.canvas.setAttribute("width",this.width +" px");
    this.canvas.setAttribute("height",this.height +" px");
    this.context    = this.canvas.getContext('2d');

    this.build = function () {
        delete this.platform;
        delete this.ball;
        this.context.clearRect(0,0,600,600);
        this.platform   = new Platform(this.width/2 - 50,this.height - 10,100,this.context);
        this.ball       = new Ball(this.width/2,this.platform.y - 10,10,this.context);
        this.platform.drow();
        this.ball.drow();
        this.context.font = "30px Arial";
        this.context.fillText("PRESS START",this.width/2 - 100,this.height/2);
    };

    this.build();

    this.start  =   function () {
        if ( this.loop ) {
            this.stop();
            this.build();
        }
        this.loop = setInterval(this.gameLoop.bind(this),50);
    };

    this.restart = function () {
        this.stop();
        this.start()
    };

    this.stop = function () {
        if ( this.loop ) {
            clearTimeout(this.loop);
        }
        this.build();
    };

    this.gameLoop = function () {
        if ( (this.ball.x + this.ball.size) === this.width ) {
            this.ball.touchRight();
        }
        if ( this.ball.x === 0 ) {
            this.ball.touchLeft();
        }
        if ( this.ball.y === 0 ) {
            this.ball.touchTop();
        }
        if ( (this.ball.y + this.ball.size) === this.height ) {
            alert("GameOver!");
            this.stop();
            return;
        }
        if ( this.ball.angle < 0
            && (this.ball.y + this.ball.size) === this.platform.y
            && this.ball.x >= this.platform.x
            && (this.ball.x + this.ball.size) <= (this.platform.x + this.platform.lenght) ) {
            this.ball.touchBottom();
        }
        this.ball.step();
        this.context.clearRect(0,0,this.width,this.height);
        this.platform.drow();
        this.ball.drow();
    };

    this.movePlatformLeft = function () {
        this.platform.moveLeft();
    };

    this.movePlatformRight = function () {
        this.platform.moveRight();
    };

}