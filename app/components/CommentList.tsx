'use client';

import { useState } from 'react';
import { CommentWithChildren } from '../types';
import CommentForm from './CommentForm';

type CommentListProps = {
  comments: CommentWithChildren[];
  onReply: (data: { author?: string; content: string; parentId?: number, replyAuthor?: string }) => Promise<void>;
};

// 単一のコメントを表示するコンポーネント
const CommentItem = ({ comment, onReply }: { comment: CommentWithChildren, onReply: (data: { author?: string; content: string; parentId?: number, replyAuthor?: string }) => Promise<void>; }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmitted = async () => {
    setShowReplyForm(false);
  };

  return (
    <li className="comment-item">
      <p className="comment-content">{comment.content}</p>
      <p className="comment-author">- {comment.replyAuthor || comment.author}</p>
      <time className="comment-date">
        {new Date(comment.createdAt).toLocaleString('ja-JP')}
      </time>
      <button onClick={() => setShowReplyForm(!showReplyForm)} className="reply-button">
        返信する
      </button>

      {showReplyForm && (
        <div className="reply-form-container">
          <CommentForm
            parentId={comment.id}
            onSubmit={async (data) => {
              await onReply(data);
              handleReplySubmitted();
            }}
          />
        </div>
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
