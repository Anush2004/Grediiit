import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

const Comment = () => {
    const { name } = useParams();
    const [com, Setcom] = useState(null);
    const [modal, setModal] = useState(false);
    const [text, setText] = useState(null);
    const [update, setUpdate] = useState(false);
    const [posts, setPosts] = useState([]);
    const [curruser, SetcurrUser] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/api/post/${name}/comment`);
            Setcom(res.data);
        }
        fetchData();
    }, [name]);

    const openCreate = () => {
        setModal(true);
    }

    useEffect(() => {
        async function fetchData() {
            const res = await axios.get(`/api/post/posts/${name}`);
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
        console.log("In");
        const comment = {
            text: text,
            postID: name,
            uname: curruser
        }

        setText('');
        await axios.post('/api/post/create-comment', comment);
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

    if (!com || !posts) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <div className="Sub-info">
                <h3 className="Link">{posts.name}</h3>
                <h4 className="mod">Posted By: {posts.uname}</h4>
                <div className="sub-desc">
                    <p className="desc">Content:{posts.text}</p>
                </div>
                <div className="sub-info">
                    <p>Number of upvotes: {posts.upvotes}</p>
                    <p>Number of downvotes:  {posts.downvotes}</p>
                </div>

                <button onClick={openCreate}>Wanna comment on the Post? Click Here.</button>
            </div>

            <div className="sub-modal">
                <Modal show={modal} className="modal-profile">
                    <Modal.Header>
                        <Modal.Title id='ModalHeader'>New Comment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-create-sub">
                            <textarea cols="50" rows="20" name="text" placeholder="Content Here..." onChange={(e) => { setText(e.target.value) }}></textarea>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='editbtn' onClick={() => setModal(false)}>Cancel</Button>
                        <Button variant="primary" className='editbtn' onClick={handleSubmit}>Create Comment</Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="Posts">
                {com.map(com => (
                    <div className="post-container">
                        <div className="post-header">
                            <h3 className="post-title">{com.uname}</h3>
                        </div>
                        <button id="follow-button" className="follow-button" disabled={curruser === com.uname} onClick={(event) => Follow(event, com)}>Follow</button>
                        <div id="follow-self" className="follow-self"></div>
                        <p className="post-text">{com.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Comment;