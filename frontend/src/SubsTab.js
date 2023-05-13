import React, { useEffect, useState } from 'react';

import Users from './Users';
import JoiningRequests from './JoiningRequests';
import Stats from './StatsPage';
import Reported from './Reported';
import Back from './Back'
import { useParams } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReportIcon from '@mui/icons-material/Report';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const tabContent = {
    'user': <Users />,
    'join': <JoiningRequests />,
    'stats': <Stats />,
    'report': <Reported />,
    'back': <Back />
};

const SubTab = () => {
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        if (localStorage.getItem('subtab') === null) {
            localStorage.setItem('subtab', 'user');
        }
        const storedTab = localStorage.getItem('subtab');
        if (storedTab) {
            setActiveTab(storedTab);
        }
    }, []);

    useEffect(() => {
       
        localStorage.setItem('subtab', activeTab);
    }, [activeTab]);

    return (
        <div className="SubTabs">
            <div>
                <ul className="sub-nav">
                    <li className={activeTab === "user" ? "active" : ""}
                        onClick={() => setActiveTab("user")}><PeopleAltIcon /></li>
                    <li className={activeTab === "join" ? "active" : ""}
                        onClick={() => setActiveTab("join")}><PersonAddIcon /></li>
                    <li className={activeTab === "stats" ? "active" : ""}
                        onClick={() => setActiveTab("stats")}><QueryStatsIcon /></li>
                    <li className={activeTab === "report" ? "active" : ""}
                        onClick={() => setActiveTab("report")}><ReportIcon /></li>
                    <li className={activeTab === "back" ? "active" : ""}
                        onClick={() => setActiveTab("back")}><ExitToAppIcon /></li>
                </ul>
            </div>
            <div className="outlet">
                {tabContent[activeTab]}
            </div>
        </div>
    );
}

export default SubTab;