import React, { useEffect, useState } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom';
import authService from '../appwrite/auth';

function Home() {
    const [posts, setPosts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchUserAndPosts = async () => {
            const user = await authService.getCurrentUser();
            setIsLoggedIn(!!user);

            const fetchedPosts = await appwriteService.getPosts();
            if (fetchedPosts) {
                setPosts(fetchedPosts.documents);
            }
        };

        fetchUserAndPosts();
    }, []);

    if (!isLoggedIn) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <Link to={'/login'} className="text-2xl font-bold hover:text-gray-500">
                        Login to read posts
                    </Link>
                </Container>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <Container>
                {posts.length === 0 ? (
                    <div className="text-center">
                        <Link to={'/add-post'} className="text-2xl font-bold">No content available. Start sharing your thoughts!</Link>
                    </div>
                ) : (
                    <div className="flex flex-wrap">
                        {posts.map((post) => (
                            <div key={post.$id} className="p-2 w-1/4">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}

export default Home;