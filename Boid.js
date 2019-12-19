class Boid {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(6,10));
        this.acceleration = createVector();
        this.r = random(175, 235);
        this.g = random(175, 235);
        this.b = random(205, 255);
        this.drawVectors = false;

        this.visualMultiplier = 150;

        this.scale = .75;

        this.maxSteeringForce = .25 * this.scale;
        this.minSpeed = 4.5 * this.scale;
        this.maxSpeed = 9 * this.scale;
        this.perception = 150 * this.scale;
        this.separation = 60 * this.scale;
        this.colisionForceMult = 1.5;
        this.colisionDistMult = 2;
        this.perceptionColor = color(44, 228, 215, 255);
        this.separationColor = color(255, 14, 16, 255);
        this.strokeWeight = 10 * this.scale;
    }

    show() {
        push();
        strokeWeight(this.strokeWeight);
        stroke(this.r,this.g,this.b);
        translate(this.position.x, this.position.y);
        let x1 = 0;
        let y1 = -1;
        let x2 = -.5;
        let y2 = 1;
        let x3 = .5;
        let y3 = 1;
        rotate(this.velocity.heading() + radians(90));
        triangle(x1, y1, x2, y2, x3, y3);
        pop();
        if (this.drawVectors) {
            this.drawCircle(this.position, this.separation, this.separationColor);
            this.drawCircle(this.position, this.perception, this.perceptionColor);
        }
    }

    makeSpecial() {
        this.r = 255;
        this.g = 105;
        this.b = 105;
        this.drawVectors = true;
    }

    makeNormal() {
        this.r = random(175, 235);
        this.g = random(175, 235);
        this.b = random(205, 255);
        this.drawVectors = false;
    }

    update(boids, isPaused) {
        this.edges();
    
        let accel = this.getAcceleration(boids);

        this.acceleration = isPaused ? createVector(0, 0) : accel;

        this.velocity.add(this.acceleration);
        let speed = this.velocity.mag();
        if (speed < this.minSpeed) {
            this.velocity.setMag = this.minSpeed;
        }
        this.velocity.limit(this.maxSpeed);

        this.position.add(this.velocity);
    }

    getAcceleration(boids) {
        let alignmentForce = createVector(0, 0);
        let alignmentAvg = createVector(0, 0);
        let cohesionForce = createVector(0, 0);
        let cohesionAvg = createVector(0, 0);
        let coheseAlignNum = 0;

        let separationForce = createVector(0, 0);
        let separationAvg = createVector(0, 0);
        let separationNum = 0;

        for (let p of boids) {
            let boid = p;
            if (usingQuadtree) {
                boid = p.userData;
            }
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            let comp = p5.Vector.sub(boid.position, this.position);
            if (boid != this) {
                if (d <= this.perception) {
                    coheseAlignNum++;

                    alignmentAvg.add(boid.velocity);
                    cohesionAvg.add(boid.position);
                }
                if (d <= this.separation) {
                    separationNum++;
    
                    let v = p5.Vector.sub(this.position, boid.position);
                    v.div(Math.pow(d, this.colisionDistMult));
                    separationAvg.add(v);
                }
                if (this.drawVectors) {
                    this.drawArrow(this.position, comp, color(195,255,195,105), 2)
                }
            }
        }

        if (coheseAlignNum != 0) {
            alignmentAvg.div(coheseAlignNum);
            alignmentAvg.setMag(this.maxSpeed);            
            alignmentForce = alignmentAvg.sub(this.velocity);
            alignmentForce.limit(this.maxSteeringForce);
            
            cohesionAvg.div(coheseAlignNum);
            cohesionAvg.sub(this.position);
            cohesionAvg.setMag(this.maxSpeed);
            cohesionForce = cohesionAvg.sub(this.velocity);
            cohesionForce.limit(this.maxSteeringForce);
        }

        if (separationNum != 0) {
            separationAvg.div(separationNum);
            separationAvg.setMag(this.maxSpeed);
            separationForce = separationAvg.sub(this.velocity);
            separationForce.limit(this.colisionForceMult * this.maxSteeringForce);
        }

        if (this.drawVectors) {
            let v = p5.Vector.mult(alignmentForce, this.visualMultiplier);
            this.drawArrow(this.position, v, 'purple', 3);
            v = p5.Vector.mult(cohesionForce, this.visualMultiplier);
            this.drawArrow(this.position, v, 'green', 3);
            v = p5.Vector.mult(separationForce, this.visualMultiplier);
            this.drawArrow(this.position, v, 'red', 3);
        }

        return alignmentForce.add(cohesionForce.add(separationForce));
    }

    drawArrow(base, vec, myColor, weight) {
        push();
        stroke(myColor);
        strokeWeight(weight);
        fill(myColor);
        translate(base.x, base.y);
        line(0, 0, vec.x, vec.y);
        rotate(vec.heading());
        let arrowSize = weight * 2 + 1;
        translate(vec.mag() - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }

    drawCircle(base, radius, myColor) {
        push();
        ellipseMode(RADIUS);
        stroke(myColor);
        strokeWeight(4);
        myColor.setAlpha(50);
        fill(myColor);
        ellipse(base.x, base.y, radius, radius);
        pop();
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }
}