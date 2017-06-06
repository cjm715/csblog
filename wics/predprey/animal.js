var s = function( p ) {

  var x = 100;
  var y = 100;

  p.setup = function() {
      var canvasWidth = 360;
      var canvasHeight = 360;

      var canvasDiv = select('#canvasDiv-pp')
      var sketchDiv = select('#sketch-holder-pp')
      //sketchDiv.style('position: relative')
      canvas = createCanvas(canvasWidth, canvasHeight);
      //canvas = createCanvas(360, 360);
      canvas.parent(canvasDiv);

      p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x,y,50,50);
  };
};

var myp5 = new p5(s);
