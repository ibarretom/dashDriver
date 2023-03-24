import { dashDriverInstance } from '../api'

async function create(carRide) {
  try {
    await dashDriverInstance.post('/carRide', {
      ...carRide,
    })
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

export default { create }
