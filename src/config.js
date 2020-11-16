import dotenv from "dotenv";

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export const config = {
    "cookie_token": "cookie_token",
    "cookie_username": "cookie_username",
    "api_url": process.env.API_URL || 'https://datretro-be.herokuapp.com/api'
};
