'use client';

import { useState, useEffect } from 'react';

const customizationOptions = [
  '気分', '今日のラッキーカラー', '好きなエディタ', '好きなシェル', '好きなターミナル', 
  '好きなフォント', '好きなテーマ', '好きなキーボード', '好きなマウス', '好きなディスプレイ',
  '好きなOS', '好きなブラウザ', '好きな検索エンジン', '好きなSNS', '好きな音楽',
  '好きな映画', '好きなドラマ', '好きなアニメ', '好きな漫画', '好きなゲーム',
  '好きな食べ物', '好きな飲み物', '好きなスポーツ', '好きな動物', '好きな季節',
  '好きな色', '好きな数字', '好きな曜日', '好きな時間', '好きな場所',
  '好きな人', '好きな言葉', '好きな本', '好きな作家', '好きなアーティスト',
  '好きな曲', '好きな映画監督', '好きな俳優', '好きな女優', '好きな声優',
  '好きなキャラクター', '好きな必殺技', '好きな魔法', '好きなアイテム', '好きな乗り物',
  '好きな国', '好きな都市', '好きな歴史上の人物', '好きな戦国武将', '好きな幕末志士',
  '好きなプログラミング言語', '好きなフレームワーク', '好きなライブラリ', '好きなDB', '好きなクラウド',
  '好きなCI/CD', '好きなバージョン管理', '好きなエディタ拡張', '好きなCLIツール', '好きなAPI',
  '朝型か夜型か', '犬派か猫派か', 'きのこの山かたけのこの里か', 'つぶあんかこしあんか', '醤油かソースか',
  'ラーメンは醤油か味噌か塩か豚骨か', 'うどんはきつねかたぬきか', 'そばは温かいか冷たいか', '目玉焼きには何をかけるか', 'カレーの辛さは甘口か中辛か辛口か',
  'PCはWindowsかMacかLinuxか', 'スマホはiPhoneかAndroidか', 'タブレットはiPadかその他か', '時計はアナログかデジタルか', '靴はスニーカーか革靴か',
  'Tシャツは無地か柄物か', 'パンツはジーンズかチノパンか', 'アウターはジャケットかコートか', '髪型は短髪か長髪か', 'ひげはありかなしか',
  'コーヒーはブラックか砂糖ミルク入りか', 'お茶は緑茶か紅茶か麦茶か', 'お酒はビールかワインか日本酒か', 'タバコは吸うか吸わないか', '運動は好きか嫌いか',
  '旅行は国内か海外か', '休日はインドアかアウトドアか', '友達は多いか少ないか', '恋人はいるかいないか', '結婚はしているかしていないか',
  '貯金は得意か苦手か', '朝食はパンかごはんか', 'ペットは飼いたいか飼いたくないか', '好きな季節は春夏秋冬どれか', 'インドア派かアウトドア派か',
  'きのこの山とたけのこの里、どっち派？', '視力は良いか悪いか', '好きなスポーツは？', '得意な料理は？', '行ってみたい国は？'
];

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'true'); // ジョークなので拒否しても同意したことにする
    setIsVisible(false);
  };

  const handleCustomizeClick = () => {
    setShowCustomize(true);
  };
  
  const handleSaveCustomization = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div data-testid="cookie-banner" className="fixed bottom-0 left-0 right-0 p-4 text-center z-50" style={{ backgroundColor: '#f3e8ff' }}>
      <div className="p-8 rounded-lg max-w-4xl mx-auto text-black">
        {!showCustomize ? (
          <>
          <p className="mb-4 font-extrabold text-2xl text-purple-900" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.5)' }}>【緊急警告】あなたのクッキーに対する意識が問われています！</p>
          <div className="flex justify-center space-x-4">
            <button onClick={handleAccept} className="font-bold py-3 px-6 rounded-full transform transition-transform duration-300 shadow-lg bg-purple-500 hover:bg-purple-600 text-white hover:scale-105">
              全てのクッキーを喜んで受け入れる（教授のまずいクッキーも愛でる）
            </button>
            <button onClick={handleDecline} className="font-bold py-3 px-6 rounded-full transform transition-transform duration-300 shadow-lg bg-purple-300 hover:bg-purple-400 text-purple-900 hover:scale-105">
              断固拒否する（クッキーの存在を生涯認めない）
            </button>
            <button onClick={handleCustomizeClick} className="font-bold py-3 px-6 rounded-full transform transition-transform duration-300 shadow-lg bg-white hover:bg-gray-200 text-purple-900 border border-purple-300 hover:scale-105">
              超詳細カスタマイズ
            </button>
          </div>
        </>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          <h3 className="text-lg font-bold mb-2">設定をカスタマイズ</h3>
          <div className="grid grid-cols-5 gap-2 text-left">
            {customizationOptions.map((option, index) => (
              <div key={index} className="flex items-center">
                <input type="checkbox" id={`option-${index}`} className="mr-2" />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
          <button onClick={handleSaveCustomization} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            設定を保存して閉じる
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default CookieBanner;
