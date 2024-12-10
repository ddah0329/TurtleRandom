## 🎲 Random Choice Game - 랜덤 게임 선택기

**Random Choice Game**은 사용자가 다양한 보드게임 선택지 중 랜덤하게 하나를 고를 수 있도록 돕는 재미있는 도구입니다. "결정 장애"를 극복하고 싶은 분들에게 최적화된 랜덤 게임 선택 애플리케이션입니다.

이 프로젝트는 **React**를 기반으로 하며, **Airtable 데이터**를 활용하여 보드게임 정보를 동적으로 표시합니다.

---

### 📸 기능 소개

- **랜덤 이미지 슬라이드**  
  Airtable에서 제공되는 보드게임 데이터(이미지, 게임명, 한줄 설명)를 무작위로 순환하며 표시합니다.

- **선택 결과 확인**  
  "Stop 🔥" 버튼을 클릭하여 선택을 멈추면 결과가 팝업으로 나타납니다.

- **선택 기록 저장**  
  최근 10개의 선택 기록을 로컬 스토리지에 저장하여 언제든 확인할 수 있습니다.

- **선택 기록 삭제**  
  저장된 기록을 초기화할 수 있는 기능을 제공합니다.

---

### 🛠️ 기술 스택

- **React**: UI 구성 및 상태 관리
- **Tailwind CSS**: 반응형 UI 디자인
- **Lucide React**: SVG 아이콘 라이브러리
- **Airtable API**: 보드게임 데이터 관리

---

### 📂 프로젝트 구조

```plaintext
src/
├── components/
│   ├── Navbar.jsx          // 상단 네비게이션 컴포넌트
│   ├── RandomChoiceGame.jsx // 랜덤 선택 기능 구현
├── assets/
│   ├── airtable_data.json   // Airtable에서 가져온 보드게임 데이터
├── App.jsx                 // 메인 App 컴포넌트
├── index.js                // ReactDOM 렌더링
```

---

### ⚙️ 설치 및 실행 방법

1. **클론 저장소**

   ```bash
   git clone https://github.com/ddah0329/TurtleRandom.git
   cd random-choice-game
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**

   ```bash
   npm start
   ```

4. **웹 브라우저에서 확인**  
   [http://localhost:3000](http://localhost:3000)로 이동하여 애플리케이션을 확인하세요.

---

### 📋 JSON 데이터 포맷

아래는 Airtable에서 제공되는 데이터 형식의 예제입니다:

```json
[
  {
    "id": "recBrYBTrUMQn7o1D",
    "fields": {
      "게임 명": "다함께 메이킹 - 오피스편",
      "image": [
        {
          "url": "https://example.com/image1.jpg"
        }
      ],
      "한줄 설명": "재미있는 오피스 게임!"
    }
  },
  ...
]
```

---

### 🎉 주요 화면

#### 랜덤 선택 화면

![랜덤 선택 화면](https://via.placeholder.com/600x400)

#### 선택 결과 팝업

![결과 팝업](https://via.placeholder.com/600x400)

#### 선택 기록

![선택 기록](https://via.placeholder.com/600x400)

---

### 📜 라이선스

이 프로젝트는 **거북이 보드게임 카페 건대점**에 라이선스가 있으므로 무단 이용은 불가합니다.

---

**✨ Enjoy your game selection!**
