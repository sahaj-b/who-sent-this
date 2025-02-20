import "dotenv/config";
import app from "./app";
import connectDB from "./db";

let port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  })
  .catch((error: Error) => {
    console.log("Error connecting to the database", error);
    process.exit(1);
  });
