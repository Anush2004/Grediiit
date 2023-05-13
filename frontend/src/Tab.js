import React, { useState ,useEffect } from "react";
import Profile from './Profile';
import Mysubs from './Mysubs';
import Subs from './Subs';
import Savedposts from './Savedposts';
import Logout from './Logout';

import FaceIcon from '@mui/icons-material/Face';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';


function Tabs() {
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        if (localStorage.getItem('tab') === null) {
            localStorage.setItem('tab', 'profile');
        }
        const storedTab = localStorage.getItem('tab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tab', activeTab);
    }, [activeTab]);

    return (
        <div className="Tabs">
            <div >
                <ul className="nav">
                    <li className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}><FaceIcon /></li>
                    <li className={activeTab === "mysubs" ? "active" : ""}
                        onClick={() => setActiveTab("mysubs")}><AddBoxIcon /></li>
                    <li className={activeTab === "subs" ? "active" : ""}
                        onClick={() => setActiveTab("subs")}><DynamicFeedIcon /></li>
                    <li className={activeTab === "savedposts" ? "active" : ""}
                        onClick={() => setActiveTab("savedposts")}><BookmarksIcon /></li>
                    <li className={activeTab === "logout" ? "active" : ""}
                        onClick={() => setActiveTab("logout")}><LogoutIcon /></li>
                </ul>
            </div>
            <div>
                <div className="outlet">
                    {activeTab === "profile" ? <Profile /> : ""}
                    {activeTab === "mysubs" ? <Mysubs /> : ""}
                    {activeTab === "subs" ? <Subs /> : ""}
                    {activeTab === "savedposts" ? <Savedposts /> : ""}
                    {activeTab === "logout" ? <Logout /> : ""}

                </div>
            </div>
        </div>
    )
}

export default Tabs;