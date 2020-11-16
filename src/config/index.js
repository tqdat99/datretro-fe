import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
//process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export const config = {
    cookie_token: "cookie_token",
    cookie_username: "cookie_username",
    api_url: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
};
