import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 flex items-center px-4 bottom-0 left-0 w-full">
      {/* Left Image */}
      <div className="flex items-center">
        <img src="assets/footer_left.png" alt="Footer Left" className="h-10" />
      </div>

      {/* Arrow */}
      <div className="flex-grow mx-4 relative">
        <div className="w-full h-0.5 bg-white mx-auto"></div>
        <div className="absolute left-0 -top-2.5 text-white text-base">
          &lt;
        </div>
      </div>

      {/* Right Image */}
      <div className="flex items-center mr-5">
        <img
          src="assets/footer_turtle.png"
          alt="Footer Right"
          className="h-9"
        />
      </div>

      {/* Right Image */}
      <div className="flex items-center">
        <img src="assets/footer_right.png" alt="Footer Right" className="h-9" />
      </div>
    </footer>
  );
};

export default Footer;
