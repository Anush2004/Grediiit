const express = require("express")
const session = require('express-session');
const user_routes = require("./routes/user-routes");
const sub_routes = require("./routes/sub-routes");
const post_routes = require("./routes/post-routes");
const report_routes = require("./routes/report-routes");
const stats_routes=require("./routes/stats")

const connectDB = require('./db/connect')
require("dotenv").config()
var bodyParser = require("body-parser");
const cors = require('cors');
const MongoDB = require('connect-mongodb-session')(session);

const app = express(); // invoke
const port = 3001 //port listneing

// connect database
const connectdb = async () =>{
    try{
        await connectDB(process.env.URI)
        app.listen(port, console.log("Server is listening to port :" + port))
    }
    catch (error){
        console.log(error)
    }
}
connectdb()


// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.set('trust-proxy', 1);

// create a user session
const store = new MongoDB({
    uri: process.env.URI,
    databaseName: 'web-app',
    collection: 'users'
});

store.on('error', (e) => {
    console.log(e);
});

app.use(session({
    secret: 'sessionisnewconcept',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    },
    store: store,
    resave: false,
    saveUninitialized: true
}));

//routes
app.use("/api", user_routes);
app.use("/api/sub", sub_routes);
app.use("/api/post", post_routes);
app.use("/api/report",report_routes);
app.use("/api/stats",stats_routes)
