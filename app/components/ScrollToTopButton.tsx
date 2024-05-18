'use client';

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };

  return (
    <button
      className="flex items-center justify-center mt-[34px] w-32 h-14 p-4 rounded-full text-black text-lg text-center mx-auto bg-custom-lime hover:bg-[#c6ff00] active:bg-black active:text-white transition-colors duration-300 ease-in-out"
      onClick={scrollToTop}
    >
      Наверх
    </button>
  );
}