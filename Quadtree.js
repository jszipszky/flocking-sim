class Quadtree {
    constructor(x, y, w, h) {
        this.capacity = 4;
        this.points = [];

        this.boundary = new Boundary(x, y, w, h);

        this.isDivided = false;

        this.northeast;
        this.northwest;
        this.southeast;
        this.southwest;
    }

    insert(p) {
        if (!this.boundary.contains(p))  {return false;}
        
        if (this.points.length < this.capacity && !this.isDivided) {
            this.points.push(p);
        } else {
            if (!this.isDivided) {
                this.subdivide();
            }
            if (this.northeast.insert(p)) {return true;}
            if (this.northwest.insert(p)) {return true;}
            if (this.southeast.insert(p)) {return true;}
            if (this.southwest.insert(p)) {return true;}
        }

        return false;   //Theoretically unreachable
    }

    subdivide() {
        this.isDivided = true;

        let newW = this.boundary.w / 2;
        let newH = this.boundary.h / 2;
        
        this.northwest = new Quadtree(this.boundary.x - newW, this.boundary.y + newH, newW, newH);
        this.northeast = new Quadtree(this.boundary.x + newW, this.boundary.y + newH, newW, newH);
        this.southeast = new Quadtree(this.boundary.x + newW, this.boundary.y - newH, newW, newH);
        this.southwest = new Quadtree(this.boundary.x - newW, this.boundary.y - newH, newW, newH);

        for (let p of this.points) {
            this.northwest.insert(p);
            this.northeast.insert(p);
            this.southeast.insert(p);
            this.southwest.insert(p);
        }
        this.points = [];
    }

    query(range, pointsInRange) {
        if (!pointsInRange) {
            pointsInRange = [];
        }


        if (!this.boundary.intersects(range)) {return pointsInRange;}

        for (let p of this.points) {
            //count++;
            if (range.contains(p)) {
                pointsInRange.push(p);
            }
        }

        if (!this.isDivided) {return pointsInRange;}

        this.northeast.query(range, pointsInRange);    
        this.northwest.query(range, pointsInRange);
        this.southeast.query(range, pointsInRange);
        this.southwest.query(range, pointsInRange);

        return pointsInRange;
    }

    show() {
        push();
        stroke(color(205,205,205,205));
        strokeWeight(1);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);

        /*for (let p of this.points) {
            strokeWeight(3);
            stroke(color(225,225,225,235));
            point(p.x, p.y);
        }*/

        if (this.isDivided) {
            this.northeast.show();
            this.northwest.show();
            this.southeast.show();
            this.southwest.show();
        }
        pop();
    }

}

class Boundary {
    constructor (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(p) {
        return p.x <= this.x + this.w &&
            p.x > this.x - this.w &&
            p.y <= this.y + this.h &&
            p.y > this.y - this.h;
    }

    intersects (range) {
        let l1 = this.x - this.w;
        let r1 = this.x + this.w;
        let u1 = this.y + this.h;
        let d1 = this.y - this.h;
        
        let l2 = range.x - range.w;
        let r2 = range.x + range.w;
        let u2 = range.y + range.h;
        let d2 = range.y - range.h;
        
        if (l1 > r2 || l2 > r1) {
            return false;
        }

        if (u1 < d2 || u2 < d1) {
            return false;
        }

        return true;
    }
}

class Point {
    constructor (x, y, userData) {
        this.x = x;
        this.y = y;
        this.userData = userData;
    }

    show() {
        push();
        strokeWeight(4);
        stroke(color(235, 76, 52, 255));
        point(this.x, this.y);
        pop();
    }
}