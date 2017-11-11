// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

// Click mouse to add boids into the system

var sketch_flock = function(s) {
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

    s.setup = function() {
        var canvasWidth = 360;
        var canvasHeight = 360;

        var canvasDiv = s.select('#canvasDiv')
        var sketchDiv = s.select('#sketch-holder')
        //sketchDiv.style('position: relative')
        canvas = s.createCanvas(canvasWidth, canvasHeight);
        //canvas = createCanvas(360, 360);
        canvas.parent(canvasDiv);
        //sketchDiv.style('width: ${canvasWidth}')


        var controls = s.select('#controlsDiv')
        // controls.style('position: relative')

        // Population controls
        var populationControls = s.select('#population');
        populationTxtBox = s.createInput(80);
        populationTxtBox.parent(populationControls);
        populationSlider = s.createSlider(0, 150, populationTxtBox.value());
        populationSlider.parent(populationControls);


        // Seperation Controls
        var seperationControls = s.select('#seperation');
        seperationTxtBox = s.createInput(16);
        seperationTxtBox.parent(seperationControls);
        seperationSlider = s.createSlider(0, 200, seperationTxtBox.value());
        seperationSlider.parent(seperationControls);


        // Cohesion Controls
        var cohesionControls = s.select('#cohesion');
        cohesionTxtBox = s.createInput(44);
        cohesionTxtBox.parent(cohesionControls);
        cohesionSlider = s.createSlider(0, 200, cohesionTxtBox.value());
        cohesionSlider.parent(cohesionControls);

        // Align Controls
        var alignControls = s.select('#alignment');
        alignTxtBox = s.createInput(20);
        alignTxtBox.parent(alignControls);
        alignSlider = s.createSlider(0, 200, alignTxtBox.value());
        alignSlider.parent(alignControls);

        reRunButton = s.createButton('Rerun');
        reRunButton.parent('#button')

        var caption = s.select('.caption');
        caption.style(`width: ${canvasWidth}`);

        s.initializeFlockSim();
    }

    s.initializeFlockSim = function() {
        flock = new s.Flock();
        // Add an initial set of boids into the system
        for (var i = 0; i < populationTxtBox.value(); i++) {
            var b = new s.Boid(s.width / 2, s.height / 2);
            flock.addBoid(b);
        }
    }


    s.draw = function() {
        s.background(100);
        reRunButton.mousePressed(s.initializeFlockSim);
        populationSlider.input(s.populationSliderEvent);
        populationTxtBox.input(s.populationTextBoxEvent);
        seperationTxtBox.input(s.seperationTxtBoxEvent);
        seperationSlider.input(s.seperationSliderEvent);
        cohesionSlider.input(s.cohesionSliderEvent);
        cohesionTxtBox.input(s.cohesionTxtBoxEvent);
        alignSlider.input(s.alignSliderEvent);
        alignTxtBox.input(s.alignTxtBoxEvent);

        desiredSeperation = seperationTxtBox.value();
        neighbordist = alignTxtBox.value();
        desiredCohesion = cohesionTxtBox.value();

        flock.run(desiredSeperation, neighbordist, desiredCohesion);
    }


    s.Flock = function() {
        // An array for all the boids
        this.boids = []; // Initialize the array

        this.run = function(desiredSeperation, neighbordist, desiredCohesion) {
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].run(this.boids, desiredSeperation, neighbordist, desiredCohesion); // Passing the entire list of boids to each boid individually
            }
        };


        this.addBoid = function(b) {
            this.boids.push(b);
        };
    }

    s.Boid = function(x, y) {
        this.acceleration = s.createVector(0, 0);
        this.velocity = s.createVector(s.random(-1, 1), s.random(-1, 1));
        this.position = s.createVector(x, y);
        this.r = 3.0;
        this.maxspeed = 3; // Maximum speed
        this.maxforce = 0.05; // Maximum steering force

        this.run = function(boids, desiredSeperation, neighbordist, desiredCohesion) {
            this.flockDynamic(boids, desiredSeperation, neighbordist, desiredCohesion);
            this.update();
            this.borders();
            this.render();
        };

        this.applyForce = function(force) {
            // We could add mass here if we want A = F / M
            this.acceleration.add(force);
        };

        // We accumulate a new acceleration each time based on three rules
        this.flockDynamic = function(boids, desiredSeperation, neighbordist, desiredCohesion) {
            var sep = this.separate(boids, desiredSeperation); // Separation
            var ali = this.align(boids, neighbordist); // Alignment
            var coh = this.cohesion(boids, desiredCohesion); // Cohesion
            // Arbitrarily weight these forces
            sep.mult(1.5);
            ali.mult(1.0);
            coh.mult(1.0);
            // Add the force vectors to acceleration
            this.applyForce(sep);
            this.applyForce(ali);
            this.applyForce(coh);
        };

        // Method to update location
        this.update = function() {
            // Update velocity
            this.velocity.add(this.acceleration);
            // Limit speed
            this.velocity.limit(this.maxspeed);
            this.position.add(this.velocity);
            // Reset accelertion to 0 each cycle
            this.acceleration.mult(0);
        };

        // A method that calculates and applies a steering force towards a target
        // STEER = DESIRED MINUS VELOCITY
        this.seek = function(target) {
            var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
            // Normalize desired and scale to maximum speed
            desired.normalize();
            desired.mult(this.maxspeed);
            // Steering = Desired minus Velocity
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce); // Limit to maximum steering force
            return steer;
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

        // Wraparound
        this.borders = function() {
            if (this.position.x < -this.r) this.position.x = s.width + this.r;
            if (this.position.y < -this.r) this.position.y = s.height + this.r;
            if (this.position.x > s.width + this.r) this.position.x = -this.r;
            if (this.position.y > s.height + this.r) this.position.y = -this.r;
        };

        // Separation
        // Method checks for nearby boids and steers away
        this.separate = function(boids, desiredseparation) {
            // var desiredseparation = desiredseparation;
            var steer = s.createVector(0, 0);
            var count = 0;
            // For every boid in the system, check if it's too close
            for (var i = 0; i < boids.length; i++) {
                var d = p5.Vector.dist(this.position, boids[i].position);
                // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
                if ((d > 0) && (d < desiredseparation)) {
                    // Calculate vector pointing away from neighbor
                    var diff = p5.Vector.sub(this.position, boids[i].position);
                    diff.normalize();
                    diff.div(d); // Weight by distance
                    steer.add(diff);
                    count++; // Keep track of how many
                }
            }
            // Average -- divide by how many
            if (count > 0) {
                steer.div(count);
            }

            // As long as the vector is greater than 0
            if (steer.mag() > 0) {
                // Implement Reynolds: Steering = Desired - Velocity
                steer.normalize();
                steer.mult(this.maxspeed);
                steer.sub(this.velocity);
                steer.limit(this.maxforce);
            }
            return steer;
        };

        // Alignment
        // For every nearby boid in the system, calculate the average velocity
        this.align = function(boids, neighbordist) {
            // var neighbordist = neighbordist;
            var sum = s.createVector(0, 0);
            var count = 0;
            for (var i = 0; i < boids.length; i++) {
                var d = p5.Vector.dist(this.position, boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    sum.add(boids[i].velocity);
                    count++;
                }
            }
            if (count > 0) {
                sum.div(count);
                sum.normalize();
                sum.mult(this.maxspeed);
                var steer = p5.Vector.sub(sum, this.velocity);
                steer.limit(this.maxforce);
                return steer;
            } else {
                return s.createVector(0, 0);
            }
        };

        // Cohesion
        // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
        this.cohesion = function(boids, desiredCohesion) {
            var neighbordist = desiredCohesion;
            var sum = s.createVector(0, 0); // Start with empty vector to accumulate all locations
            var count = 0;
            for (var i = 0; i < boids.length; i++) {
                var d = p5.Vector.dist(this.position, boids[i].position);
                if ((d > 0) && (d < neighbordist)) {
                    sum.add(boids[i].position); // Add location
                    count++;
                }
            }
            if (count > 0) {
                sum.div(count);
                return this.seek(sum); // Steer towards the location
            } else {
                return s.createVector(0, 0);
            }
        };
    }

    s.cohesionTxtBoxEvent = function() {
        cohesionSlider.value(cohesionTxtBox.value())
    }

    s.cohesionSliderEvent = function() {
        cohesionTxtBox.value(cohesionSlider.value())
    }

    s.alignSliderEvent = function() {
        alignTxtBox.value(alignSlider.value())
    }

    s.alignTxtBoxEvent = function() {
        alignSlider.value(alignTxtBox.value())
    }

    s.seperationTxtBoxEvent = function() {
        seperationSlider.value(seperationTxtBox.value())
    }

    s.seperationSliderEvent = function() {
        seperationTxtBox.value(seperationSlider.value())
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

var myp5 = new p5(sketch_flock);
