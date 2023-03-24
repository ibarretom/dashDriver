import { dashDriverInstance } from '../api'

async function SignUp({ name, email, password }) {
  try {
    const response = await dashDriverInstance.post('/users', {
      name,
      email,
      password,
    })

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

async function SignIn({ email, password }) {
  try {
    const response = await dashDriverInstance.post('/auth/signin', {
      email,
      password,
    })

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

export default { SignUp, SignIn }
