import React, { useState } from "react";
import { StashItem, UserProfile } from "../types";
import { analyzeStashItem } from "../services/geminiService";
import { addStashItem, deleteStashItem } from "../services/firestore";

interface StashProps {
  user: UserProfile;
  items: StashItem[];
  setItems: React.Dispatch<React.SetStateAction<StashItem[]>>;
}

const Stash: React.FC<StashProps> = ({ user, items, setItems }) => {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);

    // Optimistic add with loading state or placeholder?
    // Let's wait for AI for the "magic" effect.
    const analysis = await analyzeStashItem(content);

    const newItem: Omit<StashItem, "id"> = {
      type: content.startsWith("http") ? "link" : "note",
      content: content,
      title: analysis.title,
      tags: analysis.tags,
      aiSummary: analysis.summary,
      createdAt: Date.now(),
    };

    const addedItem = await addStashItem(user.uid, newItem);

    setItems((prev) => [addedItem, ...prev]);
    setContent("");
    setIsAnalyzing(false);
  };

  const handleDeleteItem = async (id: string) => {
    // Optimistic UI update
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteStashItem(user.uid, id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="text-amber-400">❖</span> Stash
          </h2>
          <p className="text-slate-400 mt-1">Intelligent Resource Vault</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleStash} className="relative group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a link, a note, or a code snippet here. AI will organize it."
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 pr-32 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-lg min-h-[100px] resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              {isAnalyzing && (
                <span className="text-xs text-amber-400 animate-pulse">
                  Processing...
                </span>
              )}
              <button
                type="submit"
                disabled={isAnalyzing || !content.trim()}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg"
              >
                Stash It
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-amber-500/50 transition-colors flex flex-col h-full group"
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`text-xs px-2 py-1 rounded font-medium uppercase tracking-wider
                ${
                  item.type === "link"
                    ? "bg-blue-900/50 text-blue-400"
                    : "bg-slate-700 text-slate-300"
                }
              `}
              >
                {item.type}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <h3
              className="font-bold text-slate-100 text-lg mb-2 line-clamp-1"
              title={item.title}
            >
              {item.title}
            </h3>

            <p className="text-slate-400 text-sm mb-4 flex-grow line-clamp-10">
              {item.aiSummary || item.content}
            </p>

            {item.type === "link" && (
              <a
                href={item.content}
                target="_blank"
                rel="noreferrer"
                className="text-amber-500 text-sm hover:underline mb-4 block truncate"
              >
                {item.content}
              </a>
            )}

            <div className="flex flex-wrap gap-2 mt-auto">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
            <p>The vault is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stash;
