function Block(gameZone,context,x,y) {
    this.context    = context;
    this.size       = gameZone.blockSize;
    this.x          = x;
    this.y          = y;

    this.drow = function () {
        this.context.fillRect(this.x, this.y, this.size, this.size);
    };

    /**
     *
     * @param ball Ball
     */
    this.test = function(ball) {
        if ( ball.getX1() >= this.getX1() && ball.getX1() <= this.getX2()) {
            if ( ball.getY1() >= this.getY1() && ball.getY1() <= this.getY2()) {
                if( Math.abs(ball.getX1() - this.getX1()) > Math.abs(ball.getY1() - this.getY1()) ) {
                    ball.touchLeft();
                    return true;
                } else {
                    ball.touchTop();
                    return true;
                }
            }
            if ( ball.getY2() >= this.getY1() && ball.getY2() <= this.getY2()) {
                if( Math.abs(ball.getX1() - this.getX1()) > Math.abs(ball.getY1() - this.getY1()) ) {
                    ball.touchLeft();
                    return true;
                } else {
                    ball.touchBottom();
                    return true;
                }
            }
            return false;
        }
        if ( ball.getX2() >= this.getX1() && ball.getX2() <= this.getX2()) {
            if ( ball.getY1() >= this.getY1() && ball.getY1() <= this.getY2()) {
                if( Math.abs(ball.getX1() - this.getX1()) > Math.abs(ball.getY1() - this.getY1()) ) {
                    ball.touchRight();
                    return true;
                } else {
                    ball.touchTop();
                    return true;
                }
            }
            if ( ball.getY2() >= this.getY1() && ball.getY2() <= this.getY2()) {
                if( Math.abs(ball.getX1() - this.getX1()) > Math.abs(ball.getY1() - this.getY1()) ) {
                    ball.touchRight();
                    return true;
                } else {
                    ball.touchBottom();
                    return true;
                }
            }
            return false;
        }

        return false;
    };

    this.getX1 = function () {
        return this.x;
    };
    this.getX2 = function () {
        return this.x + this.size;
    };
    this.getY1 = function () {
        return this.y;
    };
    this.getY2 = function () {
        return this.y + this.size;
    }
}