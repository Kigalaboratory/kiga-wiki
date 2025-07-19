/**
 * 与えられた数値がキリ番かどうかを判定します。
 * @param n 判定対象の数値
 * @returns キリ番であればtrue、そうでなければfalse
 */
export const isKiriban = (n: number): boolean => {
  // テストケースより、1桁の数字はキリ番ではない
  if (n < 10) {
    return false;
  }

  // 条件1: 100の倍数か？ (最優先)
  if (n % 100 === 0) {
    return true;
  }

  // 100の倍数ではない10の倍数はキリ番ではない (isKiriban(10) === false のため)
  if (n % 10 === 0) {
    return false;
  }

  const s = String(n);

  // 条件2: ゾろ目か？ (例: 11, 777)
  if (new Set(s.split('')).size === 1) {
    return true;
  }
  
  // 条件3: 階段状の連番か？ (例: 123, 543)
  const digits = s.split('').map(Number);

  // 昇順のチェック (ご提案のeveryを使用)
  const isAscending = digits.every((d, i) => i === 0 || d === digits[i - 1] + 1);
  if (isAscending) {
    return true;
  }

  // 降順のチェック (ご提案のeveryを使用)
  const isDescending = digits.every((d, i) => i === 0 || d === digits[i - 1] - 1);
  if (isDescending) {
    return true;
  }

  return false;
};
