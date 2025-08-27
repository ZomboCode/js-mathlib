class vect2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Convert an object to a vect2d
     * @param {Object} obj object to be converted
     * @returns resulting instance of vect2d
     */
    static fromObject(obj) {
        if (obj.x == undefined || obj.y == undefined) {
            return null;
        }
        return new vect2d(obj.x, obj.y);
    }
    /**
     * Convert a polar vector object to a vect2d
     * @param {Object} obj polar object to be converted
     * @returns resulting instance of vect2d
     */
    static fromPolarObject(obj) {
        if (obj.r == undefined || (obj.theta == undefined && obj.alpha == undefined && obj.phi == undefined)) {
            return null;
        }
        var ang = obj.theta || obj.phi || obj.alpha || 0;
        return new vect2d(obj.r*Math.cos(ang), obj.r*Math.sin(ang));
    }
    /**
     * Generate a normal vector rotated by some angle
     * @param {Number} angle rotation angle
     * @returns instance of vect2d, the resulting normal vector
     */
    static normalAtAngle(angle) {
        return new vect2d(1, 0).rotate(angle);
    }
    /**
     * Rounds components of the vector to some number of sigfigs
     * @param {Integer} x number of significant figures
     * @returns the original instance of vect2d, rounded to x sigfigs
     */
    toSigFigs(x) {
        var ret = new vect2d(parseFloat(this.x.toPrecision(x)), parseFloat(this.y.toPrecision(x)));
        return ret;
    }
    /**
     * Sets all components of the vector to 0
     */
    setZero() {
        this.x = 0; this.y = 0;
    }
    /**
     * Check if vector is of zero length
     * @returns boolean value
     */
    isZero() {
        if (this.x == 0 && this.y == 0) {
            return true;
        }
        return false;
    }
    /**
     * Finds the dot product of two vectors
     * @param {vect2d} vect2 the other vector to multiply with
     * @returns dot product value
     */
    dot(vect2) {
        return this.x * vect2.x + this.y * vect2.y;
    }
    
    /**
     * Returns a vector perpendicular to current vector (90 deg turn anti-clockwise)
     * @param {vect2d} vect2 vector to be perpendicularized
     * @returns the perpendicular vector
     */
    crossVector() {
        return new vect2d(this.y, -this.x);
    }
    
    /**
     * Finds the cross product between two vectors
     * @param {vect2d} vect2 other vector to multiply with
     * @returns a number, the result of cross product
     */
    cross(vect2) {
        return this.x * vect2.y - this.y * vect2.x;
    }
    /**
     * Interpolate between two vectors
     * @param {vect2d} vect2 other endpoint of interpolation
     * @param {cf} cf coefficient between 0 and 1 (1 is original vector, 0 is the argument vector)
     * @returns a new vect2d, the result of interpolation
     */
    lerp(vect2, cf) {
        return new vect2d(this.x * (1-cf) + vect2.x * cf, this.y * (1-cf) + vect2.y * cf);
    }

    /**
     * Rotate vector by some angle
     * @param {Number} angle angle to be rotated (in radians)
     * @returns the rotated vector
     */
    rotate(angle) {
        return new vect2d(  this.x * Math.cos(angle) - this.y * Math.sin(angle), 
                            this.x * Math.sin(angle) + this.y * Math.cos(angle));
    }
    
    /**
     * Find magnitude of the vector
     * @returns magnitude of the vector
     */
    getMagnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }
    
    /**
     * Find the square of the magnitude
     * @returns square of the magnitude
     */
    getMagnitude2() {
        return this.x**2 + this.y**2;
    }

    /**
     * Set vector length to 1
     * @returns original vector with length 1
     */
    getNormalized() {
        var mag = this.getMagnitude();
        if (mag == 0) {
            return new vect2d(0, 0);
        }
        return new vect2d(this.x/mag, this.y/mag);
    }
    
    /**
     * Normalize current vector
     */
    normalize() {
        var mag = this.getMagnitude();
        this.x /= mag; this.y /= mag;
    }
    
    /**
     * Projection of some vector onto another
     * @param {vect2d} vect2 vector to project onto
     * @returns projection of this to vect2
     */
    projectionOnto(vect2) {
        return this.dot(vect2) / (vect2.getMagnitude());
    }

    /**
     * Find the parallel component of two vectors
     * @param {vect2d} vect2 vector to compare to
     * @returns vect2d, the the component of this that is parallel to vect2
     */
    paraComponent(vect2) {
        var normal = vect2.getNormalized();
        var len = this.dot(normal);
        return normal.mult(len);
    }

    /**
     * Find the perpendicular component of two vectors
     * @param {vect2d} vect2 vector to compare to
     * @returns vect2d, the component of this that is perpendicular to vect2
     */
    perpComponent(vect2) {
        var normal = vect2.crossVector().getNormalized();
        var len = this.dot(normal);
        return normal.mult(len);
    }

    /**
     * Get the cosine between two vectors
     * @param {vect2d} vect2 
     * @returns the cosine between two vectors
     */
    cosineBetween(vect2) {
        return this.projectionOnto(vect2) / (this.getMagnitude());
    }

    /**
     * Get angle from this to vect2d, anticlockwise
     * @param {vect2d} vect2 vector to compare
     * @returns angle
     */
    angleTo(vect2) {
        var px = this.dot(vect2);
        var py = this.cross(vect2);
        return Math.atan2(py, px);
    }

    /**
     * Angle of the vector
     * @returns polar angle of the vector
     */
    angle() {
        return Math.atan2(this.y, this.x);
    }
    /**
     * find dist between vectors
     * @param {vect2d} vect2 other vector
     * @returns number, distance between points
     */
    distTo(vect2) {
        return this.minus(vect2).getMagnitude();
    }
    /**
     * Slope (y/x) of the vector
     * @returns slope of the vector
     */
    slope() {
        return this.y/this.x;
    }
    
    /**
     * Add two vectors
     * @param {vect2d} vect2 vector to be added
     * @returns sum of vectors
     */
    add(vect2) {
        return new vect2d(this.x + vect2.x, this.y + vect2.y);
    }
    /**
     * Subtract two vectors
     * @param {vect2d} vect2 vector to be subtracted
     * @returns difference of vectors
     */
    minus(vect2) {
        return new vect2d(this.x - vect2.x, this.y - vect2.y);
    }
    
    /**
     * Multiply vector with a number
     * @param {Number} num number to multiply with
     * @returns resulting vector
     */
    mult(num) {
        if (this.x == 0 && this.y == 0 && num == Infinity) {
            return new vect2d(0, 0);
        }
        return new vect2d(this.x * num, this.y * num);
    }
    /**
     * Stretch vector with another vector
     * @param {*} vect2 stretch vector
     * @returns resulting vector
     */
    stretch(vect2) {
        return new vect2d(this.x*vect2.x, this.y*vect2.y);
    }
    
    /**
     * Get opposite of vector
     * @returns negative of the original vector
     */
    getNegative() {
        return new vect2d(-this.x, -this.y);
    }
}
export default vect2d;

