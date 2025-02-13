import "dotenv/config";
import app from "./app";
import { connectDb } from "./config/db";
import { PORT } from "./config/env";

connectDb()
  .then(() => {
    app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
  })
  .catch((error) => {
    console.log("MONGODB CONNECTION ERROR :: ", error);
  });
