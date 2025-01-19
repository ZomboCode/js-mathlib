class Matrix {
    constructor(data) {
        this.data = data;
        this.w = data[0].length;
        this.h = data.length;
    }

    deepCopy() {
        var newData = []
        if (this instanceof DiagMatrix) {
            for (var i = 0; i < this.h; i++) {
                newData.push(this.diagonal[i]);
            }
            return new DiagMatrix(newData);
        }
        
        for (var i = 0; i < this.h; i++) {
            newData.push([]);
            for (var j = 0; j < this.w; j++) {
                newData[i].push(this.data[i][j])
            }
        }
        return new Matrix(newData);
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
    transpose() {
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
    inverse() {
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

    solveDiagonalSystem(rightSide) {
        var ans = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(rightSide.data[i][0]/this.diagonal[i]);
        }
        return new DiagMatrix(ans);
    }

    checkLinearSystem(rightSide) {
        if (!(this.w == this.h && this.w == rightSide.h)) {
            return false;
        }
        if (this instanceof DiagMatrix) {return this.solveDiagonalSystem(rightSide)}
        return true;
    }

    /**
     * Solves the matrix equation Ax = b using Jacobi method
     * @param {Matrix} rightSide The vector b on right side of the equation
     * @param {Number} [maxIters=50] Maximum number of iterations
     * @param {Number} [errorMargin=1e-8] Biggest difference during one iteration to quit iterations
     * @returns vector x 
     */
    solveLinearSystem(rightSide, maxIters = 50, errorMargin = 1e-9) {
        var check = this.checkLinearSystem(rightSide);
        if (check != true) {return check;}

        var ans = []; //current estimate for x
        var ans2 = []; //next estimate for x
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
        }

        for (var i = 0; i < maxIters; i++) {
            var errorSum = 0;
            for (var j = 0; j < this.w; j++) {
                var value = rightSide.data[j][0]; //initial value from b
                for (var k = 0; k < this.w; k++) {
                    if (k != j) {
                        value -= ans[k]*this.data[j][k]; //sum of components
                    }
                }
                if (this.data[j][j] != 0) { //divide by value on diagonal
                    ans2.push(value/this.data[j][j]);
                }
                else {ans2.push(0);}
                errorSum += (ans2[j]-ans[j])**2/(ans2[j]**2)/this.w;
            }
            ans = ans2; //set new value for x
            ans2 = [];
            //condition for quitting loop
            if (rightSide.h <= 1 || errorSum < errorMargin**2) {
                break;
            }
        }
        var ansMatrix = new ColMatrix(ans);
        return ansMatrix;

    }

    /**
     * Solves the matrix equation Ax = b using Gauss-Seidel method
     * @param {Matrix} rightSide The result vector b of length m
     * @param {Number} [maxIters=50] Maximum number of iterations
     * @param {Number} [errorMargin=1e-12] Maximal error to quit iterations
     * @returns vector x 
     */
    solveLinearSystem2(rightSide, maxIters = 50, errorMargin = 1e-9) {
        var check = this.checkLinearSystem(rightSide);
        if (check != true) {return check;}

        var ans = [];
        var ans2 = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
        }

        var relax = 1.6
        for (var i = 0; i < maxIters; i++) {
            var errorSum = 0;
            for (var j = 0; j < this.w; j++) {
                var value = rightSide.data[j][0];
                for (var k = 0; k < this.w; k++) {
                    if (k < j) { //take new value
                        value -= ans2[k]*this.data[j][k];
                    }
                    else if (k > j) { //take old value
                        value -= ans[k]*this.data[j][k];
                    }
                }
                var new_val = ans[j]*(1-relax) + relax*value/this.data[j][j];
                if (this.data[j][j] == 0) {new_val = 0;}
                ans2.push(new_val);
                errorSum += (ans2[j]-ans[j])**2/(ans2[j]**2)/this.w;
            }
            ans = ans2; //set new value for x
            ans2 = [];
            //condition for quitting loop
            if (rightSide.h <= 1 || errorSum < errorMargin**2) {
                break;
            }
        }
        var ansMatrix = new ColMatrix(ans);
        return ansMatrix;
    }

    /**
     * Solve system of linear equations Ax = b using Gaussian elimination. Complexity: O(n**3)
     * @param {Matrix} rightSide the right side vector b
     * @returns vector x
     */
    solveLinearGE(rightSide) {
        var check = this.checkLinearSystem(rightSide);
        if (check != true) {return check;}

        var newMatrix = this.deepCopy().data; //make array from Matrix object for editing
        var newRightSide = rightSide.deepCopy().data;
        //this.printOut()
        //rightSide.printOut()
        for (var i = 0; i < this.data.length; i++) {
            var pivotId = i; //find the row that has pivot (highest absolute value)
            for (var j = i; j < this.data.length; j++) {
                if (Math.abs(newMatrix[i][j]) > Math.abs(newMatrix[i][pivotId])) {
                    pivotId = j;
                }
            }
            //move the pivot row to i-th row
            var line = newMatrix[pivotId];
            newMatrix.splice(pivotId, 1);
            newMatrix.splice(i, 0, line);
            //must do same with the right side vector
            var val = newRightSide[pivotId]
            newRightSide.splice(pivotId, 1);
            newRightSide.splice(i, 0, val);

            //do replacement to add next row to triangular matrix
            for (var k = i; k < this.data.length; k++) {
                var pivotPower = newMatrix[k][i]/newMatrix[i][i]; //how much to add per each row
                if (k == i) {
                    continue;
                }
                for (var j = i; j < this.data.length; j++) {
                    newMatrix[k][j] -= newMatrix[i][j] * pivotPower;
                }
                newRightSide[k] -= newRightSide[i] * pivotPower;
            }
            
        }
        //now that i have triangular matrix, solve one by one
        //start from last and end up with first equation
        var ans = [];
        for (var i = this.data.length-1; i >= 0; i--) {
            var coord = newRightSide[i]/newMatrix[i][i];
            ans.push(coord);
            for (var j = i; j >= 0; j--) {
                newRightSide[j] -= coord*newMatrix[j][i];
                newMatrix[j][i] = 0;
            }
        }
        //reverse for correct order
        ans.reverse();
        var ansMatrix = new ColMatrix(ans);
        return ansMatrix;
    }

    /**
     * Solve system of linear equations Ax = b using Conjugate gradient method
     * @param {Matrix} rightSide the right side vector b 
     * @returns the searched x
     */
    solveLinearGradient(rightSide, maxIters = 50) {
        var check = this.checkLinearSystem(rightSide);
        if (check != true) {return check;}

        var ans = [];
        var ans2 = [];
        for (var i = 0; i < this.w; i++) {
            ans.push(0);
        }

        console.log(this.data);

        //highly schizophrenic
        var ansMatrix = new Matrix([ans]).transpose();
        var residual = rightSide.add(this.multiply(ansMatrix).multiplyScalar(-1));
        var direction = new Matrix(residual.data);
        for (var i = 0; i < maxIters; i++) {
            var alpha = residual.transpose().multiply(residual).data[0][0]/(direction.transpose().multiply(this).multiply(direction).data[0][0]);
            ansMatrix = ansMatrix.add(direction.multiplyScalar(alpha));
            var residual_old = new Matrix(residual.data);
            var residual = residual_old.add(this.multiply(direction).multiplyScalar(-alpha));
            var beta = residual.multiply(residual.transpose()).data[0][0]/(residual_old.transpose().multiply(residual_old).data[0][0]);
            var direction = residual.add(direction.multiplyScalar(beta));


        }
        console.log("error");
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