import React, { useState, useEffect } from "react";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import axios from "axios";

function Followers() {
    const [following, setFollowing] = useState([])

    useEffect(() => {
        const data = async () => {
            try {
                const user = await axios.post('/api/finduser');
                setFollowing(user.data.following);
            }
            catch (err) {
                console.log(err)
            }
        };
        data();
    });

    const deleteFollowing = async (uname) => {
        await axios.patch(`/api/removefollowing/${uname}`)
        const user = await axios.post('/api/finduser');
        setFollowing(user.data.followers);
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }

    return (
         <div>
            <ul>
                {following.map(f => {
                    return (
                        <li className="flwrlist" key={f}>
                            <span>{f}</span>
                            <a className='remove' onClick={() => deleteFollowing(f)}><PersonRemoveIcon /></a>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Followers;