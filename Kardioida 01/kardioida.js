let p = 350;
let r = 0;
let f = 0;
let t = 0;
let n = 0;
let max = 3;
var o;

function setup() {
    createCanvas(1600, 760);
    r = height - 16;
    o = createVector(width / 2, height / 2);
    f = 0;
    t = 3 * PI / 2;
}

function draw() {
    background(0);
    t += 0.005;
    max = map(mouseX, 0, width, 2, 20);
    f = map(sin(t) + 1, 0, 2, 0, max);

    noFill();
    stroke(255);
    strokeWeight(2);

    //circle(o.x, o.y, r);

    n = 360 / p;
    for (let a = 0; a < 360; a += n) {

        let rad = a * 2 * PI / 360;
        let x = o.x - cos(rad) * r / 2;
        let y = o.y - sin(rad) * r / 2;
        let x2 = o.x - cos(f * rad) * r / 2;
        let y2 = o.y - sin(f * rad) * r / 2;

        strokeWeight(1);
        stroke(
            //            ngjyra e pare                   ngjyra e dyte
            //                  |                              |
            //                  V                              V
            map(rad, 0, 2 * PI, 0, map(rad, 0, 2 * PI, 0,     255)),
            map(rad, 0, 2 * PI, 100, map(rad, 0, 2 * PI, 255, 0)),
            map(rad, 0, 2 * PI, 255, map(rad, 0, 2 * PI, 0,   255))
        );
        line(x, y, x2, y2);
    }
}