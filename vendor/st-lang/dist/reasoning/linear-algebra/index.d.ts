/** Matriz densa de números reales representada como array de filas. */
export type Matrix = number[][];
/** Vector de números reales representado como array plano. */
export type Vector = number[];
/** Crea una matriz `rows × cols` rellena con `fill` (default 0). */
export declare function mat(rows: number, cols: number, fill?: number): Matrix;
/** Crea una matriz de ceros de dimensión `rows × cols`. */
export declare function zeros(rows: number, cols: number): Matrix;
/** Crea una matriz de unos de dimensión `rows × cols`. */
export declare function ones(rows: number, cols: number): Matrix;
/** Crea la matriz identidad `n × n`. */
export declare function identity(n: number): Matrix;
/** Crea una matriz diagonal con `entries` en la diagonal principal. */
export declare function diagonal(entries: number[]): Matrix;
/** Devuelve una copia profunda de la matriz `M`. */
export declare function clone(M: Matrix): Matrix;
/** Devuelve la transpuesta de la matriz `M`. */
export declare function transpose(M: Matrix): Matrix;
/** Suma elemento a elemento de dos matrices con la misma forma. */
export declare function add(a: Matrix, b: Matrix): Matrix;
/** Resta elemento a elemento de dos matrices con la misma forma. */
export declare function sub(a: Matrix, b: Matrix): Matrix;
/** Multiplica todos los elementos de `M` por el escalar `c`. */
export declare function scalarMul(c: number, M: Matrix): Matrix;
/** Producto matricial estándar `a × b`. Lanza si las dimensiones son incompatibles. */
export declare function multiply(a: Matrix, b: Matrix): Matrix;
/** Multiplica la matriz `M` por el vector `v` (M·v). */
export declare function matVec(M: Matrix, v: Vector): Vector;
/** Producto punto (escalar) de dos vectores de igual longitud. */
export declare function dot(a: Vector, b: Vector): number;
/** Norma euclidiana (L2) del vector `v`. */
export declare function norm(v: Vector): number;
/** Devuelve el vector `v` escalado a norma unitaria. Lanza si `v` es el vector cero. */
export declare function normalize(v: Vector): Vector;
/** Producto vectorial de `a` × `b` en R³. Lanza si alguno no tiene exactamente 3 componentes. */
export declare function cross(a: Vector, b: Vector): Vector;
/** Reduce la matriz a forma escalonada reducida (RREF) por Gauss-Jordan. Devuelve la matriz reducida, el rango y las columnas pivot. */
export declare function rref(M: Matrix): {
    reduced: Matrix;
    rank: number;
    pivotCols: number[];
};
/** Calcula el rango de la matriz `M` mediante RREF. */
export declare function rank(M: Matrix): number;
/** Calcula el determinante de la matriz cuadrada `M` por eliminación de Gauss con pivoteo parcial. */
export declare function determinant(M: Matrix): number;
/** Devuelve la inversa de la matriz cuadrada `M`, o `null` si es singular. */
export declare function inverse(M: Matrix): Matrix | null;
/** Resuelve el sistema lineal Ax = b. Devuelve `null` si no tiene solución única (sistema indeterminado o incompatible). */
export declare function solve(A: Matrix, b: Vector): Vector | null;
/** Calcula la solución de mínimos cuadrados de Ax ≈ b vía ecuaciones normales (AᵀAx = Aᵀb). */
export declare function leastSquares(A: Matrix, b: Vector): Vector;
/** Resultado de una descomposición LU con pivoteo parcial: L, U y la permutación P. */
export interface LU {
    L: Matrix;
    U: Matrix;
    P: number[];
}
/** Descomposición LU con pivoteo parcial de la matriz cuadrada `M`. Devuelve `null` si es singular. */
export declare function decomposeLU(M: Matrix): LU | null;
/** Construye la matriz de permutación correspondiente al vector de permutación `P`. */
export declare function permutationMatrix(P: number[]): Matrix;
/** Resultado de una descomposición QR: Q ortogonal y R triangular superior. */
export interface QR {
    Q: Matrix;
    R: Matrix;
}
/** Descomposición QR por Gram-Schmidt para matrices con `rows >= cols`. */
export declare function decomposeQR(M: Matrix): QR;
/** Resultado de una descomposición SVD: matrices U, V y valores singulares S. */
export interface SVD {
    U: Matrix;
    S: number[];
    V: Matrix;
}
/** Descomposición SVD de `M` vía eigendescomposición de AᵀA con el algoritmo de Jacobi. */
export declare function decomposeSVD(M: Matrix, maxIter?: number): SVD;
/** Calcula el autovalor dominante y su autovector por el método de la potencia. */
export declare function powerIteration(M: Matrix, opts?: {
    maxIter?: number;
    eps?: number;
}): {
    eigenvalue: number;
    eigenvector: Vector;
};
/** Calcula los autovalores reales de la matriz cuadrada `M` (QR iterativo para asimétricas, Jacobi para simétricas). */
export declare function eigenvalues(M: Matrix, opts?: {
    maxIter?: number;
    eps?: number;
}): number[];
/** Calcula autovalores y autovectores de la matriz simétrica `M` por el algoritmo de Jacobi. */
export declare function eigenvectors(M: Matrix, opts?: {
    maxIter?: number;
    eps?: number;
}): {
    values: number[];
    vectors: Matrix;
};
/** Devuelve una base del espacio nulo (kernel) de `M` usando RREF. */
export declare function nullSpace(M: Matrix): Vector[];
/** Devuelve una base del espacio columna (imagen) de `M` como las columnas pivot del original. */
export declare function columnSpace(M: Matrix): Vector[];
/** Ortogonaliza y normaliza la lista de vectores mediante el proceso de Gram-Schmidt. Descarta vectores linealmente dependientes. */
export declare function gramSchmidt(vectors: Vector[]): Vector[];
/** Comprueba si la lista de vectores es linealmente independiente verificando que el rango de la matriz columna sea igual a su cantidad. */
export declare function isLinearlyIndependent(vectors: Vector[]): boolean;
//# sourceMappingURL=index.d.ts.map