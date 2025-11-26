ClickBattle.init("SHU"); // 자기 닉네임



/* --- 1. SOUND ENGINE (효과음) --- */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'tap') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
        gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'full') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(600, now); osc.frequency.linearRampToValueAtTime(1200, now + 0.25);
        gain.gain.setValueAtTime(0.3, now); gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    }
}

/* --- 2. LINKS (정보 페이지) --- */
const INFO_LINKS = {
    // 기질 (티스토리)
    "Choleric": "https://makedon.tistory.com/82",
    "Sanguine": "https://makedon.tistory.com/82",
    "Melancholic": "https://makedon.tistory.com/82",
    "Phlegmatic": "https://makedon.tistory.com/82",
    // 에니어그램 (나무위키)
    "1": "https://namu.wiki/w/에니어그램#s-3.1.1", "2": "https://namu.wiki/w/에니어그램#s-3.1.2",
    "3": "https://namu.wiki/w/에니어그램#s-3.1.3", "4": "https://namu.wiki/w/에니어그램#s-3.1.4",
    "5": "https://namu.wiki/w/에니어그램#s-3.1.5", "6": "https://namu.wiki/w/에니어그램#s-3.1.6",
    "7": "https://namu.wiki/w/에니어그램#s-3.1.7", "8": "https://namu.wiki/w/에니어그램#s-3.1.8",
    "9": "https://namu.wiki/w/에니어그램#s-3.1.9"
};

