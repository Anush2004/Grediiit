import React, { useState, useEffect } from "react";
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import axios from 'axios';

const Savedposts = () => {
    const [posts, setPosts] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.post('/api/post/savedpost');
            setPosts(res.data);
        }
        fetchData();
        setUpdate(false);
    }, [update]);



    const remove = async (postId) => {
        await axios.patch(`/api/post/remove-saved-post/${postId}`)
        const res = await axios.post('/api/post/savedpost');
        setPosts(res.data);
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }

    return (
        <>
            <div className="Posts1">
                {posts.map(post => (
                    <div className="post-container">
                        <div className="post-header">
                            <h3 className="post-title">{post.uname}</h3>
                        </div>
                        <p className="post-text">{post.text}</p>
                        <div className="post-buttons">
                            <button onClick={() => remove(post._id)}><BookmarkRemoveIcon /> Unsave</button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
};

export default Savedposts;