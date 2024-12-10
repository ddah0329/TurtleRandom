import React, { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";
import airtableData from "./airtable_data.json";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-xl md:text-2xl font-black text-[#07FF2F]">
          🐢 거북이 보드게임
        </span>
      </div>
      <div>
        <button className="text-[#07FF2F] border border-[#07FF2F] hover:bg-[#07FF2F]/10 px-4 py-2 rounded-full text-sm">
          게임 검색
        </button>
      </div>
    </nav>
  );
};

const RandomChoiceGame = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const images = airtableData.map((game) => ({
    src: game.fields.image[0].url,
    alt: game.fields["게임 명"],
    description: game.fields["한줄 설명"] || "설명이 없습니다.",
  }));

  useEffect(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const saveToHistory = (selectedIndex) => {
    const newHistory = [
      {
        id: Date.now(),
        selection: images[selectedIndex].alt,
        timestamp: new Date().toLocaleString(),
        image: images[selectedIndex].src,
        description: images[selectedIndex].description,
      },
      ...history,
    ].slice(0, 10);

    setHistory(newHistory);
    localStorage.setItem("gameHistory", JSON.stringify(newHistory));
  };

  const handleStop = () => {
    setIsRunning(false);
    setSelectedResult(currentIndex);
    setStreak((prev) => prev + 1);
    saveToHistory(currentIndex);
    setIsResultDialogOpen(true);
  };

  const handleRestart = () => {
    setIsRunning(true);
    setSelectedResult(null);
    setIsResultDialogOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("gameHistory");
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: "'Noto Sans KR', sans-serif",
        touchAction: "manipulation",
      }}
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
            <span>**연속 {streak}번째 결정 중!**</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Card */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-4 md:p-6">
              <div className="relative w-full aspect-square bg-white rounded-lg mb-4 overflow-hidden">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-100 ${
                      currentIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={isRunning ? handleStop : handleRestart}
                  className="w-full bg-[#07FF2F] hover:bg-[#05CC25] text-black px-6 py-4 text-lg font-black rounded-full"
                >
                  {isRunning ? "멈추기 🔥" : "다시하기 🔥"}
                </button>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white shadow-lg rounded-lg">
            <div className="p-4 md:p-6">
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
                        alt={item.selection}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-black text-sm md:text-base">
                            {item.selection}
                          </span>
                        </div>
                        <div className="text-xs text-black/70">
                          {item.description}
                        </div>
                        <div className="text-xs text-black/50">
                          {item.timestamp}
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

      {/* Dialog */}
      {isResultDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-sm">
            <button
              onClick={() => setIsResultDialogOpen(false)}
              className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-black" />
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-3">🎉 당신의 선택!</h2>
              {selectedResult !== null && (
                <img
                  src={images[selectedResult].src}
                  alt={images[selectedResult].alt}
                  className="w-32 h-32 mx-auto mb-3"
                />
              )}
              <button
                onClick={handleRestart}
                className="w-full bg-[#07FF2F] hover:bg-[#05CC25] text-black px-6 py-4 text-lg font-black rounded-full"
              >
                다시하기 🔥
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomChoiceGame;
