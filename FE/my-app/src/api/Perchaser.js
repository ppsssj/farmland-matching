// 추후 fetch 또는 axios 요청으로 변경 가능
export const getMatchingPersonData = async () => {
  return [
    {
      id: 1,
      name:"박짱구",
      age: "25",
      sex: "남성",
      address: "경기도 수원시",
      callNumber: "010-1234-5678", 
      presentation:"자기 소개서",
      interest:"관심 작물/농업 분야",
      suggest:"추천인 정보",
      video:"자기소개 영상",
      expereince:"농업경험",
      skill:"기술/장비/특기",
      want:"희망거래",
      detail: {
        yellow: { 
          basic:"농업기초과정 수료증",
          smart:"스마트 팜 관련 교육 수료증",
          teach:"농업기술센터 교육 수료증",
          country:"도시 농업 관리사",
          friendly:"유기농업기능사",
          quality:"농산물 품질 관리사",
          mashine:"농업 기계 기사",
          horticulture:"시설 원예 기사",
        },
        green: { 
         license:"농기계 운전 면허",
         educate:"유기농 인증 교육",
        },
         grey: { 
         start:"귀농 창업 경진 대회 수상이력",
         region:"지역 농업 공모전 참가",
         group:"농업 동아리/단체 활동"
        },
      },
    },

        {
      id: 2,
      name:"탁훈이",
      age: "27",
      sex: "여성",
      address: "경기도 군포시",
      callNumber: "010-3232-2355", 
      presentation:"자기 소개서",
      interest:"관심 작물/농업 분야",
      suggest:"추천인 정보",
      video:"자기소개 영상",
      expereince:"농업경험",
      skill:"기술/장비/특기",
      want:"희망거래",
      detail: {
        yellow: { //수료증
          basic:"농업기초과정 수료증",
          smart:"스마트 팜 관련 교육 수료증",
          country:"도시 농업 관리사",
          friendly:"유기농업기능사",
          mashine:"농업 기계 기사",
        },
        green: { 
         license:"농기계 운전 면허",
        },
         grey: { 
        group:"농업 동아리/단체 활동"
        },
      },
    },
        {
      id: 3,
      name:"이철수",
      age: "23",
      sex: "남성",
      address: "인천",
      callNumber: "010-2311-5457", 
      presentation:"자기 소개서",
      interest:"관심 작물/농업 분야",
      suggest:"추천인 정보",
      video:"자기소개 영상",
      expereince:"농업경험",
      skill:"기술/장비/특기",
      want:"희망거래",
      detail: {
        yellow: { 
          quality:"농산물 품질 관리사",
          mashine:"농업 기계 기사",
          horticulture:"시설 원예 기사",
        },
        green: { 
        },
         grey: { 
         region:"지역 농업 공모전 참가",
         group:"농업 동아리/단체 활동"
        },
      },
    },
        {
      id: 4,
      name:"전유리",
      age: "22",
      sex: "여성",
      address: "서울 강남",
      callNumber: "010-4566-3678", 
      presentation:"자기 소개서",
      interest:"관심 작물/농업 분야",
      suggest:"추천인 정보",
      video:"자기소개 영상",
      expereince:"농업경험",
      skill:"기술/장비/특기",
      want:"희망거래",
      detail: {
        yellow: {
          basic:"농업기초과정 수료증",
          smart:"스마트 팜 관련 교육 수료증",
          teach:"농업기술센터 교육 수료증",
          horticulture:"시설 원예 기사",
        },
        green: { 
         educate:"유기농 인증 교육",
        },
         grey: { 
         start:"귀농 창업 경진 대회 수상이력",
         region:"지역 농업 공모전 참가",
         group:"농업 동아리/단체 활동"
        },
      },
    },
       {
      id: 5,
      name:"고수지",
      age: "26",
      sex: "여성",
      address: "충청남도 안면읍",
      callNumber: "010-4993-4340", 
      presentation:"자기 소개서",
      interest:"관심 작물/농업 분야",
      suggest:"추천인 정보",
      video:"자기소개 영상",
      expereince:"농업경험",
      skill:"기술/장비/특기",
      want:"희망거래",
      detail: {
        yellow: { 
          basic:"농업기초과정 수료증",
          smart:"스마트 팜 관련 교육 수료증",
          friendly:"유기농업기능사",
          quality:"농산물 품질 관리사",
          horticulture:"시설 원예 기사",
        },
        green: { 
         educate:"유기농 인증 교육",
        },
         grey: { 
         start:"귀농 창업 경진 대회 수상이력",
         region:"지역 농업 공모전 참가",
         group:"농업 동아리/단체 활동"
        },
      },
    },
  ];
};

