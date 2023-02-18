import { useEffect, useState } from "react";
import { StyleSheet, Pressable, Image, Alert } from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons"
import * as ImagePicker from "expo-image-picker";

import { getDownloadURL, ref, storage, uploadBytes } from "../plugins/firebase";
import uuid from "react-native-uuid"
import { useUser } from "../hooks/user";

export function Picture({ userImage, setLoadingScreen = () => { } }) {
  const { updateUserProfilePhoto } = useUser()

  const [image, setImage] = useState(userImage)

  useEffect(() => {
    requireAccessToMediaLibrary()
  }, [])

  async function requireAccessToMediaLibrary() {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  }

  async function pickImage() {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
    });

    handleImagePicked(pickerResult);
  }

  async function handleImagePicked(pickerResult) {
    try {
      setLoadingScreen(true)

      if (!pickerResult.canceled) {
        const uploadUrl = await uploadImageAsync(pickerResult.assets[0].uri);

        await updateUserProfilePhoto(uploadUrl)

        setImage(uploadUrl);
      }

    } catch (e) {
      console.log(e);
      Alert.alert("Não foi possível fazer upload de imagem", "Desculpe, o upload falhou");
    } finally {
      setLoadingScreen(false);
    }
  }

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `profileImages/${uuid.v4()}`);
    await uploadBytes(fileRef, blob);

    blob.close();

    return await getDownloadURL(fileRef);
  }

  return (
    <>
      {
        !image ?
          <Pressable style={styles.pictureContainer} onPress={pickImage}>
            <Icon size={42} name={'person'} color='#999' />
          </Pressable> :
          <Image source={{ uri: image }} style={styles.pictureContainer} />
      }
    </>
  )
}

const styles = StyleSheet.create({
  pictureContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4E5E7',
  },
  uploadingOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})