# js-mathlib
Package for some useful math operations.
Currently includes:
+ Matrix class (includes solving linear equations)
+ vect2d class
+ vect3d class
  
Planned for future:
+ More equations (not only linear) :+1:
+ Find intersections of different functions

## Using Matrix class
Creating and multiplying matrices.

`DiagMatrix, ColMatrix, RowMatrix` are subclasses of Matrix and share all methods
```JavaScript
const {Matrix, DiagMatrix, ColMatrix, RowMatrix} = require("@zombocode/js-mathlib");
var A = new Matrix([[4, 0, 2], [0, 5, 1], [0, 4, 5]]) //define the whole matrix here
var B = new DiagMatrix([2, 1, 3]) //define only through the diagonal (but use like a normal matrix)

var C = A.mult(B) // multiply
var C2 = A.add(B) // add
var C3 = A.minus(B.multNum(3)) //A - 3B
```

Solving systems of linear equations
```JavaScript
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
```

##Using vect2d class

Useful for 2d games or solving geometry problems
```JavaScript
const {vect2d} = require("@zombocode/js-mathlib");

var pos = new vect2d(3, 4);
var norm = pos.getNormalized(); //normal vector, result (0.6, 0.8)

//movement using vect2d class
var vel = new vect2d(2, 0)
var dt = 0.5
pos = pos.add(vel.mult(dt))

//other functions between two vectors
var pos2 = new vect2d(1, -6)
var d = pos.dot(pos2) //dot product
var c = pos.cross(pos2) //cross product (gives a number)
var proj = pos.projectionOnto(pos2) //projection onto pos2
var ang = pos.angleTo(pos2) //gives in radians 
```



