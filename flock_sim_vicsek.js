// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/



var sketch_flock_vicsek = function(s) {
    var flock;
    var reRunButton;

    var populationSlider;
    var speedSlider;
    var noiseSlider;

    var populationTxtBox;
    var speedTxtBox;
    var noiseTxtBox;

    var desirednoise;
    var desiredspeed;

    var canvas;

    s.setup = function() {
        var canvasWidth = 320;
        var canvasHeight = 360;

        var canvasDiv = s.select('#canvasDiv-vicsek')
        var sketchDiv = s.select('#sketch-holder-vicsek')
        sketchDiv.style('position: relative')
        canvas = s.createCanvas(canvasWidth, canvasHeight);
        //canvas = createCanvas(360, 360);
        canvas.parent(canvasDiv);
        //sketchDiv.style('width: ${canvasWidth}')


        var controls = s.select('#controlsDiv-vicsek')
        // controls.style('position: relative')

        // Population controls
        var populationControls = s.select('#population-vicsek');
        populationTxtBox = s.createInput(80);
        populationTxtBox.parent(populationControls);
        populationSlider = s.createSlider(0, 150, populationTxtBox.value());
        populationSlider.parent(populationControls);

        // Speed Controls
        var speedControls = s.select('#speed-vicsek');
        speedTxtBox = s.createInput(5);
        speedTxtBox.parent(speedControls);
        speedSlider = s.createSlider(0, 20, 5,0.1);
        speedSlider.parent(speedControls);

        // Noise Controls
        var noiseControls = s.select('#noise-vicsek');
        noiseTxtBox = s.createInput(0.1*s.PI);
        noiseTxtBox.parent(noiseControls);
        noiseSlider = s.createSlider(0, s.PI/2.0,0.1*s.PI,0.01);
        noiseSlider.parent(noiseControls);

        reRunButton = s.createButton('Rerun');
        reRunButton.parent('#button-vicsek')

        var caption = s.select('#caption-vicsek');
        caption.style(`width: ${canvasWidth}`);

        s.initializeFlockSim();
    }

    s.initializeFlockSim = function() {
        flock = new s.Flock();
        // Add an initial set of boids into the system
        for (var i = 0; i < populationTxtBox.value(); i++) {
            var b = new s.Boid(s.random(s.width),s.random(s.height));
            flock.addBoid(b);
        }
    }


    s.draw = function() {
        s.background(100);
        reRunButton.mousePressed(s.initializeFlockSim);
        populationSlider.input(s.populationSliderEvent);
        populationTxtBox.input(s.populationTextBoxEvent);
        speedSlider.input(s.speedSliderEvent);
        speedTxtBox.input(s.speedTxtBoxEvent);
        noiseSlider.input(s.noiseSliderEvent);
        noiseTxtBox.input(s.noiseTxtBoxEvent);

        desirednoise = noiseTxtBox.value();
        desiredspeed = speedTxtBox.value();

        flock.run(desirednoise, desiredspeed);
    }


    s.Flock = function() {
        // An array for all the boids
        this.boids = []; // Initialize the array

        this.run = function(desirednoise, desiredspeed) {
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].run(this.boids, desirednoise, desiredspeed); // Passing the entire list of boids to each boid individually
            }
        };

        this.addBoid = function(b) {
            this.boids.push(b);
        };
    }

    s.Boid = function(x, y) {

        this.theta = s.random(-3.1415, 3.14159)
        this.velocity = s.createVector(0, 0);
        this.position = s.createVector(x, y);
        this.r = 3.0;
        this.dt = 1.0;

        this.run = function(boids, desirednoise, desiredspeed) {
            this.update(boids,desirednoise, desiredspeed);
            this.borders();
            this.render();
        };


        // Method to update location
        this.update = function(boids,desirednoise, desiredspeed) {
            var noise_term = s.random(-desirednoise, desirednoise)
            var avg_theta = this.calc_avg_theta(boids)
            this.theta = avg_theta + noise_term
            this.velocity = s.createVector(s.sin(this.theta), s.cos(this.theta));
            this.velocity.mult(this.dt*desiredspeed)
            this.position.add(this.velocity);
        };

        // Wraparound
        this.borders = function() {
            if (this.position.x < -this.r) this.position.x = s.width + this.r;
            if (this.position.y < -this.r) this.position.y = s.height + this.r;
            if (this.position.x > s.width + this.r) this.position.x = -this.r;
            if (this.position.y > s.height + this.r) this.position.y = -this.r;
        };


        this.render = function() {
            // Draw a triangle rotated in the direction of velocity
            var theta = this.velocity.heading() + s.radians(90);

            s.fill(127);
            s.stroke(200);
            s.push();
            s.translate(this.position.x, this.position.y);
            s.rotate(theta);
            s.beginShape();
            s.vertex(0, -this.r * 2);
            s.vertex(-this.r, this.r * 2);
            s.vertex(this.r, this.r * 2);
            s.endShape(s.CLOSE);
            s.pop();
        };

        this.calc_avg_theta = function(boids) {
            var sum_cos_theta = 0.0
            var sum_sin_theta = 0.0
            var neighbordist = 3*this.r
            var count = 0;
            for (var i = 0; i < boids.length; i++) {
                var d = p5.Vector.dist(this.position, boids[i].position);
                if (d < neighbordist ) {

                    sum_cos_theta = sum_cos_theta + s.cos(boids[i].theta)
                    sum_sin_theta = sum_sin_theta+ s.sin(boids[i].theta)
                    count++;
                }
            }
            if (count > 0) {
                avg_cos_theta = sum_cos_theta / count
                avg_sin_theta = sum_sin_theta / count

                avg_theta = s.atan2(avg_sin_theta,avg_cos_theta)

                return avg_theta
            } else {
                console.log('Error!')
            };
        };

    };

    s.speedTxtBoxEvent = function() {
        speedSlider.value(speedTxtBox.value())
    }

    s.speedSliderEvent = function() {
        speedTxtBox.value(speedSlider.value())
    }

    s.noiseSliderEvent = function() {
        noiseTxtBox.value(noiseSlider.value())
    }

    s.noiseTxtBoxEvent = function() {
        noiseSlider.value(noiseTxtBox.value())
    }


    s.populationSliderEvent = function() {
        populationTxtBox.value(populationSlider.value())
        s.initializeFlockSim()
    }

    s.populationTextBoxEvent = function() {
        if (populationTxtBox.value() > 150) {
            populationTxtBox.value(150)
        }

        populationSlider.value(populationTxtBox.value())
        s.initializeFlockSim()
    }


}

var myp5_vicsek = new p5(sketch_flock_vicsek);
