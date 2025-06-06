import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  try {
    const post = await api.getPostById(params.id);

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
          <div className="text-gray-500 mb-8">
              <span>由 <strong>{post.author.username}</strong></span>
              <span className="mx-2">•</span>
              <span>发布于 {new Date(post.createdAt).toLocaleString()}</span>
          </div>
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap">
              {post.content}
          </div>
        </article>
      </div>
    );
  } catch (error) {
    notFound(); // 如果找不到文章，显示 Next.js 的 404 页面
  }
}