// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

var flock;
var reRunButton;

var popluationSlider;
var seperationSlider;
var cohesionSlider;
var alignSlider;

var populationTxtBox;
var seperationTxtBox;
var cohesionTxtBox;
var alignTxtBox;

var desiredSeperation;
var neighbordist;
var desiredCohesion;

function setup(){
  createCanvas(640,360);
  // createP('Population');
  populationTxtBox = createInput(50);
  seperationTxtBox = createInput(20);
  cohesionTxtBox = createInput(25);
  alignTxtBox = createInput(25);

  popluationSlider = createSlider(0,200,populationTxtBox.value());
  seperationSlider = createSlider(0,200,seperationTxtBox.value());
  cohesionSlider = createSlider(0,200,cohesionTxtBox.value());
  alignSlider = createSlider(0,200,alignTxtBox.value())

  reRunButton = createButton('Rerun Sim Env')
  initilizeFlockSim()
}

function initilizeFlockSim(){
  flock = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < populationTxtBox.value(); i++) {
    var b = new Boid(width/2,height/2);
    flock.addBoid(b);
  }
}


function cohesionTxtBoxEvent(){
  cohesionSlider.value(cohesionTxtBox.value())
}

function cohesionSliderEvent(){
  cohesionTxtBox.value(cohesionSlider.value())
}

function alignSliderEvent(){
  alignTxtBox.value(alignSlider.value())
}

function alignTxtBoxEvent(){
  alignSlider.value(alignTxtBox.value())
}

function seperationTxtBoxEvent(){
  seperationSlider.value(seperationTxtBox.value())
}

function seperationSliderEvent(){
  seperationTxtBox.value(seperationSlider.value())
}

function popluationSliderEvent(){
  populationTxtBox.value(popluationSlider.value())
  initilizeFlockSim()
}

function popluationTextBoxEvent(){
  popluationSlider.value(populationTxtBox.value())
  initilizeFlockSim()
}

function draw() {
  background(100);
  reRunButton.mousePressed(initilizeFlockSim)
  popluationSlider.input(popluationSliderEvent)
  populationTxtBox.input(popluationTextBoxEvent)
  seperationTxtBox.input(seperationTxtBoxEvent)
  seperationSlider.input(seperationSliderEvent)
  cohesionSlider.input(cohesionSliderEvent)
  cohesionTxtBox.input(cohesionTxtBoxEvent)
  alignSlider.input(alignSliderEvent)
  alignTxtBox.input(alignTxtBoxEvent)

  desiredSeperation = seperationTxtBox.value()
  neighbordist = alignTxtBox.value()
  desiredCohesion = cohesionTxtBox.value()
  
  flock.run(desiredSeperation, neighbordist, desiredCohesion);
}

// Add a new boid into the System
// function mouseDragged() {
//   flock.addBoid(new Boid(mouseX,mouseY));
// }
