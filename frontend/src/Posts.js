import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

import { Link } from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import def from './defaultsub.jpg'

const Posts = () => {
    const { name } = useParams();
    const [sub, setSub] = useState(null);
    const [modal, setModal] = useState(false);
    const [text, setText] = useState(null);
    const [update, setUpdate] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postedIn, setPostedIn] = useState(null);
    const [curruser, SetcurrUser] = useState("");
    const [rmodal, setRModal] = useState(false);
    const [concern, setConcern] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/api/sub/subs/${name}`);
            setSub(res.data);
        }
        fetchData();
    }, [name]);

    const openCreate = () => {
        setModal(true);
    }

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`/api/post/${name}`);
            setPosts(res.data);
            const cuser = await axios.post('/api/finduser');
            console.log(cuser.data);
            SetcurrUser(cuser.data.uname);
        }
        fetchData();
        setUpdate(false);
    }, [update])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModal(false);
        const post = {
            text: text,
            postedIn: name,
        }
        setText('');
        setPostedIn('');
        const result = await axios.post('/api/post/create-post', post);
        if (result.data.containsBannedWords) {
            alert("Your post contains banned words.We have removed them and posted it for you.Please Dont repeat it again.");
        }
        Promise.resolve().then(() => {
            window.location.reload();
        })

    }

    const Follow = async (event, post) => {
        const match = await axios.get(`/api/following/${post.uname}`);

        if (match.data.success) {
            event.target.nextElementSibling.innerHTML = 'Followed Successfully';
            event.target.nextElementSibling.style.backgroundColor = "green";
        }
        else {
            event.target.nextElementSibling.innerHTML = 'Already Following';
            event.target.nextElementSibling.style.backgroundColor = "green";
        }
    }

    const Report = async (event, post) => {
        console.log("hello");
        event.preventDefault();
        setRModal(false);
        const report = {
            concern: concern,
        }
        setConcern('');
        await axios.post(`/api/report/create-report/${post.name}/${post._id}`, report);
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }

    const save_post = async (event, postID) => {
        const match = await axios.post(`/api/post/${postID}/savepost`);
        console.log(match.data)
        if (match.data.success) {
            event.target.nextElementSibling.innerHTML = 'Saved';
            event.target.nextElementSibling.style.backgroundColor = "green";

        }
        else {
            event.target.nextElementSibling.innerHTML = 'Already Saved';
            event.target.nextElementSibling.style.backgroundColor = "red";

        }
    }


    const handleUpvotes = async (postId) => {
        try {

            const res = await axios.post(`/api/post/${postId}/upvote`);
            const updatedPost = res.data;
            setPosts(posts.map(post => {
                if (post._id === updatedPost._id) {
                    return {
                        ...post,
                        upvotes: updatedPost.upvotes,
                        upvotedby: updatedPost.upvotedby
                    };
                } else {
                    return post;
                }
            }));
            Promise.resolve().then(() => {
                window.location.reload();
            })
        } catch (error) {
            console.log(error);
        }
    }


    const handleDownvotes = async (postId) => {
        try {
            const res = await axios.post(`/api/post/${postId}/downvote`);
            const updatedPost = res.data;
            setPosts(posts.map(post => {
                if (post._id === updatedPost._id) {
                    return {
                        ...post,
                        downvotes: updatedPost.downvotes,
                        downvotedby: updatedPost.downvotedby
                    };
                } else {
                    return post;
                }
            }));
            Promise.resolve().then(() => {
                window.location.reload();
            })
        } catch (error) {
            console.log(error);
        }
    }

    if (!sub || !posts) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <div className="imageName">

                {sub.image ?
                    <img src={`http://localhost:3000/uploads/${sub.image}`} alt="Subreddit Image" /> :
                    <img src={def} alt="Default Image" />
                }
            </div>

            <div className="Sub-info">
                <h3 className="Link">{sub.name}</h3>
                <h4 className="mod">Created By: {sub.Mod_uname}</h4>
                <div className="sub-desc">
                    <p className="desc">Description:{sub.description}</p>
                </div>
                <div className="sub-info">
                    <p>Number of people: {sub.users.filter(user => user.status === 'joined').length + sub.users.filter(user => user.status === 'created').length}</p>
                    <p>Number of posts: {sub.posts.length}</p>
                </div>

                <button onClick={openCreate}>For A New Post. Click Here.</button>
            </div>

            <div className="sub-modal">
                <Modal show={modal} className="modal-profile">
                    <Modal.Header>
                        <Modal.Title id='ModalHeader'>New Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-create-sub">
                            <textarea cols="50" rows="20" name="text" placeholder="Content Here..." onChange={(e) => { setText(e.target.value) }}></textarea>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='editbtn' onClick={() => setModal(false)}>Cancel</Button>
                        <Button variant="primary" className='editbtn' onClick={handleSubmit}>Create Post</Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="Posts">
                {posts.map(post => (
                    <div className="post-container">
                        <div className="post-header">
                            <h3 className="post-title">{post.uname}</h3>
                        </div>
                        <button id="follow-button" className="follow-button" disabled={curruser === post.uname} onClick={(event) => Follow(event, post)}>Follow</button>
                        <div id="follow-self" className="follow-self"></div>
                        <p className="post-text">{post.text}</p>
                        <div className="votes">
                            <button onClick={() => handleUpvotes(post._id)} className="north"><ThumbUpIcon />{post.upvotes}</button>
                            <button onClick={() => handleDownvotes(post._id)}><ThumbDownIcon />{post.downvotes}</button>
                        </div>


                        <div className="post-buttons">
                            <div>
                                <Link to={`/posts/${post._id}/comments`}>
                                    <button className="commentbutton"><ModeCommentIcon /> Comments</button>
                                </Link>
                            </div>

                            <button className="save-button" onClick={(event) => save_post(event, post._id)} ><BookmarkAddOutlinedIcon /> Save</button>
                            <div id="follow-save" className="follow-save"></div>

                        </div>
                        <button id="report-button" className="report-button" disabled={curruser === post.uname} onClick={() => setRModal(true)} >Report This Post</button>
                        <div id="report-self" className="report-self"></div>
                        <div className="sub-modal">
                            <Modal show={rmodal} className="modal-profile">
                                <Modal.Header>
                                    <Modal.Title id='ModalHeader'>Report This Post</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form className="form-create-sub">
                                        <textarea cols="50" rows="20" name="text" placeholder="Content Here..." onChange={(e) => { setConcern(e.target.value) }}></textarea>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" className='editbtn' onClick={() => setRModal(false)}>Cancel</Button>
                                    <Button variant="primary" className='editbtn' disabled={concern === ""} onClick={(event) => Report(event, post)}>Report</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Posts;