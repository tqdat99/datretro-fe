import { config } from "../config";

export function checkToken() {
    const curURL = window.location.pathname.substr(1);
    if (!['login', 'signup'].includes(curURL)) {
        if (!getCookie(config.cookie_token)) {
            return false;
        }
    }
    return true;
}

export function setCookie(name, val) {
    const date = new Date();
    date.setTime(date.getTime() + (999999999999999));
    document.cookie = name + '=' + val + '; expires=' + date.toUTCString();
}

export function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export function deleteCookie(name) {
    const date = new Date();
    date.setTime(date.getTime() + (-999999999999999));
    document.cookie = name + '=; expires=' + date.toUTCString();
}



