var boids = [];
var canvas;

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.style('z-index', '-1');

	let clearButton = createButton('Clear');
    clearButton.style('z-index', 0);
    clearButton.attribute('id','clearButton');
	clearButton.mousePressed(clearBoids);
	
	let specialAdd = createButton('Spawn Special');
	specialAdd.style('z-index', 0);
	specialAdd.attribute('id', 'specialAdd');
	specialAdd.mousePressed(spawnSpecial);
}

function draw() {
	background(75, 75, 85);
	for (let boid of boids) {
		boid.show();
		boid.update(boids);
	}
	if (mouseIsPressed && keyIsDown(CONTROL)) {
		spawnBoids(1);
	}
}


function clearBoids() {
	boids = [];
}

function spawnSpecial() {
	boids.push(new Boid(width / 2, height / 2));
	boids[boids.length - 1].makeSpecial();
}

function spawnBoids(num) {
	for (let i = 0; i < num; i++) {
		boids.push(new Boid(mouseX, mouseY));
	}
}