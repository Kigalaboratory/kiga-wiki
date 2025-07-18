"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('ホーム');
  const [repoUrl] = useState('https://github.com/user/project.git');
  const [copyStatus, setCopyStatus] = useState('');

  const showFloatingEmoji = (emoji: string) => {
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
  };

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    const emojis = ['🎉', '✨', '🚀', '💥', '🌈', '🦄', '🍕', '🍦', '🎮', '🎸'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    showFloatingEmoji(randomEmoji);
  };

  const handleCloneCopy = () => {
    navigator.clipboard.writeText(repoUrl).then(() => {
      setCopyStatus('copied');
      setTimeout(() => {
        setCopyStatus('');
      }, 2000);
    });
  };

  const sidebarItems = [
    { name: '胃袋への挑戦状', icon: '☣️', href: '/lab-meshi', className: 'special rainbow-text' },
    { name: 'ホーム', icon: '🏠', href: '/' },
    { name: 'はじめの一歩！', icon: '🚀', href: '#' },
    { name: 'インストール（超簡単）', icon: '🔧', href: '#' },
    { name: '使い方（ヒミツ）', icon: '🎮', href: '#' },
    { name: 'API（難しいやつ）', icon: '🤖', href: '#' },
    { name: 'よくある質問（笑）', icon: '❓', className: 'wiggle', href: '#' },
    { name: '隠しページ', icon: '🎁', className: 'special', href: '#' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-box">
        <div className="sidebar-header">ページ</div>
        <nav>
          {sidebarItems.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`sidebar-item ${activeItem === item.name ? 'active' : ''} ${item.className || ''}`}
              onClick={() => handleItemClick(item.name)}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
        <button className="add-page-btn">
          <span className="icon-plus"></span>
          新しいページを追加
        </button>
      </div>

      <div className="sidebar-box">
        <div className="sidebar-header">クローン</div>
        <div className="clone-section">
          <div className="clone-input">
            <code id="repoUrl">{repoUrl}</code>
            <button 
              className={`copy-btn icon-copy ${copyStatus}`} 
              title="URLをコピー"
              onClick={handleCloneCopy}
            ></button>
          </div>
          <div className="clone-description">
            リポジトリをクローンするには、<code>git clone</code>コマンドを使用します。
          </div>
        </div>
      </div>
    </aside>
  );
}
