import React, { useState } from "react";
import Tabs from "./Tab"
import {Navigate} from "react-router-dom"
import { Greddit } from "./greddit";

const Home = () => {
    return (
        <>
            <Greddit/>
            <Tabs/>
        </>
    )
};

export default Home;