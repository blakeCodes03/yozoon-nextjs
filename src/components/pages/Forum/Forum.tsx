// src/components/pages/Forum/Forum.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  user: {
    username: string;
  };
  createdAt: string;
}

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/forum/posts');
        setPosts(response.data);
      } catch (error) {
        setError('Failed to load forum posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center">Loading forum...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-textPrimary text-center">Community Forum</h1>
      {posts.map((post) => (
        <div key={post.id} className="bg-bg6 rounded-lg shadow p-4 mb-4">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <p className="text-textSecondary">By: {post.user.username} on {new Date(post.createdAt).toLocaleDateString()}</p>
          <p className="mt-2">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Forum;
