const mongoose = require("mongoose")
mongoose.set("strictQuery", false); // to remove an error

const connectDB = (url) => {
    return mongoose
        .connect(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
        .then(() => console.log("Connected to DB.."))
        .catch((err) => console.log("Unable to Connect.." + err))
}

module.exports = connectDB;