/* --- 3. CHARACTER LIST (단일 리스트로 통합하여 오류 방지) --- */
const CHARACTERS = [
    // ISTJ
    { name: "헤르미온느", source: "해리포터", img: "https://placehold.co/400x600/7f4a4a/FFF?text=Hermione", mbti: "ISTJ", bestTrait: "J", enneagram: "1w2", temp: "Melancholic", desc: "규칙을 준수하지만 친구를 위해 헌신하는 모범생" },
    { name: "베지터", source: "드래곤 볼", img: "https://placehold.co/400x600/1a237e/FFF?text=Vegeta", mbti: "ISTJ", bestTrait: "T", enneagram: "8w9", temp: "Choleric", desc: "자존심이 강하고 끊임없이 노력하는 엘리트 전사" },
    { name: "강북구", source: "술꾼도시여자들", img: "https://placehold.co/400x600/5d4037/FFF?text=Kang", mbti: "ISTJ", bestTrait: "S", enneagram: "6w5", temp: "Phlegmatic", desc: "현실적인 문제 해결 능력이 뛰어난 든든한 조력자" },
    { name: "기유", source: "귀멸의 칼날", img: "https://placehold.co/400x600/0d47a1/FFF?text=Giyu", mbti: "ISTJ", bestTrait: "I", enneagram: "1w9", temp: "Melancholic", desc: "말보다는 행동으로 증명하는 과묵한 의리파" },
    { name: "이이다 텐야", source: "나의 히어로 아카데미아", img: "https://placehold.co/400x600/01579b/FFF?text=Iida", mbti: "ISTJ", bestTrait: "J", enneagram: "1w2", temp: "Choleric", desc: "규율과 질서를 목숨처럼 여기는 성실한 반장" },
    { name: "네지", source: "나루토", img: "https://placehold.co/400x600/eee/333?text=Neji", mbti: "ISTJ", bestTrait: "T", enneagram: "5w6", temp: "Melancholic", desc: "운명에 맞서며 냉철하게 상황을 분석하는 천재" },

    // ISFJ
    { name: "캡틴 아메리카", source: "마블", img: "https://placehold.co/400x600/01579b/FFF?text=Captain", mbti: "ISFJ", bestTrait: "J", enneagram: "1w9", temp: "Phlegmatic", desc: "고결한 도덕성과 희생정신을 가진 리더" },
    { name: "요르 포저", source: "스파이 패밀리", img: "https://placehold.co/400x600/b71c1c/FFF?text=Yor", mbti: "ISFJ", bestTrait: "S", enneagram: "9w1", temp: "Phlegmatic", desc: "평범한 일상을 지키고 싶은 순수한 암살자" },
    { name: "신데렐라", source: "디즈니", img: "https://placehold.co/400x600/81d4fa/FFF?text=Cinderella", mbti: "ISFJ", bestTrait: "F", enneagram: "9w1", temp: "Phlegmatic", desc: "어려움 속에서도 친절함을 잃지 않는 외유내강" },
    { name: "샘와이즈", source: "반지의 제왕", img: "https://placehold.co/400x600/33691e/FFF?text=Sam", mbti: "ISFJ", bestTrait: "I", enneagram: "6w7", temp: "Phlegmatic", desc: "끝까지 곁을 지키는 충직함과 인내심의 아이콘" },
    { name: "마지 심슨", source: "심슨 가족", img: "https://placehold.co/400x600/29b6f6/FFF?text=Marge", mbti: "ISFJ", bestTrait: "F", enneagram: "2w1", temp: "Phlegmatic", desc: "가족을 위해 모든 것을 포용하는 헌신적인 어머니" },

    // INFJ
    { name: "엘사", source: "겨울왕국", img: "https://placehold.co/400x600/4fc3f7/FFF?text=Elsa", mbti: "INFJ", bestTrait: "I", enneagram: "4w5", temp: "Melancholic", desc: "내면의 힘을 두려워하다 결국 받아들이는 여왕" },
    { name: "데쿠", source: "나의 히어로 아카데미아", img: "https://placehold.co/400x600/1b5e20/FFF?text=Deku", mbti: "INFJ", bestTrait: "F", enneagram: "6w5", temp: "Melancholic", desc: "모두를 구하고 싶어하는 분석적인 히어로" },
    { name: "덤블도어", source: "해리포터", img: "https://placehold.co/400x600/4a148c/FFF?text=Dumbledore", mbti: "INFJ", bestTrait: "N", enneagram: "5w4", temp: "Phlegmatic", desc: "먼 미래를 내다보고 큰 그림을 그리는 현자" },
    { name: "아라곤", source: "반지의 제왕", img: "https://placehold.co/400x600/212121/FFF?text=Aragorn", mbti: "INFJ", bestTrait: "J", enneagram: "1w9", temp: "Melancholic", desc: "운명을 받아들이고 세상을 이끄는 고독한 왕" },
    { name: "이타치", source: "나루토", img: "https://placehold.co/400x600/b71c1c/FFF?text=Itachi", mbti: "INFJ", bestTrait: "T", enneagram: "5w4", temp: "Melancholic", desc: "모든 것을 희생하며 그림자 속에서 평화를 지킨 닌자" },

    // INTJ
    { name: "배트맨", source: "DC", img: "https://placehold.co/400x600/212121/FFF?text=Batman", mbti: "INTJ", bestTrait: "J", enneagram: "1w9", temp: "Melancholic", desc: "범죄 없는 세상을 위해 어둠을 자처한 전략가" },
    { name: "닥터 스트레인지", source: "마블", img: "https://placehold.co/400x600/311b92/FFF?text=Strange", mbti: "INTJ", bestTrait: "N", enneagram: "5w6", temp: "Choleric", desc: "최적의 미래를 계산해내는 오만하지만 유능한 마법사" },
    { name: "웬즈데이", source: "웬즈데이", img: "https://placehold.co/400x600/000000/FFF?text=Wednesday", mbti: "INTJ", bestTrait: "T", enneagram: "5w4", temp: "Melancholic", desc: "감정에 휘둘리지 않고 진실을 꿰뚫는 독설가" },
    { name: "스네이프", source: "해리포터", img: "https://placehold.co/400x600/1a1a1a/FFF?text=Snape", mbti: "INTJ", bestTrait: "I", enneagram: "4w5", temp: "Melancholic", desc: "오해를 받더라도 끝까지 목표를 완수하는 순정파" },
    { name: "를르슈", source: "코드 기어스", img: "https://placehold.co/400x600/311b92/FFF?text=Lelouch", mbti: "INTJ", bestTrait: "J", enneagram: "1w2", temp: "Choleric", desc: "세상을 부수고 다시 창조하려는 혁명가" },

    // ISTP
    { name: "강새벽", source: "오징어 게임", img: "https://placehold.co/400x600/004d40/FFF?text=SaeByeok", mbti: "ISTP", bestTrait: "S", enneagram: "8w9", temp: "Choleric", desc: "생존을 위해 누구보다 현실적으로 판단하는 승부사" },
    { name: "리바이", source: "진격의 거인", img: "https://placehold.co/400x600/263238/FFF?text=Levi", mbti: "ISTP", bestTrait: "T", enneagram: "6w5", temp: "Choleric", desc: "말보다는 압도적인 실력으로 증명하는 인류 최강" },
    { name: "슈렉", source: "슈렉", img: "https://placehold.co/400x600/558b2f/FFF?text=Shrek", mbti: "ISTP", bestTrait: "I", enneagram: "9w8", temp: "Phlegmatic", desc: "혼자만의 늪을 사랑하지만 은근히 정이 많은 오거" },
    { name: "호크아이", source: "마블", img: "https://placehold.co/400x600/3e2723/FFF?text=Hawkeye", mbti: "ISTP", bestTrait: "P", enneagram: "6w5", temp: "Phlegmatic", desc: "복잡한 건 딱 질색, 깔끔하게 임무를 처리하는 요원" },
    { name: "조로", source: "원피스", img: "https://placehold.co/400x600/004d40/FFF?text=Zoro", mbti: "ISTP", bestTrait: "T", enneagram: "8w9", temp: "Choleric", desc: "세계 최강을 꿈꾸며 묵묵히 수련하는 검사" },

    // ISFP
    { name: "해리 포터", source: "해리포터", img: "https://placehold.co/400x600/b71c1c/FFF?text=Harry", mbti: "ISFP", bestTrait: "F", enneagram: "9w8", temp: "Phlegmatic", desc: "용기와 직관으로 운명에 맞서는 선택받은 자" },
    { name: "일레븐", source: "기묘한 이야기", img: "https://placehold.co/400x600/f48fb1/FFF?text=Eleven", mbti: "ISFP", bestTrait: "S", enneagram: "4w5", temp: "Melancholic", desc: "말보다는 행동과 눈빛으로 감정을 표현하는 소녀" },
    { name: "짱구", source: "짱구", img: "https://placehold.co/400x600/ff5252/FFF?text=Jjanggu", mbti: "ISFP", bestTrait: "P", enneagram: "9w1", temp: "Sanguine", desc: "나만의 예술적 감각으로 세상을 즐기는 자유인" },
    { name: "젠이츠", source: "귀멸의 칼날", img: "https://placehold.co/400x600/fbc02d/FFF?text=Zenitsu", mbti: "ISFP", bestTrait: "I", enneagram: "6w7", temp: "Melancholic", desc: "겁도 많고 눈물도 많지만, 결정적인 순간에는 최강!" },
    { name: "하울", source: "하울의 움직이는 성", img: "https://placehold.co/400x600/f06292/FFF?text=Howl", mbti: "ISFP", bestTrait: "N", enneagram: "4w3", temp: "Melancholic", desc: "아름다움을 추구하며 자유롭게 하늘을 나는 마법사" },

    // INFP
    { name: "조커(아서)", source: "조커", img: "https://placehold.co/400x600/b71c1c/FFF?text=Joker", mbti: "INFP", bestTrait: "F", enneagram: "4w5", temp: "Melancholic", desc: "세상에 이해받지 못해 비극으로 치닫는 몽상가" },
    { name: "루크 스카이워커", source: "스타워즈", img: "https://placehold.co/400x600/e0f7fa/000?text=Luke", mbti: "INFP", bestTrait: "N", enneagram: "9w1", temp: "Phlegmatic", desc: "보이지 않는 힘과 이상을 믿는 은하계의 희망" },
    { name: "가오나시", source: "센과 치히로의 행방불명", img: "https://placehold.co/400x600/212121/FFF?text=NoFace", mbti: "INFP", bestTrait: "I", enneagram: "4w3", temp: "Phlegmatic", desc: "마음을 표현하는 게 서툴러 외로운 영혼" },
    { name: "슬픔이", source: "인사이드 아웃", img: "https://placehold.co/400x600/1976d2/FFF?text=Sadness", mbti: "INFP", bestTrait: "P", enneagram: "4w5", temp: "Melancholic", desc: "타인의 슬픔을 가장 깊이 공감하고 치유하는 존재" },
    { name: "완다 막시모프", source: "마블", img: "https://placehold.co/400x600/b71c1c/FFF?text=Wanda", mbti: "INFP", bestTrait: "F", enneagram: "4w5", temp: "Melancholic", desc: "상실의 아픔을 견디며 현실까지 왜곡하는 강력한 마녀" },

    // INTP
    { name: "L", source: "데스노트", img: "https://placehold.co/400x600/eceff1/000?text=L", mbti: "INTP", bestTrait: "T", enneagram: "5w4", temp: "Phlegmatic", desc: "감정을 배제하고 논리로만 범인을 쫓는 천재 탐정" },
    { name: "뚱이", source: "스폰지밥", img: "https://placehold.co/400x600/f48fb1/FFF?text=Patrick", mbti: "INTP", bestTrait: "P", enneagram: "9w8", temp: "Phlegmatic", desc: "가끔씩 철학적인 명언을 날리는 미스터리한 불가사리" },
    { name: "셜록 홈즈", source: "셜록", img: "https://placehold.co/400x600/37474f/FFF?text=Sherlock", mbti: "INTP", bestTrait: "N", enneagram: "5w6", temp: "Melancholic", desc: "사소한 단서에서 거대한 추론을 이끌어내는 탐정" },
    { name: "켄마", source: "하이큐!!", img: "https://placehold.co/400x600/ffab00/FFF?text=Kenma", mbti: "INTP", bestTrait: "I", enneagram: "5w4", temp: "Phlegmatic", desc: "귀찮지만 지는 건 싫어. 조용히 판을 조종하는 뇌" },
    { name: "진", source: "방탄소년단", img: "https://placehold.co/400x600/f8bbd0/FFF?text=Jin", mbti: "INTP", bestTrait: "P", enneagram: "9w8", temp: "Phlegmatic", desc: "엉뚱하고 유쾌하지만 속은 깊은 맏형" },

    // ESTP
    { name: "소닉", source: "소닉", img: "https://placehold.co/400x600/2962ff/FFF?text=Sonic", mbti: "ESTP", bestTrait: "E", enneagram: "7w8", temp: "Sanguine", desc: "한시도 가만히 있지 못하는 초음속의 장난꾸러기" },
    { name: "토르", source: "마블", img: "https://placehold.co/400x600/d32f2f/FFF?text=Thor", mbti: "ESTP", bestTrait: "S", enneagram: "7w8", temp: "Choleric", desc: "복잡한 건 딱 질색! 망치부터 나가는 천둥의 신" },
    { name: "한 솔로", source: "스타워즈", img: "https://placehold.co/400x600/3e2723/FFF?text=HanSolo", mbti: "ESTP", bestTrait: "P", enneagram: "8w7", temp: "Choleric", desc: "확률 따윈 안 믿어! 위험할수록 빛나는 임기응변" },
    { name: "마우이", source: "모아나", img: "https://placehold.co/400x600/006064/FFF?text=Maui", mbti: "ESTP", bestTrait: "T", enneagram: "3w2", temp: "Sanguine", desc: "자신감 넘치지만 칭찬에 약한 귀여운 반신반인" },
    { name: "이노스케", source: "귀멸의 칼날", img: "https://placehold.co/400x600/424242/FFF?text=Inosuke", mbti: "ESTP", bestTrait: "S", enneagram: "8w7", temp: "Choleric", desc: "저돌맹진! 생각보다 몸이 먼저 나가는 야생의 전사" },

    // ESFP
    { name: "루피", source: "원피스", img: "https://placehold.co/400x600/f44336/FFF?text=Luffy", mbti: "ESFP", bestTrait: "E", enneagram: "7w8", temp: "Sanguine", desc: "동료와 고기만 있으면 어디든 가는 무한 긍정 선장" },
    { name: "성기훈", source: "오징어 게임", img: "https://placehold.co/400x600/2e7d32/FFF?text=GiHun", mbti: "ESFP", bestTrait: "F", enneagram: "7w6", temp: "Sanguine", desc: "극한 상황에서도 인간미를 잃지 않는 따뜻한 오지랖퍼" },
    { name: "할리 퀸", source: "수어사이드 스쿼드", img: "https://placehold.co/400x600/ec407a/FFF?text=Harley", mbti: "ESFP", bestTrait: "P", enneagram: "7w8", temp: "Sanguine", desc: "어디로 튈지 모르는 매력적이고 위험한 악동" },
    { name: "나루토", source: "나루토", img: "https://placehold.co/400x600/ff9800/FFF?text=Naruto", mbti: "ESFP", bestTrait: "S", enneagram: "3w2", temp: "Sanguine", desc: "몸으로 부딪히며 성장하고 인정받고 싶어 하는 노력파" },
    { name: "포", source: "쿵푸 팬더", img: "https://placehold.co/400x600/212121/FFF?text=Po", mbti: "ESFP", bestTrait: "F", enneagram: "7w6", temp: "Sanguine", desc: "먹는 게 제일 좋아! 긍정의 힘으로 쿵푸 마스터가 된 팬더" },

    // ENFP
    { name: "스파이더맨", source: "마블", img: "https://placehold.co/400x600/c62828/FFF?text=Spidey", mbti: "ENFP", bestTrait: "E", enneagram: "6w7", temp: "Sanguine", desc: "끊임없이 수다를 떨며 도시를 지키는 친절한 이웃" },
    { name: "라푼젤", source: "라푼젤", img: "https://placehold.co/400x600/ba68c8/FFF?text=Rapunzel", mbti: "ENFP", bestTrait: "N", enneagram: "7w6", temp: "Sanguine", desc: "세상 밖이 궁금해 견딜 수 없는 호기심 많은 소녀" },
    { name: "조이", source: "인사이드 아웃", img: "https://placehold.co/400x600/fff176/000?text=Joy", mbti: "ENFP", bestTrait: "F", enneagram: "7w6", temp: "Sanguine", desc: "어떤 상황에서도 긍정을 찾아내는 행복 전도사" },
    { name: "올라프", source: "겨울왕국", img: "https://placehold.co/400x600/e1f5fe/000?text=Olaf", mbti: "ENFP", bestTrait: "P", enneagram: "7w6", temp: "Sanguine", desc: "엉뚱한 상상을 현실로 믿는 순수하고 따뜻한 눈사람" },
    { name: "아냐 포저", source: "스파이 패밀리", img: "https://placehold.co/400x600/f8bbd0/FFF?text=Anya", mbti: "ENFP", bestTrait: "N", enneagram: "7w6", temp: "Sanguine", desc: "와쿠와쿠! 사람의 마음을 읽으며 모험을 즐기는 초능력자" },

    // ENTP
    { name: "아이언맨", source: "마블", img: "https://placehold.co/400x600/b71c1c/FFF?text=IronMan", mbti: "ENTP", bestTrait: "T", enneagram: "7w8", temp: "Choleric", desc: "천재적인 두뇌와 자신감으로 세상을 구하는 혁신가" },
    { name: "데드풀", source: "데드풀", img: "https://placehold.co/400x600/d32f2f/FFF?text=Deadpool", mbti: "ENTP", bestTrait: "E", enneagram: "7w8", temp: "Sanguine", desc: "시도 때도 없이 농담을 던지는 유쾌한 안티 히어로" },
    { name: "잭 스패로우", source: "캐리비안의 해적", img: "https://placehold.co/400x600/5d4037/FFF?text=Jack", mbti: "ENTP", bestTrait: "P", enneagram: "7w8", temp: "Sanguine", desc: "교묘한 말솜씨와 임기응변으로 위기를 탈출하는 선장" },
    { name: "조커(다크나이트)", source: "배트맨", img: "https://placehold.co/400x600/2e7d32/FFF?text=Joker", mbti: "ENTP", bestTrait: "N", enneagram: "8w7", temp: "Choleric", desc: "계획 없는 혼돈 그 자체를 즐기며 사회를 비웃는 악당" },
    { name: "고조 사토루", source: "주술회전", img: "https://placehold.co/400x600/82b1ff/FFF?text=Gojo", mbti: "ENTP", bestTrait: "T", enneagram: "7w8", temp: "Sanguine", desc: "천상천하 유아독존. 압도적인 힘과 장난기를 겸비한 최강자" },

    // ESTJ
    { name: "집게사장", source: "스폰지밥", img: "https://placehold.co/400x600/ef5350/FFF?text=Krabs", mbti: "ESTJ", bestTrait: "S", enneagram: "3w4", temp: "Choleric", desc: "돈과 효율을 최우선으로 생각하는 현실적인 경영자" },
    { name: "바쿠고", source: "나의 히어로 아카데미아", img: "https://placehold.co/400x600/ff9800/FFF?text=Bakugo", mbti: "ESTJ", bestTrait: "J", enneagram: "8w7", temp: "Choleric", desc: "1등이 아니면 의미 없어. 승리에 집착하는 완벽주의자" },
    { name: "레아 공주", source: "스타워즈", img: "https://placehold.co/400x600/f5f5f5/000?text=Leia", mbti: "ESTJ", bestTrait: "T", enneagram: "8w9", temp: "Choleric", desc: "위기 상황에서 감정보다 대의를 위해 지휘하는 리더" },
    { name: "퉁퉁이", source: "도라에몽", img: "https://placehold.co/400x600/e65100/FFF?text=Gian", mbti: "ESTJ", bestTrait: "E", enneagram: "8w7", temp: "Choleric", desc: "내 것은 내 것, 네 것도 내 것! 거칠어 보이지만 의리 하나는 끝내주는 골목대장." },
    { name: "마키마", source: "체인소맨", img: "https://placehold.co/400x600/d32f2f/FFF?text=Makima", mbti: "ESTJ", bestTrait: "T", enneagram: "8w9", temp: "Choleric", desc: "목적을 위해서라면 무엇이든 이용하는 냉혹한 지배자" },

    // ESFJ
    { name: "우디", source: "토이 스토리", img: "https://placehold.co/400x600/ffb74d/000?text=Woody", mbti: "ESFJ", bestTrait: "J", enneagram: "6w5", temp: "Phlegmatic", desc: "내 친구들은 내가 챙긴다! 책임감 넘치는 보안관" },
    { name: "스폰지밥", source: "스폰지밥", img: "https://placehold.co/400x600/fff176/000?text=Spongebob", mbti: "ESFJ", bestTrait: "E", enneagram: "2w3", temp: "Sanguine", desc: "월요일 좋아! 모두에게 사랑과 관심을 퍼붓는 긍정왕" },
    { name: "안나", source: "겨울왕국", img: "https://placehold.co/400x600/ec407a/FFF?text=Anna", mbti: "ESFJ", bestTrait: "F", enneagram: "2w1", temp: "Sanguine", desc: "언니를 위해서라면 불길에도 뛰어드는 헌신의 아이콘" },
    { name: "사쿠라", source: "나루토", img: "https://placehold.co/400x600/f06292/FFF?text=Sakura", mbti: "ESFJ", bestTrait: "S", enneagram: "6w7", temp: "Melancholic", desc: "동료들을 위해 뒤에서 묵묵히 지원하는 든든한 힐러" },
    { name: "최애의 아이", source: "최애의 아이", img: "https://placehold.co/400x600/f50057/FFF?text=Ai", mbti: "ESFJ", bestTrait: "E", enneagram: "3w2", temp: "Sanguine", desc: "모두에게 사랑받기 위해 완벽한 거짓말을 연기하는 아이돌" },

    // ENFJ
    { name: "주디 홉스", source: "주토피아", img: "https://placehold.co/400x600/7986cb/FFF?text=Judy", mbti: "ENFJ", bestTrait: "J", enneagram: "1w2", temp: "Sanguine", desc: "누구나 무엇이든 될 수 있어! 편견에 맞서는 열혈 경찰" },
    { name: "올마이트", source: "나의 히어로 아카데미아", img: "https://placehold.co/400x600/fdd835/000?text=AllMight", mbti: "ENFJ", bestTrait: "E", enneagram: "2w3", temp: "Sanguine", desc: "내가 왔다! 존재만으로 희망을 주는 평화의 상징" },
    { name: "탄지로", source: "귀멸의 칼날", img: "https://placehold.co/400x600/004d40/FFF?text=Tanjiro", mbti: "ENFJ", bestTrait: "F", enneagram: "2w1", temp: "Melancholic", desc: "적에게도 자비를 베푸는 무한한 다정함의 검사" },
    { name: "모아나", source: "모아나", img: "https://placehold.co/400x600/e65100/FFF?text=Moana", mbti: "ENFJ", bestTrait: "N", enneagram: "8w7", temp: "Sanguine", desc: "정해진 운명을 거부하고 새로운 길을 개척하는 리더" },
    { name: "원더우먼", source: "DC", img: "https://placehold.co/400x600/b71c1c/FFF?text=WonderWoman", mbti: "ENFJ", bestTrait: "E", enneagram: "2w1", temp: "Choleric", desc: "사랑과 정의의 이름으로! 세상을 구하기 위해 앞장서는 전사" },

    // ENTJ
    { name: "볼드모트", source: "해리포터", img: "https://placehold.co/400x600/263238/FFF?text=Voldemort", mbti: "ENTJ", bestTrait: "J", enneagram: "3w4", temp: "Choleric", desc: "위대함엔 선악이 없어. 압도적인 힘으로 지배하려는 야망가" },
    { name: "에르빈", source: "진격의 거인", img: "https://placehold.co/400x600/fbc02d/000?text=Erwin", mbti: "ENTJ", bestTrait: "T", enneagram: "1w9", temp: "Choleric", desc: "인류의 미래를 위해 비정한 결단도 서슴지 않는 사령관" },
    { name: "고문영", source: "사이코지만 괜찮아", img: "https://placehold.co/400x600/c2185b/FFF?text=MoonYoung", mbti: "ENTJ", bestTrait: "N", enneagram: "4w3", temp: "Choleric", desc: "남들 시선 상관없이 원하는 건 쟁취하는 동화 작가" },
    { name: "아즈라", source: "아바타", img: "https://placehold.co/400x600/d32f2f/FFF?text=Azula", mbti: "ENTJ", bestTrait: "E", enneagram: "3w4", temp: "Choleric", desc: "완벽하지 않으면 의미 없어. 천재성과 공포로 지배하는 공주" },
    { name: "미란다 프리슬리", source: "The Devil Wears Prada", img: "https://placehold.co/400x600/212121/FFF?text=Miranda", mbti: "ENTJ", bestTrait: "T", enneagram: "8w7", temp: "Choleric", desc: "그게 최선입니까? 무능함은 용서하지 않는, 패션계의 냉혹하고 완벽한 군주." }
];

