import { useEffect, useState } from "react";

export default function RecentSearches({ onSearch }) {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentHorseSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("최근 검색 기록 불러오기 실패:", e);
      }
    }
  }, []);

  const addToRecent = (type, keyword) => {
    const newItem = { type, keyword, timestamp: Date.now() };
    const updated = [
      newItem,
      ...recentSearches.filter(
        (item) => !(item.type === type && item.keyword === keyword)
      ),
    ].slice(0, 5); // 최대 5개만 유지

    setRecentSearches(updated);
    localStorage.setItem("recentHorseSearches", JSON.stringify(updated));
  };

  const handleClick = (type, keyword) => {
    onSearch(type, keyword);
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">최근 검색</h3>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(item.type, item.keyword)}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm transition-colors"
          >
            {item.keyword} ({item.type === "hr_name" ? "마명" : "마번"})
          </button>
        ))}
      </div>
    </div>
  );
}

