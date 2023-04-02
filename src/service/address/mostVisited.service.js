import { dashDriverInstance } from '../api'

async function get() {
  try {
    const response = await dashDriverInstance.get(`address/mostVisited`)

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

async function getByMonth({ date }) {
  try {
    const response = await dashDriverInstance.get(
      `address/mostVisitedByMonth?date=${date}`
    )

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

async function getByDay({ date }) {
  try {
    const response = await dashDriverInstance.get(
      `address/mostVisitedByDay?date=${date}`
    )

    return response.data
  } catch (err) {
    throw new Error(err)
  }
}

export default { get, getByMonth, getByDay }
