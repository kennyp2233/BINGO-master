//Firebase
import { db, authentication, storage } from 'config/firebase';
import { updateProfile, updateEmail, updatePassword, getAuth } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  collUsers,
  collAdminUsers
} from 'store/collections';

//Update Function Profile
export function updateProfileUser(name, lastName) {
  return updateProfile(authentication.currentUser, { displayName: name + ' ' + lastName });
}

//Obtener Datos Perfil de Usuario por ID
export async function getProfileUser(id) {
  let profile = null;
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}

//Obtener Datos Perfil de Usuario Administrador por ID
export async function getProfileUserAdmin(id) {
  let profile = null;
  const q = query(collection(db, collAdminUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    profile = doc.data().profile;
  });
  return profile;
}

// Actualizar email del usuario
export async function updateUserEmail(newEmail) {
  try {
    await updateEmail(authentication.currentUser, newEmail);
    const updateRef = doc(db, collUsers, authentication.currentUser.uid);
    await updateDoc(updateRef, {
      email: newEmail
    });
    return { success: true };
  } catch (error) {
    throw error;
  }
}

// Obtener usuario por ID
export async function getUserById(id) {
  const list = [];
  const querySnapshot = await getDocs(collection(db, collUsers));
  querySnapshot.forEach((doc) => {
    if (id === doc.data().id) {
      list.push(doc.data());
    }
  });
  return list;
}

// Obtener datos del usuario por ID
export async function getUserData(id) {
  let data = [];
  const q = query(collection(db, collUsers), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data.length > 0 ? data[0] : null;
}

// Actualizar avatar del usuario
export async function updateUserAvatar(id, file) {
  try {
    const imageName = id + '.jpg';
    const imageRef = ref(storage, `avatar/${imageName}`);
    const snapshot = await uploadBytes(imageRef, file);
    const avatarUrl = await getDownloadURL(snapshot.ref);

    const obj = {
      avatar: avatarUrl
    };
    const docRef = doc(db, collUsers, id);
    await updateDoc(docRef, obj);

    await updateProfile(authentication.currentUser, {
      photoURL: avatarUrl
    });

    return avatarUrl;
  } catch (error) {
    console.error('Error updating avatar:', error);
    throw error;
  }
}

// Cambiar contraseña del usuario
export async function changeUserPassword(newPassword) {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    await updatePassword(user, newPassword);
    return { success: true };
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw error;
  }
}

// Actualizar datos del perfil del usuario
export async function updateProfileData(id, object) {
  try {
    const docRef = doc(db, collUsers, id);
    await updateDoc(docRef, object);
    return { success: true };
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    throw error;
  }
}

export const profileService = {
  updateProfileUser,
  getProfileUser,
  getProfileUserAdmin,
  updateUserEmail,
  getUserById,
  getUserData,
  updateUserAvatar,
  changeUserPassword,
  updateProfileData
};