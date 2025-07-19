'use client';
import { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import DishList from '../components/DishList';
import { DishWithComments } from '../types';

export default function LabMeshiPage() {
  const formula = 'LIM-Score = (GSI * 0.4) + (CPR * 0.3) + (TTP * 0.1) + (LCS * 0.2) + \\alpha';
  const [dishes, setDishes] = useState<DishWithComments[]>([]);
  const [newDishName, setNewDishName] = useState('');
  const [newDishAuthor, setNewDishAuthor] = useState('');
  const [newDishContent, setNewDishContent] = useState('');

  const fetchDishes = async () => {
    const response = await fetch('/api/dishes');
    const data = await response.json();
    setDishes(data);
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  const handleAddDish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newDishName.trim() || !newDishAuthor.trim() || !newDishContent.trim()) return;

    try {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDishName, author: newDishAuthor, content: newDishContent }),
      });
      if (!response.ok) throw new Error('Failed to create dish');
      setNewDishName('');
      setNewDishAuthor('');
      setNewDishContent('');
      await fetchDishes();
    } catch (error) {
      console.error('Failed to add dish:', error);
    }
  };

  const handleCommentSubmit = async (data: { author?: string; content: string; parentId?: number; replyAuthor?: string, dishId?: number }) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit comment');
      await fetchDishes();
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <article>
      <h1>
        当研究室における非公式調理活動（通称：ラボ飯）の定量的評価と格付けに関する包括的報告書
      </h1>
      <p>
        <strong>
          (A Comprehensive Report on the Quantitative Evaluation and Ranking of
          Unofficial Culinary Activities (Commonly Known as "Lab-Meshi")
          within Our Laboratory)
        </strong>
      </p>

      <hr />

      <section>
        <h2>1. 要旨 (Abstract)</h2>
        <p>
          本稿は、木賀研究室という知的生産性の極限状態に置かれた環境下で、構成員のQOL（Quality
          of
          Life）維持のために自然発生的に行われる調理活動、通称「ラボ飯」の体系的な評価を試みるものである。我々は、味覚的満足度、コスト効率、調理時間、そして最も重要な
          <strong>実験室環境適合性</strong>
          という4つの評価軸に基づいた独自の評価モデル「LIM-Score (Lab-Meshi
          Index
          Model)」を構築した。本報告書では、LIM-Scoreに基づき格付けされたラボ飯のランキングを発表し、今後の研究室生活における食文化の発展に資することを目的とする。
        </p>
      </section>

      <section>
        <h2>2. 緒言 (Introduction)</h2>
        <p>
          深夜に及ぶ実験、逼迫する論文締め切り、そして限られた予算。これらは現代の学術研究者が直面する三つの大きな障壁である。この過酷な環境下において、研究室構成員の精神的・肉体的健康を支える最後の砦が「ラボ飯」である。しかし、そのクオリティは調理者のスキル、使用可能な「実験器具」、そしてその日の教授の機嫌によって大きく変動する。本研究では、このカオスな状況に秩序をもたらすべく、厳密な科学的アプローチによる評価を導入した。
        </p>
      </section>

      <section>
        <h2>3. 評価方法 (Methodology)</h2>
        <section>
          <h3>3.1. 評価委員会 (Evaluation Committee)</h3>
          <ul>
            <li>
              <strong>委員長:</strong> 講師(通称パパ)
            </li>
            <li>
              <strong>評価員:</strong> 学生
            </li>
          </ul>
        </section>
        <section>
          <h3>3.2. 評価指標：LIM-Score</h3>
          <p>
            各ラボ飯は、以下の4つの指標（各10点満点）の重み付き平均によってスコアが算出される。
          </p>
          <ul>
            <li>
              <strong>GSI (Gustatory Satisfaction Index / 味覚的満足度):</strong>
              純粋な味の評価。
            </li>
            <li>
              <strong>CPR (Cost-Performance Ratio / コストパフォーマンス):</strong>
              1食あたりの費用。ラボリーダーの日給(32.88円)を基準値1.0とする。
            </li>
            <li>
              <strong>TTP (Time To Plate / 調理時間):</strong>
              食材の買い出し時間を除く、調理開始から配膳までの時間。昼ゼミ平均の所要時間を基準値1.0とする。
            </li>
            <li>
              <strong>LCS (Lab Compatibility Score / 実験室適合性):</strong>
              最重要項目。以下の減点項目で評価。
              <ul>
                <li>研究用機材の無断使用（-3点/件）</li>
                <li>
                  ドラフトチャンバー内での調理（+5点のボーナス、ただし匂いが漏れたら-10点）
                </li>
                <li>独特の匂いによる他研究室からのクレーム発生（-5点）</li>
                <li>教授室まで匂いが届く（評価不能、審議）</li>
                <li>
                  火災報知器の作動（-20点、殿堂入り級の事件として記録）
                </li>
              </ul>
            </li>
          </ul>
          <p>
            <strong>最終スコア計算式:</strong>
          </p>
          <p>
            <InlineMath math={formula} />
          </p>
          <p>（※ α: 委員長の気まぐれ補正係数）</p>
        </section>
      </section>

      <section>
        <h2>4. 新規評価投稿</h2>
        <form onSubmit={handleAddDish} className="review-form">
          <div className="form-group">
            <label htmlFor="dishName">拙者が作りし料理の名を言ってみよ</label>
            <input
              id="dishName"
              type="text"
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              placeholder="例：伝説のカレー"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="authorName">お主の名を名乗るがよい</label>
            <input
              id="authorName"
              type="text"
              value={newDishAuthor}
              onChange={(e) => setNewDishAuthor(e.target.value)}
              placeholder="例：厨房の魔術師"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="commentContent">この料理への熱き想いを語るのじゃ！</label>
            <textarea
              id="commentContent"
              value={newDishContent}
              onChange={(e) => setNewDishContent(e.target.value)}
              placeholder="例：この一皿に宇宙を見た…"
              required
            />
          </div>
          <button type="submit" className="silly-button">
            この評価、天に届け！
          </button>
        </form>
      </section>

      <section>
        <h2>5. ラボ飯リスト (Lab-Meshi List)</h2>
        <DishList dishes={dishes} onCommentSubmit={handleCommentSubmit} />
      </section>
    </article>
  );
}
