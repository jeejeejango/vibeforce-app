import React, { useState } from 'react';
import { UserProfile, StashItem } from '../../../shared/types';
import { addStashItem, deleteStashItem } from '../services/stashService';
import { analyzeStashItem } from '../../../shared/services/geminiService';
import { useTheme } from '../../../shared/ThemeContext';

interface StashProps {
  user: UserProfile;
  items: StashItem[];
  setItems: React.Dispatch<React.SetStateAction<StashItem[]>>;
}

const Stash: React.FC<StashProps> = ({ user, items, setItems }) => {
  const { theme } = useTheme();
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");

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

  // Get all unique tags from items
  const allTags = Array.from(
    new Set(items.flatMap((item) => item.tags))
  ).sort();

  // Filter tags based on search
  const filteredTags = allTags.filter((tag: string) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  // Filter items based on selected tags
  const filteredItems = selectedTags.length > 0
    ? items.filter((item) =>
      selectedTags.some((tag) => item.tags.includes(tag))
    )
    : items;

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags([]);
    setTagSearch("");
  };

  // Count items per tag
  const getTagCount = (tag: string) => {
    return items.filter((item) => item.tags.includes(tag)).length;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`text-3xl font-bold flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            <span className="text-amber-400">❖</span> Stash
          </h2>
          <p className={`mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>Intelligent Resource Vault</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-3">
          <form onSubmit={handleStash} className="relative group">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste a link, a note, or a code snippet here. AI will organize it."
              className={`w-full border rounded-xl p-4 pr-32 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-lg min-h-[100px] resize-none ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-900 border-slate-700 text-white'}`}
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

      {/* Tag Search & Filter Section */}
      {allTags.length > 0 && (
        <div className={`mb-6 rounded-xl p-5 border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme === 'light' ? 'text-gray-600' : 'text-slate-300'}`}>
              Filter by Tags
            </h3>
            {selectedTags.length > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear filters
              </button>
            )}
          </div>

          {/* Tag Search Input */}
          <div className="relative mb-4">
            <input
              type="text"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              placeholder="Search tags..."
              className={`w-full border rounded-lg px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-slate-800 border-slate-700 text-white'}`}
            />
            <svg
              className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>

          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag: string) => {
              const isSelected = selectedTags.includes(tag);
              const count = getTagCount(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all transform hover:scale-105 ${isSelected
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-900/50"
                    : theme === 'light' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300' : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    }`}
                >
                  #{tag}
                  <span className={`ml-1.5 ${isSelected ? "text-amber-200" : "text-slate-500"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
            {filteredTags.length === 0 && tagSearch && (
              <p className="text-sm text-slate-500">No tags match "{tagSearch}"</p>
            )}
          </div>

          {/* Active Filters Display */}
          {selectedTags.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-xs text-slate-500 mb-2">
                Showing {filteredItems.length} of {items.length} items
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag: string) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1.5 bg-amber-600/20 text-amber-300 text-xs px-2.5 py-1 rounded-md border border-amber-600/30"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => toggleTag(tag)}
                      className="hover:text-amber-100 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-5 transition-colors flex flex-col h-full group ${theme === 'light' ? 'bg-white border-gray-200 hover:border-amber-400' : 'bg-slate-800 border-slate-700 hover:border-amber-500/50'}`}
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`text-xs px-2 py-1 rounded font-medium uppercase tracking-wider
                ${item.type === "link"
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
              className={`font-bold text-lg mb-2 line-clamp-1 ${theme === 'light' ? 'text-gray-900' : 'text-slate-100'}`}
              title={item.title}
            >
              {item.title}
            </h3>

            <p className={`text-sm mb-4 flex-grow line-clamp-10 ${theme === 'light' ? 'text-gray-600' : 'text-slate-400'}`}>
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
                  className={`text-xs px-2 py-1 rounded-md border ${theme === 'light' ? 'text-gray-600 bg-gray-100 border-gray-300' : 'text-slate-400 bg-slate-900 border-slate-700'}`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className={`col-span-full py-12 text-center border-2 border-dashed rounded-xl ${theme === 'light' ? 'border-gray-300 text-gray-500' : 'border-slate-800 text-slate-600'}`}>
            {selectedTags.length > 0 ? (
              <>
                <p className="mb-2">No items match the selected tags.</p>
                <button
                  onClick={clearFilters}
                  className="text-amber-400 hover:text-amber-300 text-sm underline"
                >
                  Clear filters
                </button>
              </>
            ) : (
              <p>The vault is empty.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stash;
