import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, writeBatch } from 'firebase/firestore';
import { StashItem, TodoList, Task } from '../types';

// Stash
const getStashCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'stash');
}

export const addStashItem = async (userId: string, item: Omit<StashItem, 'id'>): Promise<StashItem> => {
    const stashCollection = getStashCollectionRef(userId);
    const docRef = await addDoc(stashCollection, item);
    return { ...item, id: docRef.id };
};

export const getStashItems = async (userId: string): Promise<StashItem[]> => {
    const stashCollection = getStashCollectionRef(userId);
    const q = query(stashCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as StashItem));
};

export const deleteStashItem = async (userId: string, itemId: string): Promise<void> => {
    const itemDoc = doc(db, 'users', userId, 'stash', itemId);
    await deleteDoc(itemDoc);
};

// Checkmate
const getTodoListsCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'todoLists');
}

export const getTodoLists = async (userId: string): Promise<TodoList[]> => {
    const todoListsCollection = getTodoListsCollectionRef(userId);
    const q = query(todoListsCollection);
    const querySnapshot = await getDocs(q);

    const todoListsPromises = querySnapshot.docs.map(async (listDoc) => {
        const todoList = { ...listDoc.data(), id: listDoc.id } as TodoList;

        // Fetch tasks for each todo list from the subcollection
        const tasksCollectionRef = collection(listDoc.ref, 'tasks');
        const tasksQuerySnapshot = await getDocs(tasksCollectionRef);
        todoList.tasks = tasksQuerySnapshot.docs.map(taskDoc => ({ ...taskDoc.data(), id: taskDoc.id } as Task));

        return todoList;
    });

    return Promise.all(todoListsPromises);
}

export const addTodoList = async (userId: string, listName: string): Promise<TodoList> => {
    const todoListsCollection = getTodoListsCollectionRef(userId);
    const docRef = await addDoc(todoListsCollection, { name: listName, tasks: [] });
    return { id: docRef.id, name: listName, tasks: [] };
}

export const deleteTodoList = async (userId: string, listId: string): Promise<void> => {
    const listDoc = doc(db, 'users', userId, 'todoLists', listId);
    await deleteDoc(listDoc);
}

export const updateTodoList = async (userId: string, listId: string, updatedList: Partial<TodoList>): Promise<void> => {
    const listDoc = doc(db, 'users', userId, 'todoLists', listId);
    const batch = writeBatch(db);
    batch.update(listDoc, updatedList);
    await batch.commit();
}

export const addTask = async (userId: string, listId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const listDocRef = doc(db, 'users', userId, 'todoLists', listId);
    const taskCollectionRef = collection(listDocRef, 'tasks');
    const docRef = await addDoc(taskCollectionRef, task);
    return { ...task, id: docRef.id };
}

export const updateTask = async (userId: string, listId: string, taskId: string, updatedTask: Partial<Task>): Promise<void> => {
    const taskDocRef = doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId);
    const batch = writeBatch(db);
    batch.update(taskDocRef, updatedTask);
    await batch.commit();
}

export const deleteTask = async (userId: string, listId: string, taskId: string): Promise<void> => {
    const taskDocRef = doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId);
    await deleteDoc(taskDocRef);
}

// Goals
import { Goal, JournalEntry } from '../types';

const getGoalsCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'goals');
}

export const getGoals = async (userId: string): Promise<Goal[]> => {
    const goalsCollection = getGoalsCollectionRef(userId);
    const q = query(goalsCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Goal));
}

export const addGoal = async (userId: string, goal: Omit<Goal, 'id'>): Promise<Goal> => {
    const goalsCollection = getGoalsCollectionRef(userId);
    const docRef = await addDoc(goalsCollection, goal);
    return { ...goal, id: docRef.id };
}

export const updateGoal = async (userId: string, goalId: string, updatedGoal: Partial<Goal>): Promise<void> => {
    const goalDoc = doc(db, 'users', userId, 'goals', goalId);
    const batch = writeBatch(db);
    batch.update(goalDoc, updatedGoal);
    await batch.commit();
}

export const deleteGoal = async (userId: string, goalId: string): Promise<void> => {
    const goalDoc = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(goalDoc);
}

// Journal
const getJournalCollectionRef = (userId: string) => {
    return collection(db, 'users', userId, 'journal');
}

export const getJournalEntries = async (userId: string): Promise<JournalEntry[]> => {
    const journalCollection = getJournalCollectionRef(userId);
    const q = query(journalCollection);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as JournalEntry));
}

export const addJournalEntry = async (userId: string, entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
    const journalCollection = getJournalCollectionRef(userId);
    const docRef = await addDoc(journalCollection, entry);
    return { ...entry, id: docRef.id };
}

export const updateJournalEntry = async (userId: string, entryId: string, updatedEntry: Partial<JournalEntry>): Promise<void> => {
    const entryDoc = doc(db, 'users', userId, 'journal', entryId);
    const batch = writeBatch(db);
    batch.update(entryDoc, updatedEntry);
    await batch.commit();
}

export const deleteJournalEntry = async (userId: string, entryId: string): Promise<void> => {
    const entryDoc = doc(db, 'users', userId, 'journal', entryId);
    await deleteDoc(entryDoc);
}
