class Matrix {
    constructor(data, diagonal = false, triangleL = false, triangleU = false) {
        this.data = data;
        this.diagonal = diagonal;
        this.triangleL = triangleL;
        this.triangleU = triangleU;

        this.w = data[0].length;
        this.h = data.length;

        if (this.diagonal) {
            this.h = data[0].length;
        }
        if (this.triangleL || this.triangleU) {
            this.w = this.h;
        }
    }

    /**
     * Function to get matrix in full form (useful if the matrix is not yet in full form, like diagonal or triangle matrices)
     * @returns Matrix in full form as an array of arrays
     */
    getFullData() {
        var ans = []
        if (this.diagonal) {
            for (var i = 0; i < this.data[0].length; i++) {
                var line = [];
                for (var j = 0; j < this.data[0].length; j++) {
                    line.push(0);
                }
                line[i] = this.data[0][i];
            }
            ans.push(line);
        }
        else if (this.triangleL) {
            for (var i = 0; i < this.data.length; i++) {
                var line = [];
                for (var j = 0; j < this.data[i].length; j++) {
                    line.push(this.data[i][j]);
                }
                for (var j = this.data[i].length; j < this.data[this.data.length].length; j++) {
                    line.push(0);
                }
            }
            ans.push(line);
        }
        else if (this.triangleU) {
            for (var i = 0; i < this.data.length; i++) {
                var line = [];
                for (var j = this.data[i].length; j < this.data[this.data.length].length; j++) {
                    line.push(0);
                }
                for (var j = 0; j < this.data[i].length; j++) {
                    line.push(this.data[i][j]);
                }
            }
            ans.push(line);
        }
        else {
            ans = this.data;
        }
        return ans;
    }

    /**
     * Function to multiply two matrices
     * @param {*} matrix2 Second matrix to multiply with
     * @returns Product of the two matrices as a new matrix
     */
    multiply(matrix2) {
        //impossible to multiply
        if (this.w != matrix2.h) {
            return false;
        }
        var ans = []; // define ans matrix
        for (var i = 0; i < this.h; i++) {  //go over rows (top to down)
            ans.push([]);
            for (var j = 0; j < matrix2.w; j++) { // go over columns (left to right)
                var sub_ans = 0;
                if (this.diagonal) { //simpler formula to avoid O(n3) complexity by not multiplying zeros
                    sub_ans += this.data[0][i]*matrix2.data[i][j];
                }
                else if (matrix2.diagonal) {
                    sub_ans += this.data[i][j]*matrix2.data[0][j];
                }
                else {
                    this.data = this.getFullData(); // no simpler formula for triangles yet
                    matrix2.data = matrix2.getFullData();
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
        for (var i = 0; i < this.h; i++) {
            ans.push([]);
            for (var j = 0; j < this.w; j++) {
                var a = 0;
                var b = 0;

                if (this.diagonal && i == j) {a = this.data[0][j];}
                else if (!this.diagonal) {a = this.data[i][j];}
                if (matrix2.diagonal && i == j) {b = matrix2.data[0][j];}
                else if (!matrix2.diagonal) {b = matrix2.data[i][j];}

                ans[i].push(a+b);
            }
        }
        return new Matrix(ans, this.diagonal && matrix2.diagonal);
    }

    /**
     * Function to multiply matrix with a number
     * @param {Number} number Number to multiply with
     * @returns The product as a new Matrix
     */
    multiplyScalar(number) {
        var ans = [];
        for (var i = 0; i < this.h; i++) {
            ans.push([]);
            for (var j = 0; j < this.w; j++) {
                if (this.diagonal) {
                    if (i == j) {ans[i].push(this.data[0][j]*number);}
                    else {ans[i].push(0)}
                }
                else {
                    ans[i].push(this.data[i][j]*number);
                }
                
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
        if (this.diagonal) {
            return this;
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
     * Function to get inverse of a matrix, currently works for only diagonal ones
     * @returns Inverse of the matrix as a new matrix
     */
    getInverse() {
        var ans = [];
        if (this.diagonal) {
            for (var i = 0; i < this.data[0].length; i++) {
                ans.push(1/this.data[0][i]);
            }
            return new Matrix([ans], true);
        }
        else {
            return false;
        }

    }

    /**
     * Function to print out the matrix
     */
    printOut() {
        for (var i = 0; i < this.h; i++) {
            var line = "";
            for (var j = 0; j < this.w; j++) {
                if (this.diagonal) {
                    if (i == j) {line += this.data[0][i] + " ";}
                    else {line += "0 ";}
                }
                else {
                    line += this.data[i][j] + " ";
                }
            }
        }
    }

    /**
     * Solves the matrix equation Ax = b using Jacobi method
     * @param {Matrix} rightSide The result vector b of length m
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
        ansMatrix.printOut()
        return ansMatrix;
    }
}