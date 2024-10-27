# 한국천문연구원 공휴일 제공 Open API 데이터 가져오기
`datepicker.js`에 응용하기 위해 데이터 구조를 바꿨습니다.   
Tested Node version: `v20.17.0`

## 예시
```json
{
  "20220101": {
    "type": 0,
    "title": "1월1일",
    "year": "2022"
  },
  "20220131": {
    "type": 0,
    "title": "설날",
    "year": "2022"
  },
  "20220201": {
    "type": 0,
    "title": "설날",
    "year": "2022"
  },
	// ...
}
```

## 주요 변수 및 함수 설명
- `port`: 서버가 실행될 포트 번호. 환경 변수 `PORT` 값을 사용하거나 기본값 3000을 사용합니다.
- `timeDifferenceList`: 시간 간격에 대한 정의를 포함한 객체로, 일(day), 시간(hour), 분(minute) 단위의 간격을 설정합니다.
- `timeDifference`: JSON 파일을 최신으로 유지하기 위한 시간 차이 기준. 기본적으로 1시간(`oneHour`)로 설정됩니다.
- `delay(ms)`: 지정된 밀리초(ms) 동안 지연시키는 비동기 함수.
- `currentYear`: 현재 연도를 저장하는 변수.
- `startYear`: 공휴일 데이터를 가져올 시작 연도. 현재 연도에서 2년을 뺀 값을 사용합니다.
- `endYear`: 공휴일 데이터를 가져올 종료 연도. 현재 연도에서 2년을 더한 값을 사용합니다.
- `years`: 시작 연도부터 종료 연도까지의 연도 목록을 저장하는 배열.
- `fetchHolidayData()`: 한국천문연구원 API를 이용해 공휴일 데이터를 가져와 JSON 파일로 저장하거나 기존 JSON 파일을 사용하는 함수.
- `existingFilePath`: 기존 공휴일 JSON 파일의 경로를 저장하기 위한 변수로, 최신 파일이 있는 경우 이 경로를 사용합니다.
- `directory`: 공휴일 데이터 JSON 파일을 저장할 디렉터리 경로.
- `holidays`: 연도별 공휴일 정보를 저장하는 객체.
- `/holidays` 경로의 엔드포인트: 공휴일 데이터를 클라이언트에게 제공하는 API 엔드포인트.

## .env
```sh
# .env
API_URL=http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo
SERVICE_KEY=인증키(Decoding)
```
