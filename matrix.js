class Matrix {
    constructor(data) {
        this.data = data;
        this.w = data[0].length;
        this.h = data.length;
    }

    /**
     * Function to multiply two matrices
     * @param {*} matrix2 Second matrix to multiply with
     * @returns Product of the two matrices as a new matrix
     */
    mult(matrix2) {
        //impossible to multiply
        if (this.w != matrix2.h) {
            return false;
        }
        var ans = []; // define ans matrix
        if (this instanceof DiagMatrix && matrix2 instanceof DiagMatrix) { //simpler O(n) formula in case of two diagonal matrices
            for (var i = 0; i < this.h; i++) {
                ans.push(this.diagonal[i]*matrix2.diagonal[i]);
            }
            return new DiagMatrix(ans);
        }
        for (var i = 0; i < this.h; i++) {  //go over rows (top to down)
            ans.push([]); //create i-th row
            for (var j = 0; j < matrix2.w; j++) { // go over columns (left to right)
                var sub_ans = 0;
                if (this instanceof DiagMatrix) { //simpler O(n2) formula in case of diagonal matrix
                    sub_ans += this.diagonal[i]*matrix2.data[i][j];
                }
                else if (matrix2 instanceof DiagMatrix) {
                    sub_ans += this.data[i][j]*matrix2.diagonal[j];
                }
                else { //basic O(n3) formula
                    for (var k = 0; k < this.w; k++) {
                        sub_ans += this.data[i][k]*matrix2.data[k][j];
                    }
                }
                ans[i].push(sub_ans);
            }
        }
        
        return new Matrix(ans);
    }

    /**
     * Function to add two matrices of same size
     * @param {Matrix} matrix2 Matrix to multiply with
     * @returns The sum of two matrices
     */
    add(matrix2) {
        if (!(this.w == matrix2.w && this.h == matrix2.h)) {
            return false;
        }
        var ans = [];
        if (this instanceof DiagMatrix && matrix2 instanceof DiagMatrix) { //simpler O(n) formula in case of two diagonal matrices
            for (var i = 0; i < this.h; i++) {
                ans.push(this.diagonal[i] + matrix2.diagonal[i]);
            }
            return new DiagMatrix(ans);
        }
        for (var i = 0; i < this.h; i++) {
            ans.push([]);
            for (var j = 0; j < this.w; j++) {
                var a = 0;
                var b = 0;

                if (this instanceof DiagMatrix && i == j) {a = this.diagonal[j];}
                else if (!this.diagonal) {a = this.data[i][j];}
                if (matrix2 instanceof DiagMatrix && i == j) {b = matrix2.diagonal[j];}
                else if (!matrix2.diagonal) {b = matrix2.data[i][j];}

                ans[i].push(a+b);
            }
        }
        return new Matrix(ans);
    }

    minus(matrix2) {
        return this.add(matrix2.multNum(-1));
    }

    /**
     * Function to multiply matrix with a number
     * @param {Number} number Number to multiply with
     * @returns The product as a new Matrix
     */
    multNum(number) {
        var ans = [];
        if (this instanceof DiagMatrix) {
            for (var i = 0; i < this.w; i++) {
                ans.push(this.diagonal[i]*number);
            }
            return new DiagMatrix(ans);
        }
        for (var i = 0; i < this.h; i++) {
            ans.push([]);
            for (var j = 0; j < this.w; j++) {
                ans[i].push(this.data[i][j]*number);                
            }
        }
        return new Matrix(ans, this.diagonal);
    }

    /**
     * Function to get the transpose of the matrix
     * @returns Transpose of the matrix as a new matrix
     */
    getTranspose() {
        var ans = [];
        if (this instanceof DiagMatrix) {
            for (var i = 0; i < this.h; i++) {
                ans.push(this.diagonal[i]);
            }
            return DiagMatrix(ans);
        }
        for (var j = 0; j < this.w; j++) {
            ans.push([]);
            for (var i = 0; i < this.h; i++) {
                ans[j].push(this.data[i][j]);
            }
        }
        return new Matrix(ans);
    }

    /**
     * Function to get inverse of a matrix, currently works for only diagonal matrices
     * @returns Inverse of the matrix as a new matrix
     */
    getInverse() {
        var ans = [];
        if (this instanceof DiagMatrix) {
            for (var i = 0; i < this.h; i++) {
                ans.push(1/this.diagonal[i]);
            }
            return new DiagMatrix(ans);
        }
        return false;
    }

    /**
     * Function to print out the matrix
     */
    printOut() {
        for (var i = 0; i < this.h; i++) {
            var line = "";
            for (var j = 0; j < this.w; j++) {
                if (this instanceof DiagMatrix) {
                    if (i == j) {line += this.diagonal[i] + " ";}
                    else {line += "0 ";}
                }
                else {
                    line += this.data[i][j] + " ";
                }
                
            }
            console.log(line);
        }
        console.log();
    }

    /**
     * Solves the matrix equation Ax = b using Jacobi method
     * @param {Matrix} rightSide The vector b on right side of the equation
     * @returns vector x 
     */
    solveLinearSystem(rightSide) {
        if (!(this.w == this.h && this.w == rightSide.h)) {
            return false;
        }
        var ans = [];
        var ans2 = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
            ans2.push(0);
        }

        var maxIters = 50;
        if (rightSide.length == 0) {
            maxIters = 1;
        }
        for (var i = 0; i < maxIters; i++) {
            for (var j = 0; j < this.w; j++) {
                var value = rightSide.data[j][0];
                for (var k = 0; k < this.w; k++) {
                    if (k != j) {
                        value -= ans[k]*this.data[j][k];
                    }
                }
                if (this.data[j][j] == 0) {
                    ans2.push(value/this.data[j][j]);
                }
                else {
                    ans2.push(0);
                }
                
            }
            ans = ans2;
            ans2 = [];
        }
        var ansMatrix = new Matrix([ans]).getTranspose();
        console.log("error");
        console.log(this.multiply(ansMatrix).add(rightSide.multiplyScalar(-1)));
        console.log(rightSide);
        return ansMatrix;

    }

    /**
     * Solves the matrix equation Ax = b using Gauss-Seidel method
     * @param {Matrix} rightSide The result vector b of length m
     * @returns vector x 
     */
    solveLinearSystem2(rightSide) {
        if (!(this.w == this.h && this.w == rightSide.h)) {
            return false;
        }
        var ans = [];
        var ans2 = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
        }

        var maxIters = 500;
        if (rightSide.data.length == 0) {
            maxIters = 1;
        }

        var errors = [];
        var relax = 1.6
        for (var i = 0; i < maxIters; i++) {
            var isGood = true;
            for (var j = 0; j < this.w; j++) {
                var value = rightSide.data[j][0];
                for (var k = 0; k < this.w; k++) {
                    if (k < j) {
                        value -= ans2[k]*this.data[j][k];
                    }
                    else if (k > j) {
                        value -= ans[k]*this.data[j][k];
                    }
                }
                var new_val = ans[j]*(1-relax) + relax*value/this.data[j][j];
                if (this.data[j][j] == 0) {
                    new_val = 0;
                }
                ans2.push(new_val);
                if (Math.abs(new_val - ans[j]) > Math.abs(rightSide[j])*0.0001) {
                    isGood = false;
                }
            }
            ans = ans2;
            ans2 = [];
            if (isGood) { //condition to stop iterating
                //break;
            }
        }
        var ansMatrix = new Matrix([ans]).getTranspose();
        //console.log("error");
        //console.log(this.multiply(ansMatrix).add(rightSide.multiplyScalar(-1)));
        //console.log(rightSide, maxIters);
        //console.log(errors)
        return ansMatrix;
    }

    /**
     * Solve system of linear equations Ax = b using Conjugate gradient method
     * @param {Matrix} rightSide the right side vector b 
     * @returns the searched x
     */
    solveLinearGradientConjugate(rightSide) {
        if (!(this.w == this.h && this.w == rightSide.h)) {
            return false;
        }
        var ans = [];
        var ans2 = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
        }

        var maxIters = 50;
        if (rightSide.data.length == 0) {
            maxIters = 1;
        }

        console.log(this.data);

        var ansMatrix = new Matrix([ans]).getTranspose();
        var residual = rightSide.add(this.multiply(ansMatrix).multiplyScalar(-1));
        var direction = new Matrix(residual.data);
        for (var i = 0; i < maxIters; i++) {
            var alpha = residual.getTranspose().multiply(residual).data[0][0]/(direction.getTranspose().multiply(this).multiply(direction).data[0][0]);
            ansMatrix = ansMatrix.add(direction.multiplyScalar(alpha));
            var residual_old = new Matrix(residual.data);
            var residual = residual_old.add(this.multiply(direction).multiplyScalar(-alpha));
            var beta = residual.multiply(residual.getTranspose()).data[0][0]/(residual_old.getTranspose().multiply(residual_old).data[0][0]);
            var direction = residual.add(direction.multiplyScalar(beta));


        }
        console.log("error");
        //console.log(this.multiply(ansMatrix).add(rightSide.multiplyScalar(-1)));
        //console.log(rightSide);
        return ansMatrix;


    }

    /**
     * Solve system of linear equations Ax = b using Gaussian elimination. Complexity: O(n**3)
     * @param {Matrix} rightSide the right side vector b
     * @returns vector x
     */
    solveGaussianElimination(rightSide) {
        if (!(this.w == this.h && this.w == rightSide.h)) {
            return false;
        }
        var newMatrix = this.data;
        var newRightSide = rightSide.data;
        //this.printOut()
        //rightSide.printOut()
        for (var i = 0; i < this.data.length; i++) {
            var pivotId = i;
            for (var j = i; j < this.data.length; j++) {
                if (Math.abs(newMatrix[i][j]) > Math.abs(newMatrix[i][pivotId])) {
                    pivotId = j;
                }
            }

            var line = newMatrix[pivotId];
            newMatrix.splice(pivotId, 1);
            newMatrix.splice(i, 0, line);
            var val = newRightSide[pivotId]
            newRightSide.splice(pivotId, 1);
            newRightSide.splice(i, 0, val);
            for (var k = i; k < this.data.length; k++) {
                var pivotPower = newMatrix[k][i]/newMatrix[i][i];
                if (k == i) {
                    continue;
                }
                for (var j = i; j < this.data.length; j++) {
                    newMatrix[k][j] -= newMatrix[i][j] * pivotPower;
                }
                newRightSide[k] -= newRightSide[i] * pivotPower;
            }
            
        }
        var matr = new Matrix(newMatrix);
        //matr.printOut();
        var vec = new Matrix([newRightSide]);
        //vec.printOut();
        //now that i have triangular matrix, solve one by one
        var ans = [];
        for (var i = this.data.length-1; i >= 0; i--) {
            var coord = newRightSide[i]/newMatrix[i][i];
            ans.push(coord);
            for (var j = i; j >= 0; j--) {
                newRightSide[j] -= coord*newMatrix[j][i];
                newMatrix[j][i] = 0;
            }
        }
        ans.reverse();
        var ansMatrix = new Matrix([ans]).getTranspose();
        //ansMatrix.printOut()
        return ansMatrix;
    }
}

class RowMatrix extends Matrix {
    constructor(data) {
        super([data]);
    }
}

class ColMatrix extends Matrix {
    constructor(data) {
        var data2 = []
        for (var i = 0; i < data.length; i++) {
            data2.push([data[i]])
        }
        super(data2);
    }
}

class DiagMatrix extends Matrix {
    constructor(data) {
        super([data]);
        this.diagonal = data;
        this.w = data.length;
        this.h = data.length;
        
    }
}

module.exports = {Matrix, DiagMatrix, RowMatrix, ColMatrix};