// components/Header.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/'); // 退出后跳转到主页
    };

    if (isLoading) {
        return ( // 在加载时显示一个占位导航栏
            <header className="bg-white shadow-sm">
                <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-600">我的博客</div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </nav>
            </header>
        );
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    我的博客
                </Link>
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-gray-600 hover:text-blue-500 transition-colors">主页</Link>
                    {user ? (
                        <>
                            <Link href="/create-post" className="text-gray-600 hover:text-blue-500 transition-colors">撰写文章</Link>
                            <span className="text-gray-800 font-medium">你好, {user.username}</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">退出</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-gray-600 hover:text-blue-500 transition-colors">登录</Link>
                            <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">注册</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
