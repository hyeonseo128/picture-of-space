document.getElementById('searchForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;

    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const errorDiv = document.getElementById('error');
    const resultDiv = document.getElementById('result');

    errorDiv.innerText = '';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=aYsMkgUe7CvaQr35ng0cObOlASslJcRucfzxfspZ&date=${dateStr}`);
        const data = await response.json();

        if (response.ok) {
            const title = data.title;
            const explanation = await translateToKorean(data.explanation); // 설명 번역 추가
            const photoUrl = data.url;

            resultDiv.innerHTML = `
                <h2>${title}</h2>
                <img src="${photoUrl}" alt="${title}" class="img-fluid mt-3" />
                <p>${explanation}</p>
                <a href="/" class="btn">다시 검색하기</a>
            `;
        } else {
            errorDiv.innerText = '사진을 찾을 수 없습니다.';
        }
    } catch (error) {
        errorDiv.innerText = '오류가 발생했습니다. 다시 시도하세요.';
    }
});

// 설명을 한국어로 번역하는 함수
async function translateToKorean(text) {
    const translateUrl = 'https://api.mymemory.translated.net/get'; // 무료 번역 API
    const maxChunkSize = 500; // 최대 조각 크기
    let translatedText = '';

    // 설명을 500자 이하의 조각으로 나누어 번역
    for (let i = 0; i < text.length; i += maxChunkSize) {
        const chunk = text.substring(i, i + maxChunkSize);
        const response = await fetch(`${translateUrl}?q=${encodeURIComponent(chunk)}&langpair=en|ko`);
        const data = await response.json();
        translatedText += (data.responseData.translatedText || chunk) + ' '; // 번역 결과 추가
    }

    return translatedText.trim(); // 최종 번역 결과 반환
}
