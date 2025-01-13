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