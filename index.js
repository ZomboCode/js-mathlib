const vect2d = require("./vector")
const vect3d = require("./vector3d")
const {Matrix, ColMatrix, RowMatrix, DiagMatrix} = require("./matrix")

var m = new DiagMatrix([1, 2, 3])
var n = new DiagMatrix([1, 2, 4])
var c = m.minus(n.multNum(1.4));

n.printOut();
m.printOut();
c.printOut();

module.exports = {vect3d, vect2d, ColMatrix, Matrix, RowMatrix, DiagMatrix}