var points;
var max_points;
var factor;
var addSpeed;
var r;
var offsetX;
var offsetY;
var orbitSpeed;
var Outer_Circle_Width;
var Follow_Speed;
var minDim;
var timeStartup;
var showText;

function setup() {
  createCanvas(windowWidth, windowHeight);
  max_points = 1000;
  factor = 0;
  addSpeed = 0.01;
  offsetX = 0;
  offsetY = 0;
  orbitSpeed = PI / 10;
  Outer_Circle_Width = 4;
  Follow_Speed = 0.15;
  textFont('calibri');
  timeStartup = second();
  showText = true;
  resize()
}
function resize() {
  minDim = min(width, height);
  points = 210 //int(minDim / 1.6);
  r = minDim / 2 * 0.5
  textSize(minDim / 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resize();
}

function mouseClicked() {
  showText = !showText;
}

function getVector(index, radius) {
  var angle = map(index % points, 0, points, 0, TWO_PI);
  var v = p5.Vector.fromAngle(angle + HALF_PI, radius);
  return v;
}

function circle(x, y, r) {
  ellipse(x, y, r, r);
}

function logx(y, x) {
  return log(y) / log(x);
}

function log10(y) {
  return logx(y, 10);
}

function maplog(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var outMinLog = log(out_min);
  var outMaxLog = log(out_max);
  var scale = (outMaxLog - outMinLog) / (in_max - in_min);
  var res = exp(outMinLog + scale * (value - in_min));
  return withinBounds ? constrain(res, out_min, out_max) : res;
}

function mappow(value, in_min, in_max, out_min, out_max, power, withinBounds = false) {
  var pitch = map(value, in_min, in_max, 0, 1);
  var powered = pow(pitch, power);
  return map(powered, 0, 1, out_min, out_max, withinBounds);
}

function mapu(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var pitch = map(value, in_min, in_max, -1, 1);
  var powered = pow(pitch, 2);
  return map(powered, 0, 1, out_min, out_max, withinBounds);
}

function maps(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var pitch = map(value, in_min, in_max, -1, 1);
  var powered = pow(pitch, 3);
  return map(powered, -1, 1, out_min, out_max, withinBounds);
}

function toFixed(value, maxDecimals) {
  return round(value * pow(10, maxDecimals)) / pow(10, maxDecimals);
}

function cabloidCircle(x, y, radius, f, pts) {
  circle(x, y, radius * 2);
  for (i = 0; i < pts; i++) {
    var a = getVector(i, radius);
    var b = getVector(i * f, radius);
    line(a.x + x, a.y + y, b.x + x, b.y + y);
  }
}

function orbitCircle(angle, scale, f) {
  var dx = offsetX + (r * (1.1 + 1 / scale) * cos(angle));
  var dy = offsetY + (r * (1.1 + 1 / scale) * sin(angle));
  cabloidCircle(dx, dy, r / scale, f, points);
}

function draw() {
  background(25);
  strokeWeight(1);

  //points = int(map(mouseX, 0, width, 0, max_points));

  factorAdd = -1 * float(maps(mouseX, 0, width, -addSpeed, addSpeed, true));
  factor += factorAdd;
  //print("factorAdd " + factorAdd + ", " + mouseX);

  colorMode(HSB, 255);
  var color = map(abs(factor % (addSpeed * 1000)), 0, (addSpeed * 1000), 0, 255);
  translate(width / 2, height / 2);
  stroke(color, map(mouseY, 0, height, 200, 120, true), 255);
  noFill();

  var lowOff = 10;
  var highOff = -10;

  var targetOffsetX = map(mouseX, 0, width, lowOff, highOff, true);
  var targetOffsetY = map(mouseY, 0, height, lowOff, highOff, true);

  offsetX = lerp(offsetX, targetOffsetX, Follow_Speed);
  offsetY = lerp(offsetY, targetOffsetY, Follow_Speed);

  //mid circle
  //circle(offsetX, offsetY, r * 2);

  //for	(var i = 0; i < points; i++) {
  //	var v = getVector(i);
  //	fill(color, 200, 255);
  //	circle(v.x + offsetX, v.y + offsetY, Outer_Circle_Width);
  //}

  //for (i = 0; i < points; i++) {
  //  var a = getVector(i);
  //  var b = getVector(i * factor);
  //  line(a.x + offsetX, a.y + offsetY, b.x + offsetX, b.y + offsetY);
  //}
  cabloidCircle(offsetX, offsetY, r, factor, points);

  var orbitAngle = ((timeStartup / 60 + millis() / 60000) * TWO_PI) % TWO_PI;
  var orbitAngle2 = (orbitAngle + PI) % TWO_PI;


  //text('> more info', 0 - textXOffset + offsetX / 6, height / 2 - minDim / 40 + offsetY / 6);

  //orbit circles
  var scale = 3;
  orbitCircle(orbitAngle, scale, factor - 1);
  orbitCircle(orbitAngle2, scale, factor / 2);
  
  if(showText) {
  textAlign(LEFT);
  var showInfo = mouseY > height * 0.9;
  var textXOffset = width / 2 * 0.9;
  //text('elapsed: ' + toFixed(orbitAngle, 3), 0 - textXOffset + offsetX / 6, height / 2 - (minDim / 60) * 4 + offsetY / 6);

  text('faktoret: ' + toFixed(factor, 1), 0 - textXOffset + offsetX / 6, height / 2 - minDim / 40 + offsetY / 6);
  textAlign(RIGHT);
  text('pikat: ' + toFixed(points, 3), textXOffset + offsetX / 6, height / 2 - minDim / 40 + offsetY / 6);
  
  textAlign(CENTER, CENTER);
  if (showInfo) {
    //text('offsetX: ' + toFixed(offsetX, 2), 0 - r, height/2 - 55);
    //text('speed: ' + toFixed(factorAdd, 3), 0 - r + offsetX/6 , height/2 - 40 + offsetY/6);
    //text('log factor: ' + toFixed(max(0, logx(abs(factor), 20)), 3), 0 - r + offsetX/6 , height/2 - 80 + offsetY/6);
  //var dx = offsetX + (r * (1.1 + 1 / scale) * cos(angle));
  //var dy = offsetY + (r * (1.1 + 1 / scale) * sin(angle));
    
    var ox1 = offsetX + r * (1.1 + 1 / scale) * cos((orbitAngle + PI / (9 - max(1, log10(abs(factor - 1))))) % TWO_PI);
    var oy1 = offsetY + r * (1.1 + 1 / scale) * sin((orbitAngle + PI / (9 - max(1, log10(abs(factor - 1))))) % TWO_PI);
    var ox2 = offsetX + r * (1.1 + 1 / scale) * cos((orbitAngle2 - PI / (9 - max(1, log10(abs(factor / 2))))) % TWO_PI);
    var oy2 = offsetY + r * (1.1 + 1 / scale) * sin((orbitAngle2 - PI / (9 - max(1, log10(abs(factor / 2))))) % TWO_PI);
    
    text(toFixed(factor - 1, 1), ox1, oy1);
    text(toFixed(factor / 2, 1), ox2, oy2);
  }
  }

  textAlign(CENTER, CENTER);
  //numeruesi i sekondave
  var timeAngle = (orbitAngle - HALF_PI) % TWO_PI
  var timeRadiusOff = abs(sin(millis() * PI / 1000)) / 10
  //print(timeRadiusOff);
  var tdx = offsetX + (r * (1.05 + timeRadiusOff + 1 / scale) * cos(timeAngle));
  var tdy = offsetY + (r * (1.05 + timeRadiusOff + 1 / scale) * sin(timeAngle));
  var tx = offsetX + (r * (0.9 + 1 / scale) * cos(timeAngle));
  var ty = offsetY + (r * (0.9 + 1 / scale) * sin(timeAngle));

  text(int(timeStartup + millis() / 1000) % 60, tx, ty);

  strokeWeight(map(minDim, 0, 1240, 1, 15, true));
  point(tdx, tdy);

  //strokeWeight(8);
  //Sin?
  //var pendulumOrbitAngle = (orbitAngle + HALF_PI) % TWO_PI
  //var x = offsetX + (r * (1.05+1/scale) * cos(pendulumOrbitAngle));
  //var y = offsetY + (r * (1.05+1/scale) * sin(pendulumOrbitAngle));
  //point(x, y);
}