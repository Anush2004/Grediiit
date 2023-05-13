import { Button, Modal } from 'react-bootstrap'
import React, { useState, useEffect } from "react";
import pfp from "./pfp.png";
import Flwr from "./Followers"
import Flwing from "./Following"
import axios from 'axios'


const Profile = () => {

    const [followers, setMFollowers] = useState(false);
    const [following, setMFollowing] = useState(false);
    const [uname, setUname] = useState("");
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [Cnumber, setCnumber] = useState('');
    // const [pass, setPass] = useState('');
    const [profile, setMprofile] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [flwr,setFlwr] = useState([]);
    const [follwg,SetFollwg] = useState([]);


    useEffect(() => {
        const data = async () => {
            try {
                const user = await axios.post('/api/finduser');
                setUname(user.data.uname);
                setFname(user.data.fname);
                setLname(user.data.lname);
                setEmail(user.data.email);
                setAge(user.data.age);
                setCnumber(user.data.Cnumber);
                setFlwr(user.data.followers);
                SetFollwg(user.data.following);
                // setPass(user.data.pass)
            }
            catch (err) {
                console.log(err)
            }
        };

        data();
        setSubmit(false);
    }, submit);

    const handleCancel = async (e) => {
        try {
            const user = await axios.post('/api/finduser');
            setFname(user.data.fname);
            setLname(user.data.lname);
            setEmail(user.data.email);
            setAge(user.data.age);
            setCnumber(user.data.Cnumber);
            setMprofile(false);
        }
        catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        console.log("submitted");
        setMprofile(false);
        e.preventDefault();

        const user = {
            fname: fname,
            lname: lname,
            uname: uname,
            email: email,
            age: age,
            Cnumber: Cnumber
        };
        console.log(user)
        await axios.put("/api/updateuser", user);
        setSubmit(true);

    }

    return (
        <div className="container">
            <div className="profile-stat">
                <ul>
                    <li><a className="profile-stat-count" onClick={() => setMFollowers(true)}>{flwr.length}</a> followers</li>

                    <li><a className="profile-stat-count" onClick={() => setMFollowing(true)}>{follwg.length}</a> following</li>
                </ul>
            </div>
            <div className="modalfollowers">
                <Modal show={followers}>
                    <div className="modal-followers">
                        <Modal.Header>
                            <Modal.Title className="Mtitle">Followers</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><Flwr /></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setMFollowers(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
            <div className="modalfollowing">
                <Modal show={following}>
                    <div className='modal-following'>
                        <Modal.Header>
                            <Modal.Title className="Mtitle">Following</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><Flwing /></Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setMFollowing(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal>
            </div>
            <img className='pfp' src={pfp} alt="pfp" />
            <div className="profile">
                <div className="profile-user">
                    <h1 className="profile-user-name">{uname}</h1>
                </div>
            </div>
            <div>
                <button className="profile-btn" onClick={() => setMprofile(true)}>Edit Profile</button>
            </div>

            <div className="profile-bio">
                <p><span className="profile-bio-name" id="fname">First Name: </span>{fname}</p>
                <p><span className="profile-bio-name" id="lname">Last Name: </span>{lname}</p>
                <p><span className="profile-bio-name" id="email">Email: </span>{email}</p>
                <p><span className="profile-bio-name" id="age">Age: </span>{age}</p>
                <p><span className="profile-bio-name" id="Cnumber">Contact: </span>{Cnumber}</p>
            </div>


            <Modal show={profile} onHide={() => setMprofile(false)} className="modal-profile">
                <Modal.Header>
                    <Modal.Title id='MTitle'> Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="edit-profile">
                        <label>
                            First Name:
                            <input type="text" onChange={e => setFname(e.target.value)} name="fname" />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" onChange={(e) => setLname(e.target.value)} name="lname" />
                        </label>
                        <label>
                            Email:
                            <input type="email" onChange={(e) => setEmail(e.target.value)} name="email" />
                        </label>
                        <label>
                            Age:
                            <input type="number" onChange={(e) => setAge(e.target.value)} name="age" />
                        </label>
                        <label>
                            Contact:
                            <input type="tel" onChange={(e) => setCnumber(e.target.value)} name="Cnumber" pattern="[0-9]{10}" />
                        </label>
                        {/* <label>
                            Password:
                            <input type="password" onChange={(e) => setPass(e.target.value)} name="pass" />
                        </label> */}
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='editbtn' onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" className='editbtn' onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    )
};

export default Profile;