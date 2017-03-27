var boids=[]

function setup() {
  var canvas = createCanvas(300, 300);
  canvas.parent('sketch-holder');
  background(200);
  stroke(0);
  strokeWeight(4);
  fill(240);
  rect(0, 0, 300, 300);

  var sketch=select('#sketch-holder');
  sketch.style('float','left')
  sketch.style('margin','20px')
}

function draw() {
  background(240);
  stroke(0);
  strokeWeight(4);
  fill(240);
  rect(0, 0, 300, 300);

  for (var i=0; i < boids.length; i++){
    boids[i].move();
    boids[i].display();
  }
}

function mouseDragged(){
  boids.push(new Boid(mouseX,mouseY))
}

function Boid(x,y){
  this.pos = createVector(x,y);
  this.vel = createVector(random(-5,5),0);
  this.acc = createVector(random(-5,5),0);

  this.display = function(){
      stroke(255);
      strokeWeight(1);
      fill(255,0,150,50);
      ellipse(this.pos.x,this.pos.y,24,24);
  }

  this.move = function(){
    var mouse = createVector(mouseX,mouseY);
    this.acc = p5.Vector.sub(mouse, this.pos);

    this.acc.add(p5.Vector.mult(this.vel,-2.0));
    this.acc.mult(0.01);
    this.vel.add(this.acc)
    this.pos.add(this.vel);
  }
}
