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
Creating and multiplying matrices
```
const {Matrix, DiagMatrix} = require("@zombocode/js-mathlib");
var A = new Matrix([[4, 0, 2], [0, 5, 1], [0, 4, 5]]) //define the whole matrix here
var B = new DiagMatrix([2, 1, 3]) //define only through the diagonal (but use like a normal matrix)

var C = A.mult(B) // multiply
var C2 = A.add(B) // add
var C3 = A.minus(B.multNum(3)) //A - 3B


```


