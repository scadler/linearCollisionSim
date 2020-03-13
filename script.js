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
    CRL : false,
    order : [],
    i : 0,
}
function drawCircle(x, y, r, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
}
function drawCircleCombined(x, y, r, color){
    if(combined.draw === true){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI*2, false);
    context.closePath();
    context.fill();
    }
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
const combined = {
    draw : false,
    x : canvas.width/4,
    y : canvas.height/2,
    radius : 10,
    vi : 0,
    v : 0,
    m: 1,
    color : "#cccccc",
    a : 0,
}
const left = {
    x : canvas.width/4,
    y : canvas.height/2,
    radius : 11.28,
    vi : 0,
    v : 0.5,
    m: 3,
    color : "#FF0000",
    a : 0,
}
const center = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 20,
    vi : 0,
    v : 0,
    m: 5,
    color : "#0000FF",
    a : 0,
}
const right = {
    x : 3*canvas.width/4,
    y : canvas.height/2,
    radius : 19.54,
    vi : 0,
    v : -0.05,
    m: 1,
    color : "#FFFFFF",
    a : 0,
}

function combinedParticle(c1,c2,m1,m2){
    m3 = m1+m2
    c1R = parseInt( c1.substring(0,2), 16)
    console.log(c1R)
    c1G = parseInt( c1.substring(2,4), 16)
    console.log(c1G)
    c1B = parseInt( c1.substring(4,6), 16)
    console.log(c1B)
    c2R = parseInt( c2.substring(0,2), 16)
    console.log(c2R)
    c2G = parseInt( c2.substring(2,4), 16)
    console.log(c2G)
    c2B = parseInt( c2.substring(4,6), 16)
    console.log(c2B)
    c3R = (c1R * (m1/(m3))) + (c2R * (m2/(m3)))
    c3G = (c1G * (m1/(m3))) + (c2G * (m2/(m3)))
    c3B = (c1B * (m1/(m3))) + (c2B * (m2/(m3)))
    c3 = "#"+c3R.toString(16)+c3G.toString(16)+c3B.toString(16)
    console.log(c3)

}
combinedParticle("FF0000","0000FF",1,2)
function collision(a,b){
    a.v = ( ( ( a.m * a.vi ) + ( b.m * b.vi ) + ( b.m * status.COR * ( b.vi - a.vi ) ) ) / ( a.m + b.m) )
    b.v = ( ( ( b.m * b.vi ) + ( a.m * a.vi ) + ( a.m * status.COR * ( a.vi - b.vi ) ) ) / ( a.m + b.m) )
}
function collisionCOR(a,b,c){
    a.v = ( ( ( a.m * a.vi ) + ( b * b.vi ) + ( b * status.COR * ( b.vi - a.vi ) ) ) / ( a.m + b) )
    b.v = ( ( ( b * b.vi ) + ( a.m * a.vi ) + ( a.m * status.COR * ( a.vi - b.vi ) ) ) / ( a.m + b) )
}
function overlap(a,b){
    if(Math.abs(a.x-b.x)< a.radius+b.radius){
        if(a.x > b.x){
            b.x = a.x - a.radius - b.radius
        }
        else{
             a.x = b.x - b.radius - a.radius
        }
    }
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
function updateInelastic(a,b){
    b.v = -b.v
    if(a.x < b.x){
        b.x = a.x + a.radius + b.radius + 0.1
    }else{
        b.x = a.x - a.radius - b.radius - 0.1
    }
}
function updateInelasticAll(a,b,c,d){
    if( status.i === 0){
    if(status.order.length !== 3){
    if( (a.x > b.x) && (a.x > c.x) ){
        if(b.x > c.x){
            status.order=[a, b, c]
        }else{
            status.order=[a, c, b]
        }
    }
    else if( (c.x > a.x) && (c.x > b.x) ){
        if(a.x > b.x){
            status.order=[c, a, b]
        }else{
            status.order=[c, b, a]
        }
    }
    else if( (b.x > a.x) && (b.x > c.x) ){
        if(a.x > c.x){
            status.order=[b, a, c]
        }else{
            status.order=[b, c, a]
        }
    }
    front = status.order[0]
    mid = status.order[1]
    last = status.order[2]
}
status.i = 1;
    }
    if(a.x > 500){
        front = status.order[0]
        mid = status.order[1]
        last = status.order[2]
        console.log(front.color +"1a")
        console.log(mid.color +"2a")
        console.log(last.color +"3a")
        front.v = -(Math.abs(d))
        mid.v = -(Math.abs(d))
        last.v = -(Math.abs(d))
        front.x = canvas.width - front.radius - 0.1
        mid.x = canvas.width - front.radius - front.radius - mid.radius - 0.2
        last.x = canvas.width - front.radius - front.radius - mid.radius - mid.radius - last.radius - 0.3
    }else if(a.x < 500){
        front = status.order[2]
        mid = status.order[1]
        last = status.order[0]
        front.v = Math.abs(d)
        mid.v = Math.abs(d)
        last.v = Math.abs(d)
        last.x = front.radius + front.radius + mid.radius + mid.radius + last.radius + 0.3;
        mid.x = front.radius + front.radius + mid.radius + 0.2;
        front.x = front.radius + 0.1;
    }
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
        else if(right.x - right.radius < 0){
            right.x = right.radius
        }
        if(status.CRL === true){
            updateInelasticAll(right,center,left,right.v)
        }
        else if(status.RL === true){
            updateInelastic(right,left)
        }
        else if(status.CR === true){
            updateInelastic(right,center)
        }
    }
    if( left.x + left.radius > canvas.width || left.x - left.radius < 0){
        left.v = - left.v;
        if(left.x + left.radius > canvas.width){
            left.x = canvas.width - left.radius;
        }
        else if(left.x - left.radius < 0){
            left.x = left.radius
        }
        if(status.CRL === true){
            updateInelasticAll(right,center,left,right.v)
        }
        if(status.CL === true){
            updateInelastic(left,center)
        }
        else if(status.RL === true){
             updateInelastic(left,right)
        }
    }
    if( center.x + center.radius > canvas.width || center.x - center.radius < 0){
        center.v = - center.v;
        if(center.x + center.radius > canvas.width){
            center.x = canvas.width - center.radius;
        }
        else if(center.x - center.radius < 0){
            center.x = center.radius
        }
        if(status.CRL === true){
            updateInelasticAll(right,center,left,right.v)
        }
        else if(status.CL === true){
            updateInelastic(center,left)
        }
        else if(status.CR === true){
            updateInelastic(center,right)
        } 
    }
    let closeRL = Math.sqrt((right.x - left.x)*(right.x - left.x))
    if(closeRL <= (right.radius+left.radius)){
        if(status.CL !== true && status.CR !== true){
            collision(right,left)
        }
        else{
            collisionCOR(right,left,center)
            collisionCOR(left,right,center)
        }
        if(right.v === left.v){
            status.RL = true;
            //
        }
    }
    if(status.blue === true){
        let closeCL = Math.sqrt((center.x - left.x)*(center.x - left.x))
        if(closeCL <= (center.radius+left.radius)){
            if(status.RL !== true && status.CR !== true){
            collision(center,left)
        }
        else{
            collisionCOR(center,left,right)
            collisionCOR(left,center,right)
        }
            if(center.v === left.v){
                status.CL = true;
            }
        }
        let closeCR = Math.sqrt((center.x - right.x)*(center.x - right.x))
        if(closeCR <= (center.radius+right.radius)){
            if(status.RL !== true && status.CL !== true){
            collision(center,right)
        }
        else{
            collisionCOR(center,right,left)
            collisionCOR(right,center,left)
        }
            if(center.v === right.v){
            status.CR = true;
        }
        }
    }
    if((status.RL === true && status.CR === true )||(status.CR === true && status.CL === true )||(status.RL === true && status.CL === true )){
        status.CRL = true;
        status.RL = false;
        status.CR = false;
        status.CL = false;
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
        status.i = 0;
        status.CR = false;
        status.CL = false;
        status.RL = false;
        status.CRL = false;
        status.blue = status.blueCheck
        status.blueMultiplier = status.blueMultiplierCheck
        status.order = []
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
        right.radius = 20*Math.sqrt(Number($("#whiteMRangeOutput").text())/Math.PI)+1
        center.radius = 20*Math.sqrt(Number($("#blueMRangeOutput").text())/Math.PI)+1
        left.radius = 20*Math.sqrt(Number($("#redMRangeOutput").text())/Math.PI)+1
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