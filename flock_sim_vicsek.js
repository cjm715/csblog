// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/



var sketch_flock_vicsek = function(s) {
    var flock;
    var reRunButton;
    var startButton;
    var stopButton;

    var populationSlider;
    var speedSlider;
    var noiseSlider;

    var populationTxtBox;
    var speedTxtBox;
    var noiseTxtBox;

    var desirednoise;
    var desiredspeed;

    var canvas;

    var time_steps_since_start_vicsek;

    s.setup = function() {
        var canvasWidth = 320;
        var canvasHeight = 320;

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
        speedTxtBox = s.createInput(2.5);
        speedTxtBox.parent(speedControls);
        speedSlider = s.createSlider(0.0001, 10, 2.5,0.1);
        speedSlider.parent(speedControls);

        // Noise Controls
        var noiseControls = s.select('#noise-vicsek');
        noiseTxtBox = s.createInput(0.1*s.PI);
        noiseTxtBox.parent(noiseControls);
        noiseSlider = s.createSlider(0, 2.*s.PI,0.1*s.PI,0.01);
        noiseSlider.parent(noiseControls);

        var button_row = s.select('#button-vicsek')
        order_parameter_holder = s.createDiv('');
        order_parameter_holder.parent(button_row)
        order_parameter_leading_text = s.createSpan('Order parameter $ \\varphi = $ ');
        order_parameter_leading_text.parent(order_parameter_holder)
        order_parameter_following_text = s.createSpan(' ');
        order_parameter_following_text.parent(order_parameter_holder)


        time_holder_vicsek = s.createDiv('');
        time_holder_vicsek.parent(button_row)
        time_leading_text_vicsek = s.createSpan('Time steps $t = $ ');
        time_leading_text_vicsek.parent(time_holder_vicsek)
        time_following_text_vicsek = s.createSpan(' ');
        time_following_text_vicsek.parent(time_holder_vicsek)

        reRunButton = s.createButton('Rerun');
        reRunButton.parent(button_row)

        startButton = s.createButton('Start');
        startButton.parent(button_row)

        stopButton = s.createButton('Stop');
        stopButton.parent(button_row)

        caption = s.select('#caption-vicsek');
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
        time_steps_since_start_vicsek=0
        running_flag_vicsek = true

    }

    s.stopFlockSim = function(){
      running_flag_vicsek = false
    }

    s.startFlockSim = function(){
      running_flag_vicsek = true
    }

    s.draw = function() {
        reRunButton.mousePressed(s.initializeFlockSim);
        startButton.mouseReleased(s.startFlockSim);
        stopButton.mouseReleased(s.stopFlockSim);
        populationSlider.input(s.populationSliderEvent);
        populationTxtBox.input(s.populationTextBoxEvent);
        speedSlider.input(s.speedSliderEvent);
        speedTxtBox.input(s.speedTxtBoxEvent);
        noiseSlider.input(s.noiseSliderEvent);
        noiseTxtBox.input(s.noiseTxtBoxEvent);

        desirednoise = noiseTxtBox.value();
        desiredspeed = speedTxtBox.value();

        if (running_flag_vicsek){
          s.background(100);
          flock.run(desirednoise, desiredspeed);
          var order_parameter = flock.calc_order_parameter(desiredspeed);
          order_parameter_following_text.html(s.str(order_parameter.toFixed(2)))
          time_steps_since_start_vicsek++;
          time_following_text_vicsek.html(s.str(time_steps_since_start_vicsek));
       }
    }


    s.Flock = function() {
        // An array for all the boids
        this.boids = []; // Initialize the array

        this.run = function(desirednoise, desiredspeed) {
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].run(this.boids, desirednoise, desiredspeed); // Passing the entire list of boids to each boid individually
            }
        };

        this.calc_order_parameter = function(desiredspeed){
            // calculate group speed
            var sum = s.createVector(0, 0);
            for (var i = 0; i < this.boids.length; i++) {
                sum.add(this.boids[i].velocity);
            }
            sum.div(this.boids.length);
            group_speed = sum.mag();
            order_parameter = group_speed / desiredspeed
            return order_parameter;

        }

        this.addBoid = function(b) {
            this.boids.push(b);
        };
    }

    s.Boid = function(x, y) {

        this.theta = s.random(-3.1415, 3.14159)
        this.velocity = s.createVector(0, 0);
        this.position = s.createVector(x, y);
        this.r = 10.0;
        this.dt = 1.0;

        this.run = function(boids, desirednoise, desiredspeed) {
            this.update(boids,desirednoise, desiredspeed);
            this.borders();
            this.render();
        };


        // Method to update location
        this.update = function(boids,desirednoise, desiredspeed) {
            var noise_term = s.random(-desirednoise/2., desirednoise/2.)
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
            scale = 3.0
            s.vertex(0, -scale* 2);
            s.vertex(-scale, scale * 2);
            s.vertex(scale, scale * 2);
            s.endShape(s.CLOSE);
            s.pop();
        };

        this.calc_avg_theta = function(boids) {
            var sum_cos_theta = 0.0
            var sum_sin_theta = 0.0
            var neighbordist = this.r
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
