import mongoose from "mongoose";

async function connectDB() {
  let uri: string = `${process.env.MONGODB_URI}`;
  try {
    const connectionInstance = await mongoose.connect(uri);
    console.log(
      "MONGODB Connected. Host: ",
      connectionInstance.connection.host,
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
}
export default connectDB;
