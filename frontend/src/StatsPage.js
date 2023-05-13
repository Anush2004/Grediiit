import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter } from 'recharts';
import Table from 'react-bootstrap/Table';

function MyComponent() {
    const [memberStats, setMemberStats] = useState([]);
    const [postStats, setPostStats] = useState([]);
    const [reportStats, setReportStats] = useState([]);
    const { name } = useParams();

    useEffect(() => {
        axios
            .get(`/api/stats/${name}/stats`)
            .then((response) => {
                setMemberStats(response.data.memberStats);
                setPostStats(response.data.postStats);
                setReportStats(response.data.reportStats);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Create a new array with all dates until today
    let today = new Date();
    today = today.setDate(today.getDate() + 1);
    const dates = [];
    for (let d = new Date(memberStats[0]?.date); d <= today; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toLocaleDateString());
    }

    // Map over the dates array and find the corresponding member count for each date
    const memberCounts = dates.map((date) => {
        // Find the member count for this date
        for (let i = memberStats.length - 1; i >= 0; i--) {
            if (new Date(memberStats[i].date).toLocaleDateString() === date) {
                console.log(date);
                return memberStats[i].members;
            };
        }
        // Find the most recent non-zero member count and use that as the value for this date
        for (let i = 0; i < memberStats.length - 1; i++) {
            if (memberStats[i].members !== 0) {
                return memberStats[i].members;
            }
        }
        // If there are no non-zero member counts, return 0
        return 0;
    });

    const postCounts = dates.map((date) => {
        // Find the post count for this date
        for (let i = postStats.length - 1; i >= 0; i--) {
            if (new Date(postStats[i].date).toLocaleDateString() === date) {
                return postStats[i].posts;
            };
        }

        // If there are no non-zero post counts, return 0
        return 0;
    });

    // Combine the dates and member counts into an array of objects
    const memberStatsByDate = dates.map((date, i) => ({ date, members: memberCounts[i] }));
    const postStatsByDate = dates.map((date, i) => ({ date, posts: postCounts[i] }));

    return (
        <div className='stats-container'>
            <h1>Member Stats</h1>
            <LineChart width={600} height={400} data={memberStatsByDate}>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='members' stroke='#4d8' />
            </LineChart>

            <h1>New Posts Everyday Stats</h1>
            <LineChart width={600} height={400} data={postStatsByDate}>
                <XAxis dataKey='date' />
                <YAxis />
                <CartesianGrid />
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='posts' stroke='#4d8' />
            </LineChart>

            <h1>Report Stats</h1>
            <ScatterChart
                width={500}
                height={400}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid />
                <XAxis type="number" dataKey="reported" name="Reported Posts" />
                <YAxis type="number" dataKey="deleted" name="Deleted Posts" />
                <Tooltip />
                <Scatter data={reportStats} fill="#8884d8" />
            </ScatterChart>

            <Table striped bordered hover style={{ marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th>Reported Posts</th>
                        <th>Deleted Posts</th>
                    </tr>
                </thead>
                <tbody>
                    {reportStats.map((stat) => (
                        <tr key={stat.date}>
                            <td>{stat.reported}</td>
                            <td>{stat.deleted}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div >
    );
}

export default MyComponent;
