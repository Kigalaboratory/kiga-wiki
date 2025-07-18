import { vi, describe, it, expect, beforeEach } from 'vitest';
import { getAllDishes } from './data';
import { prisma } from './prisma';

// prisma.dish.findManyをモック化
vi.mock('./prisma', () => ({
  prisma: {
    dish: {
      findMany: vi.fn(),
    },
  },
}));

// React.cacheをモックして、テスト環境では何もしないようにする
// これにより、キャッシュの有無に関わらず、関数の基本的な動作をテストできる
vi.mock('react', async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cache: (fn: any) => fn,
    };
});

describe('getAllDishes', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.mocked(prisma.dish.findMany).mockClear();
  });

  it('should call prisma.dish.findMany', async () => {
    // モックされたfindManyがダミーデータを返すように設定
    const mockDishes = [{ id: 1, name: 'Test Dish', chef: 'Test Chef', comment: 'Yummy', createdAt: new Date() }];
    vi.mocked(prisma.dish.findMany).mockResolvedValue(mockDishes);

    const result = await getAllDishes();

    // prisma.dish.findManyが1回呼び出されたことを確認
    expect(prisma.dish.findMany).toHaveBeenCalledTimes(1);
    // 正しいデータが返されることを確認
    expect(result).toEqual(mockDishes);
  });
});
