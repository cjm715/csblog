// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

var flock;
var slider;
var text;
var userinput;

function setup() {

  createCanvas(640,360);
  flock = new Flock();

  userinput = createInput('50')
  slider = createSlider(0,200,userinput.value());

  // Add an initial set of boids into the system
  for (var i = 0; i < 60; i++) {
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
}

function upDateTextBox(){
  userinput.value(slider.value())
}

function updateSlider(){
  slider.value(userinput.value())
}

function draw() {
  background(100);

  slider.input(upDateTextBox)
  userinput.input(updateSlider)
  // console.log(userinput.value())
  flock.run();
}

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX,mouseY));
}
