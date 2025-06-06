// app/page.tsx
import { api, Post } from '@/lib/api';
import Link from 'next/link';

// 文章卡片组件
function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.id}`} className="block bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{post.author.username}</div>
            <h2 className="block mt-1 text-2xl leading-tight font-bold text-black">{post.title}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed truncate">{post.content}</p>
            <p className="mt-4 text-xs text-gray-500">发布于 {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
    </Link>
  );
}

export default async function HomePage() {
  try {
    const posts = await api.getPosts();
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">博客文章</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">博客文章</h1>
        <p className="text-red-500">加载文章失败。请确保你的 NestJS 后端服务正在运行。</p>
      </div>
    );
  }
}
