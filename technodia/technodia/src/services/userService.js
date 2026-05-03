import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export const createUserDocument = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  return setDoc(userRef, data);
};

export const getUserDocument = async (uid) => {
  const userRef = doc(db, "users", uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

export const updateUserDocument = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  return updateDoc(userRef, data);
};

export const saveOnboardingData = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    businessDetails: data,
    onboardingCompleted: true
  });
};
