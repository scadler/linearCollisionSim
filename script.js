const canvas = document.getElementById("plane");
const context = canvas.getContext("2d");
//comment
const status = {
    elastic : true,
    collision : false,
    touchingWall : false,
    blueCheck: false,
    blue: false,
    friction: false,
    xCoorClose: false,
    passCounter: 0,
    blueMultiplierCheck : 0,
    blueMultiplier : 0,
    CORCheck : 1,
    COR : 0,
    CR : false,
    RL : false,
    CL : false,
}
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
function drawCircleBlue(x, y, r, color, check){
    if(check === true){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
    }
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
function checkXCoorSliders(){ 
    status.passCounter = 0;
    let wx = Number($("#whiteXCoor").val())
    let bx = Number($("#blueXCoor").val())
    let rx = Number($("#redXCoor").val())
    let wr = 20*Math.sqrt(Number($("#whiteMRangeOutput").text())/Math.PI)
    let br = 20*Math.sqrt(Number($("#blueMRangeOutput").text())/Math.PI)
    let rr = 20*Math.sqrt(Number($("#redMRangeOutput").text())/Math.PI)
    let closeWR = (Math.sqrt((wx-rx)*(wx-rx)) < (rr + wr + 10)) ? true : false
    let closeBR = (Math.sqrt((bx-rx)*(bx-rx)) < (rr + br + 10)) ? true : false
    let closeBW = (Math.sqrt((bx-wx)*(bx-wx)) < (wr + br + 10)) ? true : false
    if(status.blueCheck === false){
        closeBR = false
        closeBW = false
    }
    if(closeBR === true || closeWR === true || rx < (0+rr+3) || rx > (canvas.width-rr-3)) {
        $("#redXCoor").css("background-color", "#ff8888")
        status.xCoorClose = true
    }
    else if(closeBR === false && closeWR === false ){
        $("#redXCoor").css("background-color", "#d3d3d3")
        status.passCounter = status.passCounter + 1;
    }
    if(closeBR === true || closeBW === true || bx < (0+br+3) || bx > (canvas.width-br-3)){
        $("#blueXCoor").css("background-color", "#ff8888")
        status.xCoorClose = true
    }
    else if(closeBR === false && closeBW === false){
        $("#blueXCoor").css("background-color", "#d3d3d3")
        status.passCounter = status.passCounter + 1;
    }
    if(closeWR === true || closeBW === true || wx < (0+wr+3) || wx > (canvas.width-wr-3)){  
        $("#whiteXCoor").css("background-color", "#ff8888")
        status.xCoorClose = true
    }
    else if(closeWR === false && closeBW === false){
        $("#whiteXCoor").css("background-color", "#d3d3d3")
        status.passCounter = status.passCounter + 1;
    }
    if(status.passCounter === 3){
        status.passCounter = 0;
        status.xCoorClose = false;
    }
}
const left = {
    x : canvas.width/4,
    y : canvas.height/2,
    radius : 11.28,
    vi : 0,
    v : 0.5,
    m: 3,
    color : "Red",
    a : 0,
}
const center = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 20,
    vi : 0,
    v : 0,
    m: 5,
    color : "Blue",
    a : 0,
}
const right = {
    x : 3*canvas.width/4,
    y : canvas.height/2,
    radius : 19.54,
    vi : 0,
    v : -0.05,
    m: 1,
    color : "White",
    a : 0,
}
function updateText(){
    $("#redVRangeOutput").text($("#redVRange").val())
    $("#redMRangeOutput").text($("#redMRange").val())
    $("#blueVRangeOutput").text($("#blueVRange").val())
    $("#blueMRangeOutput").text($("#blueMRange").val())
    $("#whiteVRangeOutput").text($("#whiteVRange").val())
    $("#whiteMRangeOutput").text($("#whiteMRange").val())
    $("#frictionRangeOutput").text($("#frictionRange").val())
    $("#CORRangeOutput").text($("#CORRange").val())
    $("#redMOutput").text(left.m.toFixed(2))
    $("#redVOutput").text(left.v.toFixed(3))
    $("#redKEOutput").text((0.5*left.m*(left.v*left.v)).toFixed(4))
    $("#redPOutput").text((left.a*100).toFixed(4))
    $("#whiteMOutput").text(right.m.toFixed(2))
    $("#whiteVOutput").text(right.v.toFixed(3))
    $("#whiteKEOutput").text((0.5*right.m*(right.v*right.v)).toFixed(4))
    $("#whitePOutput").text(right.a*100)
    $("#blueMOutput").text(status.blueMultiplier*center.m.toFixed(2))
    $("#blueVOutput").text(status.blueMultiplier*center.v.toFixed(3))
    $("#blueKEOutput").text(status.blueMultiplier*(0.5*center.m*(center.v*center.v)).toFixed(4))
    $("#bluePOutput").text(status.blueMultiplier*center.a*100)
    $("#netMOutput").text((Number($("#redMOutput").text())+Number($("#blueMOutput").text())+Number($("#whiteMOutput").text())).toFixed(2))
    $("#netVOutput").text((Number($("#redVOutput").text())+Number($("#blueVOutput").text())+Number($("#whiteVOutput").text())).toFixed(3))
    $("#netKEOutput").text((Number($("#redKEOutput").text())+Number($("#blueKEOutput").text())+Number($("#whiteKEOutput").text())).toFixed(4))
    $("#netPOutput").text((Number($("#redPOutput").text())+Number($("#bluePOutput").text())+Number($("#whitePOutput").text())).toFixed(4))
}
function updateElastic(){
    let leftDirection = (left.v > 0) ? 1 : -1 
    let rightDirection = (right.v > 0) ? 1 : -1 
    let centerDirection = (center.v > 0) ? 1 : -1 
    left.v = (Math.pow(leftDirection*Math.sqrt((left.v*left.v)-(leftDirection*2*Number($("#frictionRangeOutput").text())*9.8*left.v)),2) > 0) ? leftDirection*Math.sqrt((left.v*left.v)-(leftDirection*2*Number($("#frictionRangeOutput").text())*9.8*left.v)) : 0
    right.v = (Math.pow(rightDirection*Math.sqrt((right.v*right.v)-(rightDirection*2*Number($("#frictionRangeOutput").text())*9.8*right.v)),2) > 0) ? rightDirection*Math.sqrt((right.v*right.v)-(rightDirection*2*Number($("#frictionRangeOutput").text())*9.8*right.v)) : 0
    center.v = (Math.pow(centerDirection*Math.sqrt((center.v*center.v)-(centerDirection*2*Number($("#frictionRangeOutput").text())*9.8*center.v)),2) > 0) ? centerDirection*Math.sqrt((center.v*center.v)-(centerDirection*2*Number($("#frictionRangeOutput").text())*9.8*center.v)) : 0
    right.a = right.vi - right.v
    left.a = left.vi - left.v
    center.a = center.vi - center.v
    right.vi = right.v
    left.vi = left.v
    center.vi = center.v
    right.x += right.v;
    left.x += left.v;
    center.x += center.v
    drawText("White:     m: "+right.m.toFixed(2)+" kg, v: "+right.v.toFixed(3)+" m/s, KE: "+(1/2*right.m*(right.v*right.v)).toFixed(4)+" N", 0, 10, "White");
    drawText("Blue   m: "+center.m.toFixed(2)+" kg, v: "+center.v.toFixed(3)+" m/s, KE: "+(1/2*center.m*(center.v*center.v)).toFixed(4)+" N", 0, 30, "White");
    drawText("Red:   m: "+left.m.toFixed(2)+" kg, v: "+left.v.toFixed(3)+" m/s, KE: "+(1/2*left.m*(left.v*left.v)).toFixed(4)+" N", 0, 20, "White");
    if( right.x + right.radius > canvas.width || right.x - right.radius < 0){
        right.v = - right.v;
        if(right.x + right.radius > canvas.width){
            right.x = canvas.width - right.radius;
        }
        if(status.RL === true){
            if(right.x < left.x){
                left.v = -left.v
                left.x = right.x + right.radius + left.radius + 0.1
             }else{
                left.v = -left.v
                left.x = right.x - left.radius - right.radius - 0.1
                console.log("A")
            }
        }
        if(status.CR === true){
            center.v = - center.v
        }
    }
    if( left.x + left.radius > canvas.width || left.x - left.radius < 0){
        left.v = - left.v;
        if(left.x + left.radius > canvas.width){
            left.x = canvas.width - left.radius;
        }
        if(status.CL === true){
            center.v = - center.v
        }
        if(status.RL === true){
            
            if(left.x < right.x){
                right.v = -right.v
                right.x = left.x + left.radius + right.radius + 0.1
             }else{
                right.v = -right.v
                right.x = left.x - left.radius - right.radius - 0.1
            }
        }
    }
    if( center.x + center.radius > canvas.width || center.x - center.radius < 0){
        center.v = - center.v;
        if(center.x + center.radius > canvas.width){
            center.x = canvas.width - center.radius;
        }
        if(status.CL === true){
            left.v = -left.v
        }
        if(status.CR === true){
            right.v = -right.v
        }
    }
    let closeRL = Math.sqrt((right.x - left.x)*(right.x - left.x))
    if(closeRL <= (right.radius+left.radius)){
        right.v = ( ( ( right.m * right.vi ) + ( left.m * left.vi ) + ( left.m * status.COR * ( left.vi - right.vi ) ) ) / ( right.m + left.m ) )
        left.v = ( ( ( left.m * left.vi ) + ( right.m * right.vi ) + ( right.m * status.COR * ( right.vi - left.vi ) ) ) / ( right.m + left.m ) )
        if(right.v === left.v){
            console.log("RL")
            status.RL = true;
        }

    }
    if(status.blue === true){
        let closeCL = Math.sqrt((center.x - left.x)*(center.x - left.x))
        if(closeCL <= (center.radius+left.radius)){
            center.v = ( ( ( center.m * center.vi ) + ( left.m * left.vi ) + ( left.m * status.COR * ( left.vi - center.vi ) ) ) / ( center.m + left.m ) )
            left.v = ( ( ( left.m * left.vi ) + ( center.m * center.vi ) + ( center.m * status.COR * ( center.vi - left.vi ) ) ) / ( center.m + left.m ) )
            if(center.v === left.v){
            console.log("CL")
            status.CL = true;
        }
        }
        let closeCR = Math.sqrt((center.x - right.x)*(center.x - right.x))
        if(closeCR <= (center.radius+right.radius)){
            center.v = ( ( ( center.m * center.vi ) + ( right.m * right.vi ) + ( right.m * status.COR * ( right.vi - center.vi ) ) ) / ( center.m + right.m ) )
            right.v = ( ( ( right.m * right.vi ) + ( center.m * center.vi ) + ( center.m * status.COR * ( center.vi - right.vi ) ) ) / ( center.m + right.m ) )
            if(center.v === right.v){
            console.log("CR")
            status.CR = true;
        }
        }
    }
}
function render(){
drawRect(0, 0, canvas.width, canvas.height, "black");
drawCircle(left.x, left.y, left.radius, left.color)
drawCircle(right.x, right.y, right.radius, right.color)
drawCircleBlue(center.x, center.y, center.radius, center.color, status.blue)
updateText()
}
function game(){
    render();
    updateElastic();
}
document.addEventListener("mousemove",checkXCoorSliders());
document.addEventListener("mousedown",checkXCoorSliders());
setInterval(game,);
$("#restart").click(function(){
    if(status.xCoorClose === false){
        status.CR = false;
        status.CL = false;
        status.RL = false;
        status.blue = status.blueCheck
        status.blueMultiplier = status.blueMultiplierCheck
        status.COR = $("#CORRange").val()
        right.x = Number($("#whiteXCoor").val())
        center.x = Number($("#blueXCoor").val())
        left.x = Number($("#redXCoor").val())
        right.v = Number($("#whiteVRangeOutput").text())
        right.m = Number($("#whiteMRangeOutput").text())
        center.v = Number($("#blueVRangeOutput").text())
        center.m = Number($("#blueMRangeOutput").text())
        left.v = Number($("#redVRangeOutput").text())
        left.m = Number($("#redMRangeOutput").text())
        right.radius = 20*Math.sqrt(Number($("#whiteMRangeOutput").text())/Math.PI)
        center.radius = 20*Math.sqrt(Number($("#blueMRangeOutput").text())/Math.PI)
        left.radius = 20*Math.sqrt(Number($("#redMRangeOutput").text())/Math.PI)
    }
})
var i = 0;
function checkBlueParticleVal(){
    if(Number($("#checkBlueParticle").val()) === 1){
        status.blueCheck = true
        $("#checkBlueParticleOutput").text("Yes")
    }
    else{
        status.blueCheck = false
        $("#checkBlueParticleOutput").text("No")
    }
    i++;
}
function checkBlueParticleVal(){
    if(Number($("#checkBlueParticle").val()) === 1){
        status.blueCheck = true
        status.blueMultiplierCheck = 1
        $("#checkBlueParticleOutput").text("Yes")
            checkXCoorSliders()
    }
    else{
        status.blueCheck = false
        $("#checkBlueParticleOutput").text("No")
            checkXCoorSliders()
            status.blueMultiplierCheck = 0;
    }
    i++;
}