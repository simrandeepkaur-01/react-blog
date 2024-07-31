import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import { PostCard, Container } from '../components';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const result = await appwriteService.getPosts([]);
                if (result) {
                    setPosts(result.documents);
                }
            } catch (err) {
                console.error('Failed to fetch posts:', err);
                setError(err.message);
            }
        };

        fetchPosts();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts?.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;