const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
function drawRect(x, y, w, h, color){
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
function drawText(text,x, y, color){
    context.fillStyle = color;
    context.font = "12px arial";
    context.fillText(text, x, y);
}
const right = {
    x : canvas.width/3,
    y : canvas.height/2,
    radius : 15,
    vi : 0,
    v : 0.5,
    m: 2,
    color : "White",
}
const left = {
    x : 2*canvas.width/3,
    y : canvas.height/2,
    radius : 15,
    vi : 0,
    v : 0.5,
    m: 1,
    color : "Red",
}
function update(){
    right.vi = right.v
    left.vi = left.v
    right.x += right.v;
    left.x += left.v;
    drawText("Right X: "+Math.round(right.x)+" Right V: "+right.v.toFixed(3), 0, 10, "White");
    drawText("Left X: "+Math.round(left.x)+" Left V: "+left.v.toFixed(3), 0, 20, "White");
    if( right.x + right.radius > canvas.width || right.x - right.radius < 0){
        right.v = - right.v;
        if(right.x + right.radius > canvas.width){
            right.x = canvas.width - right.radius;
        }
    }
    if( left.x + left.radius > canvas.width || left.x - left.radius < 0){
        left.v = - left.v;
        if(left.x + left.radius > canvas.width){
            left.x = canvas.width - left.radius;
        }
    }
    //     else{
    //         ball.x = ball.radius;
    //     }
    // }
    let closeX = Math.sqrt((right.x - left.x)*(right.x - left.x))
    // let closeY = Math.sqrt((ball.y - user.y)*(ball.y - user.y))
    // let closeXY = Math.sqrt((closeX*closeX)+(closeY*closeY))
    // let ballv = Math.sqrt((ball.velocityX*ball.velocityX)+(ball.velocityY*ball.velocityY))
    if(closeX <= (right.radius+left.radius)){
        
        // right.v = (((right.m - left.m)/(right.m + left.m)*right.v) + (((2*left.m)/(right.m + left.m))*left.v))
        // left.v = (((2*right.m)/(right.m + left.m)*right.v) - (((right.m - left.m)/(right.m + left.m))*left.v))
        right.v = (((right.vi*(right.m - left.m))/(right.m + left.m)) + (((2*left.m)/(right.m + left.m))*left.vi))
        left.v = (((right.vi*(2*right.m))/(right.m + left.m)) + (((left.m - right.m)/(right.m + left.m))*left.vi))
            }
    //     let theta = Math.atan((ball.x-user.x)/(ball.y-user.y))
    //     let isStatic = (user.static === true) ? user.v : 1
    //     console.log(isStatic + " static")
    //     console.log(theta + " theta")
    //     let diffX = ball.x - user.x
    //     let directionX = (ball.x > user.x) ? 1 : -1;
    //     let diffY = ball.y - user.y
    //     let directionY = (ball.y > user.y) ? 1 : -1;
    //     let diffXY = Math.sqrt((diffX*diffX)+(diffY*diffY))
    //     ball.velocityX = 0.25 * user.v * Math.cos(theta)
    //     ball.velocityY = 0.25 * user.v * Math.sin(theta)

        //ball.velocityY = user.vy
        // console.log(Math.asin(closeX/closeXY))
            //if this code is activated it makes red and white act like magnets
            // ball.x = ball.x +((15-closeX)*directionX)
            // ball.y = ball.y +((15-closeY)*directionY)

    // }
}
function render(){
drawRect(0, 0, canvas.width, canvas.height, "black");
drawCircle(left.x, left.y, left.radius, left.color)
drawCircle(right.x, right.y, right.radius, right.color)
}
function game(){
    render();
    update();
}
// $(window).keypress(function(e) {
//     if (e.which === 32) {
//     ball.x = canvas.width/2;
//     ball.y = canvas.height/2;
//     ball.velocityX = 0;
//     ball.velocityY = 0;
//     }
// });
setInterval(game,);
// canvas.addEventListener("mousemove",moveUser);
// canvas.addEventListener("click",staticUser);