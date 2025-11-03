# 한국마사회 경주마 성적 조회 시스템

한국마사회 오픈API를 이용하여 서울, 부산경남, 제주 경마장의 경주마 성적 정보를 검색하고 시각화하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **검색 기능**: 마명(hr_name) 또는 마번(hr_no)으로 경주마 검색
- **결과 표시**: 검색 결과를 표 형태로 표시
- **CSV 다운로드**: 검색 결과를 CSV 파일로 다운로드
- **최근 검색 기록**: 최근 검색한 마명 5개 저장 및 빠른 재조회
- **로딩 상태**: 검색 중 로딩 스피너 표시
- **오류 처리**: API 호출 실패 시 사용자 친화적 오류 메시지 표시

## 🛠️ 기술 스택

### Frontend
- **React** 18.2.0
- **Vite** 5.0.8
- **TailwindCSS** 3.3.6
- **Axios** 1.6.2

### Backend
- **Node.js** (Express 4.18.2)
- **Axios** 1.6.2
- **CORS** 2.8.5
- **dotenv** 16.3.1

## 📁 프로젝트 구조

```
horserace/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx         # 검색바 컴포넌트
│   │   │   ├── ResultTable.jsx       # 결과 테이블 컴포넌트
│   │   │   ├── LoadingSpinner.jsx    # 로딩 스피너 컴포넌트
│   │   │   └── RecentSearches.jsx    # 최근 검색 기록 컴포넌트
│   │   ├── App.jsx                   # 메인 앱 컴포넌트
│   │   ├── main.jsx                  # React 진입점
│   │   └── index.css                 # TailwindCSS 스타일
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/                  # Express 백엔드
│   ├── server.js             # Express 서버
│   ├── package.json
│   └── .env                   # 환경 변수 (ServiceKey 저장)
└── README.md
```

## 📦 설치 및 실행

### 1. 백엔드 설정

```bash
cd backend
npm install
```

`.env` 파일을 생성하고 ServiceKey를 입력합니다:

```env
SERVICE_KEY=335caaab503a2b735d35c428496dd175f2b18f43949a0d768547741397166989
```

백엔드 서버 실행:

```bash
npm start
# 또는 개발 모드 (자동 재시작)
npm run dev
```

서버는 `http://localhost:5000`에서 실행됩니다.

### 2. 프론트엔드 설정

새 터미널에서:

```bash
cd frontend
npm install
```

프론트엔드 개발 서버 실행:

```bash
npm run dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 3. 빌드

프로덕션 빌드:

```bash
cd frontend
npm run build
```

빌드된 파일은 `frontend/dist` 디렉토리에 생성됩니다.

## 🔌 API 엔드포인트

### GET /api/horse

경주마 성적 정보를 조회합니다.

**Query Parameters:**
- `hr_name` (선택): 마명으로 검색
- `hr_no` (선택): 마번으로 검색

**예시:**
```
GET http://localhost:5000/api/horse?hr_name=부산킹
GET http://localhost:5000/api/horse?hr_no=12345
```

**응답:**
```json
{
  "response": {
    "body": {
      "items": {
        "item": [
          {
            "meet": "부산경남",
            "hrName": "부산킹",
            "sex": "암",
            "age": "5",
            "recentRcName": "경주명",
            "recentOrd": "1",
            "recentRcTime": "1:23.4",
            "winRateT": "25.5",
            "winRateY": "30.0",
            "chaksunT": "50000000",
            "chaksunY": "25000000"
          }
        ]
      }
    }
  }
}
```

## 📊 데이터 표시 항목

- **시행경마장명** (meet): 서울, 부산경남, 제주
- **마명** (hrName): 경주마 이름
- **성별** (sex): 암, 숫
- **나이** (age): 경주마 나이
- **최근경주명** (recentRcName): 최근 참가한 경주 이름
- **최근경주순위** (recentOrd): 최근 경주에서의 순위
- **최근경주기록** (recentRcTime): 최근 경주 기록
- **통산승률** (winRateT): 전체 통산 승률 (%)
- **최근1년승률** (winRateY): 최근 1년 승률 (%)
- **통산착순상금** (chaksunT): 전체 통산 착순 상금
- **최근1년착순상금** (chaksunY): 최근 1년 착순 상금

## 💾 주요 기능 설명

### 검색 기능
- 마명 또는 마번 선택 후 검색 가능
- 검색어 입력 후 "조회하기" 버튼 클릭 또는 Enter 키로 검색
- 검색 중에는 버튼과 입력창이 비활성화됨

### 최근 검색 기록
- 최근 검색한 마명/마번 5개를 자동 저장
- 브라우저의 localStorage를 사용하여 저장
- 최근 검색 버튼 클릭 시 해당 검색어로 즉시 재조회

### CSV 다운로드
- 검색 결과 우측 상단의 "CSV 다운로드" 버튼 클릭
- UTF-8 BOM 인코딩으로 한글 깨짐 방지
- 파일명에 날짜 자동 포함

## 🐛 문제 해결

### 백엔드 서버 오류
- `.env` 파일이 올바르게 생성되었는지 확인
- 포트 5000이 이미 사용 중인지 확인
- `npm install`이 정상적으로 완료되었는지 확인

### 프론트엔드 연결 오류
- 백엔드 서버가 실행 중인지 확인
- `vite.config.js`의 proxy 설정 확인
- 브라우저 콘솔에서 CORS 오류 확인

### API 응답 오류
- ServiceKey가 유효한지 확인
- 한국마사회 API 서버 상태 확인
- 네트워크 연결 확인

## 📝 라이선스

이 프로젝트는 개인 및 교육 목적으로 사용됩니다.

## 👤 개발자 정보

한국마사회 오픈API를 활용한 경주마 성적 조회 시스템입니다.

