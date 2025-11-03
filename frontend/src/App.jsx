import { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultTable from "./components/ResultTable";
import LoadingSpinner from "./components/LoadingSpinner";
import RecentSearches from "./components/RecentSearches";
import RankingList from "./components/RankingList";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchHorse = async (searchType, keyword) => {
    setLoading(true);
    setError(null);
    setData([]);

    try {
      const params = {};
      if (searchType === "hr_name") {
        params.hr_name = keyword;
      } else {
        params.hr_no = keyword;
      }

      const res = await axios.get("http://localhost:5000/api/horse", { params });

      // API 응답 구조 처리
      console.log("전체 응답 데이터:", res.data);
      
      let items = [];
      
      // 한국마사회 API 응답 구조 확인
      if (res.data?.response?.body?.items) {
        const itemsData = res.data.response.body.items;
        if (itemsData.item) {
          items = Array.isArray(itemsData.item) ? itemsData.item : [itemsData.item];
        }
      } else if (res.data?.body?.items) {
        const itemsData = res.data.body.items;
        if (itemsData.item) {
          items = Array.isArray(itemsData.item) ? itemsData.item : [itemsData.item];
        }
      }

      // API 에러 응답 확인
      if (res.data?.response?.header?.resultCode && 
          res.data.response.header.resultCode !== "00") {
        const errorMsg = res.data.response.header.resultMsg || "검색 결과가 없습니다.";
        setError(errorMsg);
        setData([]);
        return;
      }

      // 빈 배열이거나 null인 경우 처리
      if (items.length === 0 || (items.length === 1 && !items[0])) {
        setData([]);
        // 에러 메시지는 표시하지 않고 빈 결과만 표시
      } else {
        setData(items);
        // 최근 검색에 추가
        const recentSearches = JSON.parse(
          localStorage.getItem("recentHorseSearches") || "[]"
        );
        const newItem = {
          type: searchType,
          keyword,
          timestamp: Date.now(),
        };
        const updated = [
          newItem,
          ...recentSearches.filter(
            (item) => !(item.type === searchType && item.keyword === keyword)
          ),
        ].slice(0, 5);
        localStorage.setItem("recentHorseSearches", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("조회 오류:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "조회 실패. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          한국마사회 경주마 성적 조회
        </h1>

        <SearchBar onSearch={searchHorse} loading={loading} />
        <RecentSearches onSearch={searchHorse} />

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>오류:</strong> {error}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && !error && <ResultTable data={data} />}

        {/* 최근 1년 착순상금 랭킹 */}
        <RankingList />
      </div>
    </div>
  );
}

export default App;

