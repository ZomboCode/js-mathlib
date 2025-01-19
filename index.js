const vect2d = require("./vector")
const vect3d = require("./vector3d")
const {Matrix, ColMatrix, RowMatrix, DiagMatrix} = require("./matrix")

var m = new DiagMatrix([1, 2, 3])
var n = new DiagMatrix([1, 2, 4])
var c = m.minus(n.multNum(1.4));

n.printOut();
m.printOut();
c.printOut();

var A = new DiagMatrix([1, 2, 4]);
var b = new ColMatrix([1, 2, 5]);

var x = A.solveLinearSystem(b);
var x2 = A.solveLinearGE(b);
var x3 = A.solveLinearSystem2(b);

x.printOut()
x2.printOut()
x3.printOut()

module.exports = {vect3d, vect2d, ColMatrix, Matrix, RowMatrix, DiagMatrix}