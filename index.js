import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import logger from "morgan";
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';
import dotenv from "dotenv";

// Load contract artifact
import { readFileSync } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contractPath = path.join(__dirname, 'contracts/abi.json');
const contractJson = JSON.parse(readFileSync(contractPath, 'utf8'));

dotenv.config();

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(`https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Use contract address from environment variables
const CONTRACT_ADDRESS = process.env.DEPLOYED_CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
    throw new Error("Deployed contract address not found in environment variables");
}
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractJson.abi, wallet);

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

// Add a nonce manager at the top level
let currentNonce = null;

// Function to get and increment nonce
async function getNextNonce() {
    try {
        // If we don't have a current nonce, get it from the network
        if (currentNonce === null) {
            currentNonce = await wallet.getNonce();
        } else {
            // Increment the local nonce
            currentNonce++;
        }
        return currentNonce;
    } catch (error) {
        // If there's an error, reset the nonce
        throw error;
    }
}

app.post("/counter", async (req, res, next) => {
    try {
        // Get the next nonce
        const nonce = await getNextNonce();
        console.log("Using nonce:", nonce);

        // Call the increment function on the smart contract
        const tx = await contract.increment();
        
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        
        // Get the current count
        const count = await contract.getCount();
        
        res.status(200).json({
            message: "Counter incremented on blockchain",
            count: count.toString(),
            transactionHash: receipt.hash
        });
    } catch (error) {
        console.error('Error:', error);
        // res.status(500).json({
        //     message: "Error incrementing counter",
        //     error: error.message
        // });
    }
});

app.get("/counter", async (req, res, next) => {
    try {
        const count = await contract.getCount();
        res.status(200).json({
            count: count.toString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: "Error getting counter value",
            error: error.message
        });
    }
});

app.listen(5173, () => console.log("Server running on port 5173"));