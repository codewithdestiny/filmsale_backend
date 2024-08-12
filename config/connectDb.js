import mongoose from "mongoose"
import "../src/user/user.model.js";
import "../src/film/film.model.js";

const dbConnection = async () => {
    mongoose.connect(process.env.MONGO_URL).then((res) => console.log(`Mongodb is connected`)).catch(err => console.log(`Error occurred ! ${err}`))
}

export default dbConnection;