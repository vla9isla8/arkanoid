var root            =   document.getElementById("game_container");
var canvas          =   document.getElementById("game");
var score           =   document.getElementById("score");
canvas.width        =   root.clientWidth;
canvas.height       =   root.clientHeight;
var game            =   new Game(canvas);
game.onScoreChange(function (val) {
    score.innerText = "Score: " + val;
});
game.build();
var lastX = 0;
canvas.addEventListener('mousemove', function (event) {
    var pageX = event.pageX - score.clientWidth;
    lastX = Math.abs(pageX - lastX) < 5 ? lastX : pageX;
},false);

canvas.onclick      =   function () {
    if(!game.active) {
        game.start();
    }
};

setInterval(function () {
    var platformCenter = game.platform.getPlatformPosition();
    var diff = Math.round(lastX - platformCenter);
    var step = Math.abs(diff);
    if ( diff > 0 ) {
        game.movePlatformRight(step > 10 ? step/10 : step);
    } else if( diff < 0 ) {
        game.movePlatformLeft(step > 10 ? step/10 : step);
    }
},1);