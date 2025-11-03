import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/horse", async (req, res) => {
  const { hr_name, hr_no } = req.query;

  if (!hr_name && !hr_no) {
    return res.status(400).json({ 
      error: "검색 파라미터가 필요합니다. hr_name 또는 hr_no를 입력해주세요." 
    });
  }

  try {
    console.log("검색 요청:", { hr_name, hr_no });
    console.log("ServiceKey 확인:", process.env.SERVICE_KEY ? "있음" : "없음");

    const response = await axios.get(
      "https://apis.data.go.kr/B551015/API15_2/raceHorseResult_2",
      {
        params: {
          ServiceKey: process.env.SERVICE_KEY,
          pageNo: 1,
          numOfRows: 10,
          _type: "json",
          ...(hr_name && { hr_name }),
          ...(hr_no && { hr_no }),
        },
      }
    );

    console.log("API 응답 상태:", response.status);
    console.log("API 응답 데이터:", JSON.stringify(response.data, null, 2));

    // API 응답이 성공했지만 내부에 에러가 있는 경우 확인
    if (response.data.response?.header?.resultCode !== "00" && 
        response.data.response?.header?.resultCode !== undefined) {
      const errorMsg = response.data.response?.header?.resultMsg || "알 수 없는 오류";
      console.error("API 응답 오류:", errorMsg);
      return res.status(400).json({
        error: errorMsg,
        code: response.data.response?.header?.resultCode
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error("API 호출 오류:", error.message);
    console.error("오류 상세:", error.response?.data || error.message);
    
    // 더 자세한 에러 정보 제공
    if (error.response) {
      res.status(error.response.status || 500).json({ 
        error: "데이터 조회 실패", 
        detail: error.response.data?.message || error.message,
        status: error.response.status
      });
    } else {
      res.status(500).json({ 
        error: "데이터 조회 실패", 
        detail: error.message 
      });
    }
  }
});

// 최근 1년 착순상금 랭킹 TOP 30 조회
app.get("/api/ranking", async (req, res) => {
  try {
    console.log("랭킹 조회 시작");

    let allItems = [];
    
    // 한국마사회 API는 검색 파라미터가 필요하므로
    // 여러 검색어를 사용하여 데이터 수집
    // 일반적인 마명 키워드들로 검색 시도
    const searchKeywords = [
      "부산", "서울", "제주", "경주", "우승", "스타", "킹", "챔프", "로얄",
      "빅", "그랜드", "슈퍼", "골드", "실버", "다이아", "파이어", "스톰",
      "레이스", "윈", "빅토리", "챔피언", "히어로", "레전드", "마스터"
    ];

    // 방법 1: 검색 파라미터 없이 시도 (일부 API는 허용)
    try {
      const response = await axios.get(
        "https://apis.data.go.kr/B551015/API15_2/raceHorseResult_2",
        {
          params: {
            ServiceKey: process.env.SERVICE_KEY,
            pageNo: 1,
            numOfRows: 100,
            _type: "json",
          },
          timeout: 10000,
        }
      );

      if (response.data?.response?.header?.resultCode === "00") {
        const itemsData = response.data.response.body?.items;
        if (itemsData?.item) {
          const items = Array.isArray(itemsData.item) ? itemsData.item : [itemsData.item];
          const validItems = items.filter(item => item && item.chaksunY && Number(item.chaksunY) > 0);
          allItems = allItems.concat(validItems);
          console.log(`검색 파라미터 없이 ${validItems.length}개 항목 수집`);
        }
      }
    } catch (directError) {
      console.log("검색 파라미터 없이 조회 실패, 키워드 검색으로 전환");
    }

    // 방법 2: 여러 키워드로 검색하여 데이터 수집
    for (const keyword of searchKeywords.slice(0, 10)) { // 처음 10개 키워드만 사용
      try {
        const response = await axios.get(
          "https://apis.data.go.kr/B551015/API15_2/raceHorseResult_2",
          {
            params: {
              ServiceKey: process.env.SERVICE_KEY,
              pageNo: 1,
              numOfRows: 100,
              _type: "json",
              hr_name: keyword,
            },
            timeout: 10000,
          }
        );

        if (response.data?.response?.header?.resultCode === "00") {
          const itemsData = response.data.response.body?.items;
          if (itemsData?.item) {
            const items = Array.isArray(itemsData.item) ? itemsData.item : [itemsData.item];
            const validItems = items.filter(item => 
              item && 
              item.chaksunY && 
              Number(item.chaksunY) > 0 &&
              !allItems.some(existing => existing.hrName === item.hrName && existing.meet === item.meet)
            );
            allItems = allItems.concat(validItems);
            console.log(`키워드 "${keyword}"로 ${validItems.length}개 항목 수집 (총 ${allItems.length}개)`);
          }
        }
        
        // API 호출 제한을 피하기 위해 약간의 지연
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (keywordError) {
        console.error(`키워드 "${keyword}" 검색 오류:`, keywordError.message);
        // 개별 키워드 오류는 무시하고 계속 진행
      }
    }

    // chaksunY(최근 1년 착순상금) 기준으로 내림차순 정렬
    const sortedItems = allItems
      .filter(item => item.chaksunY && Number(item.chaksunY) > 0)
      .sort((a, b) => {
        const aChaksun = Number(a.chaksunY) || 0;
        const bChaksun = Number(b.chaksunY) || 0;
        return bChaksun - aChaksun;
      })
      .slice(0, 30); // 상위 30개만

    console.log(`랭킹 데이터 수집 완료: ${sortedItems.length}개`);
    
    // 데이터가 충분하지 않으면 샘플 데이터 추가 (개발용)
    if (sortedItems.length < 30 && sortedItems.length > 0) {
      console.log(`데이터가 ${sortedItems.length}개만 수집됨 (목표: 30개)`);
    }
    
    if (sortedItems.length === 0) {
      console.log("수집된 데이터가 없음");
      return res.json([]); // 빈 배열 반환 (에러 대신)
    }
    
    res.json(sortedItems);
  } catch (error) {
    console.error("랭킹 조회 오류:", error.message);
    res.status(500).json({
      error: "랭킹 데이터 조회 실패",
      detail: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

