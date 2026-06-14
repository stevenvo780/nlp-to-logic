"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mat = mat;
exports.zeros = zeros;
exports.ones = ones;
exports.identity = identity;
exports.diagonal = diagonal;
exports.clone = clone;
exports.transpose = transpose;
exports.add = add;
exports.sub = sub;
exports.scalarMul = scalarMul;
exports.multiply = multiply;
exports.matVec = matVec;
exports.dot = dot;
exports.norm = norm;
exports.normalize = normalize;
exports.cross = cross;
exports.rref = rref;
exports.rank = rank;
exports.determinant = determinant;
exports.inverse = inverse;
exports.solve = solve;
exports.leastSquares = leastSquares;
exports.decomposeLU = decomposeLU;
exports.permutationMatrix = permutationMatrix;
exports.decomposeQR = decomposeQR;
exports.decomposeSVD = decomposeSVD;
exports.powerIteration = powerIteration;
exports.eigenvalues = eigenvalues;
exports.eigenvectors = eigenvectors;
exports.nullSpace = nullSpace;
exports.columnSpace = columnSpace;
exports.gramSchmidt = gramSchmidt;
exports.isLinearlyIndependent = isLinearlyIndependent;
const DEFAULT_EPS = 1e-10;
function ensureRect(M, label = 'matrix') {
    const rows = M.length;
    if (rows === 0) {
        return { rows: 0, cols: 0 };
    }
    const first = M[0];
    if (!first) {
        throw new Error(`${label}: empty row`);
    }
    const cols = first.length;
    for (let i = 0; i < rows; i++) {
        const row = M[i];
        if (!row || row.length !== cols) {
            throw new Error(`${label}: row ${i} has inconsistent length`);
        }
    }
    return { rows, cols };
}
function getCell(M, r, c) {
    const row = M[r];
    if (!row) {
        throw new Error(`out of bounds: row ${r}`);
    }
    const v = row[c];
    if (v === undefined) {
        throw new Error(`out of bounds: col ${c}`);
    }
    return v;
}
function setCell(M, r, c, v) {
    const row = M[r];
    if (!row) {
        throw new Error(`out of bounds: row ${r}`);
    }
    row[c] = v;
}
function getRow(M, r) {
    const row = M[r];
    if (!row) {
        throw new Error(`out of bounds: row ${r}`);
    }
    return row;
}
function getVec(v, i) {
    const x = v[i];
    if (x === undefined) {
        throw new Error(`vector out of bounds: ${i}`);
    }
    return x;
}
/** Crea una matriz `rows × cols` rellena con `fill` (default 0). */
function mat(rows, cols, fill = 0) {
    if (rows < 0 || cols < 0 || !Number.isInteger(rows) || !Number.isInteger(cols)) {
        throw new Error('mat: rows and cols must be non-negative integers');
    }
    const M = new Array(rows);
    for (let i = 0; i < rows; i++) {
        M[i] = new Array(cols).fill(fill);
    }
    return M;
}
/** Crea una matriz de ceros de dimensión `rows × cols`. */
function zeros(rows, cols) {
    return mat(rows, cols, 0);
}
/** Crea una matriz de unos de dimensión `rows × cols`. */
function ones(rows, cols) {
    return mat(rows, cols, 1);
}
/** Crea la matriz identidad `n × n`. */
function identity(n) {
    const I = zeros(n, n);
    for (let i = 0; i < n; i++) {
        setCell(I, i, i, 1);
    }
    return I;
}
/** Crea una matriz diagonal con `entries` en la diagonal principal. */
function diagonal(entries) {
    const n = entries.length;
    const D = zeros(n, n);
    for (let i = 0; i < n; i++) {
        setCell(D, i, i, getVec(entries, i));
    }
    return D;
}
/** Devuelve una copia profunda de la matriz `M`. */
function clone(M) {
    const { rows, cols } = ensureRect(M, 'clone');
    const out = zeros(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(out, i, j, getCell(M, i, j));
        }
    }
    return out;
}
/** Devuelve la transpuesta de la matriz `M`. */
function transpose(M) {
    const { rows, cols } = ensureRect(M, 'transpose');
    const T = zeros(cols, rows);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(T, j, i, getCell(M, i, j));
        }
    }
    return T;
}
function sameShape(a, b, label) {
    const A = ensureRect(a, `${label}/a`);
    const B = ensureRect(b, `${label}/b`);
    if (A.rows !== B.rows || A.cols !== B.cols) {
        throw new Error(`${label}: shape mismatch (${A.rows}x${A.cols}) vs (${B.rows}x${B.cols})`);
    }
    return A;
}
/** Suma elemento a elemento de dos matrices con la misma forma. */
function add(a, b) {
    const { rows, cols } = sameShape(a, b, 'add');
    const out = zeros(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(out, i, j, getCell(a, i, j) + getCell(b, i, j));
        }
    }
    return out;
}
/** Resta elemento a elemento de dos matrices con la misma forma. */
function sub(a, b) {
    const { rows, cols } = sameShape(a, b, 'sub');
    const out = zeros(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(out, i, j, getCell(a, i, j) - getCell(b, i, j));
        }
    }
    return out;
}
/** Multiplica todos los elementos de `M` por el escalar `c`. */
function scalarMul(c, M) {
    const { rows, cols } = ensureRect(M, 'scalarMul');
    const out = zeros(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(out, i, j, c * getCell(M, i, j));
        }
    }
    return out;
}
/** Producto matricial estándar `a × b`. Lanza si las dimensiones son incompatibles. */
function multiply(a, b) {
    const A = ensureRect(a, 'multiply/a');
    const B = ensureRect(b, 'multiply/b');
    if (A.cols !== B.rows) {
        throw new Error(`multiply: dimension mismatch (${A.rows}x${A.cols}) * (${B.rows}x${B.cols})`);
    }
    const out = zeros(A.rows, B.cols);
    for (let i = 0; i < A.rows; i++) {
        for (let k = 0; k < A.cols; k++) {
            const aik = getCell(a, i, k);
            if (aik === 0) {
                continue;
            }
            for (let j = 0; j < B.cols; j++) {
                setCell(out, i, j, getCell(out, i, j) + aik * getCell(b, k, j));
            }
        }
    }
    return out;
}
/** Multiplica la matriz `M` por el vector `v` (M·v). */
function matVec(M, v) {
    const { rows, cols } = ensureRect(M, 'matVec');
    if (cols !== v.length) {
        throw new Error(`matVec: dimension mismatch (${rows}x${cols}) * (${v.length})`);
    }
    const out = new Array(rows).fill(0);
    for (let i = 0; i < rows; i++) {
        let s = 0;
        for (let j = 0; j < cols; j++) {
            s += getCell(M, i, j) * getVec(v, j);
        }
        out[i] = s;
    }
    return out;
}
/** Producto punto (escalar) de dos vectores de igual longitud. */
function dot(a, b) {
    if (a.length !== b.length) {
        throw new Error(`dot: length mismatch (${a.length} vs ${b.length})`);
    }
    let s = 0;
    for (let i = 0; i < a.length; i++) {
        s += getVec(a, i) * getVec(b, i);
    }
    return s;
}
/** Norma euclidiana (L2) del vector `v`. */
function norm(v) {
    let s = 0;
    for (let i = 0; i < v.length; i++) {
        const x = getVec(v, i);
        s += x * x;
    }
    return Math.sqrt(s);
}
/** Devuelve el vector `v` escalado a norma unitaria. Lanza si `v` es el vector cero. */
function normalize(v) {
    const n = norm(v);
    if (n < DEFAULT_EPS) {
        throw new Error('normalize: zero vector');
    }
    const out = new Array(v.length);
    for (let i = 0; i < v.length; i++) {
        out[i] = getVec(v, i) / n;
    }
    return out;
}
/** Producto vectorial de `a` × `b` en R³. Lanza si alguno no tiene exactamente 3 componentes. */
function cross(a, b) {
    if (a.length !== 3 || b.length !== 3) {
        throw new Error('cross: only defined for R^3 vectors');
    }
    const a0 = getVec(a, 0);
    const a1 = getVec(a, 1);
    const a2 = getVec(a, 2);
    const b0 = getVec(b, 0);
    const b1 = getVec(b, 1);
    const b2 = getVec(b, 2);
    return [a1 * b2 - a2 * b1, a2 * b0 - a0 * b2, a0 * b1 - a1 * b0];
}
/** Reduce la matriz a forma escalonada reducida (RREF) por Gauss-Jordan. Devuelve la matriz reducida, el rango y las columnas pivot. */
function rref(M) {
    const { rows, cols } = ensureRect(M, 'rref');
    const R = clone(M);
    const pivotCols = [];
    let lead = 0;
    for (let r = 0; r < rows; r++) {
        if (lead >= cols) {
            break;
        }
        let i = r;
        while (i < rows && Math.abs(getCell(R, i, lead)) < DEFAULT_EPS) {
            i++;
        }
        if (i === rows) {
            r--;
            lead++;
            continue;
        }
        if (i !== r) {
            const tmp = getRow(R, i);
            R[i] = getRow(R, r);
            R[r] = tmp;
        }
        const pivot = getCell(R, r, lead);
        for (let j = 0; j < cols; j++) {
            setCell(R, r, j, getCell(R, r, j) / pivot);
        }
        for (let k = 0; k < rows; k++) {
            if (k === r) {
                continue;
            }
            const factor = getCell(R, k, lead);
            if (Math.abs(factor) < DEFAULT_EPS) {
                continue;
            }
            for (let j = 0; j < cols; j++) {
                setCell(R, k, j, getCell(R, k, j) - factor * getCell(R, r, j));
            }
        }
        pivotCols.push(lead);
        lead++;
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (Math.abs(getCell(R, i, j)) < DEFAULT_EPS) {
                setCell(R, i, j, 0);
            }
        }
    }
    return { reduced: R, rank: pivotCols.length, pivotCols };
}
/** Calcula el rango de la matriz `M` mediante RREF. */
function rank(M) {
    return rref(M).rank;
}
/** Calcula el determinante de la matriz cuadrada `M` por eliminación de Gauss con pivoteo parcial. */
function determinant(M) {
    const { rows, cols } = ensureRect(M, 'determinant');
    if (rows !== cols) {
        throw new Error('determinant: matrix must be square');
    }
    const n = rows;
    if (n === 0) {
        return 1;
    }
    const A = clone(M);
    let det = 1;
    for (let i = 0; i < n; i++) {
        let pivotRow = i;
        let pivotAbs = Math.abs(getCell(A, i, i));
        for (let k = i + 1; k < n; k++) {
            const v = Math.abs(getCell(A, k, i));
            if (v > pivotAbs) {
                pivotAbs = v;
                pivotRow = k;
            }
        }
        if (pivotAbs < DEFAULT_EPS) {
            return 0;
        }
        if (pivotRow !== i) {
            const tmp = getRow(A, pivotRow);
            A[pivotRow] = getRow(A, i);
            A[i] = tmp;
            det = -det;
        }
        const pivot = getCell(A, i, i);
        det *= pivot;
        for (let k = i + 1; k < n; k++) {
            const factor = getCell(A, k, i) / pivot;
            if (factor === 0) {
                continue;
            }
            for (let j = i; j < n; j++) {
                setCell(A, k, j, getCell(A, k, j) - factor * getCell(A, i, j));
            }
        }
    }
    return det;
}
/** Devuelve la inversa de la matriz cuadrada `M`, o `null` si es singular. */
function inverse(M) {
    const { rows, cols } = ensureRect(M, 'inverse');
    if (rows !== cols) {
        throw new Error('inverse: matrix must be square');
    }
    const n = rows;
    const aug = zeros(n, 2 * n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            setCell(aug, i, j, getCell(M, i, j));
        }
        setCell(aug, i, n + i, 1);
    }
    const { reduced } = rref(aug);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const want = i === j ? 1 : 0;
            if (Math.abs(getCell(reduced, i, j) - want) > 1e-8) {
                return null;
            }
        }
    }
    const inv = zeros(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            setCell(inv, i, j, getCell(reduced, i, n + j));
        }
    }
    return inv;
}
/** Resuelve el sistema lineal Ax = b. Devuelve `null` si no tiene solución única (sistema indeterminado o incompatible). */
function solve(A, b) {
    const { rows, cols } = ensureRect(A, 'solve');
    if (rows !== b.length) {
        throw new Error('solve: b length must match A rows');
    }
    const aug = zeros(rows, cols + 1);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            setCell(aug, i, j, getCell(A, i, j));
        }
        setCell(aug, i, cols, getVec(b, i));
    }
    const { reduced, pivotCols } = rref(aug);
    for (const p of pivotCols) {
        if (p === cols) {
            return null;
        }
    }
    if (pivotCols.length < cols) {
        return null;
    }
    const x = new Array(cols).fill(0);
    for (let i = 0; i < pivotCols.length; i++) {
        const col = getVec(pivotCols, i);
        x[col] = getCell(reduced, i, cols);
    }
    return x;
}
/** Calcula la solución de mínimos cuadrados de Ax ≈ b vía ecuaciones normales (AᵀAx = Aᵀb). */
function leastSquares(A, b) {
    const { rows, cols } = ensureRect(A, 'leastSquares');
    if (rows !== b.length) {
        throw new Error('leastSquares: b length must match A rows');
    }
    const At = transpose(A);
    const AtA = multiply(At, A);
    const Atb = matVec(At, b);
    const x = solve(AtA, Atb);
    if (!x) {
        throw new Error('leastSquares: AtA is singular (rank-deficient A)');
    }
    if (x.length !== cols) {
        throw new Error('leastSquares: internal dimension error');
    }
    return x;
}
/** Descomposición LU con pivoteo parcial de la matriz cuadrada `M`. Devuelve `null` si es singular. */
function decomposeLU(M) {
    const { rows, cols } = ensureRect(M, 'decomposeLU');
    if (rows !== cols) {
        throw new Error('decomposeLU: matrix must be square');
    }
    const n = rows;
    const U = clone(M);
    const L = identity(n);
    const P = new Array(n);
    for (let i = 0; i < n; i++) {
        P[i] = i;
    }
    for (let i = 0; i < n; i++) {
        let pivotRow = i;
        let pivotAbs = Math.abs(getCell(U, i, i));
        for (let k = i + 1; k < n; k++) {
            const v = Math.abs(getCell(U, k, i));
            if (v > pivotAbs) {
                pivotAbs = v;
                pivotRow = k;
            }
        }
        if (pivotAbs < DEFAULT_EPS) {
            return null;
        }
        if (pivotRow !== i) {
            const tmpU = getRow(U, pivotRow);
            U[pivotRow] = getRow(U, i);
            U[i] = tmpU;
            const tmpP = getVec(P, pivotRow);
            P[pivotRow] = getVec(P, i);
            P[i] = tmpP;
            for (let j = 0; j < i; j++) {
                const tmpL = getCell(L, i, j);
                setCell(L, i, j, getCell(L, pivotRow, j));
                setCell(L, pivotRow, j, tmpL);
            }
        }
        const pivot = getCell(U, i, i);
        for (let k = i + 1; k < n; k++) {
            const factor = getCell(U, k, i) / pivot;
            setCell(L, k, i, factor);
            for (let j = i; j < n; j++) {
                setCell(U, k, j, getCell(U, k, j) - factor * getCell(U, i, j));
            }
        }
    }
    return { L, U, P };
}
/** Construye la matriz de permutación correspondiente al vector de permutación `P`. */
function permutationMatrix(P) {
    const n = P.length;
    const M = zeros(n, n);
    for (let i = 0; i < n; i++) {
        setCell(M, i, getVec(P, i), 1);
    }
    return M;
}
/** Descomposición QR por Gram-Schmidt para matrices con `rows >= cols`. */
function decomposeQR(M) {
    const { rows, cols } = ensureRect(M, 'decomposeQR');
    if (rows < cols) {
        throw new Error('decomposeQR: rows must be >= cols');
    }
    const Q = zeros(rows, cols);
    const R = zeros(cols, cols);
    for (let j = 0; j < cols; j++) {
        const v = new Array(rows);
        for (let i = 0; i < rows; i++) {
            v[i] = getCell(M, i, j);
        }
        for (let k = 0; k < j; k++) {
            let r = 0;
            for (let i = 0; i < rows; i++) {
                r += getCell(Q, i, k) * getVec(v, i);
            }
            setCell(R, k, j, r);
            for (let i = 0; i < rows; i++) {
                v[i] = getVec(v, i) - r * getCell(Q, i, k);
            }
        }
        const nrm = norm(v);
        if (nrm < DEFAULT_EPS) {
            setCell(R, j, j, 0);
            for (let i = 0; i < rows; i++) {
                setCell(Q, i, j, 0);
            }
        }
        else {
            setCell(R, j, j, nrm);
            for (let i = 0; i < rows; i++) {
                setCell(Q, i, j, getVec(v, i) / nrm);
            }
        }
    }
    return { Q, R };
}
function symmetricEigen(S, maxIter, eps) {
    const { rows, cols } = ensureRect(S, 'symmetricEigen');
    if (rows !== cols) {
        throw new Error('symmetricEigen: matrix must be square');
    }
    const n = rows;
    const A = clone(S);
    const V = identity(n);
    for (let iter = 0; iter < maxIter; iter++) {
        let p = 0;
        let q = 1;
        let maxOff = 0;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const v = Math.abs(getCell(A, i, j));
                if (v > maxOff) {
                    maxOff = v;
                    p = i;
                    q = j;
                }
            }
        }
        if (maxOff < eps) {
            break;
        }
        const app = getCell(A, p, p);
        const aqq = getCell(A, q, q);
        const apq = getCell(A, p, q);
        const theta = (aqq - app) / (2 * apq);
        let t;
        if (Math.abs(theta) > 1e15) {
            t = 1 / (2 * theta);
        }
        else {
            const sign = theta >= 0 ? 1 : -1;
            t = sign / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        }
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
            const aip = getCell(A, i, p);
            const aiq = getCell(A, i, q);
            setCell(A, i, p, c * aip - s * aiq);
            setCell(A, i, q, s * aip + c * aiq);
        }
        for (let j = 0; j < n; j++) {
            const apj = getCell(A, p, j);
            const aqj = getCell(A, q, j);
            setCell(A, p, j, c * apj - s * aqj);
            setCell(A, q, j, s * apj + c * aqj);
        }
        for (let i = 0; i < n; i++) {
            const vip = getCell(V, i, p);
            const viq = getCell(V, i, q);
            setCell(V, i, p, c * vip - s * viq);
            setCell(V, i, q, s * vip + c * viq);
        }
    }
    const values = new Array(n);
    for (let i = 0; i < n; i++) {
        values[i] = getCell(A, i, i);
    }
    return { values, vectors: V };
}
/** Descomposición SVD de `M` vía eigendescomposición de AᵀA con el algoritmo de Jacobi. */
function decomposeSVD(M, maxIter = 200) {
    const { rows, cols } = ensureRect(M, 'decomposeSVD');
    const At = transpose(M);
    const AtA = multiply(At, M);
    const { values, vectors: V } = symmetricEigen(AtA, maxIter, 1e-12);
    const order = [];
    for (let i = 0; i < values.length; i++) {
        order.push(i);
    }
    order.sort((a, b) => Math.abs(getVec(values, b)) - Math.abs(getVec(values, a)));
    const Vsorted = zeros(cols, cols);
    const sigma = new Array(cols).fill(0);
    for (let j = 0; j < cols; j++) {
        const src = getVec(order, j);
        const val = getVec(values, src);
        sigma[j] = Math.sqrt(Math.max(val, 0));
        for (let i = 0; i < cols; i++) {
            setCell(Vsorted, i, j, getCell(V, i, src));
        }
    }
    const U = zeros(rows, cols);
    for (let j = 0; j < cols; j++) {
        const vj = new Array(cols);
        for (let i = 0; i < cols; i++) {
            vj[i] = getCell(Vsorted, i, j);
        }
        const Av = matVec(M, vj);
        const s = getVec(sigma, j);
        if (s > 1e-10) {
            for (let i = 0; i < rows; i++) {
                setCell(U, i, j, getVec(Av, i) / s);
            }
        }
        else {
            for (let i = 0; i < rows; i++) {
                setCell(U, i, j, 0);
            }
        }
    }
    return { U, S: sigma, V: Vsorted };
}
/** Calcula el autovalor dominante y su autovector por el método de la potencia. */
function powerIteration(M, opts = {}) {
    const { rows, cols } = ensureRect(M, 'powerIteration');
    if (rows !== cols) {
        throw new Error('powerIteration: matrix must be square');
    }
    const n = rows;
    const maxIter = opts.maxIter ?? 1000;
    const eps = opts.eps ?? 1e-10;
    let v = new Array(n);
    for (let i = 0; i < n; i++) {
        v[i] = Math.sin(i + 1);
    }
    let nrm = norm(v);
    if (nrm < DEFAULT_EPS) {
        v[0] = 1;
        nrm = 1;
    }
    for (let i = 0; i < n; i++) {
        v[i] = getVec(v, i) / nrm;
    }
    let lambda = 0;
    for (let iter = 0; iter < maxIter; iter++) {
        const w = matVec(M, v);
        const wn = norm(w);
        if (wn < DEFAULT_EPS) {
            return { eigenvalue: 0, eigenvector: v };
        }
        const next = new Array(n);
        for (let i = 0; i < n; i++) {
            next[i] = getVec(w, i) / wn;
        }
        const newLambda = dot(next, matVec(M, next));
        if (Math.abs(newLambda - lambda) < eps) {
            lambda = newLambda;
            v = next;
            break;
        }
        lambda = newLambda;
        v = next;
    }
    return { eigenvalue: lambda, eigenvector: v };
}
function isSymmetric(M, eps = 1e-9) {
    const { rows, cols } = ensureRect(M, 'isSymmetric');
    if (rows !== cols) {
        return false;
    }
    for (let i = 0; i < rows; i++) {
        for (let j = i + 1; j < cols; j++) {
            if (Math.abs(getCell(M, i, j) - getCell(M, j, i)) > eps) {
                return false;
            }
        }
    }
    return true;
}
/** Calcula los autovalores reales de la matriz cuadrada `M` (QR iterativo para asimétricas, Jacobi para simétricas). */
function eigenvalues(M, opts = {}) {
    const { rows, cols } = ensureRect(M, 'eigenvalues');
    if (rows !== cols) {
        throw new Error('eigenvalues: matrix must be square');
    }
    const n = rows;
    const maxIter = opts.maxIter ?? 500;
    const eps = opts.eps ?? 1e-10;
    if (n === 0) {
        return [];
    }
    if (n === 1) {
        return [getCell(M, 0, 0)];
    }
    if (n === 2) {
        const a = getCell(M, 0, 0);
        const b = getCell(M, 0, 1);
        const c = getCell(M, 1, 0);
        const d = getCell(M, 1, 1);
        const tr = a + d;
        const det = a * d - b * c;
        const disc = tr * tr - 4 * det;
        if (disc < -eps) {
            return [];
        }
        const sq = Math.sqrt(Math.max(disc, 0));
        return [(tr + sq) / 2, (tr - sq) / 2];
    }
    if (isSymmetric(M, 1e-9)) {
        const { values } = symmetricEigen(M, maxIter, eps);
        return values.slice().sort((a, b) => b - a);
    }
    let A = clone(M);
    for (let iter = 0; iter < maxIter; iter++) {
        const { Q, R } = decomposeQR(A);
        A = multiply(R, Q);
        let off = 0;
        for (let i = 1; i < n; i++) {
            off += Math.abs(getCell(A, i, i - 1));
        }
        if (off < eps) {
            break;
        }
    }
    const out = new Array(n);
    for (let i = 0; i < n; i++) {
        out[i] = getCell(A, i, i);
    }
    return out.sort((a, b) => b - a);
}
/** Calcula autovalores y autovectores de la matriz simétrica `M` por el algoritmo de Jacobi. */
function eigenvectors(M, opts = {}) {
    const { rows, cols } = ensureRect(M, 'eigenvectors');
    if (rows !== cols) {
        throw new Error('eigenvectors: matrix must be square');
    }
    const maxIter = opts.maxIter ?? 500;
    const eps = opts.eps ?? 1e-12;
    if (!isSymmetric(M, 1e-9)) {
        throw new Error('eigenvectors: only supported for symmetric matrices');
    }
    const { values, vectors } = symmetricEigen(M, maxIter, eps);
    const n = values.length;
    const order = [];
    for (let i = 0; i < n; i++) {
        order.push(i);
    }
    order.sort((a, b) => getVec(values, b) - getVec(values, a));
    const sortedVals = new Array(n);
    const sortedVecs = zeros(n, n);
    for (let j = 0; j < n; j++) {
        const src = getVec(order, j);
        sortedVals[j] = getVec(values, src);
        for (let i = 0; i < n; i++) {
            setCell(sortedVecs, i, j, getCell(vectors, i, src));
        }
    }
    return { values: sortedVals, vectors: sortedVecs };
}
/** Devuelve una base del espacio nulo (kernel) de `M` usando RREF. */
function nullSpace(M) {
    const { cols } = ensureRect(M, 'nullSpace');
    const { reduced, pivotCols } = rref(M);
    const reducedRect = ensureRect(reduced, 'nullSpace/reduced');
    const pivotSet = new Set(pivotCols);
    const freeCols = [];
    for (let j = 0; j < cols; j++) {
        if (!pivotSet.has(j)) {
            freeCols.push(j);
        }
    }
    const basis = [];
    for (const free of freeCols) {
        const v = new Array(cols).fill(0);
        v[free] = 1;
        for (let i = 0; i < pivotCols.length; i++) {
            const pc = getVec(pivotCols, i);
            if (i >= reducedRect.rows) {
                break;
            }
            v[pc] = -getCell(reduced, i, free);
        }
        basis.push(v);
    }
    return basis;
}
/** Devuelve una base del espacio columna (imagen) de `M` como las columnas pivot del original. */
function columnSpace(M) {
    const { rows } = ensureRect(M, 'columnSpace');
    const { pivotCols } = rref(M);
    const basis = [];
    for (const c of pivotCols) {
        const col = new Array(rows);
        for (let i = 0; i < rows; i++) {
            col[i] = getCell(M, i, c);
        }
        basis.push(col);
    }
    return basis;
}
/** Ortogonaliza y normaliza la lista de vectores mediante el proceso de Gram-Schmidt. Descarta vectores linealmente dependientes. */
function gramSchmidt(vectors) {
    if (vectors.length === 0) {
        return [];
    }
    const first = vectors[0];
    if (!first) {
        return [];
    }
    const dim = first.length;
    const out = [];
    for (const raw of vectors) {
        if (raw.length !== dim) {
            throw new Error('gramSchmidt: vectors must share dimension');
        }
        const v = raw.slice();
        for (const u of out) {
            const c = dot(v, u);
            for (let i = 0; i < dim; i++) {
                v[i] = getVec(v, i) - c * getVec(u, i);
            }
        }
        const nrm = norm(v);
        if (nrm < DEFAULT_EPS) {
            continue;
        }
        const unit = new Array(dim);
        for (let i = 0; i < dim; i++) {
            unit[i] = getVec(v, i) / nrm;
        }
        out.push(unit);
    }
    return out;
}
/** Comprueba si la lista de vectores es linealmente independiente verificando que el rango de la matriz columna sea igual a su cantidad. */
function isLinearlyIndependent(vectors) {
    if (vectors.length === 0) {
        return true;
    }
    const first = vectors[0];
    if (!first) {
        return true;
    }
    const dim = first.length;
    if (vectors.length > dim) {
        return false;
    }
    const M = zeros(dim, vectors.length);
    for (let j = 0; j < vectors.length; j++) {
        const v = vectors[j];
        if (!v || v.length !== dim) {
            throw new Error('isLinearlyIndependent: vectors must share dimension');
        }
        for (let i = 0; i < dim; i++) {
            setCell(M, i, j, getVec(v, i));
        }
    }
    return rank(M) === vectors.length;
}
//# sourceMappingURL=index.js.map