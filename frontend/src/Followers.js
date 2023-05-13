import React, { useState, useEffect } from "react";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from 'axios'

function Followers() {
    const [followers, setFollowers] = useState([])

    useEffect(() => {
        const data = async () => {
            try {
                const user = await axios.post('/api/finduser');
                setFollowers(user.data.followers);
            }
            catch (err) {
                console.log(err)
            }
        };

        data();
    });

    const deleteFollower = async (uname) => {
        console.log(uname);
        await axios.patch(`/api/removefollowers/${uname}`)
        const user = await axios.post('/api/finduser');
        setFollowers(user.data.followers);
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }
    return (
        <div>
            <ul>
                {followers.map(f => {
                    return (
                        <li className="flwrlist" key={f}>
                            <span>{f}</span>
                            <a className='remove' onClick={() => deleteFollower(f)}><PersonRemoveIcon /></a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Followers;