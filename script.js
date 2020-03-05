const canvas = document.getElementById("plane");
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
const status = {
    elastic : true,
    collision : false,
    touchingWall : false,
}
const right = {
    x : canvas.width/3,
    y : canvas.height/2,
    radius : 19.54,
    vi : 0,
    v : 0.5,
    m: 3,
    color : "White",
}
const left = {
    x : 2*canvas.width/3,
    y : canvas.height/2,
    radius : 11.28,
    vi : 0,
    v : -0.05,
    m: 1,
    color : "Red",
}
function updateElastic(){
    right.vi = right.v
    left.vi = left.v
    right.x += right.v;
    left.x += left.v;
    drawText("Red:     m: "+right.m.toFixed(2)+" kg, v: "+right.v.toFixed(3)+" m/s, KE: "+(1/2*right.m*(right.v*right.v)).toFixed(3)+" N", 0, 10, "White");
    drawText("White:   m: "+left.m.toFixed(2)+" kg, v: "+left.v.toFixed(3)+" m/s, KE: "+(1/2*left.m*(left.v*left.v)).toFixed(3)+" N", 0, 20, "White");
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
    let closeX = Math.sqrt((right.x - left.x)*(right.x - left.x))
    if(closeX <= (right.radius+left.radius)){
        right.v = (((right.vi*(right.m - left.m))/(right.m + left.m)) + (((2*left.m)/(right.m + left.m))*left.vi))
        left.v = (((right.vi*(2*right.m))/(right.m + left.m)) + (((left.m - right.m)/(right.m + left.m))*left.vi))
    }
}
function updateInelastic(){
    right.vi = right.v
    left.vi = left.v
    right.x += right.v;
    left.x += left.v;
    if(right.x - left.x)
    drawText("Red:     m: "+right.m.toFixed(2)+" kg, v: "+right.v.toFixed(3)+" m/s, KE: "+(1/2*right.m*(right.v*right.v)).toFixed(3)+" N", 0, 10, "White");
    drawText("White:   m: "+left.m.toFixed(2)+" kg, v: "+left.v.toFixed(3)+" m/s, KE: "+(1/2*left.m*(left.v*left.v)).toFixed(3)+" N", 0, 20, "White");
    if(status.collision === false){
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
    let closeX = Math.sqrt((right.x - left.x)*(right.x - left.x))
    if(closeX <= (right.radius+left.radius)){
        status.collision = true;
        right.v = ((right.m*right.v)+(left.m*left.v))/(right.m*left.m)
        left.v = right.v
    }
}
    else{
        if(right.x - left.x < right.radius + left.radius){
            right.x = left.x + right.radius + left.radius
        }
        if( right.x + right.radius > canvas.width || right.x - right.radius < 0 || eft.x + left.radius > canvas.width || left.x - left.radius < 0){
            left.v = -left.v
            right.v = - right.v
            if(right.x + right.radius > canvas.width){
                right.x = canvas.width - right.radius;
                left.x = left.x - right.radius;
            }
            if(left.x + left.radius > canvas.width){
                left.x = canvas.width - left.radius;
                right.x = right.x - left.radius;
         }
    }
}
}
function render(){
drawRect(0, 0, canvas.width, canvas.height, "black");
drawCircle(left.x, left.y, left.radius, left.color)
drawCircle(right.x, right.y, right.radius, right.color)
$("#redVRangeOutput").text($("#redVRange").val())
$("#whiteVRangeOutput").text($("#whiteVRange").val())
$("#redMRangeOutput").text($("#redMRange").val())
$("#whiteMRangeOutput").text($("#whiteMRange").val())
}
function game(){
    render();
    // if(status.elastic === true){
    updateElastic();
    // }
    // else{
    //     updateInelastic();
    // }
}
setInterval(game);
$("#restart").click(function(){
    right.x = canvas.width/3
    left.x = 2*canvas.width/3
    right.v = Number($("#whiteVRangeOutput").text())
    left.v = Number($("#redVRangeOutput").text())
    right.m = Number($("#whiteMRangeOutput").text())
    left.m = Number($("#redMRangeOutput").text())
    right.radius = 20*Math.sqrt(Number($("#whiteMRangeOutput").text())/Math.PI)
    console.log(right.radius)
    left.radius = 20*Math.sqrt(Number($("#redMRangeOutput").text())/Math.PI)
    console.log(left.radius)
})