import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Tabs from "./SubsTab";

const Subs = () => {

    const { name } = useParams();
    const [sub, setSub] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log(name)
            const res = await axios.get(`/api/sub/subs/${name}`);
            setSub(res.data);
        }
        fetchData();
    }, [name]);

    if(!sub) {
        return (
            <div>
                Loading...Please give it a minute
            </div>
        )
    }

    return (
        <div className="sub">
            <Tabs/>
        </div>
    );
};

export default Subs;