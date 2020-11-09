import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { config } from "../config";
import { setCookie } from "../helpers";
const axios = require('axios');
const qs = require('querystring');
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '846280586932-kuuau5r2a3qqml22q6tmmecc42dtffpj.apps.googleusercontent.com';


function GoogleBtn(props) {
    const login = (response) => {
        console.log(response.accessToken);
        const requestBody = {
            username: response.profileObj.email,
            password: '',
            displayName: response.profileObj.name,
        }
        const reqConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.get(`${config.api_url}/users/${response.profileObj.email}`)
            .then((resGetUser) => {
                console.log(resGetUser);
                console.log(resGetUser.data);
                if (resGetUser.data != '') {
                    setCookie(config.cookie_token, response.accessToken);
                    setCookie(config.cookie_username, response.profileObj.email);
                    window.location.href = "/";
                }
                else {
                    axios.post(`${config.api_url}/signup`, qs.stringify(requestBody), reqConfig)
                        .then((resSignup) => {
                            setCookie(config.cookie_token, response.accessToken);
                            setCookie(config.cookie_username, response.profileObj.email);
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

    const handleLoginFailure = (response) => {
        alert('Failed to continue with Google')
    }

    return (
        <div>
            <GoogleLogin
                clientId={CLIENT_ID}
                buttonText='Continue with Google'
                onSuccess={login}
                onFailure={handleLoginFailure}
                cookiePolicy={'single_host_origin'}
                responseType='code,token'
            />
        </div>
    )
}

export default GoogleBtn;