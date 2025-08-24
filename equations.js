class PolyEquation {
    /**
     * Define a polynomial through its coefficients
     * @param {Array} coeffs array of numbers, the coefficients
     */
    constructor(coeffs) {
        this.coeffs = coeffs;
        this.c = 0; this.b = 0; this.a = 0;
        if (coeffs.length > 0) {
            this.c = coeffs[0];
        }
        if (coeffs.length > 1) {
            this.b = coeffs[1];
        }
        if (coeffs.length > 2) {
            this.a = coeffs[2];
        }
    }

    /**
     * Get the value of a function at some coordinate
     * @param {Number} x 
     * @returns the y-coordinate
     */
    evaluate(x) {
        var ans = 0;
        for (var i = 0; i < this.coeffs.length; i++) {
            ans += this.coeffs[i]*(x**i);
        }
        return ans;
    }

    /**
     * get the intersection x coordinate of two functions
     * @param {PolyEquation} eq the other equation
     * @param {Number} sign sign for determinant (for quadratic function)
     * @returns x coordinate
     */
    intersect(eq, sign = 1) {
        if ((this instanceof SquareEquation || this instanceof LinearEquation) && (eq instanceof SquareEquation || eq instanceof LinearEquation)) {
            var totalEq = new SquareEquation(this.c - eq.c, this.b - eq.b, this.a - eq.a);
            return totalEq.getZero(sign);
        }
        return x
    }

    /**
     * Function that returns zero of a function
     * @param {Number} initial initial guess
     * @param {Number} maxIters maximum number of iterations
     * @param {Number} errorMargin margin of error
     * @returns x coordinate of a zero
     */
    getZero(initial = 0, maxIters = 15, errorMargin = 1e-9) {
        var derivativeCoeffs = [];
        for (var i = 0; i < this.coeffs.length; i++) {
            derivativeCoeffs.push(this.coeffs[i]*i);
        }
        var derivativeEq = new PolyEquation(derivativeCoeffs);
        var xi = initial;
        for (var i = 0; i < maxIters; i++) {
            var value = this.evaluate(xi);
            var slope = derivativeEq.evaluate(xi);
            var diff = value/slope;
            xi -= diff;
            if (Math.abs(diff) < xi*errorMargin) {
                break;
            }
        }
        return xi;
    }
}


class LinearEquation extends PolyEquation {
    /**
     * Define a linear equation through the slope and constant
     * @param {Number} linear 
     * @param {Number} constant 
     */
    constructor(linear, constant) {
        super([constant, linear]);
    }
    /**
     * returns LinearEquation from form ax + by = c;
     * @param {NUmber} a 
     * @param {Number} b 
     * @param {Number} c 
     * @returns instance of LinearEquation
     */
    static fromStandard(a, b, c) { //ax + by = c
        return new LinearEquation(-a/b, c/b);
    }
    /**
     * returns LinearEquation from a point and a normal vector
     * @param {Object} p must contain x, y
     * @param {Object} n must contain x, y
     * @returns Instance of LinearEquation
     */
    static fromNormal(p, n) { //point and a normal
        return new LinearEquation(-n.x/n.y, p.y - p.x/(-n.x/n.y))
    }
    /**
     * get linear function from two points on its line
     * @param {Object} p1 must contain x, y
     * @param {Object} p2 must contain x, y
     * @returns instance of LinearEquation
     */
    static fromPoints(p1, p2) {
        var k = (p2.y-p1.y)/(p2.x - p1.y);
        return new LinearEquation(k, p1.y - p1.x/k);
    }

    /**
     * Gives the x coordinate where y = 0
     * @returns x coordinate
     */
    getZero() {
        return -this.c/this.b;
    }
}

class SquareEquation extends PolyEquation {
    /**
     * Define a quadratic equation through its coefficients
     * @param {Number} square the square coefficient
     * @param {Number} linear the linear coefficient
     * @param {Number} constant the constant
     */
    constructor(square, linear, constant) {
        super([constant, linear, square]);
    }
    /**
     * get zero of the quadratic equation
     * @param {Number} sign sign for the determinant
     * @returns one of the two solutions (or undefined)
     */
    getZero(sign) {
        var det = this.b**2 - 4*this.a*this.c;
        if (this.a == 0) {
            return -this.c/this.b;
        }
        if (det < 0) {
            return null;
        }
        return (-this.b + sign*(det**0.5))/(2*this.a);
    }
}

export {LinearEquation, SquareEquation, PolyEquation}

class eqs {
    constructor() {
        this.type = "";
    }
    static solveQuadratic(a, b, c, sign) {
        var det = b**2 - 4*a*c;
        if (det < 0) {
            return null;
        }
        return (-b + sign*(det**0.5))/(2*a);
    }
    linearDeterminant(line) {
        var det0 = this.a*line.b - this.b*line.a;
        return det0;
    }
    linearIntersect(line) {
        if (!(this.type == "linear" && line.type == "linear")) {return null;}
        var det0 = this.a*line.b - this.b*line.a;
        var detX = this.c*line.b - this.b*line.c;
        var detY = this.a*line.c - this.c*line.a;

        if (det0 == 0) {
            return Infinity;
        }
        return new vect2d(detX/det0, detY/det0);
    }
    getSlope() {
        if (!this.type == "linear") {return null;}
        return -this.a/this.b;
    }
    linearReturnX(y) {
        return (this.c-this.b*y)/this.a;
    }
    linearReturnY(x) {
        return (this.c-this.a*x)/this.b;
    }

    
    //ax + by = c;
    static getLinearFunction(a, b, c) {
        var eq = new eqs();
        eq.type = "linear";
        eq.a = a; eq.b = b; eq.c = c;
        return eq;
    }
    static getLinearFunctionFromPoint(a, b, pt) {
        if (!(pt instanceof vect2d)) {return null}
        return eqs.getLinearFunction(a, b, a*pt.x + b*pt.y);
    }
    static getLinearFromNormal(vect, pt) {
        if (!(pt instanceof vect2d) || !(vect instanceof vect2d)) {return null}
        return eqs.getLinearFunction(vect.x, vect.y, vect.x*pt.x + vect.y*pt.y);
    }
    
}