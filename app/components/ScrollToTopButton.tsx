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
      className="flex items-center justify-center mt-[34px] w-32 h-14 p-4 rounded-full mx-auto btnGreen"
      onClick={scrollToTop}
    >
      Наверх
    </button>
  );
}