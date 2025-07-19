"use client";

import { useEffect, useState } from 'react';
import { isKiriban } from '../lib/kiriban';

type VisitorCounterProps = {
  onScrollToComment: () => void;
};

export default function VisitorCounter({ onScrollToComment }: VisitorCounterProps) {
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [isKiribanUser, setIsKiribanUser] = useState(false);

  useEffect(() => {
    const incrementAndFetchCount = async () => {
      try {
        // 先に現在のカウントを取得
        const getResponse = await fetch('/api/visitors');
        if (!getResponse.ok) {
          throw new Error('Failed to fetch visitor count');
        }
        const data = await getResponse.json();
        const currentCount = data.count;

        // 次の番号を計算
        const nextVisitorNumber = currentCount + 1;
        setVisitorNumber(nextVisitorNumber);
        if (isKiriban(nextVisitorNumber)) {
          setIsKiribanUser(true);
        }

        // その後でカウントをインクリメント
        await fetch('/api/visitors', { method: 'POST' });

      } catch (error) {
        console.error(error);
        setVisitorNumber(0); 
      }
    };

    incrementAndFetchCount();
  }, []);

  return (
    <div className="alert alert-purple">
      <span className="alert-icon">🔬</span>
      <div>
        <strong>研究室に迷い込んだあなたの被験者番号: </strong>
        {visitorNumber !== null ? (
          <span className={`visitor-number ${isKiribanUser ? 'kiriban' : ''}`}>
            {visitorNumber}
          </span>
        ) : (
          <span>読み込み中...</span>
        )}
        {isKiribanUser && (
          <div className="kiriban-message">
            🎉キリ番ゲットおめでとう！🎉<br />
            記念に何かコメントを残していかないか？（強制ではない）
            <button onClick={onScrollToComment} className="silly-button">
              コメントする
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
