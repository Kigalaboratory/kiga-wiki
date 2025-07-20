import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">お探しのページは実験に失敗しました。</h1>
      <Image src="/404.png" alt="実験に失敗した教授" width={300} height={300} />
    </div>
  );
}
