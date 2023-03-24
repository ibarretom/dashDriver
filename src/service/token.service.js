import jwtDecode from 'jwt-decode'

function isValid(token) {
  if (!token) {
    return false
  }

  const decoded = jwtDecode(token)

  const expiresIn = decoded.exp * 1000

  if (expiresIn < Date.now()) {
    return false
  }

  return true
}

export default { isValid }
