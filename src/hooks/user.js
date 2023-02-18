import { auth, updateProfile } from "../plugins/firebase";

export function useUser() {
  async function updateUserName(name) {
    return updateProfile(auth.currentUser, {
      displayName: name
    })
  }

  async function updateUserProfilePhoto(photoURL) {
    return updateProfile(auth.currentUser, {
      photoURL: photoURL
    })
  }

  return {
    updateUserName,
    updateUserProfilePhoto
  }
}