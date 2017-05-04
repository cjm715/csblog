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
    var canvasWidth = 360;
    var canvasHeight = 360;

    var canvasDiv = select('#canvasDiv')
    var sketchDiv = select('#sketch-holder')
    //sketchDiv.style('position: relative')
    canvas = createCanvas(canvasWidth, canvasHeight);
    //canvas = createCanvas(360, 360);
    canvas.parent(canvasDiv);
    //sketchDiv.style('width: ${canvasWidth}')


    var controls = select('#controlsDiv')
    // controls.style('position: relative')

    // Population controls
    var populationControls = select('#population');
    populationTxtBox = createInput(80);
    populationTxtBox.parent(populationControls);
    populationSlider = createSlider(0, 150, populationTxtBox.value());
    populationSlider.parent(populationControls);


    // Seperation Controls
    var seperationControls = select('#seperation');
    seperationTxtBox = createInput(16);
    seperationTxtBox.parent(seperationControls);
    seperationSlider = createSlider(0, 200, seperationTxtBox.value());
    seperationSlider.parent(seperationControls);


    // Cohesion Controls
    var cohesionControls = select('#cohesion');
    cohesionTxtBox = createInput(44);
    cohesionTxtBox.parent(cohesionControls);
    cohesionSlider = createSlider(0, 200, cohesionTxtBox.value());
    cohesionSlider.parent(cohesionControls);

    // Align Controls
    var alignControls = select('#alignment');
    alignTxtBox = createInput(20);
    alignTxtBox.parent(alignControls);
    alignSlider = createSlider(0, 200, alignTxtBox.value());
    alignSlider.parent(alignControls);

    reRunButton = createButton('Rerun');
    reRunButton.parent('#button')

    var caption = select('.caption');
    caption.style(`width: ${canvasWidth}`);

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
