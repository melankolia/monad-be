import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import logger from "morgan";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init Morgan
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(logger("combined", { stream: accessLogStream }));
app.use(logger("combined"));
app.use("/output", express.static("public"));

app.get("/", (req, res, next) => {
    res.statusCode(200).json({
        message: "Hello World"
    });
  });

  app.listen(5173, () => console.log("Server running on port 5173"));