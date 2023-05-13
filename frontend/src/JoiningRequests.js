import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JoinRequests = () => {
  const [requests, setRequests] = useState([]);
  const { name } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`/api/sub/${name}/jr`);
      setRequests(result.data.joinRequests);
    };
    fetchData();
  }, [name]);

  const handleAccept = async (uname) => {
    try {
      await axios.put(`/api/sub/${name}/accept-request/${uname}`);
      setRequests(requests.filter((r) => r !== uname));
    } catch (error) {
      console.log('Error accepting join request:', error);
    }
  };

  const handleReject = async (uname) => {
    try {
      await axios.put(`/api/sub/${name}/reject-request/${uname}`);
      setRequests(requests.filter((r) => r !== uname));
    } catch (error) {
      console.log('Error rejecting join request:', error);
    }
  };

  const ulStyle = {
    listStyleType: 'none',
    padding: '0',
  };

  const liStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '1rem',
  };

  const nameStyle = {
    fontWeight: 'bold',
    marginRight: '1rem',
  };

  const buttonStyle = {
    marginLeft: '1rem',
    border: 'none',
    borderRadius: '4px',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    backgroundColor: 'green',
    color: '#fff',
    fontWeight: 'bold',
  };

  const rejectButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'red',
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem' }}>Join Requests</h1>
      <ul style={ulStyle}>
        {requests.map((r) => (
          <li key={r} style={liStyle}>
            <div>
              <span style={nameStyle}>{r}</span>
            </div>
            <div>
              <button style={buttonStyle} onClick={() => handleAccept(r)}>
                Accept
              </button>
              <button style={rejectButtonStyle} onClick={() => handleReject(r)}>
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JoinRequests;
