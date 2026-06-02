const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://abhishekpatidarexam_db_user:a1b2h1i2@ac-bkb3vej-shard-00-00.4pc8ulz.mongodb.net:27017,ac-bkb3vej-shard-00-01.4pc8ulz.mongodb.net:27017,ac-bkb3vej-shard-00-02.4pc8ulz.mongodb.net:27017/erpdb?ssl=true&replicaSet=atlas-be5ckq-shard-0&authSource=admin&retryWrites=true&w=majority");
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDB;
