var boids = [];
var specialIndecies = [];
var isSpecial = false;
var usingQuadtree = false;
var visualizingQuadtree = false;
var canvas;
var quadtree;

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.style('z-index', '-1');
	quadtree = new Quadtree(width / 2, height / 2, width / 2, height / 2);

	let clearButton = createButton('Clear');
    clearButton.style('z-index', 0);
    clearButton.attribute('id','button');
	clearButton.mousePressed(clearBoids);
	
	let spawnXButton = createButton('Spawn x3');
	spawnXButton.style('z-index', 0);
	spawnXButton.attribute('id', 'button');
	spawnXButton.style('top', '35%');
	spawnXButton.mousePressed(spawnX);

	let specialAdd = createButton('Spawn Special');
	specialAdd.style('z-index', 0);
	specialAdd.attribute('id', 'button');
	specialAdd.style('top', '40%');
	specialAdd.mousePressed(spawnSpecial);

	let specialClear = createButton('Toggle Specials');
	specialClear.style('z-index', 0);
	specialClear.attribute('id', 'button');
	specialClear.style('top', '45%');
	specialClear.mousePressed(toggleSpecials);

	let quadToggle = createButton('Use Quadtree');
	quadToggle.style('z-index', 0);
	quadToggle.attribute('id', 'button');
	quadToggle.style('top', '50%');
	quadToggle.mousePressed(toggleQuadtree);

	let quadVis = createButton("*Vis Quadtree*");
	quadVis.style('z-index', 0);
	quadVis.attribute('id', 'button');
	quadVis.style('top', '55%');
	quadVis.mousePressed(toggleQuadtreeVis);

}

function draw() {
	background(75, 75, 85);
	drawFrames();

	if (usingQuadtree) {
		quadtree = new Quadtree(width / 2, height / 2, width / 2, height / 2);
		for (let boid of boids) {
			let p = new Point(boid.position.x, boid.position.y, boid);
			quadtree.insert(p);
		}

		if (visualizingQuadtree) {quadtree.show();}

		for (let boid of boids) {
			let range = new Boundary(boid.position.x, boid.position.y, boid.perception, boid.perception);
        	let query = quadtree.query(range);

			boid.show();
			boid.update(query, keyIsDown(ALT));
		}
	} else {
		for (let boid of boids) {
			boid.show();
			boid.update(boids, keyIsDown(ALT));
		}
	}
	if (mouseIsPressed && keyIsDown(CONTROL)) {
		spawnBoids(1);
	}
}

function drawFrames() {
	push();
	rectMode(CENTER);
	textSize(32);
	text(frameRate(), width - 70,  30);
	fill(color(245, 141, 66));
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

function toggleQuadtree() {
	usingQuadtree = !usingQuadtree;
	console.log(usingQuadtree);	
}

function toggleQuadtreeVis() {
	visualizingQuadtree = !visualizingQuadtree;
	console.log(visualizingQuadtree);	
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