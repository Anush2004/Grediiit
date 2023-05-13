import { Navigate } from "react-router-dom";

const Protected = ({ isLoggedIn, children }) => {
    if (isLoggedIn === 'false') {
        console.log("false");
        return <Navigate to="/" replace />
    }
    if (isLoggedIn === null) {
        console.log("null");
        return <Navigate to="/" replace />
    }
    console.log("true");
    return children;
};

export default Protected;
