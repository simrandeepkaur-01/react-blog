import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Button, Container } from '../components';
import parse from 'html-react-parser';
import { useSelector } from 'react-redux';

function Post() {
    const [post, setPost] = useState(null);
    const [imageUrl, setImageUrl] = useState(null); // State to store image URL
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((fetchedPost) => {
                if (fetchedPost) {
                    setPost(fetchedPost);
                    // Set initial image URL when post is fetched
                    fetchImageUrl(fetchedPost.featuredImage);
                } else {
                    navigate('/');
                }
            }).catch((error) => {
                console.error('Error fetching post:', error);
                navigate('/');
            });
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    const fetchImageUrl = (imageId) => {
        if (imageId) {
            appwriteService.getFilePreview(imageId).then((url) => {
                setImageUrl(url);
            }).catch((error) => {
                console.error('Error fetching image URL:', error);
                setImageUrl(null); // Set imageUrl to null on error
            });
        } else {
            setImageUrl(null); // Set imageUrl to null if imageId is falsy
        }
    };

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate('/');
            }
        }).catch((error) => {
            console.error('Error deleting post:', error);
        });
    };

    return post ? (
        <div className='py-8'>
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={post.title}
                            className='rounded-xl'
                        />
                    )}

                    {isAuthor && (
                        <div className='absolute right-6 top-6'>
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor='bg-green-500' className='mr-3'>Edit</Button>
                            </Link>

                            <Button onClick={deletePost} bgColor='bg-red-500'>Delete</Button>
                        </div>
                    )}
                </div>

                <div className="w-full mb-6">
                    <h2 className='text-2xl font-bold'>{post.title}</h2>
                </div>
                <div className='browser-css'>{parse(post.content)}</div>
            </Container>
        </div>
    ) : null;
}

export default Post;