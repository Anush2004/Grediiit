import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const Back = (props) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        localStorage.setItem('stab', 'user');
        navigate("/home");
    }

    return (
        <div>
            <p>Wanna go back?</p>
        <button className="logout-btn" onClick={handleLogout}>Yes</button>
        </div>
    )
};

export default Back;