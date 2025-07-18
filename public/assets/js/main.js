// Wiki機能のメインJavaScript

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeCopyButtons();
    initializeSecretButton();
});

// サイドバーの初期化
function initializeSidebar() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブ状態を切り替え
            document.querySelectorAll('.sidebar-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');

            // おふざけ要素：クリックするとランダムな絵文字を表示
            const emojis = ['🎉', '✨', '🚀', '💥', '🌈', '🦄', '🍕', '🍦', '🎮', '🎸'];
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            showFloatingEmoji(randomEmoji);
        });
    });
}

// 浮遊絵文字を表示する関数
function showFloatingEmoji(emoji) {
    const emojiSpan = document.createElement('span');
    emojiSpan.textContent = emoji;
    emojiSpan.style.position = 'fixed';
    emojiSpan.style.fontSize = '2rem';
    emojiSpan.style.left = Math.random() * 90 + '%';
    emojiSpan.style.top = Math.random() * 80 + '%';
    emojiSpan.style.zIndex = '999';
    emojiSpan.style.pointerEvents = 'none';
    emojiSpan.style.transition = 'all 1s ease-out';
    document.body.appendChild(emojiSpan);

    setTimeout(() => {
        emojiSpan.style.transform = 'translateY(-100px)';
        emojiSpan.style.opacity = '0';
    }, 100);

    setTimeout(() => {
        if (emojiSpan.parentNode) {
            document.body.removeChild(emojiSpan);
        }
    }, 1100);
}

// コピーボタンの初期化
function initializeCopyButtons() {
    // コードブロックのコピーボタン
    document.querySelectorAll('.copy-code-btn').forEach(button => {
        button.addEventListener('click', function() {
            const codeBlock = this.closest('.code-block').querySelector('pre');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const originalText = this.textContent;
                this.textContent = 'コピーしました！';
                this.classList.add('copied');
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // クローンURLのコピーボタン
    const cloneCopyBtn = document.querySelector('.copy-btn');
    if (cloneCopyBtn) {
        cloneCopyBtn.addEventListener('click', function() {
            const url = this.previousElementSibling.textContent;
            navigator.clipboard.writeText(url).then(() => {
                this.style.color = '#38a169';
                setTimeout(() => {
                    this.style.color = '#718096';
                }, 2000);
            });
        });
    }
}

// 秘密のボタンの初期化
function initializeSecretButton() {
    const secretButton = document.getElementById('secretButton');
    if (secretButton) {
        secretButton.addEventListener('click', activateSecret);
    }
}

// 秘密の機能を発動
function activateSecret() {
    // ページ全体を一瞬だけ回転させる
    document.body.style.transition = 'transform 0.5s ease-in-out';
    document.body.style.transform = 'rotate(360deg)';

    // 秘密のメッセージを表示
    const secretMessage = document.createElement('div');
    secretMessage.className = 'secret-message';
    secretMessage.innerHTML = `
        <h3>🎁 秘密を発見！</h3>
        <p>おめでとう！何も起きないと言ったのに、クリックしちゃったね！</p>
        <p style="margin-top: 15px; font-size: 0.8rem;">（5秒後に消えます）</p>
    `;
    document.body.appendChild(secretMessage);

    // 紙吹雪エフェクト
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }

    // 5秒後にメッセージを消す
    setTimeout(() => {
        if (secretMessage.parentNode) {
            document.body.removeChild(secretMessage);
        }
        document.body.style.transform = 'none';
    }, 5000);
}

// 紙吹雪を作成する関数
function createConfetti() {
    const colors = ['#ff7eb3', '#7afcff', '#feff9c', '#fff740'];
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.opacity = Math.random() + 0.5;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);

    // アニメーション
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

// ページローダー（オプション）
function loadPage(pageName) {
    // 将来的に他のページを動的に読み込む場合に使用
    console.log(`Loading page: ${pageName}`);
}