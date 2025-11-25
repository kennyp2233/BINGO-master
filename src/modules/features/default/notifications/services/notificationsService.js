//Firebase
import { db } from 'config/firebase';
import {
  collection,
  getDocs,
  addDoc,
  where,
  query
} from 'firebase/firestore';
import {
  collGenNoti,
  collUsrNoti
} from 'store/collections';
import { genConst } from 'store/constant';
import { labels } from 'store/labels';
import { generateId } from 'utils/idGenerator';
import { generateDate } from 'utils/validations';

export const getGeneralNotifications = async () => {
  const list = [];
  const querySnapshot = await getDocs(collection(db, collGenNoti));
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
};

export async function getUserNotifications(id) {
  const list = [];
  const q = query(collection(db, collUsrNoti), where('idUser', '==', id));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    list.push(doc.data());
  });
  return list;
}

export function createSystemNotification(object) {
  return addDoc(collection(db, collUsrNoti), object);
}

export function createGlobalNotification(message, subject) {
  const object = {
    id: generateId(6),
    from: labels.notiAdmin,
    date: generateDate(),
    message: message,
    subject: subject,
    state: genConst.CONST_NOTIF_NL
  };
  return addDoc(collection(db, collGenNoti), object);
}