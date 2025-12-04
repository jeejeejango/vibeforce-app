import { db } from '../../../shared/services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { TodoList, Task } from '../../../shared/types';

const getTodoListsCollectionRef = (userId: string) => {
  return collection(db, 'users', userId, 'todoLists');
};

export const getTodoLists = async (userId: string): Promise<TodoList[]> => {
  const todoListsCollection = getTodoListsCollectionRef(userId);
  const querySnapshot = await getDocs(todoListsCollection);

  const todoListsPromises = querySnapshot.docs.map(async listDoc => {
    const todoList = { ...listDoc.data(), id: listDoc.id } as TodoList;

    // Fetch tasks for each todo list from the subcollection
    const tasksCollectionRef = collection(listDoc.ref, 'tasks');
    const tasksQuerySnapshot = await getDocs(tasksCollectionRef);
    todoList.tasks = tasksQuerySnapshot.docs.map(
      taskDoc => ({ ...taskDoc.data(), id: taskDoc.id }) as Task
    );

    return todoList;
  });

  return Promise.all(todoListsPromises);
};

export const addTodoList = async (userId: string, listName: string): Promise<TodoList> => {
  const todoListsCollection = getTodoListsCollectionRef(userId);
  const docRef = await addDoc(todoListsCollection, { name: listName, tasks: [] });
  return { id: docRef.id, name: listName, tasks: [] };
};

export const deleteTodoList = async (userId: string, listId: string): Promise<void> => {
  const listDoc = doc(db, 'users', userId, 'todoLists', listId);
  await deleteDoc(listDoc);
};

export const updateTodoList = async (
  userId: string,
  listId: string,
  updatedList: Partial<TodoList>
): Promise<void> => {
  const listDoc = doc(db, 'users', userId, 'todoLists', listId);
  const batch = writeBatch(db);
  batch.update(listDoc, updatedList);
  await batch.commit();
};

export const addTask = async (
  userId: string,
  listId: string,
  task: Omit<Task, 'id'>
): Promise<Task> => {
  const listDocRef = doc(db, 'users', userId, 'todoLists', listId);
  const taskCollectionRef = collection(listDocRef, 'tasks');
  const docRef = await addDoc(taskCollectionRef, task);
  return { ...task, id: docRef.id };
};

export const updateTask = async (
  userId: string,
  listId: string,
  taskId: string,
  updatedTask: Partial<Task>
): Promise<void> => {
  const taskDocRef = doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId);
  const batch = writeBatch(db);
  batch.update(taskDocRef, updatedTask);
  await batch.commit();
};

export const deleteTask = async (userId: string, listId: string, taskId: string): Promise<void> => {
  const taskDocRef = doc(db, 'users', userId, 'todoLists', listId, 'tasks', taskId);
  await deleteDoc(taskDocRef);
};
