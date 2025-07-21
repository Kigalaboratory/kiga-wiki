'use client';

export default function Header() {
  const GITHUB_URL = 'https://github.com/Kigalaboratory/kiga-wiki/tree/main';

  const handleEditClick = () => {
    console.log(
      `
      神の啓示
      ⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️⚡️
      `
    );
    alert(
      '見ちゃったね？ 見ちゃったね？ このボタンは『押すな』と書いてあるのと同じなんだぜ。編集権限？ そんなものはない。代わりに、我々の秘密結社の古文書（GitHub）への道を示してやろう。'
    );
    window.location.href = GITHUB_URL;
  };

  const handleHistoryClick = () => {
    console.log(
      `
      タイムマシン
      ⏳...⌛️...⏳...⌛️...⏳
      `
    );
    alert(
      '過去に戻りたいだと？ 残念だったな、タイムマシンはまだ開発中だ。このWikiの黒歴史（コミットログ）なら見せてやってもいいが...見る覚悟はできているか？'
    );
    window.location.href = GITHUB_URL;
  };

  const handleResetCookie = () => {
    localStorage.removeItem('cookieConsent');
    window.location.reload(); // ページをリロードしてバナーを再表示
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <span className="bounce-icon icon-book"></span>
            <h1>Kiga Wiki</h1>
          </div>
          <div className="header-buttons">
            <button onClick={handleEditClick} className="btn btn-green">
              <span className="icon-edit"></span>
              編集
            </button>
            <button onClick={handleHistoryClick} className="btn btn-gray">
              <span className="icon-history"></span>
              履歴
            </button>
            <button onClick={handleResetCookie} className="btn btn-red">
              <span className="icon-cookie"></span>
              クッキー設定をリセット
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
