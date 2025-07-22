"use client";

export default function Footer() {

  const createConfetti = () => {
    const colors = ['#ff7eb3', '#7afcff', '#feff9c', '#fff740'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.opacity = `${Math.random() + 0.5}`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);

    const startTransform = `translate(0, 0) rotate(0deg)`;
    const endTransform = `translate(${Math.random() * 100 - 50}px, ${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
    
    confetti.animate([
        { transform: startTransform, opacity: 1 },
        { transform: endTransform, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    }).onfinish = () => {
        if (confetti.parentNode) {
            document.body.removeChild(confetti);
        }
    };
  }

  const activateSecret = () => {
    document.body.style.transition = 'transform 0.5s ease-in-out';
    document.body.style.transform = 'rotate(360deg)';

    const secretMessage = document.createElement('div');
    secretMessage.className = 'secret-message';
    secretMessage.innerHTML = `
        <h3>🎁 秘密を発見！</h3>
        <p>おめでとう！何も起きないと言ったのに、クリックしちゃったね！</p>
        <p style="margin-top: 15px; font-size: 0.8rem;">（5秒後に消えます）</p>
    `;
    document.body.appendChild(secretMessage);

    for (let i = 0; i < 50; i++) {
        createConfetti();
    }

    setTimeout(() => {
        if (secretMessage.parentNode) {
            document.body.removeChild(secretMessage);
        }
        document.body.style.transform = 'none';
    }, 5000);
  }

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            © 2023 ワクワクプロジェクト. <span className="wiggle" style={{ display: 'inline-block' }}>All rights reserved (たぶん)</span>
            <small>このサイトは真面目に見えて実は全然真面目じゃないよ</small>
          </div>
          <div className="social-links">
            <a href="#" className="social-link github icon-github" title="GitHub"></a>
            <a href="#" className="social-link twitter icon-twitter" title="Twitter"></a>
            <a href="#" className="social-link email icon-email" title="Email"></a>
            <a href="#" className="social-link cookie icon-cookie" title="Cookie"></a>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
          <p>
            本ウェブサイトに掲載されている事象、登場する人物、団体、名称、事件、場所などはすべて架空のものであり、<strong>実在のものとは一切関係ありません</strong>。
          </p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button onClick={activateSecret} id="secretButton" className="secret-button">
            ここをクリックしても何も起きません（多分）
          </button>
        </div>
      </div>
    </footer>
  );
}
