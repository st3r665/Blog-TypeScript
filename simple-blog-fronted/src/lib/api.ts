export interface Author {
    id: number;
    username: string;
    email: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    author: Author;
    authorId: number;
}

export interface AuthResponse {
    id: number;
    username: string;
    email: string;
    accessToken: string;
}

// 2. API 配置
const API_BASE_URL = 'http://localhost:3000'; // 后端地址

// 3. API 请求函数
async function fetcher(url: string, options: RequestInit = {}) {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'API请求失败');
    }
    return data;
}

export const api = {
    getPosts: (): Promise<Post[]> => {
        return fetcher(`${API_BASE_URL}/posts`);
    },
    getPostById: (id: number | string): Promise<Post> => {
        return fetcher(`${API_BASE_URL}/posts/${id}`);
    },
    login: (credentials: any): Promise<AuthResponse> => {
        return fetcher(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
    },
    register: (userInfo: any): Promise<AuthResponse> => {
        return fetcher(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userInfo),
        });
    },
    createPost: (postData: { title: string; content: string }, token: string): Promise<Post> => {
        return fetcher(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(postData),
        });
    },
};
