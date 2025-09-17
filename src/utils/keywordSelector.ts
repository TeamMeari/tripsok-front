const keywords = [
    "바다",
    "호텔",
    "맛집",
    "명소",
    "쇼핑",
    "카페",
    "문화",
    "역사",
    "자연",
    "레저",
    "스포츠"
];

// 날짜 기반으로 여러 개의 검색어 선택
function getDailyKeywords(count: number = 3) {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    ); // 올해 몇 번째 날인지
    
    const selectedKeywords: string[] = [];
    const maxCount = Math.min(count, keywords.length); // 요청한 개수와 전체 키워드 개수 중 작은 값
    
    for (let i = 0; i < maxCount; i++) {
      const index = (dayOfYear + i) % keywords.length;
      selectedKeywords.push(keywords[index]);
    }
    
    return selectedKeywords;
}

export { getDailyKeywords };