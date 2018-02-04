function Platform(x, y, length,context) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.wegth = 10;
    this.lenght = length;

    this.drow = function () {
        context.fillRect(this.x, this.y, this.lenght, this.wegth);
    };
    this.moveLeft = function () {
        this.x-=10;
    };
    this.moveRight = function () {
        this.x+=10;
    };
}