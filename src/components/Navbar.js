import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
      <div className="flex items-center">
        <span
          className="text-xl md:text-2xl text-black cursor-pointer"
          onClick={() =>
            (window.location.href = "https://open.kakao.com/o/ssdPaEEe")
          }
        >
          가맹문의
        </span>
      </div>
      <div className="flex items-center">
        <span
          className="text-xl md:text-2xl text-black cursor-pointer"
          onClick={() =>
            (window.location.href = "https://turtlegame.my.canva.site/")
          }
        >
          <img
            src="assets/navbar_heyTurtle.png"
            alt="거북이 보드게임 카페 로고"
            className="cursor-pointer w-auto h-12"
          />
        </span>
      </div>
      <div className="flex items-center">
        <span
          className="text-xl md:text-2xl text-black cursor-pointer"
          onClick={() =>
            (window.location.href = "https://turtlegame.softr.app/")
          }
        >
          <img
            src="assets/navbar_search.png"
            alt="검색"
            className="cursor-pointer w-auto h-7"
          />
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