const defaultChar = { name: "데이터 분석 중", source: "System", img: "https://placehold.co/400x600?text=Unknown", mbti: "XXXX", enneagram: "?w?", temp: "Unknown", desc: "일치하는 데이터 패턴을 찾을 수 없습니다." };

/* --- 4. QUESTIONS (20 items) --- */
const questions = [
    { text: "사람들과 어울리고 나면 에너지가 충전되는 느낌이다.", type: "EI", dir: 1 },
    { text: "혼자만의 시간을 가져야 피로가 풀린다.", type: "EI", dir: -1 },
    { text: "새로운 사람에게 먼저 말을 거는 게 어렵지 않다.", type: "EI", dir: 1 },
    { text: "대화할 때 말하기보다 주로 듣는 편이다.", type: "EI", dir: -1 },
    { text: "눈에 보이는 사실과 경험을 중요하게 생각한다.", type: "SN", dir: 1 },
    { text: "미래의 가능성이나 '만약에'라는 상상을 즐긴다.", type: "SN", dir: -1 },
    { text: "구체적인 데이터와 수치를 신뢰한다.", type: "SN", dir: 1 },
    { text: "비유나 은유적인 표현을 자주 사용한다.", type: "SN", dir: -1 },
    { text: "결정을 내릴 때 논리적인 원칙이 가장 중요하다.", type: "TF", dir: 1 },
    { text: "상대방의 기분이나 상황을 먼저 고려하는 편이다.", type: "TF", dir: -1 },
    { text: "비판적인 분석을 즐기는 편이다.", type: "TF", dir: 1 },
    { text: "목표 달성이 사람 관계보다 우선이다.", type: "TF", dir: 1 },
    { text: "여행 갈 때 계획을 세세하게 짜는 편이다.", type: "JP", dir: 1 },
    { text: "상황에 따라 즉흥적으로 행동하는 것이 편하다.", type: "JP", dir: -1 },
    { text: "결론을 빨리 내리고 마무리지어야 마음이 편하다.", type: "JP", dir: 1 },
    { text: "마감 기한이 임박해야 집중력이 발휘된다.", type: "JP", dir: -1 },

    // Enneagram & Temperament Mix (17-20)
    { text: "성공과 성취를 통해 인정받는 것이 무엇보다 중요하다.", type: "VAL", dir: 1 }, // 성취/주도 (Enneagram 3, 8 / Choleric)
    { text: "나만의 독특한 개성과 감정을 표현하는 것이 중요하다.", type: "VAL", dir: 2 }, // 개성/감성 (Enneagram 4 / Melancholic)
    { text: "갈등을 피하고 평화롭고 안정적인 상태를 유지하고 싶다.", type: "VAL", dir: 3 }, // 평화/안정 (Enneagram 9 / Phlegmatic)
    { text: "새로운 즐거움과 모험을 찾아다니는 것이 삶의 낙이다.", type: "VAL", dir: 4 }  // 낙천/모험 (Enneagram 7 / Sanguine)
];

