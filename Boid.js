class Boid {

    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(6,10));
        this.acceleration = createVector();
        this.maxSteeringForce = .25;
        this.minSpeed = 4.5;
        this.maxSpeed = 9;
        this.r = random(175, 235);
        this.g = random(175, 235);
        this.b = random(205, 255);
    }

    show() {
        push();
        strokeWeight(10);
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
    }

    makeSpecial() {
        this.r = 255;
        this.g = 105;
        this.b = 105;
    }

    update(boids) {
        this.edges();
        let alignment = this.align(boids);
        let cohesion = this.cohere(boids);
        let separation = this.separate(boids);
    
        this.acceleration = alignment.add(cohesion.add(separation));

        this.velocity.add(this.acceleration);
        let speed = this.velocity.mag();
        if (speed < this.minSpeed) {
            this.velocity.setMag = this.minSpeed;
        }
        this.velocity.limit(this.maxSpeed);

        this.position.add(this.velocity);
    }

    align(boids) {
        let perception = 150;
        let steeringForce = createVector(0, 0);
        let avg = createVector();
        let numPerceived = 0;
        for (let boid of boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && d <= perception) {
                numPerceived++;
                avg.add(boid.velocity);
            }
        }
        if (numPerceived != 0) {
            avg.div(numPerceived);
            avg.setMag(this.maxSpeed);
            steeringForce = avg.sub(this.velocity);
            steeringForce.limit(this.maxSteeringForce);
        }
        return steeringForce;
    }

    cohere(boids) {
        let perception = 150;
        let steeringForce = createVector(0, 0);
        let avg = createVector();
        let numPerceived = 0;
        for (let boid of boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this && d <= perception) {
                numPerceived++;
                avg.add(boid.position);
            }
        }
        if (numPerceived != 0) {
            avg.div(numPerceived);
            avg.sub(this.position);
            avg.setMag(this.maxSpeed);
            steeringForce = avg.sub(this.velocity);
            steeringForce.limit(this.maxSteeringForce);
        }
        return steeringForce;
    }

    separate() {
        let separation = 60;
        let steeringForce = createVector(0,0);
        let avg = createVector(0,0);
        let numPerceived = 0;
        for (let boid of boids) {
            let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);
            if (boid != this &&  d <= separation) {
                numPerceived++;
                let v = p5.Vector.sub(this.position, boid.position);
                v.div(d * d);
                avg.add(v);
            }
        }
        if (numPerceived != 0) {
            avg.div(numPerceived);
            avg.setMag(this.maxSpeed);
            steeringForce = avg.sub(this.velocity);
            steeringForce.limit(1.5 * this.maxSteeringForce);
        }
        return steeringForce;
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