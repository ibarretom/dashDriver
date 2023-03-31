import { dashDriverInstance } from '../api'

async function get({ date }) {
  try {
    const response = await dashDriverInstance.get(`/carInfo?iso_date=${date}`)

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

export default { get }
