'use client';

import { useState } from 'react';

type CommentFormProps = {
  onSubmit: (data: { author?: string; content: string; parentId?: number, replyAuthor?: string }) => Promise<void>;
  parentId?: number;
};

export default function CommentForm({ onSubmit, parentId }: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (parentId) {
        await onSubmit({ content, parentId, replyAuthor });
        setReplyAuthor('');
      } else {
        await onSubmit({ author, content });
        setAuthor('');
      }
      setContent('');
      setIsSubmitted(true);
      // フォームが消えるアニメーションの後、再度表示するために状態をリセット
      setTimeout(() => setIsSubmitted(false), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="comment-form"
      onSubmit={handleSubmit}
      className={`review-form ${isSubmitted ? 'fly-away' : ''}`}
      role="form"
    >
      {parentId ? (
        <div className="form-group">
          <label htmlFor="replyAuthorName">返信者名を名乗るがよい</label>
          <input
            id="replyAuthorName"
            type="text"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            placeholder="例：通りすがりの賢者"
            required
          />
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="authorName">お主の名を名乗るがよい</label>
          <input
            id="authorName"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="例：通りすがりの賢者"
            required
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="commentContent">この掲示板への熱き想いを語るのじゃ！</label>
        <textarea
          id="commentContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="例：このサイト、無限に見ていられる…"
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting} className="silly-button">
        {isSubmitting ? '念を送信中...' : 'この想い、天に届け！'}
      </button>
    </form>
  );
}
