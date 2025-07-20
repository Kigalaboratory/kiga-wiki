'use client';

export default function Header() {
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
            <a href="#" className="btn btn-green">
              <span className="icon-edit"></span>
              編集
            </a>
            <a href="#" className="btn btn-gray">
              <span className="icon-history"></span>
              履歴
            </a>
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
