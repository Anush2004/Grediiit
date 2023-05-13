import React, { useState, useEffect } from 'react';
import './App.css';
import { Login } from "./Login"
import Home from "./Home"
import { Register } from "./Register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import Protected from './Protected';
import Subs from './MyLoadingSubs';
import Posts from './Posts';
import Comments from './Comment';

function App() {
  const [currentForm, setCurrentForm] = useState('login')

  const [login, setLogin] = useState(() => {
    return localStorage.getItem('login') || 'false';
  });
  const nav = useNavigate()


  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  useEffect(() => {
    if (localStorage.getItem('login') === null) {
      localStorage.setItem('login', 'false');
    }
  }, []);


  return (
    <div className="App">
      <Routes>
        <Route path="/" element={currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />} />
        <Route path="/home" element={<Protected isLoggedIn={localStorage.getItem('login')}><Home /></Protected>} />
        <Route path="/:name" element={<Subs />}></Route>
        <Route path="/posts/:name" element={<Posts />}></Route>
        <Route path="/posts/:name/comments" element={<Comments />}></Route>
      </Routes>
    </div>
  );
}

export default App;
export var login;

