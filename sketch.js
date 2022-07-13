let time = 0;
let wave =[];

function setup() {
  createCanvas(1400, 400);
}

function draw() {
  background(220);
  translate(200,200);

  stroke(255,0,0);
  line(-200,0,1200,0);
  line(0,200,0,-200);

  let radius = 150;

  noFill();
  stroke(0);
  ellipse(0,0,radius*2);

  let x = radius * cos(time);
  let y = radius * sin(time);

  wave.unshift(y);
  fill(0);
  line(0,0,x,y);
  ellipse(x,y,8);

  translate(200,0);
  line(x-200, y,  0, wave[0]);
  beginShape();
  noFill();
  stroke(255,0,0); 
  for(i=0;i<wave.length;i++)
  {
    vertex(i,wave[i]);
  }
  endShape();

  time -=.05;
}