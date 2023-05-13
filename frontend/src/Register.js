import React, { useState, useRef } from 'react';
import { Greddit } from './greddit';
import axios from "axios";


export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [uname, setUname] = useState('');
    const [age, setAge] = useState('34');
    const [Cnumber, setCnumber] = useState('');
    const formRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(email)
        const user = {
            fname: fname,
            lname: lname,
            uname: uname,
            email: email,
            pass: pass,
            age: age,
            Cnumber: Cnumber
        };
        var res = await axios.post('/api/register', user)
        if (res.data.success) {
            props.onFormSwitch('login');
            
            console.log("User registered successfully: ");
        }
        else {
            formRef.current.reset();
            setFname('');
            setLname('');
            setUname('');
            setEmail('');
            setCnumber('');
            setAge('');
            setPass('');
            document.getElementById("text").style.backgroundColor = "red";
            document.getElementById("text").innerHTML = "Email already taken";
        }
    }

    const validate = () => {
        return ((fname.length > 0) && (lname.length > 0) && (uname.length > 0) && (email.length > 0) && (age.length > 0) && (Cnumber.length > 0) && (pass.length > 0));
    };

    return (
        <div className="auth-form-container">
            <Greddit />
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit} ref={formRef}>
                <label httpFor="fname">Full name</label>
                <input value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Full Name" id="fname" name="fname" />
                <label httpFor="lname">Last name</label>
                <input value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last Name" id="lname" name="lname" />
                <label httpFor="uname">User Name</label>
                <input value={uname} onChange={(e) => setUname(e.target.value)} placeholder="User Name" id="uname" name="uname" />
                <label httpFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="email@gmail.com" id="email" name="email" />
                <label httpFor="age">Age</label>
                <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder='34' min="10" max="120" id="age" name="age" />
                <label httpFor="Cnumber">Contact Number</label>
                <input value={Cnumber} onChange={(e) => setCnumber(e.target.value)} type="tel" placeholder="9812342512" id="cnumber" name="cnumber" />
                <label htmlFor="password">Password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="*******" id="password" name="password" />
                <div id="text"></div>
                <button className='log-reg-button' disabled={!validate()} onClick={() => {handleSubmit()}} type="submit">Register</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here</button>
        </div>
    )
}

export default Register;