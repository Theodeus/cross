(function(root){
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext("2d");
    var circles = [];
    var PI = Math.PI;
    var width = root.innerWidth;
    var height = root.innerHeight;
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    
    canvas.width = width;
    canvas.height = height;

    //initial black background
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);

    function render() {
        requestAnimationFrame(render);
        //draw somewhat translucent black to create fade effect
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, width, height);
        //draw circles
        circles.forEach(function(circleProp, index){
            circleSegment.apply(null, circleProp);
            circleProp[2] += Math.max(index + 1, 2);
            if(circleProp[2] > circleProp[6]) {
                circles.splice(index, 1);
            }
        });
        cross();
    }
    render();

    canvas.addEventListener("mousedown", function(e){
        var rot = (PI * 2) * Math.random();
        circles.push([e.offsetX, e.offsetY, 10, 0 + rot, PI / 2 + rot, null, 50],
                     [e.offsetX, e.offsetY, 10, PI + rot, PI * 1.5 + rot, null, 50],
                     [e.offsetX, e.offsetY, 15, PI / 2 + rot, PI + rot, null, 50],
                     [e.offsetX, e.offsetY, 15, PI * 1.5 + rot, PI * 2 + rot, null, 50],
                     [e.offsetX, e.offsetY, 20, PI + rot, PI * 1.5 + rot, null, 50],
                     [e.offsetX, e.offsetY, 20, 0 + rot, PI / 2 + rot, null, 50]);
        canvas.addEventListener("mousemove", move);
    });

    canvas.addEventListener("mouseup", function(e){
        var rot = (PI * 2) * Math.random();
        circles.push([e.offsetX, e.offsetY, 10, 0 + rot, PI / 2 + rot, null, 30],
                     [e.offsetX, e.offsetY, 10, PI + rot, PI * 1.5 + rot, null, 30],
                     [e.offsetX, e.offsetY, 15, PI / 2 + rot, PI + rot, null, 30],
                     [e.offsetX, e.offsetY, 15, PI * 1.5 + rot, PI * 2 + rot, null, 30],
                     [e.offsetX, e.offsetY, 20, PI + rot, PI * 1.5 + rot, null, 30],
                     [e.offsetX, e.offsetY, 20, 0 + rot, PI / 2 + rot, null, 30]);
        canvas.removeEventListener("mousemove", move);
    })

    function move(e) {
        circles.push([e.offsetX, e.offsetY, 1, 0, PI * 2, "#f0f", 0, 1]);
    }

    function circleSegment(x, y, radius, startAngleRad, endAngleRad, strokeStyle){
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngleRad, endAngleRad);
        ctx.strokeStyle = strokeStyle || "#ccc";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function cross() {
        ctx.beginPath();
        ctx.moveTo(0, halfHeight);
        ctx.lineTo(width, halfHeight);
        ctx.moveTo(halfWidth, 0);
        ctx.lineTo(halfWidth, height);
        ctx.strokeStyle = "rgba(250, 250, 250, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
})(this)
