import { db } from '../../../shared/services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { Goal } from '../../../shared/types';

const getGoalsCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'goals');
};

export const getGoals = async (userId: string): Promise<Goal[]> => {
  const goalsCollection = getGoalsCollectionRef(userId);
  const querySnapshot = await getDocs(goalsCollection);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Goal);
};

export const addGoal = async (userId: string, goal: Omit<Goal, 'id'>): Promise<Goal> => {
  const goalsCollection = getGoalsCollectionRef(userId);
  const docRef = await addDoc(goalsCollection, goal);
  return { ...goal, id: docRef.id };
};

export const updateGoal = async (
  userId: string,
  goalId: string,
  updatedGoal: Partial<Goal>
): Promise<void> => {
  const goalDoc = doc(db, 'users', userId, 'goals', goalId);
  const batch = writeBatch(db);
  batch.update(goalDoc, updatedGoal);
  await batch.commit();
};

export const deleteGoal = async (userId: string, goalId: string): Promise<void> => {
  const goalDoc = doc(db, 'users', userId, 'goals', goalId);
  await deleteDoc(goalDoc);
};
