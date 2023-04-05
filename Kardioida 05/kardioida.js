let n = 0;
let t = 20;
let sides = 3;

let points = [];

let sides_slider;
let sides_p;
let points_slider;
let points_p;

let times_p;


function setup() {
    createCanvas(windowWidth, windowHeight);

    sides_slider = createSlider(3, 20, 3);
    sides_p = createP("Brinjet: " + sides_slider.value());
    sides_p.addClass("value");
    sides_p.position(15, 10);
    sides_slider.position(15, 65);
    sides_slider.mouseMoved(changeSides);

    points_slider = createSlider(10, 60, 20, 5);
    points_p = createP("Pika/brinje: " + points_slider.value());
    points_p.addClass("value");
    points_p.position(15, 100);
    points_slider.position(15, 155);
    points_slider.mouseMoved(changePoints);

    times_p = createP("Tranzicioni: ");
    times_p.addClass("value");
    times_p.position(width - 240, height - 80);

    createPoint();
}

function changeSides() {
    sides_p.html("Brinjet: " + sides_slider.value());
    sides = sides_slider.value();

    createPoint();
}

function changePoints() {
    points_p.html("Pika/brinje: " + points_slider.value());
    t = points_slider.value();

    createPoint();
}

function createPoint() {
    points = [];

    for (let i = 0; i < sides; i++) {
        let x = 300 * cos(TWO_PI * i / sides - HALF_PI);
        let y = 300 * sin(TWO_PI * i / sides - HALF_PI);
        points[floor(i * t)] = (createVector(x, y));
    }
    for (let j = 0; j < sides; j++) {
        for (let i = 1; i < t; i++) {
            let p = p5.Vector.lerp(points[j * t], points[(j + 1) * t % (sides * t)], 1 * i / t);
            points[(j * t) + i] = p;
        }
    }
}

function draw() {
    background(50);
    translate(width / 2, height / 2);

    for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const p_next = points[floor(i * n) % points.length];

        // PIKAT
        stroke(255);
        strokeWeight(5);
        point(p.x, p.y);

        // VIJAT
        stroke(255, 0, 0, 150);
        strokeWeight(2);
        line(p.x, p.y, p_next.x, p_next.y);
    }
    n = n + 0.01;

    translate(-width / 2, -height / 2);

    times_p.html("Tranzitimi: " + n.toFixed(1));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}