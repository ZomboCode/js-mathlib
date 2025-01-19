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

DiagMatrix, ColMatrix, RowMatrix are subclasses of Matrix and share all methods
```JavaScript
const {Matrix, DiagMatrix, ColMatrix} = require("@zombocode/js-mathlib");
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

//iterative methods
//Jacobi method
var x = C.solveLinearSystem(b)
//Seidel method
var x2 = C.solveLinearSystem2(b)

//exact method - Gaussian Elimination
var x3 = C.solveLinearGE

//log the results
console.log("jacobi method")
x.printOut()
console.log("seidel method")
x2.printOut()
console.log("GE method")
x3.printOut()







```


