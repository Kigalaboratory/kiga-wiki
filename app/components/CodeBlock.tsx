"use client";

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock({ code }: CodeBlockProps) {
  const [buttonText, setButtonText] = useState('コピー（してもいいけど責任は取らないよ）');

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setButtonText('コピーしました！');
      setTimeout(() => {
        setButtonText('コピー（してもいいけど責任は取らないよ）');
      }, 2000);
    });
  };

  return (
    <div className="code-block">
      <button className="copy-code-btn" onClick={handleCopy}>
        {buttonText}
      </button>
      <pre><code>{code}</code></pre>
    </div>
  );
}
