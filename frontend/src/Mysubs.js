import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import axios from 'axios';
import { Button, Modal } from "react-bootstrap";

const Mysubs = () => {
    const [sub_modal, setSubModal] = useState(false);
    const [update, setUpdate] = useState(false);
    const [subs, setSubs] = useState([])
    const [name, setName] = useState('');
    const [description, setDesc] = useState('');
    const [tags, setTags] = useState([]);
    const [banned, setBanned] = useState([]);
    const [users, SetUsers] = useState([]);
    const [posts, setPosts] = useState([])
    const [image, setImage] = useState('');

    const openCreate = () => {
        setSubModal(true);
    }

    useEffect(() => {
        setSubModal(false);
        setUpdate(true);

        async function fetchData() {
            try {
                const res = await axios.get('/api/sub/getusersubs');
                setSubs(res.data);
                console.log(res.data)
                SetUsers(res.data.users);
                setPosts(res.data.posts);
            }
            catch (err) {
                console.log(err)
            }
        }
        fetchData();
        setUpdate(false);

    }, update)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubModal(false);
        setUpdate(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('tags', JSON.stringify(tags));
        formData.append('banned', JSON.stringify(banned));
        formData.append('image', image);
        setName('')
        setDesc('')
        setTags([])
        setBanned([])
        setImage('')
        await axios.post('/api/sub/create-sub', formData);
    }

    const handleDeleteSub = async (subname) => {
        console.log(subname)
        axios.delete(`/api/sub/delete-sub/${subname}`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        Promise.resolve().then(() => {
            window.location.reload();
        })

    }
    if (!subs) {
        return (
            <div>
                Loading...
            </div>
        )
    }
    return (
        <div className="grid">
            <button onClick={openCreate}>+Add New SubGreddiit</button>

            <div className="sub-modal">
                <Modal show={sub_modal} className="modal-profile">
                    <Modal.Header>
                        <Modal.Title id='ModalHeader'>New SubGreddiit</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-create-sub">
                            <input type="text" name="name" placeholder="Name of the subreddit" onChange={(e) => setName(e.target.value)}></input>
                            <textarea cols="50" rows="20" name="description" value={description} placeholder="Description..." onChange={(e) => { setDesc(e.target.value) }}></textarea>
                            <textarea cols="50" rows="5" name="tags" value={tags} placeholder="tag1,tag2,tag3..." onChange={(e) => setTags(e.target.value.toLowerCase().split(','))}></textarea>
                            <textarea cols="50" rows="5" name="banned" value={banned} placeholder="banned1,banned2,banned3..." onChange={(e) => setBanned(e.target.value.toLowerCase().split(','))}></textarea>
                            <input type="file" name="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" className='editbtn' onClick={() => setSubModal(false)}>Cancel</Button>
                        <Button variant="primary" className='editbtn' onClick={handleSubmit}>Create Sub</Button>
                    </Modal.Footer>
                </Modal>
            </div>

            <div className="all-posts">
                {subs.map(sub => (
                    <div className="sub-greddiit" key={sub.name}>
                        <Link to={`/${sub.name}`}>
                            <h3 className="Link">{sub.name}</h3>
                        </Link>
                        <h4 className="mod">Created By: {sub.Mod_uname}</h4>
                        <div className="sub-desc">
                            <p className="desc">Description:{sub.description}</p>
                        </div>
                        <div className="sub-info">
                            <p>Number of people: {sub.users.filter(user => user.status === 'joined').length + sub.users.filter(user => user.status === 'created').length}</p>
                            <p>Number of posts: {sub.posts.length}</p>
                        </div>
                        <div className="banned">
                            <p>Banned: {sub.banned.map((element, index) => {
                                return index === sub.banned.length - 1 ? element : element + ', '
                            })}</p>
                        </div>

                        <div>
                            <button onClick={() => handleDeleteSub(sub.name)}>Delete</button>
                            <button>
                                <Link to={`/${sub.name}`}>
                                    Open
                                </Link>
                            </button>
                        </div>
                    </div>

                ))}
            </div>

        </div>
    )
};

export default Mysubs;