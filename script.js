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
const rightBall = {
    x : canvas.width/3,
    y : canvas.height/2,
    radius : 15,
    vx : 1,
    color : "White",
}
const leftBall = {
    x : 2*canvas.width/3,
    y : canvas.height/2,
    radius : 15,
    vx : 2,
    color : "Red",
}
// function moveUser(event){
   
//     let rect = canvas.getBoundingClientRect();
//     user.y = event.clientY - rect.top - user.radius/2;
//     user.x = event.clientX - rect.top - user.radius/2;
//     let directionX = (oldX > user.x) ? -1 : 1
//     let directionY = (oldY > user.y) ? -1 : 1
//     user.vx = directionX * Math.sqrt((oldX - user.x)*(oldX - user.x));
//     user.vy = directionY * Math.sqrt((oldY - user.y)*(oldY - user.y));
//     user.v = Math.sqrt((user.vx*user.vx)+(user.vy*user.vy))
//     // console.log(user.v)
//     // console.log(user.vx +" "+ oldX + "X")
//     // console.log(user.vy +" "+ oldY + "Y")
// }
function update(){
    rightBall.x += rightBall.vx;
    leftBall.x += leftBall.vx;
    drawText("Right X: "+Math.round(rightBall.x)+" Right Vx: "+rightBall.vx, 0, 10, "White");
    drawText("Left X: "+Math.round(leftBall.x)+" Left Vx: "+leftBall.vx, 0, 20, "White");
    if( rightBall.x + rightBall.radius > canvas.width || rightBall.x - rightBall.radius < 0){
        rightBall.vx = - rightBall.vx;
        if(rightBall.x + rightBall.radius > canvas.width){
            rightBall.x = canvas.width - rightBall.radius;
        }
    }
    if( leftBall.x + leftBall.radius > canvas.width || leftBall.x - leftBall.radius < 0){
        leftBall.vx = - leftBall.vx;
        if(leftBall.x + leftBall.radius > canvas.width){
            leftBall.x = canvas.width - leftBall.radius;
        }
    }
    //     else{
    //         ball.x = ball.radius;
    //     }
    // }
    let closeX = Math.sqrt((rightBall.x - leftBall.x)*(rightBall.x - leftBall.x))
    // let closeY = Math.sqrt((ball.y - user.y)*(ball.y - user.y))
    // let closeXY = Math.sqrt((closeX*closeX)+(closeY*closeY))
    // let ballv = Math.sqrt((ball.velocityX*ball.velocityX)+(ball.velocityY*ball.velocityY))
    if(closeX <= (rightBall.radius+leftBall.radius)){
        rightBall.vx = leftBall.vx
        leftBall.vx = rightBall.vx
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
drawCircle(leftBall.x, leftBall.y, leftBall.radius, leftBall.color)
drawCircle(rightBall.x, rightBall.y, rightBall.radius, rightBall.color)
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