var boids = [];
var specialIndecies = [];
var isSpecial = false;
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
	
	let spawnXButton = createButton('Spawn x3');
	spawnXButton.style('z-index', 0);
	spawnXButton.attribute('id', 'spawnX');
	spawnXButton.mousePressed(spawnX);

	let specialAdd = createButton('Spawn Special');
	specialAdd.style('z-index', 0);
	specialAdd.attribute('id', 'specialAdd');
	specialAdd.mousePressed(spawnSpecial);

	let specialClear = createButton('Toggle Specials');
	specialClear.style('z-index', 0);
	specialClear.attribute('id', 'specialClear');
	specialClear.mousePressed(toggleSpecials);
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
	specialIndecies = [];
}

function spawnSpecial() {
	boids.push(new Boid(width / 2, height / 2));
	boids[boids.length - 1].makeSpecial();
	specialIndecies.push(boids.length - 1);
	isSpecial = true;
}

function toggleSpecials() {
	if (specialIndecies.length > 0) {
		isSpecial = !isSpecial;
	}
	for (let i of specialIndecies) {
		if (isSpecial) {
			boids[i].makeSpecial();
		} else {
			boids[i].makeNormal();
		}
	}
}

function spawnX() {
	for (let i = 0; i < 3; i++) {
		boids.push(new Boid(random(0, width), random(0, height)));
	}
}

function spawnBoids(num) {
	for (let i = 0; i < num; i++) {
		boids.push(new Boid(mouseX, mouseY));
	}
}