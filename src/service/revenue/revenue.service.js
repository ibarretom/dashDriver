import { dashDriverInstance } from '../api'

async function get({ date }) {
  try {
    const response = await dashDriverInstance.get(`/revenue?date=${date}`)

    return response.data
  } catch (err) {
    console.log(err.response.data)
    throw new Error(err)
  }
}

export default { get }
