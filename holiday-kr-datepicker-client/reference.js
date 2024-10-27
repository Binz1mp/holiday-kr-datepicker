// 참고용 datepicker 코드
var holidays = {
    "0101":{type:0, title:"신정", year:""},
    "0301":{type:0, title:"삼일절", year:""},
    "0505":{type:0, title:"어린이날", year:""},
    "0606":{type:0, title:"현충일", year:""},
    "0815":{type:0, title:"광복절", year:""},
    "1003":{type:0, title:"개천절", year:""},
    "1009":{type:0, title:"한글날", year:""},
    "1225":{type:0, title:"크리스마스", year:""},
  
  
    "0121":{type:0, title:"설날", year:"2023"},
    "0122":{type:0, title:"설날", year:"2023"},
    "0123":{type:0, title:"설날", year:"2023"},
    "0124":{type:0, title:"설날(대체)", year:"2023"},
    "0928":{type:0, title:"추석", year:"2023"},
    "0929":{type:0, title:"추석", year:"2023"},
    "0930":{type:0, title:"추석", year:"2023"},
    "0527":{type:0, title:"석가탄신일", year:"2023"},
    "0529":{type:0, title:"석가탄신일(대체)", year:"2023"},
  
    "0209":{type:0, title:"설날", year:"2024"},
    "0210":{type:0, title:"설날", year:"2024"},
    "0211":{type:0, title:"설날", year:"2024"},
    "0212":{type:0, title:"설날(대체)", year:"2024"},
    "0410":{type:0, title:"선거", year:"2024"},
    "0916":{type:0, title:"추석", year:"2024"},
    "0917":{type:0, title:"추석", year:"2024"},
    "0918":{type:0, title:"추석", year:"2024"},
    "0515":{type:0, title:"석가탄신일", year:"2023"},
    "0506":{type:0, title:"어린이날(대체)", year:"2024"},
  
  };
  
  jQuery(function($){
      $.datepicker.regional['ko'] = {
          resetText: '삭제',
          closeText: '닫기',
          prevText: '이전달',
          nextText: '다음달',
          currentText: '금일',
          monthNames: ['1월(JAN)','2월(FEB)','3월(MAR)','4월(APR)','5월(MAY)','6월(JUN)',
          '7월(JUL)','8월(AUG)','9월(SEP)','10월(OCT)','11월(NOV)','12월(DEC)'],
          monthNamesShort: ['1월','2월','3월','4월','5월','6월',
          '7월','8월','9월','10월','11월','12월'],
          dayNames: ['일','월','화','수','목','금','토'],
          dayNamesShort: ['일','월','화','수','목','금','토'],
          dayNamesMin: ['일','월','화','수','목','금','토'],
          weekHeader: 'Wk',
          dateFormat: 'yy-mm-dd',
          firstDay: 0,
          isRTL: false,
          showMonthAfterYear: true,
          yearSuffix: '',
      };
      $.datepicker.setDefaults($.datepicker.regional['ko']);
  
      var old_goToToday = $.datepicker._gotoToday
      $.datepicker._gotoToday = function(id) {
        old_goToToday.call(this,id);
        this._selectDate(id);
        $(id).blur();
      }
  });
  
  
  var dateOption = {
      dateFormat: 'yy-mm-dd',
      showOtherMonths: true, //빈 공간에 현재월의 앞뒤월의 날짜를 표시
      showMonthAfterYear:true, // 월- 년 순서가아닌 년도 - 월 순서
      changeYear: true, //option값 년 선택 가능
      changeMonth: true, //option값  월 선택 가능                
      //showOn: "both", //button:버튼을 표시하고,버튼을 눌러야만 달력 표시 ^ both:버튼을 표시하고,버튼을 누르거나 input을 클릭하면 달력 표시  
      buttonImage: "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif", //버튼 이미지 경로
      buttonImageOnly: true, //버튼 이미지만 깔끔하게 보이게함
      buttonText: "선택", //버튼 호버 텍스트              
      yearSuffix: "년", //달력의 년도 부분 뒤 텍스트
      minDate: "-10Y", //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
      maxDate: "+10y", //최대 선택일자(+1D:하루후, -1M:한달후, -1Y:일년후)  
      showButtonPanel: true,
      //yearRange: 'c-99:c+99',
      beforeShowDay: function(day) {
          var result;
          // 포맷에 대해선 다음 참조(http://docs.jquery.com/UI/Datepicker/formatDate)
          var holiday = holidays[$.datepicker.formatDate("mmdd",day )];
          var thisYear = $.datepicker.formatDate("yy", day);
  
          // exist holiday?
          if (holiday) {
              if(thisYear == holiday.year || holiday.year == "") {
                  result =  [true, "date-holiday", holiday.title];
              }
          }
          
          if(!result) {
              switch (day.getDay()) {
                  case 0: // is sunday?
                       result = [true, "date-sunday"];
                       break;
                  case 6: // is saturday?
                       result = [true, "date-saturday"];
                       break;
                  default:
                       result = [true, ""];
                       break;
              }
          }
          
          return result;
      }
  }