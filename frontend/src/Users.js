import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Users = () => {
  const [mod, setMod] = useState([]);
  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/sub/sub-users/${name}`);
        setMod(response.data.created);
        setUsers(response.data.joined);
        setBlockedUsers(response.data.blocked);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };
    fetchData();
  }, [name]);

  return (
    <div>
      <h1>User List</h1>
      <div>
        <h2>Moderators</h2>
        <ul className="user-list">
          {mod.map((user) => (
            <li key={user} className="user-list-item moderator">{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Joined Users</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user} className="user-list-item">{user}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Blocked Users</h2>
        <ul className="user-list">
          {blockedUsers.map((user) => (
            <li key={user} className="user-list-item blocked">{user} (Blocked)</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
