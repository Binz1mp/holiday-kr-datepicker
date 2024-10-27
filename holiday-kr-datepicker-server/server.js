require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// 시간 차이 설정
const timeDifferenceList = {
  oneDay: 24 * 60 * 60 * 1000, // 1일
  oneHour: 60 * 60 * 1000, // 1시간
  fiveMinute: 5 * 60 * 1000, // 5분
  oneMinute: 60 * 1000, // 1분
};
const timeDifference = timeDifferenceList.oneHour;
const currentYear = new Date().getFullYear();
const startYear = currentYear - 2;
const endYear = currentYear + 2;
const years = [];

// 요청 사이에 지연을 두기 위한 delay 함수
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchHolidayData() {
  try {
    console.log('서비스 키 확인 중...');
    if (!process.env.SERVICE_KEY) {
      throw new Error('SERVICE_KEY가 환경 변수에 정의되지 않았습니다');
    }
    console.log('서비스 키 확인 완료');

    const directory = path.join(__dirname, 'json_holiday');
    console.log(`디렉터리 확인: ${directory}`);
    if (!fs.existsSync(directory)) {
      console.log('디렉터리가 존재하지 않으므로 생성합니다.');
      fs.mkdirSync(directory);
    }

    const files = fs.readdirSync(directory);
    console.log(`디렉터리 내 파일들: ${files}`);

    let existingFilePath = null;

    files.forEach(file => {
      if (file.startsWith('holidays_') && file.endsWith('.json')) {
        const timestamp = parseInt(file.match(/holidays_(\d+)\.json/)[1], 10);
        const timeDiff = Date.now() - timestamp;
        if (timeDiff > timeDifference) {
          fs.unlinkSync(path.join(directory, file));
          console.log(`이전 파일 ${file}이 삭제되었습니다`);
        } else {
          console.log(`파일 ${file}은(는) 최신 상태입니다. 삭제하지 않습니다.`);
          existingFilePath = path.join(directory, file);
        }
      }
    });

    if (existingFilePath) {
      console.log(`기존 JSON 파일 사용: ${existingFilePath}`);
      return JSON.parse(fs.readFileSync(existingFilePath, 'utf8'));
    }

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    let holidays = {};

    for (const year of years) {
      console.log(`${year}년의 공휴일 데이터 요청 중...`);

      try {
        const response = await axios.get(process.env.API_URL, {
          params: {
            serviceKey: process.env.SERVICE_KEY,
            solYear: year,
            _type: 'json',
            numOfRows: 30,
          }
        });

        const items = response.data.response.body.items.item;
        items.forEach(item => {
          const locdateStr = item.locdate.toString();
          const formattedDate = locdateStr; // YYYYMMDD 형식으로 추출
          holidays[formattedDate] = {
            type: 0,
            title: item.dateName,
            year: locdateStr.slice(0, 4),
          };
        });

        console.log(`${year}년의 공휴일 데이터를 성공적으로 가져왔습니다.`);
        
      } catch (error) {
        if (error.response) {
          console.error(`${year}년의 공휴일 데이터를 가져오는 데 실패했습니다:`, error.response.data);
        } else {
          console.error(`${year}년의 요청 실패:`, error.message);
        }
        break; // 오류 발생 시 반복문 종료
      }
      
      // // 각 요청 사이에 지연을 둡니다
      // await delay(100);
    }

    const jsonData = JSON.stringify(holidays, null, 2);
    const filePath = path.join(directory, `holidays_${Date.now()}.json`);
    await fs.promises.writeFile(filePath, jsonData);
    console.log(`데이터가 ${filePath} 파일에 성공적으로 저장되었습니다`);

    return holidays;
  } catch (error) {
    if (error.response) {
      console.error('API 오류:', error.response.data);
    } else if (error.request) {
      console.error('네트워크 오류:', error.message);
    } else {
      console.error('오류:', error.message);
    }
  }
}


// Express 서버 설정
app.get('/holidays', async (req, res) => {
  try {
    const holidays = await fetchHolidayData();
    res.json(holidays);
  } catch (error) {
    res.status(500).send('서버 오류: 공휴일 데이터를 가져오는 데 실패했습니다.');
  }
});

app.listen(port, () => {
  fetchHolidayData();
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
