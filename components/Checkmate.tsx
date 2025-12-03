import React, { useState, useEffect } from "react";
import { TodoList, Task, UserProfile } from "../types";
import {
  addTodoList,
  deleteTodoList,
  addTask,
  deleteTask,
  updateTask,
} from "../services/firestore";
import { generateTasksFromNaturalLanguage } from "../services/geminiService"; // Import the new service function

interface CheckmateProps {
  user: UserProfile;
  todoLists: TodoList[];
  setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>>;
}

const Checkmate: React.FC<CheckmateProps> = ({
  user,
  todoLists,
  setTodoLists,
}) => {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false); // New state for loading

  useEffect(() => {
    if (todoLists.length > 0 && !selectedListId) {
      setSelectedListId(todoLists[0].id);
    }
  }, [todoLists, selectedListId]);

  const handleAddTodoList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const newList = await addTodoList(user.uid, newListName);
    setTodoLists((prev) => [...prev, newList]);
    setNewListName("");
  };

  const handleDeleteTodoList = async (listId: string) => {
    await deleteTodoList(user.uid, listId);
    setTodoLists((prev) => prev.filter((list) => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

  const selectedList = todoLists.find((list) => list.id === selectedListId);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedListId) return;

    const newTask: Omit<Task, "id"> = {
      title: newTaskTitle,
      status: "todo",
      priority: "medium",
      tags: [],
      createdAt: Date.now(),
    };

    const addedTask = await addTask(user.uid, selectedListId, newTask);

    setTodoLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? { ...list, tasks: [...list.tasks, addedTask] }
          : list
      )
    );
    setNewTaskTitle("");
  };

  const handleGenerateTasks = async () => {
    if (!newTaskTitle.trim() || !selectedListId) {
      alert("Please enter a prompt and select a todo list.");
      return;
    }

    setIsGeneratingTasks(true);
    try {
      const generatedTasks = await generateTasksFromNaturalLanguage(
        newTaskTitle
      );
      if (generatedTasks.length > 0) {
        // Add each generated task to the list
        const newTasksPromises = generatedTasks.map((taskTitle) => {
          const newTask: Omit<Task, "id"> = {
            title: taskTitle,
            status: "todo",
            priority: "medium",
            tags: [],
            createdAt: Date.now(),
          };
          return addTask(user.uid, selectedListId, newTask);
        });

        const addedTasks = await Promise.all(newTasksPromises);

        setTodoLists((prev) =>
          prev.map((list) =>
            list.id === selectedListId
              ? { ...list, tasks: [...list.tasks, ...addedTasks] }
              : list
          )
        );
      } else {
        alert("No tasks were generated. Please try a different prompt.");
      }
    } catch (error) {
      console.error("Error generating tasks:", error);
      alert("Failed to generate tasks. Please try again.");
    } finally {
      setNewTaskTitle("");
      setIsGeneratingTasks(false);
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    if (!selectedListId) return;

    const task = selectedList?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === "done" ? "todo" : "done";
    await updateTask(user.uid, selectedListId, taskId, { status: newStatus });

    setTodoLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t
              ),
            }
          : list
      )
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedListId) return;

    await deleteTask(user.uid, selectedListId, taskId);

    setTodoLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? { ...list, tasks: list.tasks.filter((t) => t.id !== taskId) }
          : list
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex gap-6">
      {/* TodoList Sidebar */}
      <div className="w-1/4">
        <h3 className="text-xl font-bold mb-4">Todo Lists</h3>
        <form onSubmit={handleAddTodoList} className="mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 mb-2"
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg"
          >
            Add List
          </button>
        </form>
        <ul>
          {todoLists.map((list) => (
            <li
              key={list.id}
              className={`flex justify-between items-center cursor-pointer p-2 rounded-lg ${
                selectedListId === list.id
                  ? "bg-violet-600"
                  : "hover:bg-slate-800"
              }`}
            >
              <span
                onClick={() => setSelectedListId(list.id)}
                className="flex-grow"
              >
                {list.name}
              </span>
              <button
                onClick={() => handleDeleteTodoList(list.id)}
                className="text-red-500 ml-2 p-1 rounded-full hover:bg-red-500/20"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4">
        {selectedList ? (
          <>
            <h2 className="text-3xl font-bold mb-4">{selectedList.name}</h2>
            <div className="mb-8 relative flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={
                  isGeneratingTasks
                    ? "Generating tasks..."
                    : "What's your next move? Or describe tasks to generate..."
                }
                className="flex-grow bg-slate-900 border border-slate-700 text-white rounded-xl p-4 pl-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-lg shadow-black/20"
                disabled={isGeneratingTasks}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <button
                type="submit"
                onClick={handleAddTask} // Explicitly call handleAddTask
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                disabled={isGeneratingTasks || !newTaskTitle.trim()}
              >
                Add Task
              </button>
              <button
                type="button" // Change to button type to prevent form submission
                onClick={handleGenerateTasks}
                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                disabled={isGeneratingTasks || !newTaskTitle.trim()}
              >
                {isGeneratingTasks ? "Generating..." : "Generate Tasks"}
              </button>
            </div>
            <div className="space-y-3">
              {selectedList.tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 p-4 rounded-xl transition-all"
                >
                  <button onClick={() => handleToggleStatus(task.id)}>
                    <div
                      className={`w-6 h-6 rounded-full border-2 ${
                        task.status === "done"
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-500"
                      }`}
                    >
                      {task.status === "done" && "✓"}
                    </div>
                  </button>
                  <span
                    className={`flex-1 ${
                      task.status === "done"
                        ? "line-through text-slate-500"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-500/20"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-600">
            <p className="text-xl">
              Select a list or create a new one to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkmate;
