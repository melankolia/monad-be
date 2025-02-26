import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import logger from "morgan";
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    res.status(200).json({
        message: "Hello World"
    });
});

let counter = 0;

app.post("/counter", (req, res, next) => {
  counter++;
  res.status(200).json({
    message: "Counter",
    counter
  });
});

app.listen(5173, () => console.log("Server running on port 5173"));