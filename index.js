import vect2d from "./vector"
import vect3d from "./vector3d"
import {Matrix, ColMatrix, RowMatrix, DiagMatrix} from "./matrix"
import {LinearEquation, SquareEquation, PolyEquation} from "./equations"

var func1 = new LinearEquation(1, 2);
var func2 = LinearEquation.fromNormal({x:2, y:2}, {x:0, y:1});
console.log(func1, func2)
var point = func1.intersect(func2)
console.log(point)



export {vect3d, vect2d, ColMatrix, Matrix, RowMatrix, DiagMatrix, LinearEquation, SquareEquation, PolyEquation}