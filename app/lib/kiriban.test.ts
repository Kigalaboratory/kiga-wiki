import { describe, it, expect } from 'vitest';
import { isKiriban } from './kiriban';

describe('isKiriban', () => {
  // 100の倍数
  it('should return true for multiples of 100', () => {
    expect(isKiriban(100)).toBe(true);
    expect(isKiriban(200)).toBe(true);
    expect(isKiriban(1000)).toBe(true);
  });

  // 777
  it('should return true for 777', () => {
    expect(isKiriban(777)).toBe(true);
  });

  // ゾろ目
  it('should return true for repdigits (Zoro-me)', () => {
    expect(isKiriban(11)).toBe(true);
    expect(isKiriban(22)).toBe(true);
    expect(isKiriban(333)).toBe(true);
    expect(isKiriban(4444)).toBe(true);
    expect(isKiriban(99)).toBe(true);
  });

  // 階段（連番）
  it('should return true for sequential numbers (Kaidan)', () => {
    expect(isKiriban(12)).toBe(true);
    expect(isKiriban(123)).toBe(true);
    expect(isKiriban(2345)).toBe(true);
    expect(isKiriban(543)).toBe(true);
    expect(isKiriban(987)).toBe(true);
  });

  // キリ番ではないケース
  it('should return false for non-kiriban numbers', () => {
    expect(isKiriban(10)).toBe(false);
    expect(isKiriban(124)).toBe(false);
    expect(isKiriban(776)).toBe(false);
    expect(isKiriban(112)).toBe(false);
  });

  // 1桁の数字
  it('should return false for single digit numbers', () => {
    expect(isKiriban(0)).toBe(false);
    expect(isKiriban(1)).toBe(false);
    expect(isKiriban(7)).toBe(false);
  });
});
