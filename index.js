const vect2d = require("./vector")
const vect3d = require("./vector3d")
const {Matrix, ColMatrix, RowMatrix, DiagMatrix} = require("./matrix")

var A = new Matrix([[4, 0, 2], [0, 5, 1], [0, 4, 5]]) //define the whole matrix here
var B = new DiagMatrix([2, 1, 3]) //define only through the diagonal (but use like a normal matrix)

var C = A.mult(B) // multiply
var C2 = A.add(B) // add
var C3 = A.minus(B.multNum(3)) //A - 3B

var b = new ColMatrix([10, 5, 6]) //define a column matrix

//want to solve an equation Cx = b for x
//iterative Jacobi method
var x = C.solveLinearSystem(b)
//iterative Seidel method
var x2 = C.solveLinearSystem2(b)

//exact method - Gaussian Elimination
var x3 = C.solveLinearGE(b)

//log the results
console.log("jacobi method")
x.printOut()
console.log("seidel method")
x2.printOut()
console.log("GE method")
x3.printOut()

var pos = new vect2d(3, 4);
var norm = pos.getNormalized(); //normal vector
console.log(norm)

module.exports = {vect3d, vect2d, ColMatrix, Matrix, RowMatrix, DiagMatrix}