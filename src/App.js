import React, { useState, useEffect, useCallback } from "react";
import { Trophy, Volume2, VolumeX } from "lucide-react";

// Airtable 설정
const AIRTABLE_API_KEY = "patyPmcAShCtMsIWF"; // 실제 API 키로 교체해주세요
const AIRTABLE_BASE_ID = "appLkhHLUId132fIG"; // 실제 Base ID로 교체해주세요
const AIRTABLE_TABLE_NAME = "tblbW6hSYxW2IKTtx"; // 실제 테이블 이름으로 교체해주세요

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-xl md:text-2xl font-black text-[#07FF2F]">
          🐢 거북이 보드게임
        </span>
      </div>
      <div>
        <button className="text-[#07FF2F] border-[#07FF2F] border px-4 py-2 rounded-full hover:bg-[#07FF2F]/10">
          게임 검색
        </button>
      </div>
    </nav>
  );
};

const RandomChoiceGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false); // 초기값을 false로 변경
  const [isMuted, setIsMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Airtable에서 이미지 데이터 가져오기
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
          {
            headers: {
              Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Airtable 데이터를 가져오는데 실패했습니다");
        }

        const data = await response.json();
        
        // Airtable 레코드 구조에 맞게 데이터 매핑
        const formattedImages = data.records
          .filter(record => record.fields.ImageURL) // 이미지 URL이 있는 레코드만 필터링
          .map((record) => ({
            id: record.id,
            src: record.fields.ImageURL,
            alt: record.fields.Title || "게임 이미지",
            title: record.fields.Title || "제목 없음",
            description: record.fields.Description || "설명 없음",
          }));

        if (formattedImages.length === 0) {
          throw new Error("등록된 이미지가 없습니다");
        }

        setImages(formattedImages);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Airtable 데이터 fetch 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // 로컬 스토리지에서 히스토리 불러오기
  useEffect(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 사운드 재생 함수
  const playSound = useCallback(
    (soundType) => {
      if (isMuted) return;
      // 여기에 사운드 재생 로직 추가
    },
    [isMuted]
  );

  // 이미지 회전 타이머
  useEffect(() => {
    let timer;
    if (isRunning && images.length > 0) {
      playSound("spinning");
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, images.length, playSound]);

  // 히스토리 저장 함수
  const saveToHistory = (selectedIndex) => {
    const selectedImage = images[selectedIndex];
    const newHistory = [
      {
        id: Date.now(),
        selection: selectedIndex + 1,
        timestamp: new Date().toLocaleString(),
        image: selectedImage.src,
        title: selectedImage.title,
        description: selectedImage.description,
      },
      ...history,
    ].slice(0, 10); // 최근 10개만 유지

    setHistory(newHistory);
    localStorage.setItem("gameHistory", JSON.stringify(newHistory));
  };

  // 게임 멈추기 핸들러
  const handleStop = () => {
    setIsRunning(false);
    playSound("stop");
    setSelectedResult(currentIndex);
    setStreak((prev) => prev + 1);
    saveToHistory(currentIndex);
  };

  // 게임 재시작 핸들러
  const handleRestart = () => {
    setIsRunning(true);
    setSelectedResult(null);
  };

  // 히스토리 초기화
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("gameHistory");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold">이미지를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl font-bold text-red-500">에러: {error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-black text-black mb-2">
            🎯 돌려돌려 돌림판~!
          </h1>
          <h2 className="text-lg md:text-xl text-black/90 font-bold">
            결정장애 당신을 위한! 랜덤~게임~!
          </h2>
          <div className="mt-2 text-black/80 flex items-center justify-center gap-2 font-bold">
            <Trophy size={18} color="#FF0000" />
            <span>연속 {streak}번째 결정 중!</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">현재 선택</h3>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            <div className="relative w-full aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-100 ${
                    currentIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-contain"
                  />
                  {!isRunning && currentIndex === index && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <h4 className="font-bold">{image.title}</h4>
                      <p className="text-sm">{image.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={isRunning ? handleStop : handleRestart}
                className="w-full bg-[#07FF2F] hover:bg-[#05CC25] text-black px-6 py-4 text-lg font-black rounded-full"
                disabled={images.length === 0}
              >
                {isRunning ? "멈추기 🔥" : "돌리기 🔥"}
              </button>
            </div>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-black text-black">
                최근 선택 기록
              </h3>
              <button
                onClick={clearHistory}
                className="text-xs text-black/70 hover:bg-gray-100 rounded-full px-2 py-1"
              >
                기록 삭제
              </button>
            </div>
            {history.length === 0 ? (
              <div className="text-center text-black/70 py-4 text-sm">
                아직 선택 기록이 없습니다
              </div>
            ) : (
              <div className="grid gap-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={`선택 ${item.selection}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <div className="font-bold text-black">{item.title}</div>
                      <div className="text-xs text-black/70">
                        {item.timestamp}
                      </div>
                      <div className="text-sm text-black/80">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomChoiceGame;