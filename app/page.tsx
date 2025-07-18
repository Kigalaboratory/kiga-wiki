"use client";

import CodeBlock from "./components/CodeBlock";

export default function Page() {
  const quickStartCode = `$ npm install project-name
$ npx project-name init`;

  const magicCode = `import { MagicProject } from 'super-awesome-project';

// ここから魔法が始まる ✨
const project = new MagicProject({
    name: '世界征服計画',
    description: 'とても普通のプロジェクトです（怪しくない）',
    secretPower: 9999,
    coffeeNeeded: true
});

// ボタンをポチッとな
project.doMagic()
    .then(() => console.log('🎉 やったー！魔法が発動したよ！'))
    .catch(err => console.error('😱 おっと！魔法が失敗...', err));

// 注意: 猫が出てくるかも`;

  return (
    <main className="content">
      <article>
        <h1 className="rainbow-title">スーパーすごいプロジェクト Kiga Wiki へようこそ！</h1>

        <p>
          このWikiページは、木賀研究室の裏ホームページとして、暗躍しています。左側のナビゲーションから必要な情報を見つけることができます。（迷子にならないでね👀）。
        </p>

        <div className="alert alert-pink">
          <span className="alert-icon icon-bomb"></span>
          <div>
            <strong>超重要お知らせ！</strong>
            このプロジェクトは現在爆速開発中です！最新情報については定期的にWikiをチェックしてください。チェックしないと悲しくなっちゃいます(´；ω；｀)
          </div>
        </div>

        <div className="alert alert-yellow">
          <span className="alert-icon">🎉</span>
          <div>
            <strong>今日のラッキーユーザーはあなた！</strong>
            <br />
            <small>おめでとうございます！何も起きませんが、とにかくおめでとう！</small>
          </div>
        </div>

        <section>
          <h2>🌟 プロジェクト概要（すごすぎて笑える）</h2>
          <p>
            このプロジェクトは、ユーザーが<strong style={{ color: '#805ad5' }}>超絶簡単に</strong>情報を管理・共有できるプラットフォームを提供することを目的としています。
            赤ちゃんでも使えるくらい簡単です！（赤ちゃんには実際に試していません）
            主な機能には以下が含まれます：
          </p>

          <ul className="feature-list">
            <li className="feature-item">
              <span className="feature-emoji">🎨</span>
              <span>シンプルで使いやすいインターフェース（目がチカチカしない！）</span>
            </li>
            <li className="feature-item">
              <span className="feature-emoji">📝</span>
              <span>マークダウン形式でのコンテンツ作成（難しそうに見えて実は超簡単）</span>
            </li>
            <li className="feature-item">
              <span className="feature-emoji">⏰</span>
              <span>バージョン管理と変更履歴（タイムマシンみたいに過去に戻れる！）</span>
            </li>
            <li className="feature-item">
              <span className="feature-emoji">👯</span>
              <span>共同編集機能（友達と一緒に編集！喧嘩しないでね）</span>
            </li>
            <li className="feature-item">
              <span className="feature-emoji">🔔</span>
              <span>カスタマイズ可能な通知設定（うるさすぎない、でも見逃さない）</span>
            </li>
            <li className="feature-item special">
              <span className="feature-emoji">✨</span>
              <strong>秘密の機能（見つけられるかな？）</strong>
            </li>
          </ul>
        </section>

        <section>
          <h2>クイックスタート</h2>
          <p>以下のコマンドでプロジェクトをインストールできます：</p>

          <CodeBlock code={quickStartCode} />

          <p>
            詳細なインストール手順については、<a href="#" className="link">インストール方法</a>ページを参照してください。
          </p>
        </section>

        <section>
          <h2>🧙‍♂️ 魔法のコード（コピペするだけ！）</h2>
          <p>基本的な使用例（これをコピペすれば、あなたも今日からプログラマー！）：</p>

          <CodeBlock code={magicCode} />

          <div className="alert alert-green">
            <span className="feature-emoji">🐱</span>
            <span>このコードを実行すると、PCから猫の鳴き声がするかもしれません（しないけど）</span>
          </div>
        </section>

        <section>
          <h2>貢献する</h2>
          <p>プロジェクトへの貢献に興味がある方は、以下の手順に従ってください：</p>

          <ol className="steps-list">
            <li>このリポジトリをフォークする</li>
            <li>新しいブランチを作成する (<code>git checkout -b feature/amazing-feature</code>)</li>
            <li>変更をコミットする (<code>git commit -m 'Add some amazing feature'</code>)</li>
            <li>ブランチにプッシュする (<code>git push origin feature/amazing-feature</code>)</li>
            <li>プルリクエストを作成する</li>
          </ol>
        </section>

        <div className="footer-divider">
          <p>最終更新: <time dateTime="2023-10-15">2023年10月15日</time></p>
        </div>
      </article>
    </main>
  );
}
