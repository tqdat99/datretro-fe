import { config } from "../config";

export function setCookie(name, val) {
    const date = new Date();
    const value = val;
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + value + '; expires=' + date.toUTCString();
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
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = name + '=; expires=' + date.toUTCString();
}

export function quickCheckToken() {
    const currentURI = window.location.pathname.substr(1);
    if (!['login', 'signup'].includes(currentURI)) {
        if (!getCookie(config.cookie_token)) {
            return false;
        }
    }
    return true;
}

