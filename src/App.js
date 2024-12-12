import React, { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import axios from "axios";

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
      const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
      const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME;

      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/${baseId}/${tableName}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        const gameData = response.data.records.map((record) => ({
          src: record.fields.image[0].url,
          alt: record.fields["게임 명"],
          description: record.fields["한줄 설명"] || "설명이 없습니다.",
          videoUrl: record.fields["영상 설명"] || "영상이 없습니다.",
          hashtag: record.fields["장르"],
          whatGame: record.fields["어떤 게임 좋아해요?"],
          numberOfPeople: record.fields["인원수"],
        }));

        setImages(gameData);
      } catch (error) {
        console.error("Error fetching data from Airtable", error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && images.length > 0) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, images]);

  const saveToHistory = (selectedIndex) => {
    if (images[selectedIndex]) {
      const newHistory = [
        {
          id: Date.now(),
          selection: images[selectedIndex].alt,
          timestamp: new Date().toLocaleString(),
          image: images[selectedIndex].src,
          description: images[selectedIndex].description,
          videoUrl: images[selectedIndex].videoUrl,
          hashtag: images[selectedIndex].hashtag,
          whatGame: images[selectedIndex].whatGame,
          numberOfPeople: images[selectedIndex].numberOfPeople,
        },
        ...history,
      ].slice(0, 10);

      setHistory(newHistory);
      localStorage.setItem("gameHistory", JSON.stringify(newHistory));
    }
  };

  const handleStop = () => {
    if (images.length > 0) {
      setIsRunning(false);
      setSelectedResult(currentIndex);
      setStreak((prev) => prev + 1);
      saveToHistory(currentIndex);
      setIsResultDialogOpen(true);
    }
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="text-center mt-10 mb-10">
          <h1 className="text-3xl md:text-4xl text-black mb-2">
            🎯 돌려돌려 돌림판~!
          </h1>
          <h2 className="text-lg md:text-xl text-black/90">
            결정을 못하는 당신을 위한! 랜덤~게임~!
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Game Card */}
          <div className="bg-white rounded-lg">
            <div className="p-4 md:p-6">
              {/* Circular Guide Overlay */}
              <div className="relative w-full aspect-square bg-white rounded-full mb-4 overflow-hidden">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-100 z-10 ${
                      currentIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ))}

                {/* Circular Guide Overlay */}
                <img
                  src="/assets/circular-guide.png"
                  alt="Circular Guide"
                  className="absolute inset-0 w-full h-full pointer-events-none z-50 circular-guide-spin"
                />

                {/* 애니메이션 스타일 추가 */}
                <style jsx>{`
                  .circular-guide-spin {
                    animation: spin 15s linear infinite;
                  }

                  @keyframes spin {
                    from {
                      transform: rotate(0deg) scale(1.05);
                    }
                    to {
                      transform: rotate(360deg) scale(1.05);
                    }
                  }
                `}</style>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={isRunning ? handleStop : handleRestart}
                  className="w-full bg-[#000] hover:bg-[#07FF2F] text-white hover:text-black px-6 py-4 text-lg rounded-full mt-10 mb-3"
                >
                  {isRunning ? "🔥 멈추기 🔥" : "🔥 다시하기 🔥"}
                </button>
              </div>
            </div>
          </div>

          {/* History Card */}
          <div className="bg-white rounded-lg">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg md:text-xl text-black">
                  🎯 최근 선택 기록
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
                  {history.map((item) => {
                    console.log(item);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 rounded-lg shadow-md transition-shadow duration-300"
                        style={{ fontFamily: "Noto Sans KR, sans-serif" }}
                      >
                        <img
                          src={item.image}
                          alt={item.selection}
                          className="w-20 h-22 md:w-23 md:h-23 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="text-2xs text-black font-black">
                            {item.whatGame && item.whatGame[0]}
                          </div>

                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-black text-sm md:text-base font-black">
                              {item.selection}
                            </span>
                            <div className="text-xs text-[#000] bg-[#eee] px-2 py-1 rounded-md shadow-sm transition-shadow duration-300 font-black">
                              {item.numberOfPeople}
                            </div>
                          </div>
                          <div className="text-xs text-black/70 font-black">
                            {item.description}
                          </div>
                          <div className="text-xs text-black/50 font-black">
                            {item.hashtag &&
                              item.hashtag.map((tag) => `#${tag}`).join(" ")}
                          </div>
                          <button
                            onClick={() => {
                              if (item.videoUrl) {
                                window.location.href = item.videoUrl;
                              } else {
                                console.log("영상 링크가 없습니다.");
                              }
                            }}
                            className="w-full text-[#000] bg-[#eee] hover:bg-[#e0e0e0]/30 px-2 py-1 text-xs rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 font-black"
                            disabled={!item.videoUrl}
                          >
                            {item.videoUrl
                              ? "게임 설명 보기"
                              : "게임 설명 없음"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
            <div className="flex justify-end">
              <button
                onClick={() => setIsResultDialogOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-black" />
              </button>
            </div>
            <div className="flex justify-center">
              <h2 className="text-2xl">🎉 랜덤~! 게임~! 🎉</h2>
            </div>
            <div className="flex justify-center mb-3">
              <h2 className="text-2xl">바로 이거 하러 가자!</h2>
            </div>
            {selectedResult !== null && (
              <>
                <div className="text-center mb-3">
                  <p className="text-xs text-black/70">
                    {images[selectedResult].whatGame &&
                      images[selectedResult].whatGame[0]}
                  </p>

                  <div className="flex items-center justify-center space-x-2">
                    <h3 className="text-xl text-black">
                      {images[selectedResult].alt}
                    </h3>
                    <div className="text-xs text-[#000] bg-[#eee] px-2 py-1 rounded-md shadow-sm transition-shadow duration-300">
                      {images[selectedResult].numberOfPeople}
                    </div>
                  </div>

                  <p className="text-sm text-black/70 mt-3">
                    {images[selectedResult].description}
                  </p>
                  <p className="text-sm text-black/70">
                    {images[selectedResult].hashtag &&
                      images[selectedResult].hashtag
                        .map((tag) => `#${tag}`)
                        .join(" ")}
                  </p>
                </div>
                <img
                  src={images[selectedResult].src}
                  alt={images[selectedResult].alt}
                  className="w-60 h-60 mx-auto mb-3"
                />
              </>
            )}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setIsResultDialogOpen(false)}
                className="flex-1 bg-black hover:bg-[#07FF2F] text-white hover:text-black py-3 text-lg rounded-full"
              >
                다시하기
              </button>
              <button
                onClick={() => {
                  const selectedGame = images[selectedResult];
                  if (selectedGame && selectedGame.videoUrl) {
                    window.open(selectedGame.videoUrl, "_blank");
                  } else {
                    console.log("게임 설명 영상이 없습니다.");
                  }
                }}
                className="flex-1 bg-[#07FF2F] hover:bg-black text-black hover:text-white py-3 text-lg rounded-full"
              >
                게임 설명 영상
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
