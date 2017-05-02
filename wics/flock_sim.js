// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

var flock;
var reRunButton;

var populationSlider;
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

var canvas;


function setup() {

    var sketch = select('#sketch-holder')

    canvas = createCanvas(640, 360);
    canvas.parent(sketch);

    var controls = createDiv('');
    controls.parent(sketch);

    // Population controls
    var populationControls = createDiv('Population:    ');
    populationControls.parent(controls);
    populationTxtBox = createInput(50);
    populationTxtBox.parent(populationControls);
    populationSlider = createSlider(0, 200, populationTxtBox.value());
    populationSlider.parent(populationControls);

    // Seperation Controls
    var seperationControls = createDiv('Seperation:    ');
    seperationControls.parent(controls);
    seperationTxtBox = createInput(20);
    seperationTxtBox.parent(seperationControls);
    seperationSlider = createSlider(0, 200, seperationTxtBox.value());
    seperationSlider.parent(seperationControls);

    // Cohesion Controls
    var cohesionControls = createDiv('Cohesion:    ');
    cohesionControls.parent(controls);
    cohesionTxtBox = createInput(20);
    cohesionTxtBox.parent(cohesionControls);
    cohesionSlider = createSlider(0, 200, cohesionTxtBox.value());
    cohesionSlider.parent(cohesionControls);


    // Align Controls
    var alignControls = createDiv('Align:    ');
    alignControls.parent(controls);
    alignTxtBox = createInput(20);
    alignTxtBox.parent(alignControls);
    alignSlider = createSlider(0, 200, alignTxtBox.value());
    alignSlider.parent(alignControls);


    reRunButton = createButton('Rerun Sim Env');
    reRunButton.parent(controls)

    // var sketch = select('#sketch-holder');
    // sketch.style('float', 'left')
    // sketch.style('margin', '20px')

    initilizeFlockSim();
}

function initilizeFlockSim() {
    flock = new Flock();
    // Add an initial set of boids into the system
    for (var i = 0; i < populationTxtBox.value(); i++) {
        var b = new Boid(width / 2, height / 2);
        flock.addBoid(b);
    }
}


function draw() {
    background(100);
    reRunButton.mousePressed(initilizeFlockSim);
    populationSlider.input(populationSliderEvent);
    populationTxtBox.input(populationTextBoxEvent);
    seperationTxtBox.input(seperationTxtBoxEvent);
    seperationSlider.input(seperationSliderEvent);
    cohesionSlider.input(cohesionSliderEvent);
    cohesionTxtBox.input(cohesionTxtBoxEvent);
    alignSlider.input(alignSliderEvent);
    alignTxtBox.input(alignTxtBoxEvent);

    desiredSeperation = seperationTxtBox.value();
    neighbordist = alignTxtBox.value();
    desiredCohesion = cohesionTxtBox.value();

    flock.run(desiredSeperation, neighbordist, desiredCohesion);
}
