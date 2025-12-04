import { db } from '../../../shared/services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { StashItem } from '../../../shared/types';

const getStashCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'stash');
};

export const addStashItem = async (
  userId: string,
  item: Omit<StashItem, 'id'>
): Promise<StashItem> => {
  const stashCollection = getStashCollectionRef(userId);
  const docRef = await addDoc(stashCollection, item);
  return { ...item, id: docRef.id };
};

export const getStashItems = async (userId: string): Promise<StashItem[]> => {
  const stashCollection = getStashCollectionRef(userId);
  const querySnapshot = await getDocs(stashCollection);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as StashItem);
};

export const deleteStashItem = async (userId: string, itemId: string): Promise<void> => {
  const itemDoc = doc(db, 'users', userId, 'stash', itemId);
  await deleteDoc(itemDoc);
};
