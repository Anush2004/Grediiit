import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Greddit } from './greddit';
import axios from 'axios'

export const Login = (props, token) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const nav = useNavigate()
    const formRef = useRef(null);

    const handleSubmit = async(req,res) => {
        setEmail(req.target.elements.email.value);
        setPass(req.target.elements.pass.value);
    }

    const handleauth =  async (e) => {
        e.preventDefault();
        
        const user = {
            email: email,
            pass: pass
        };
        
        try {
            var res = await axios.post('/api/login', user)
            console.log(user)
            if (res.data.success) {
                localStorage.setItem('login', 'true');
                nav("/home");
            }
        } catch (error) {
            document.getElementById("text").style.backgroundColor = "red";
            document.getElementById("text").innerHTML = "Try again!";
            formRef.current.reset();
            setEmail('');
            setPass('');
        }
    }

    const validate = () => {
        return ((email.length > 0) && (pass.length > 0));
    };


    return (
        <div className="auth-form-container">
            <Greddit />
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit} ref={formRef}>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@gmail.com" id="email" name="email" />
                <label htmlFor="password" >Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="*******" id="password" name="password" />
                <div id="text"></div>
                <button disabled={!validate()} className='log-reg-button' type="submit" onClick={handleauth} >Log In</button>
            </form>

            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here</button>
        </div>


    )
}
