import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState("hr_name"); // hr_name or hr_no

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }
    onSearch(searchType, keyword.trim());
    setKeyword(""); // 검색 후 입력창 초기화
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border rounded-lg px-3 py-2 bg-white"
        >
          <option value="hr_name">마명</option>
          <option value="hr_no">마번</option>
        </select>
        <input
          className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={searchType === "hr_name" ? "마명 입력 (예: 부산킹)" : "마번 입력"}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          조회하기
        </button>
      </form>
    </div>
  );
}

