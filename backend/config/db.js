const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(`Database connected on >> ${conn.connection.host}`);
  } catch (err) {
    console.log(`${err.code}:`,'Sorry, Unable to connect to database ...');
    process.exit(1);
  }
};

module.exports = connectDB;
