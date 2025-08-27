class vect3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Convert an object to a vect3d
     * @param {Object} obj object to be converted
     * @returns resulting instance of vect3d
     */
    static fromObject(obj) {
        if (obj.x == undefined || obj.y == undefined || obj.z == undefined) {
            return null;
        }
        return new vect3d(obj.x, obj.y, obj.z);
    }

    /**
     * Convert a polar vector object to a vect3d
     * @param {Object} obj polar object to be converted
     * @returns resulting instance of vect3d
     */
    static fromPolarObject(obj) {
        if (obj.r == undefined || obj.theta == undefined || obj.phi == undefined) {
            return null;
        }
        const r = obj.r;
        const theta = obj.theta;
        const phi = obj.phi;
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        return new vect3d(x, y, z);
    }

    /**
     * Generate a normal vector rotated by some angle in 3D
     * @param {Number} angle rotation angle
     * @returns instance of vect3d, the resulting normal vector
     */
    static normalAtAngle(angle) {
        return new vect3d(Math.cos(angle), Math.sin(angle), 0);
    }

    /**
     * Rounds components of the vector to some number of sigfigs
     * @param {*} x number of significant figures
     * @returns the original instance of vect3d, rounded to x sigfigs
     */
    toSigFigs(x) {
        var ret = new vect3d(
            parseFloat(this.x.toPrecision(x)),
            parseFloat(this.y.toPrecision(x)),
            parseFloat(this.z.toPrecision(x))
        );
        return ret;
    }

    /**
     * Sets all components of the vector to 0
     */
    setZero() {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    /**
     * Check if vector is of zero length
     * @returns boolean value
     */
    isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    /**
     * Finds the dot product of two vectors
     * @param {vect3d} vect3 the other vector to multiply with
     * @returns dot product value
     */
    dot(vect2) {
        return this.x * vect2.x + this.y * vect2.y + this.z * vect2.z;
    }

    /**
     * Finds the cross product between two vectors in 3D
     * @param {vect3d} vect3 other vector to multiply with
     * @returns a new vect3d, the result of the cross product
     */
    cross(vect2) {
        return new vect3d(
            this.y * vect2.z - this.z * vect2.y,
            this.z * vect2.x - this.x * vect2.z,
            this.x * vect2.y - this.y * vect2.x
        );
    }

    /**
     * Interpolate between two vectors
     * @param {vect3d} vect3 other endpoint of interpolation
     * @param {cf} cf coefficient between 0 and 1 (1 is original vector, 0 is the argument vector)
     * @returns a new vect3d, the result of interpolation
     */
    lerp(vect3, cf) {
        return new vect3d(
            this.x * (1 - cf) + vect2.x * cf,
            this.y * (1 - cf) + vect2.y * cf,
            this.z * (1 - cf) + vect2.z * cf
        );
    }

    /**
     * Rotate vector by some angle (rotation in 3D should be done via axis of rotation)
     * @param {Number} angle angle to be rotated (in radians)
     * @returns the rotated vector
     */
    rotate(angle) {
        // Rotation in 3D requires defining an axis and a specific formula, so the following is a simple 2D rotation in the xy-plane
        return new vect3d(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle),
            this.z
        );
    }

    /**
     * Find magnitude of the vector
     * @returns magnitude of the vector
     */
    getMagnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    /**
     * Find the square of the magnitude
     * @returns square of the magnitude
     */
    getMagnitude2() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }

    /**
     * Set vector length to 1
     * @returns original vector with length 1
     */
    getNormalized() {
        var mag = this.getMagnitude();
        if (mag == 0) {
            return new vect3d(0, 0, 0);
        }
        return new vect3d(this.x / mag, this.y / mag, this.z / mag);
    }

    /**
     * Normalize current vector
     */
    normalize() {
        var mag = this.getMagnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
    }

    /**
     * Add two vectors
     * @param {vect3d} vect3 vector to be added
     * @returns sum of vectors
     */
    add(vect2) {
        return new vect3d(this.x + vect2.x, this.y + vect2.y, this.z + vect2.z);
    }

    /**
     * Subtract two vectors
     * @param {vect3d} vect3 vector to be subtracted
     * @returns difference of vectors
     */
    minus(vect2) {
        return new vect3d(this.x - vect2.x, this.y - vect2.y, this.z - vect2.z);
    }

    /**
     * Multiply vector with a number
     * @param {Number} num number to multiply with
     * @returns resulting vector
     */
    mult(num) {
        return new vect3d(this.x * num, this.y * num, this.z * num);
    }

    /**
     * Get opposite of vector
     * @returns negative of the original vector
     */
    getNegative() {
        return new vect3d(-this.x, -this.y, -this.z);
    }

    /**
     * find dist between vectors
     * @param {vect2d} vect2 other vector
     * @returns number, distance between points
     */
    distTo(vect2) {
        return this.minus(vect2).getMagnitude();
    }
}

export default vect3d;
