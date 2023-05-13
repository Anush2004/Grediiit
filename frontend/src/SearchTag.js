import React, { useState } from 'react';
import SubgreddiitFilter from './SubgreddiitFilter';
import axios from 'axios';
import { Link } from "react-router-dom";

function SearchTag() {
    const [joinedsubs, setJoinedSubs] = useState(null);
    const [unjoinedsubs, setUnjoinedSubs] = useState(null);
    const handleFilter = (subs) => {
        setJoinedSubs(subs.joined);
        setUnjoinedSubs(subs.unjoined);
    };
    const [curruser, SetCurrUser] = useState('');

    const join = async (subname) => {
        const sub = unjoinedsubs.find(sub => sub.name === subname);

        if (sub.users.filter(user => user.status === 'blocked').map(user => user.uname).includes(curruser)) {

            alert(`You are blocked from joining ${subname}`);
        }
        else if (sub.users.filter(user => user.status === 'left').map(user => user.uname).includes(curruser)) {
            alert(`You cant rejoin ${subname}`);
        }
        else {
            await axios.post(`/api/sub/${subname}/join-request`);
        }
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }

    const leave = async (subname) => {
        await axios.post(`/api/sub/${subname}/leavesub`);
        Promise.resolve().then(() => {
            window.location.reload();
        })
    }

    return (
        <div>
            <SubgreddiitFilter onFilter={handleFilter} />
            <ul>
                {joinedsubs && joinedsubs.map(sub => (
                    <div className="sub-greddiit" key={sub.name}>
                        <Link to={`/posts/${sub.name}`}>
                            <h3 className="Link">{sub.name}</h3>
                        </Link>
                        <h4 className="mod">Created By: {sub.Mod_uname}</h4>
                        <div className="sub-desc">
                            <p className="desc">Description:{sub.description}</p>
                        </div>
                        <div className="sub-info">
                            <p>Number of people:{sub.users.filter(user => user.status === 'joined').length + sub.users.filter(user => user.status === 'created').length}</p>
                            <p>Number of posts: {sub.posts.length}</p>
                        </div>
                        <div className="banned">
                            <p>Banned: {sub.banned.map((element, index) => {
                                return index === sub.banned.length - 1 ? element : element + ', ';
                            })}</p>
                        </div>
                        <button disabled={curruser === sub.Mod_uname} id="leave" onClick={() => leave(sub.name)}>Leave</button>

                    </div>
                ))}
            </ul>
            <ul>
                { unjoinedsubs && unjoinedsubs.map(sub => (
                    <div className="sub-greddiit" key={sub.name}>
                        <Link to={`/posts/${sub.name}`}>
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
                                return index === sub.banned.length - 1 ? element : element + ', ';
                            })}</p>
                        </div>
                        <button id="leave" onClick={() => join(sub.name)}>Join</button>

                    </div>
                ))}
            </ul>
        </div>
    );
}

export default SearchTag;