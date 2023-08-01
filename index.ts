import express from "express";
import cors from "cors";
import helmet from "helmet";

import accountRoute from "./routes/accountRoute";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/account", accountRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
