// app/create-post/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 当认证状态加载完成且用户未登录时，重定向到登录页
        if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [user, isLoading, router]);
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!token) {
            setError('认证信息无效，请重新登录。');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const newPost = await api.createPost({ title, content }, token);
            router.push(`/posts/${newPost.id}`); // 创建成功后跳转到文章详情页
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading || !user) {
        // 在重定向前显示加载状态
        return <div className="text-center p-8">加载中...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">撰写新文章</h1>
            <div className="bg-white p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 text-lg font-bold mb-2">标题</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-gray-700 text-lg font-bold mb-2">内容</label>
                        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={15} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:bg-green-300">
                        {loading ? '发布中...' : '发布文章'}
                    </button>
                </form>
            </div>
        </div>
    );
}