'use client';

import { useState } from 'react';
import { CommentWithChildren } from '../types';

type CommentListProps = {
  comments: CommentWithChildren[];
  onReply: (data: { content: string; parentId: number }) => void;
};

// 単一のコメントを表示するコンポーネント
const CommentItem = ({ comment, onReply }: { comment: CommentWithChildren, onReply: (data: { content: string; parentId: number }) => void; }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReply({ content: replyContent, parentId: comment.id });
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <li className="comment-item">
      <p className="comment-content">{comment.content}</p>
      <p className="comment-author">- {comment.author}</p>
      <time className="comment-date">
        {new Date(comment.createdAt).toLocaleString('ja-JP')}
      </time>
      <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-button">
        返信する
      </button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <label htmlFor={`reply-textarea-${comment.id}`}>このコメントへの返信をどうぞ</label>
          <textarea
            id={`reply-textarea-${comment.id}`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
          />
          <button type="submit">返信を投稿する</button>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="comment-replies">
          <CommentList comments={comment.children} onReply={onReply} />
        </div>
      )}
    </li>
  );
};


export default function CommentList({ comments, onReply }: CommentListProps) {
  return (
    <section>
      <h2>みんなの足跡</h2>
      {comments.length > 0 ? (
        <ul className="comment-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onReply={onReply} />
          ))}
        </ul>
      ) : (
        <p>まだコメントはありません。一番乗りを目指せ！</p>
      )}
    </section>
  );
}
