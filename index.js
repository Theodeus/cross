(function(root){
    var canvas = document.getElementById('stage');
    var ctx = canvas.getContext("2d");
    var circles = [];
    var beats = [];
    var PI = Math.PI;
    var width = root.innerWidth;
    var height = root.innerHeight;
    var halfWidth = width / 2;
    var halfHeight = height / 2;
    var conductor, engine, tick;

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
        //draw beats
        beats.forEach(function(circleProp, index){
            circleSegmentFill.apply(null, circleProp);
            circleProp[2] += 50;
            if(circleProp[2] > circleProp[6]) {
                beats.splice(index, 1);
            }
        });
        //cross();
    }
    render();

    function initAudio() {
        "use strict";
        var context = new AudioContext();
        engine = new BeatEngine(context, 0.175, 220);
        var kick = new Kick(context);
        var beept = new FMBeep(context, 300);
        tick = new Tick(context, 300);
        var track = new Track().readString("1,1,130.81,50,synth;3,1,130.81,50,synth;1,3,146.83,50,synth;1,4,146.83,50,synth;2,1,164.81,50,synth;3,3,196,50,synth;3,4,196,50,synth;4,1,174.61,50,synth;4,4,146.83,50,synth");
        var track2 = new Track().readString("1,1,70,120,kick;1,3,70,120,kick;2,1,70,120,kick;2,3,70,120,kick;3,1,70,120,kick;3,3,70,120,kick;4,1,70,120,kick;4,3,70,120,kick");
        var track3 = new Track().readString("1,1,130.81,120,kick;1,3,146.83,120,kick;2,1,164.81,120,kick;2,3,174.61,120,kick;3,1,196,120,kick;3,3,220,120,kick;4,1,246.94,120,kick;4,3,196,120,kick");
        var track4 = new Track().readString("1,3,400,100,tick;2,3,400,100,tick;3,3,400,100,tick;4,3,400,100,tick;1,1,400,100,tick;1,2,400,100,tick;1,4,400,100,tick;2,1,400,100,tick;2,2,400,100,tick;2,4,400,100,tick;3,1,400,100,tick;3,2,400,100,tick;3,4,400,100,tick;4,1,400,100,tick;4,2,400,100,tick;4,4,400,100,tick");
        conductor = new Conductor(engine);
        conductor.registerInstrument("kick", kick);
        conductor.registerInstrument("synth", beept);
        conductor.registerInstrument("tick", tick);
        conductor.addTrack(track);
        conductor.addTrack(track2);
        conductor.addTrack(track4);
    }
    initAudio();

    function drawBeat(beat) {
        if(beat % 2 === 1) {
            var x = Math.random() * width;
            var y = Math.random() * height;
            beats.push([x, y, 10, 0, PI * 2, "#" + (parseInt(Math.random() * 16777215, 10)).toString(16), Math.random() * 300 + 200]);
        }
    }

    canvas.addEventListener("mousedown", function(e){
        conductor.start();
        var rot = (PI * 2) * Math.random();
        circles.push([e.offsetX, e.offsetY, 10, 0 + rot, PI / 2 + rot, null, 50],
                     [e.offsetX, e.offsetY, 10, PI + rot, PI * 1.5 + rot, null, 50],
                     [e.offsetX, e.offsetY, 15, PI / 2 + rot, PI + rot, null, 50],
                     [e.offsetX, e.offsetY, 15, PI * 1.5 + rot, PI * 2 + rot, null, 50],
                     [e.offsetX, e.offsetY, 20, PI + rot, PI * 1.5 + rot, null, 50],
                     [e.offsetX, e.offsetY, 20, 0 + rot, PI / 2 + rot, null, 50]);
        canvas.addEventListener("mousemove", move);
        engine.addBeatListener(drawBeat);
    });

    canvas.addEventListener("mouseup", function(e){
        conductor.stop();
        var rot = (PI * 2) * Math.random();
        circles.push([e.offsetX, e.offsetY, 10, 0 + rot, PI / 2 + rot, null, 30],
                     [e.offsetX, e.offsetY, 10, PI + rot, PI * 1.5 + rot, null, 30],
                     [e.offsetX, e.offsetY, 15, PI / 2 + rot, PI + rot, null, 30],
                     [e.offsetX, e.offsetY, 15, PI * 1.5 + rot, PI * 2 + rot, null, 30],
                     [e.offsetX, e.offsetY, 20, PI + rot, PI * 1.5 + rot, null, 30],
                     [e.offsetX, e.offsetY, 20, 0 + rot, PI / 2 + rot, null, 30]);
        canvas.removeEventListener("mousemove", move);
        engine.removeBeatListener(drawBeat);
    })

    function move(e) {
        circles.push([e.offsetX, e.offsetY, 1, 0, PI * 2, "#f0f", 0, 1]);
        tick.octave = 2 - ((e.offsetY / height) * 2);
        tick.filterFreq = (e.offsetX / width) * 2000;
    }

    function circleSegment(x, y, radius, startAngleRad, endAngleRad, strokeStyle){
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngleRad, endAngleRad);
        ctx.strokeStyle = strokeStyle || "#ccc";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function circleSegmentFill(x, y, radius, startAngleRad, endAngleRad, strokeStyle){
        ctx.beginPath();
        ctx.arc(x, y, radius, startAngleRad, endAngleRad);
        ctx.strokeStyle = strokeStyle || "#ccc";
        ctx.lineWidth = 3;
        ctx.fillStyle = strokeStyle || "#ccc";
        ctx.fill();
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
