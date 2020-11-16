import { config } from "../config";
import { setCookie } from "../helpers";
import React from 'react';
import FacebookLogin from 'react-facebook-login';
const axios = require('axios');
const qs = require('querystring');
const APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || '812528609511975';

function FacebookBtn(props) {
    const login = (response) => {
        console.log(response);
        const requestBody = {
            username: response.userID,
            password: '',
            displayName: response.name,
        }
        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.get(`${config.api_url}/users/${response.userID}`)
            .then((resGetUser) => {
                console.log(resGetUser);
                console.log(resGetUser.data);
                if (resGetUser.data != '') {
                    setCookie(config.cookie_token, response.accessToken);
                    setCookie(config.cookie_username, response.userID);
                    window.location.href = "/";
                }
                else {
                    axios.post(`${config.api_url}/signup`, qs.stringify(requestBody), reqConfig)
                        .then((resSignup) => {
                            setCookie(config.cookie_token, response.accessToken);
                            setCookie(config.cookie_username, response.userID);
                            window.location.href = "/";
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            });

    }

    return (
        <FacebookLogin
            appId={APP_ID}
            fields="name,email,picture"
            callback={login}
        />
    )
}

export default FacebookBtn;