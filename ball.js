function Ball(x, y, size, context) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.size = size;
    this.active = true;
    this.angle = 45;

    this.step = function () {
        this.angle = this.angle % 360;
        this.x+= Math.cos(this.angle * Math.PI / 180) > 0 ? this.size : (-1 * this.size);
        this.y-= Math.sin(this.angle * Math.PI / 180) > 0 ? this.size : (-1 * this.size);
    };
    this.drow = function () {
        this.context.fillRect(this.x, this.y, 10, 10);
    };

    this.touchRight = function () {
        this.angle = this.angle + Math.abs(this.angle) / this.angle * 90;
    };
    this.touchLeft = function () {
        this.angle = this.angle - Math.abs(this.angle) / this.angle * 90;
    };

    this.touchTop = function() {
        this.angle = (-1) * this.angle;
    };
    this.touchBottom = function() {
        this.angle = (-1) * this.angle;
    };

}