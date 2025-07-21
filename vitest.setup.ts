import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { server } from './app/mocks/server';

// jest-domのマッチャーをvitestのexpectに拡張
expect.extend(matchers);

// テスト全体の開始前にモックサーバーを起動
beforeAll(() => server.listen());

// 各テストの後にDOMをクリーンアップし、モックサーバーのハンドラをリセット
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// テスト全体の終了後にモックサーバーを閉じる
afterAll(() => server.close());

// JSDOM環境でアラートとコンソール出力をモック
vi.spyOn(window, 'alert').mockImplementation(() => {});
vi.spyOn(console, 'log').mockImplementation(() => {});
