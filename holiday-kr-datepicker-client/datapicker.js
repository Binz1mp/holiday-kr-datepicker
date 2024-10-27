let holidaysData;

$(document).ready(function () {
  fetchHolidaysData();
});

// 서버에서 공휴일 데이터 가져오기
function fetchHolidaysData() {
  $.getJSON("http://localhost:3000/holidays", function (holidays) {
    holidaysData = holidays;
    console.log('가져온 공휴일 데이터: ', holidaysData);
    initializeDatePicker();
  }).fail(function () {
    console.error("공휴일 데이터를 가져오는 데 실패했습니다.");
  });
}

// 데이트피커 초기화 및 설정
function initializeDatePicker() {
  setKoreanLocale();
  customizeGotoToday();
  setupDatepickerOptions();
}

// 데이트피커의 한국어 로케일 설정
function setKoreanLocale() {
  $.datepicker.regional["ko"] = {
    resetText: "삭제",
    closeText: "닫기",
    prevText: "이전달",
    nextText: "다음달",
    currentText: "금일",
    monthNames: [
      "1월(JAN)",
      "2월(FEB)",
      "3월(MAR)",
      "4월(APR)",
      "5월(MAY)",
      "6월(JUN)",
      "7월(JUL)",
      "8월(AUG)",
      "9월(SEP)",
      "10월(OCT)",
      "11월(NOV)",
      "12월(DEC)",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
    weekHeader: "Wk",
    dateFormat: "yy-mm-dd",
    firstDay: 0,
    isRTL: false,
    showMonthAfterYear: true,
    yearSuffix: "",
  };
  $.datepicker.setDefaults($.datepicker.regional["ko"]);
}

// "오늘" 버튼의 동작 사용자 정의
function customizeGotoToday() {
  var oldGotoToday = $.datepicker._gotoToday;
  $.datepicker._gotoToday = function (id) {
    oldGotoToday.call(this, id);
    this._selectDate(id);
    $(id).blur();
  };
}

// 데이트피커 옵션 설정
function setupDatepickerOptions() {
  var dateOption = {
    dateFormat: "yy-mm-dd",
    showOtherMonths: true,
    showMonthAfterYear: true,
    changeYear: true,
    changeMonth: true,
    buttonImage:
      "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif",
    buttonImageOnly: true,
    buttonText: "선택",
    yearSuffix: "년",
    minDate: "-10Y",
    maxDate: "+10y",
    showButtonPanel: true,
    beforeShowDay: determineDayStyles,
  };

  $("#datepicker").datepicker(dateOption);
}

// 공휴일, 일요일, 토요일의 스타일 결정
function determineDayStyles(day) {
  var formattedDate = $.datepicker.formatDate("yymmdd", day);
  var holiday = holidaysData[formattedDate];
  var result;

  if (holiday) {
    result = [true, "date-holiday", holiday.title];
  } else {
    switch (day.getDay()) {
      case 0:
        result = [true, "date-sunday"];
        break;
      case 6:
        result = [true, "date-saturday"];
        break;
      default:
        result = [true, ""];
        break;
    }
  }

  return result;
}