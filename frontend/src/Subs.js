import React, { useState, useEffect } from "react";
import axios from 'axios';
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import SearchByTag from "./SearchTag"
import TagIcon from '@mui/icons-material/Tag';
import SearchIcon from '@mui/icons-material/Search';
import SortButton from "./SortButton";
import SortIcon from '@mui/icons-material/Sort';

const SubsPage = () => {
    const [curruser, SetCurrUser] = useState('');
    const [joinedsubs, setJoinedSubs] = useState(null);
    const [unjoinedsubs, setUnjoinedSubs] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showSearchbyTag, setShowSearchbyTag] = useState(false);
    const [showSort, setShowSort] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('/api/sub/joinedsubs');
                setJoinedSubs(result.data.joined);
                setUnjoinedSubs(result.data.unjoined);
                SetCurrUser(result.data.curruser);
                console.log(curruser);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);



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
    if (!joinedsubs || !unjoinedsubs) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <div>
            <button disabled={showSearch} onClick={() => setShowSearch(true)}><SearchIcon /></button>
            {showSearch && !showSearchbyTag && !showSort && <div className="search">
                <SearchBar />
            </div>}
            <button disabled={showSearchbyTag} onClick={() => setShowSearchbyTag(true)}><SearchIcon /><TagIcon /></button>
            {!showSearch && showSearchbyTag && !showSort && <div className="search">
                <SearchByTag />
            </div>}
            <button disabled={showSearch} onClick={() => setShowSort(true)}><SortIcon /></button>
            {!showSearch && !showSearchbyTag && showSort && <div className="search">
                <SortButton />
            </div>}
            <div className="all-posts">
                {!showSearch && !showSearchbyTag && !showSort && joinedsubs && joinedsubs.map(sub => (
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
            </div>
            <div className="all-posts">
                {!showSearch && !showSearchbyTag && !showSort && unjoinedsubs && unjoinedsubs.map(sub => (
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
            </div>
        </div>
    )
};

export default SubsPage;