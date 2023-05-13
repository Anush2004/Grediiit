import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const nav = useNavigate();

    const handleLogout = async () => {
        await axios.post('/api/logout')
        localStorage.setItem('login', 'false');
        nav("/")
    }

    return (
        <div className="Logout">
            <p>Log out of your account?</p>
            <button className="logout" onClick = {handleLogout}>Log out</button>
        </div>
    )
};

export default Logout;