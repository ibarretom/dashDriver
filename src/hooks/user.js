import { auth, updateProfile } from "../plugins/firebase";

export function useUser() {
  async function updateUserName(name) {
    return updateProfile(auth.currentUser, {
      displayName: name
    })
  }

  return {
    updateUserName
  }
}