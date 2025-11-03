export default function ResultTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  const handleDownloadCSV = () => {
    const headers = [
      "시행경마장명",
      "마명",
      "성별",
      "나이",
      "최근경주명",
      "최근경주순위",
      "최근경주기록",
      "통산승률",
      "최근1년승률",
      "통산착순상금",
      "최근1년착순상금",
    ];

    const csvRows = [
      headers.join(","),
      ...data.map((item) =>
        [
          item.meet || "",
          item.hrName || "",
          item.sex || "",
          item.age || "",
          item.recentRcName || "",
          item.recentOrd || "",
          item.recentRcTime || "",
          item.winRateT || "",
          item.winRateY || "",
          item.chaksunT || "",
          item.chaksunY || "",
        ]
          .map((field) => `"${String(field).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `경주마_성적_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full overflow-x-auto">
      {data.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleDownloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            CSV 다운로드
          </button>
        </div>
      )}
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-3 py-2 text-left">시행경마장명</th>
            <th className="border border-gray-300 px-3 py-2 text-left">마명</th>
            <th className="border border-gray-300 px-3 py-2 text-center">성별</th>
            <th className="border border-gray-300 px-3 py-2 text-center">나이</th>
            <th className="border border-gray-300 px-3 py-2 text-left">최근경주명</th>
            <th className="border border-gray-300 px-3 py-2 text-center">최근경주순위</th>
            <th className="border border-gray-300 px-3 py-2 text-center">최근경주기록</th>
            <th className="border border-gray-300 px-3 py-2 text-center">통산승률</th>
            <th className="border border-gray-300 px-3 py-2 text-center">최근1년승률</th>
            <th className="border border-gray-300 px-3 py-2 text-right">통산착순상금</th>
            <th className="border border-gray-300 px-3 py-2 text-right">최근1년착순상금</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="hover:bg-gray-50 border-t">
              <td className="border border-gray-300 px-3 py-2">{item.meet || "-"}</td>
              <td className="border border-gray-300 px-3 py-2 font-medium">
                {item.hrName || "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">{item.sex || "-"}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">{item.age || "-"}</td>
              <td className="border border-gray-300 px-3 py-2">{item.recentRcName || "-"}</td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {item.recentOrd || "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {item.recentRcTime || "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {item.winRateT ? `${item.winRateT}%` : "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-center">
                {item.winRateY ? `${item.winRateY}%` : "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {item.chaksunT ? Number(item.chaksunT).toLocaleString() + "원" : "-"}
              </td>
              <td className="border border-gray-300 px-3 py-2 text-right">
                {item.chaksunY ? Number(item.chaksunY).toLocaleString() + "원" : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

