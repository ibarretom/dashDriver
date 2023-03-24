import { dashDriverInstance } from '../api'

async function create({ moment, amount, kilometer_date }) {
  try {
    const response = await dashDriverInstance.post('/kilometer', {
      moment,
      amount,
      kilometer_date,
    })

    return response.data
  } catch (err) {
    throw {
      status: err.response.status,
      message: err.response.data.message,
    }
  }
}

export default { create }
