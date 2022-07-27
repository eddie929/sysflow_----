import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const usernameKey = 'username'
const userid = 'userid'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserName(value) {
  return Cookies.set(usernameKey, value)
}
// 查询用户名
export function getUserName() {
  return Cookies.get(usernameKey)
}

export function removeUserName() {
  return Cookies.remove(usernameKey)
}

// 写入cookies
export function setuserid(value) {
  return Cookies.set(userid, value)
}
// 查询
export function getuserid() {
  return Cookies.get(userid)
}

export function removeuserid() {
  return Cookies.remove(userid)
}
