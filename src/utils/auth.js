import Cookies from 'js-cookie';

// 本地token管理
const TokenKey = 'loginToken'
export function isAuthenticated () {
    return getToken();
}

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
