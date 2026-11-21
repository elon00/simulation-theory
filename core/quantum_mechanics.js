/**
 * Exact Linear Algebra & Quantum State Vector Mechanics
 * Foundations for 2022 Nobel Prize in Physics (Aspect, Clauser, Zeilinger)
 * No mocks. Exact complex arithmetic, Hilbert spaces, tensor products, and projection operators.
 */

class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }

    add(other) {
        return new Complex(this.re + other.re, this.im + other.im);
    }

    sub(other) {
        return new Complex(this.re - other.re, this.im - other.im);
    }

    mul(other) {
        if (typeof other === 'number') {
            return new Complex(this.re * other, this.im * other);
        }
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }

    div(scalar) {
        return new Complex(this.re / scalar, this.im / scalar);
    }

    conj() {
        return new Complex(this.re, -this.im);
    }

    absSq() {
        return this.re * this.re + this.im * this.im;
    }

    abs() {
        return Math.sqrt(this.absSq());
    }

    static fromReal(re) {
        return new Complex(re, 0);
    }
}

// Tensor Product of two matrices
function tensorProduct(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;

    const result = Array.from({ length: rowsA * rowsB }, () => 
        Array.from({ length: colsA * colsB }, () => new Complex(0, 0))
    );

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            for (let k = 0; k < rowsB; k++) {
                for (let l = 0; l < colsB; l++) {
                    result[i * rowsB + k][j * colsB + l] = A[i][j].mul(B[k][l]);
                }
            }
        }
    }
    return result;
}

// Matrix vector multiplication: M * v
function matrixVectorMul(M, v) {
    const rows = M.length;
    const cols = M[0].length;
    const out = [];
    for (let i = 0; i < rows; i++) {
        let sum = new Complex(0, 0);
        for (let j = 0; j < cols; j++) {
            sum = sum.add(M[i][j].mul(v[j]));
        }
        out.push(sum);
    }
    return out;
}

// Vector inner product: <u | v>
function innerProduct(u, v) {
    let sum = new Complex(0, 0);
    for (let i = 0; i < u.length; i++) {
        sum = sum.add(u[i].conj().mul(v[i]));
    }
    return sum;
}

// Expectation value <psi | O | psi>
function expectationValue(psi, operator) {
    const O_psi = matrixVectorMul(operator, psi);
    return innerProduct(psi, O_psi).re;
}

// Pauli Matrices (2x2)
const I2 = [
    [new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(1, 0)]
];

const SigmaX = [
    [new Complex(0, 0), new Complex(1, 0)],
    [new Complex(1, 0), new Complex(0, 0)]
];

const SigmaY = [
    [new Complex(0, 0), new Complex(0, -1)],
    [new Complex(0, 1), new Complex(0, 0)]
];

const SigmaZ = [
    [new Complex(1, 0), new Complex(0, 0)],
    [new Complex(0, 0), new Complex(-1, 0)]
];

/**
 * Single-qubit measurement operator along direction theta (in radians)
 * In the X-Z plane: A(theta) = cos(theta) * sigma_z + sin(theta) * sigma_x
 */
function measurementOperator(thetaRad) {
    const cosT = Math.cos(thetaRad);
    const sinT = Math.sin(thetaRad);
    return [
        [new Complex(cosT, 0), new Complex(sinT, 0)],
        [new Complex(sinT, 0), new Complex(-cosT, 0)]
    ];
}

/**
 * 2-Qubit Bell States (Orthonormal Basis of C^4)
 * |Phi+> = 1/sqrt(2) (|00> + |11>)
 * |Phi-> = 1/sqrt(2) (|00> - |11>)
 * |Psi+> = 1/sqrt(2) (|01> + |10>)
 * |Psi-> = 1/sqrt(2) (|01> - |10>)  <-- Entangled Singlet state (used in 2022 Nobel experiments)
 */
const invSqrt2 = 1.0 / Math.SQRT2;

function getBellStates() {
    return {
        phiPlus: [new Complex(invSqrt2, 0), new Complex(0, 0), new Complex(0, 0), new Complex(invSqrt2, 0)],
        phiMinus: [new Complex(invSqrt2, 0), new Complex(0, 0), new Complex(0, 0), new Complex(-invSqrt2, 0)],
        psiPlus: [new Complex(0, 0), new Complex(invSqrt2, 0), new Complex(invSqrt2, 0), new Complex(0, 0)],
        psiMinus: [new Complex(0, 0), new Complex(invSqrt2, 0), new Complex(-invSqrt2, 0), new Complex(0, 0)]
    };
}

module.exports = {
    Complex,
    tensorProduct,
    matrixVectorMul,
    innerProduct,
    expectationValue,
    measurementOperator,
    getBellStates,
    I2,
    SigmaX,
    SigmaY,
    SigmaZ
};
