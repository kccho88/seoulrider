import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

export default function RankingList() {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/ranking");
        
        if (res.data?.error) {
          setError(res.data.error);
          setRanking([]);
        } else {
          const rankingData = Array.isArray(res.data) ? res.data : [];
          setRanking(rankingData);
          if (rankingData.length === 0) {
            setError(null); // 빈 배열은 에러가 아님
          }
        }
      } catch (err) {
        console.error("랭킹 조회 오류:", err);
        console.error("에러 상세:", err.response?.data || err.message);
        // 네트워크 오류가 아니고 응답이 있는 경우
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.response?.status === 404) {
          setError("랭킹 데이터를 찾을 수 없습니다.");
        } else {
          setError("랭킹 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
        setRanking([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          최근 1년 착순상금 랭킹 TOP 30
        </h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 pt-8 border-t-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          최근 1년 착순상금 랭킹 TOP 30
        </h2>
        <div className="text-center text-red-600 py-4">{error}</div>
      </div>
    );
  }

  if (ranking.length === 0) {
    return (
      <div className="mt-12 pt-8 border-t-2 border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          최근 1년 착순상금 랭킹 TOP 30
        </h2>
        <div className="text-center text-gray-500 py-4">랭킹 데이터가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t-2 border-gray-300">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        최근 1년 착순상금 랭킹 TOP 30
      </h2>
      <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">순위</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-bold">마명</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">시행경마장</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">성별</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">나이</th>
              <th className="border border-gray-300 px-4 py-3 text-right font-bold">최근 1년 착순상금</th>
              <th className="border border-gray-300 px-4 py-3 text-center font-bold">최근 1년 승률</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => {
              const rank = index + 1;
              const medalEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "";
              const chaksunY = item.chaksunY ? Number(item.chaksunY) : 0;
              const winRateY = item.winRateY || "0";
              
              // 순위별 배경색 구분
              const rowBgClass = 
                rank === 1 ? "bg-gradient-to-r from-yellow-50 to-yellow-100" :
                rank === 2 ? "bg-gradient-to-r from-gray-50 to-gray-100" :
                rank === 3 ? "bg-gradient-to-r from-orange-50 to-orange-100" :
                rank <= 10 ? "bg-white" :
                "bg-gray-50";
              
              return (
                <tr
                  key={`${item.hrName}-${index}`}
                  className={`border-t hover:bg-blue-50 transition-colors ${rowBgClass}`}
                >
                  <td className="border border-gray-300 px-4 py-3 text-center font-semibold">
                    <span className="flex items-center justify-center gap-1">
                      {medalEmoji}
                      <span className={
                        rank === 1 ? "text-yellow-600 font-bold" :
                        rank === 2 ? "text-gray-600 font-bold" :
                        rank === 3 ? "text-orange-600 font-bold" :
                        rank <= 10 ? "text-gray-700" :
                        "text-gray-600"
                      }>
                        {rank}위
                      </span>
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-900">
                    {item.hrName || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {item.meet || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {item.sex || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {item.age || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-bold text-blue-600">
                    {chaksunY > 0 ? `${chaksunY.toLocaleString()}원` : "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-center">
                    {winRateY ? `${winRateY}%` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