/* --- 5. GAME ENGINE --- */
const game = {
    state: {
        scores: { EI: 0, SN: 0, TF: 0, JP: 0 },
        tapCounts: { EI: 0, SN: 0, TF: 0, JP: 0 },
        extraScores: { Choleric: 0, Melancholic: 0, Phlegmatic: 0, Sanguine: 0 },
        qIdx: 0, totalClicks: 0, currentCharge: 0, unlockClicks: 0, resultProfile: {}, targetLink: ""
    },
    constants: { CHARGE_MAX: 20, UNLOCK_TARGET: 20, LINK_UNLOCK_TARGET: 20 },

    initElements: function () {
        this.elements = {
            sections: { start: document.getElementById('section-start'), test: document.getElementById('section-test'), unlock: document.getElementById('section-unlock'), final: document.getElementById('section-final') },
            qNum: document.getElementById('q-num'), totalProgress: document.getElementById('total-progress'),
            question: document.getElementById('question-text'),
            chargeBar: document.getElementById('charge-bar'), chargePercent: document.getElementById('charge-percent'), chargeMsg: document.getElementById('charge-msg'),
            totalClicks: document.getElementById('total-clicks'),
            unlockMbti: document.getElementById('unlock-mbti'), unlockEnnea: document.getElementById('unlock-ennea'), unlockTemp: document.getElementById('unlock-temp'),
            pdbGauge: document.getElementById('pdb-gauge'), pdbMsg: document.getElementById('pdb-msg'),
            finalName: document.getElementById('final-name'), finalSource: document.getElementById('final-source'), finalDesc: document.getElementById('final-desc'), matchRate: document.getElementById('match-rate'), finalImg: document.getElementById('final-img'),
            tagMbti: document.getElementById('tag-mbti'), tagEnnea: document.getElementById('tag-ennea'), tagTemp: document.getElementById('tag-temp'),
            btnLinkUnlock: document.getElementById('btn-link-unlock'), linkMsg: document.getElementById('link-msg'), linkFill: document.getElementById('link-fill'),
            buttons: document.querySelectorAll('.tap-btn')
        };
    },

    start: function () { this.initElements(); this.resetState(); playSound('start'); this.showSection('test'); this.loadQuestion(); },
    resetState: function () { this.state = { scores: { EI: 0, SN: 0, TF: 0, JP: 0 }, tapCounts: { EI: 0, SN: 0, TF: 0, JP: 0 }, extraScores: { Choleric: 0, Melancholic: 0, Phlegmatic: 0, Sanguine: 0 }, qIdx: 0, totalClicks: 0, currentCharge: 0, unlockClicks: 0, resultProfile: {}, targetLink: "" }; },
    showSection: function (id) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(el => el.classList.remove('active'));
        const target = document.getElementById('section-' + id);
        if (target) target.classList.add('active');
    },

    loadQuestion: function () {
        if (this.state.qIdx >= questions.length) { this.analyzeProfile(); return; }
        this.state.currentCharge = 0; this.updateChargeUI();
        this.elements.question.innerText = questions[this.state.qIdx].text;
        this.elements.qNum.innerText = `진행 상황: ${this.state.qIdx + 1} / ${questions.length}`;
        this.elements.totalProgress.style.width = ((this.state.qIdx / questions.length) * 100) + "%";
        this.elements.buttons.forEach(btn => { btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; btn.style.transform = "scale(1)"; });
        this.elements.chargeMsg.innerHTML = "YES와 NO를 섞어 <strong>총 20번</strong> 두드리세요."; this.elements.chargeMsg.style.color = "#aaa";
    },

    handleTap: function (val) {
        if (this.state.currentCharge >= this.constants.CHARGE_MAX) return;
        this.state.totalClicks++; this.state.currentCharge++;
        let q = questions[this.state.qIdx];

        if (q.type === "VAL") {
            if (val > 0) {
                if (q.dir === 1) this.state.extraScores.Choleric += 2;
                if (q.dir === 2) this.state.extraScores.Melancholic += 2;
                if (q.dir === 3) this.state.extraScores.Phlegmatic += 2;
                if (q.dir === 4) this.state.extraScores.Sanguine += 2;
            }
        } else {
            this.state.scores[q.type] += (q.dir * val);
            this.state.tapCounts[q.type]++;
        }

        this.updateChargeUI(); playSound('tap'); if (navigator.vibrate) navigator.vibrate(5);
        if (this.state.currentCharge >= this.constants.CHARGE_MAX) {
            playSound('full');
            this.elements.chargeMsg.innerText = "입력 완료! 다음으로 넘어갑니다."; this.elements.chargeMsg.style.color = "#2979ff";
            setTimeout(() => { this.state.qIdx++; this.loadQuestion(); }, 500);
        }
    },

    updateChargeUI: function () {
        let percent = Math.min(100, (this.state.currentCharge / this.constants.CHARGE_MAX) * 100);
        this.elements.chargeBar.style.width = `${percent}%`;
        this.elements.chargePercent.innerText = `${Math.round(percent)}%`;
    },

    analyzeProfile: function () {
        const s = this.state.scores;
        const ex = this.state.extraScores;
        const mbti = (s.EI >= 0 ? "E" : "I") + (s.SN >= 0 ? "S" : "N") + (s.TF >= 0 ? "T" : "F") + (s.JP >= 0 ? "J" : "P");

        let temp = "";
        if (s.EI >= 0) temp = (s.TF >= 0) ? "Choleric" : "Sanguine";
        else temp = (s.TF >= 0) ? "Melancholic" : "Phlegmatic";

        if (ex.Choleric > 3) temp = "Choleric";
        else if (ex.Sanguine > 3) temp = "Sanguine";
        else if (ex.Melancholic > 3) temp = "Melancholic";
        else if (ex.Phlegmatic > 3) temp = "Phlegmatic";

        let ennea = "9w1";
        if (temp === "Choleric") ennea = "8w7";
        else if (temp === "Sanguine") ennea = "7w6";
        else if (temp === "Melancholic") ennea = "4w5";
        else ennea = "9w1";

        this.state.resultProfile = { mbti, temp, ennea };
        if (this.elements.unlockMbti) this.elements.unlockMbti.innerText = mbti;
        if (this.elements.unlockEnnea) this.elements.unlockEnnea.innerText = ennea;
        if (this.elements.unlockTemp) this.elements.unlockTemp.innerText = temp;
        this.showSection('unlock');
    },

    scanDatabase: function () {
        this.state.unlockClicks++;
        let percent = (this.state.unlockClicks / this.constants.UNLOCK_TARGET) * 100;
        if (this.elements.pdbGauge) this.elements.pdbGauge.style.width = percent + "%";
        if (this.state.unlockClicks >= this.constants.UNLOCK_TARGET) { this.calculateSimilarity(); }
        else { if (this.elements.pdbMsg) this.elements.pdbMsg.innerHTML = `데이터베이스 접근 승인 대기 중... <strong>(${this.state.unlockClicks}/${this.constants.UNLOCK_TARGET})</strong>`; }
        playSound('tap'); if (navigator.vibrate) navigator.vibrate(5);
    },

    calculateSimilarity: function () {
        try {
            const user = this.state.resultProfile;
            let bestMatch = defaultChar;
            let maxScore = -1;

            // 배열 순회 (안전함)
            CHARACTERS.forEach(char => {
                let score = 0;
                if (char.mbti === user.mbti) score += 50;
                if (char.enneagram && user.ennea && char.enneagram[0] === user.ennea[0]) score += 30;

                let userTempRoot = user.temp ? user.temp.split(' ')[0] : '';
                let charTempRoot = char.temp ? char.temp.split(' ')[0] : '';
                if (charTempRoot === userTempRoot) score += 20;

                if (score > maxScore) { maxScore = score; bestMatch = char; }
            });

            if (this.elements.finalName) this.elements.finalName.innerText = bestMatch.name;
            if (this.elements.finalSource) this.elements.finalSource.innerText = bestMatch.source;
            if (this.elements.finalDesc) this.elements.finalDesc.innerText = bestMatch.desc;
            if (this.elements.matchRate) this.elements.matchRate.innerText = maxScore > 0 ? maxScore : 60;
            if (this.elements.totalClicks) this.elements.totalClicks.innerText = this.state.totalClicks;
            if (this.elements.finalImg) this.elements.finalImg.src = bestMatch.img;

            if (this.elements.tagMbti) this.elements.tagMbti.innerText = bestMatch.mbti;
            if (this.elements.tagEnnea) this.elements.tagEnnea.innerText = bestMatch.enneagram;
            if (this.elements.tagTemp) this.elements.tagTemp.innerText = bestMatch.temp;

            // 링크 매핑 (안전한 소문자 변환)
            this.setTagAction(this.elements.tagMbti, `https://www.16personalities.com/ko/성격유형-${bestMatch.mbti.toLowerCase()}`, "MBTI 분석");
            this.setTagAction(this.elements.tagEnnea, INFO_LINKS[bestMatch.enneagram.charAt(0)] || "https://namu.wiki/w/에니어그램", "에니어그램 분석");
            this.setTagAction(this.elements.tagTemp, INFO_LINKS["Choleric"], "기질 분석"); // 티스토리 링크 통일

            this.showSection('final'); playSound('full');

        } catch (e) {
            console.error("결과 계산 중 오류 발생:", e);
            if (this.elements.finalName) this.elements.finalName.innerText = "분석 실패";
            this.showSection('final');
        }
    },

    setTagAction: function (element, url, label) {
        element.onclick = () => {
            [this.elements.tagMbti, this.elements.tagEnnea, this.elements.tagTemp].forEach(el => { if (el) el.classList.remove('selected'); });
            element.classList.add('selected');
            this.state.targetLink = url; this.state.unlockClicks = 0; this.elements.linkFill.style.width = "0%";
            this.elements.linkMsg.innerHTML = `<span style="color:#2979ff">${label}</span> 페이지로 이동합니다. (버튼을 연타하세요!)`;
            this.elements.btnLinkUnlock.classList.remove('disabled');
            this.elements.btnLinkUnlock.innerHTML = `이동 승인 (0/${this.constants.LINK_UNLOCK_TARGET}) <div class="btn-fill" id="link-fill"></div>`;
            this.elements.linkFill = document.getElementById('link-fill');
            playSound('tap');
        };
    },

    unlockLink: function () {
        if (!this.state.targetLink) return;
        this.state.unlockClicks++; this.state.totalClicks++;
        let percent = (this.state.unlockClicks / this.constants.LINK_UNLOCK_TARGET) * 100;
        this.elements.linkFill.style.width = `${percent}%`;
        this.elements.btnLinkUnlock.innerHTML = `승인 중... (${this.state.unlockClicks}/${this.constants.LINK_UNLOCK_TARGET}) <div class="btn-fill" style="width:${percent}%"></div>`;
        if (this.state.unlockClicks >= this.constants.LINK_UNLOCK_TARGET) {
            window.open(this.state.targetLink, '_blank');
            this.elements.linkMsg.innerText = "이동 완료! 시스템 초기화 대기.";
            this.elements.btnLinkUnlock.classList.add('disabled');
        }
        playSound('tap'); if (navigator.vibrate) navigator.vibrate(5);
    }
};
