var s = new p5(function(p) {

    var x = 100;
    var y = 100;

    p.setup = function() {
        var canvasWidth = 360;
        var canvasHeight = 360;

        var canvasDiv = p.select('#canvasDiv-pp')
        var sketchDiv = p.select('#sketch-holder-pp')
        //sketchDiv.style('position: relative')
        canvas = p.createCanvas(canvasWidth, canvasHeight);
        //canvas = createCanvas(360, 360);
        canvas.parent(canvasDiv);


    };

    p.draw = function() {
        p.background(0);
        p.fill(255);
        p.rect(x, y, 50, 50);
    };
});
