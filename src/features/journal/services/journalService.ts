import { db } from '../../../shared/services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { JournalEntry } from '../../../shared/types';

const getJournalCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'journal');
};

export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
  const journalCollection = getJournalCollectionRef(userId);
  const querySnapshot = await getDocs(journalCollection);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as JournalEntry);
};

export const addJournalEntry = async (
  userId: string,
  entry: Omit<JournalEntry, 'id'>
): Promise<JournalEntry> => {
  const journalCollection = getJournalCollectionRef(userId);
  const docRef = await addDoc(journalCollection, entry);
  return { ...entry, id: docRef.id };
};

export const updateJournalEntry = async (
  userId: string,
  entryId: string,
  updatedEntry: Partial<JournalEntry>
): Promise<void> => {
  const entryDoc = doc(db, 'users', userId, 'journal', entryId);
  const batch = writeBatch(db);
  batch.update(entryDoc, updatedEntry);
  await batch.commit();
};

export const deleteJournalEntry = async (userId: string, entryId: string): Promise<void> => {
  const entryDoc = doc(db, 'users', userId, 'journal', entryId);
  await deleteDoc(entryDoc);
};
