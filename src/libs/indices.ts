export function generateIndices(n: number): number[][] {
  const rows = Array(n)
    .fill('')
    .map((_, rindex) =>
      Array(n)
        .fill('')
        .map((__, cindex) => rindex * n + cindex)
    );

  const cols = Array(n)
    .fill('')
    .map((_, cindex) =>
      Array(n)
        .fill('')
        .map((__, rindex) => cindex + n * rindex)
    );

  const diagonals = Array(n).fill('').map((_, index) => rows[index][index])
  const antiDiagonals = Array(n).fill('').map((_, index) => rows[index][n - 1 - index])

  return [...rows, ...cols, diagonals, antiDiagonals];
}
