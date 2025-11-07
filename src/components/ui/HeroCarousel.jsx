import React, { useRef, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import { Carousel, Typography, IconButton } from '@material-tailwind/react';
import Link from "next/link";

export function CarouselWithBigArrows() {
  const carouselRefNext = useRef(null);
  const carouselRefPrev = useRef(null);
  const router = useRouter(); // Initialize the router


  // Step 2: Define functions to control the carousel
  const handlePrev = () => {
    if (carouselRefNext.current) {
      carouselRefNext.current.click(); // Call the prev method on the carousel
    }
  };

  const handleNext = () => {
    if (carouselRefNext.current) {
      carouselRefNext.current.click(); // Call the next method on the carousel
    }
  };

  //  Prefetch the page when the component mounts
  useEffect(() => {
    router.prefetch('/coin/[id]');
  }, []);

  const handleStartNewToken = () => {
    router.push("/start-new-coin"); // Navigate to the Start New Coin page
  };

  return (
    <div className="container bg-white dark:bg-bgdark mx-auto px-4 py-1 lg:px-10 xl:px-25 md:py-3">
      <div className="relative w-full block md:flex flex-row items-center space-x-1">
        <Carousel
        // slideRef={carouselRef}
          loop
          autoplay
          className="rounded-xl"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {new Array(length).fill('').map((_, i) => (
                <span
                  key={i}
                  className={`block h-2 cursor-pointer rounded-full transition-all content-[''] ${
                    activeIndex === i ? 'w-2 bg-[#FFB92D]' : 'w-2 bg-white/50'
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
          prevArrow={({ handlePrev }) => (
            <IconButton
              variant="text"
              color="white"
              size="lg"
              ref={carouselRefPrev}
              onClick={handlePrev}
              className="!absolute hidden top-2/4 left-4 -translate-y-2/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton
              variant="text"
              color="white"
              ref={carouselRefNext}
              size="lg"
              onClick={handleNext}
              className="!absolute hidden top-2/4 !right-4 -translate-y-2/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </IconButton>
          )}
        >
          <div className="relative h-50 w-full md:w-7/7">
            <img
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="h-[160px] w-full object-cover rounded-xl block"
            />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/45">
              <div className="w-3/4 text-center md:w-2/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="text-xl font-[600] absolute top-8 left-12 text-white text-center sofia-fonts"
                >
                  Crypto Trading with <br />{' '}
                  <strong className="text-2xl"> YOZOON </strong>
                </Typography>
              </div>
            </div>
          </div>
          <div className="relative h-50 w-full md:w-7/7">
            <img
              src="/assets/images/sitelogo.svg"
              alt="image 1"
              className="h-[160px] w-full object-cover rounded-xl block"
            />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/45">
              <div className="w-3/4 text-center md:w-2/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="text-xl font-[600] absolute top-8 left-12 text-white text-center sofia-fonts"
                >
                  Crypto Trading with <br />{' '}
                  <strong className="text-2xl"> YOZOON </strong>
                </Typography>
              </div>
            </div>
          </div>
          <div className="relative h-50 w-full md:w-7/7">
            <img
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="h-[160px] w-full object-cover rounded-xl block"
            />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/45">
              <div className="w-3/4 text-center md:w-2/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="text-xl font-[600] absolute top-8 left-12 text-white text-center sofia-fonts"
                >
                  Crypto Trading with <br />{' '}
                  <strong className="text-2xl"> YOZOON </strong>
                </Typography>
              </div>
            </div>
          </div>
          <div className="relative h-50 w-full md:w-7/7">
            <img
              src="/assets/images/sitelogo.svg"
              alt="image 1"
              className="h-[160px] w-full object-cover rounded-xl block"
            />
            <div className="absolute inset-0 grid h-full w-full place-items-center bg-black/45">
              <div className="w-3/4 text-center md:w-2/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="text-xl font-[600] absolute top-8 left-12 text-white text-center sofia-fonts"
                >
                  Crypto Trading with <br />{' '}
                  <strong className="text-2xl"> YOZOON </strong>
                </Typography>
              </div>
            </div>
          </div>
        </Carousel>
        {/* // old navigation dots */}
        {/* <div className="absolute bottom-6 md:bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30 ">
          <button
            type="button"
            className="w-2 h-2 rounded-full bg-white "
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-2 h-2 rounded-full bg-white"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-2 h-2 rounded-full bg-white"
            data-carousel-slide-to="2"
          ></button>
          <button
            type="button"
            className="w-2 h-2 rounded-full bg-white"
            data-carousel-slide-to="3"
          ></button>
          <button
            type="button"
            className="w-2 h-2 rounded-full bg-white"
            data-carousel-slide-to="4"
          ></button>
        </div> */}

        <div className="w-full mt-2 md:mt-0 md:w-2/3 flex flex-row items-center justify-between pb-3 md:pb-10">
          <div className="">
            <button
              type="button"
              onClick={handlePrev}
              className="w-7 h-7 md:w-14 md:h-24 cursor-pointer"
              data-carousel-prev
            >
              <img src="/assets/images/crousel-buton2.gif" alt="" />
              <span className="sr-only">Previous</span>
            </button>
          </div>
          <div>
          {/* <Link href="/start-new-coin"> */}
            <button
              type="button"
              onClick={handleStartNewToken}
             className="bg-[url('/assets/images/slide-butn.png')] bg-cover bg-center py-4 px-5 lg:px-4 shadow-black shadow-sm w-full md:h-16 rounded-[20px]  text-xs md:text-md lg:text-[20px] xl:text-[25px] font-[700] text-[#181A20] inter-fonts">
              START New Agent\Token
            </button>
          {/* </Link> */}
          </div>
          <div className="">
            <button
              type="button"
              onClick={handleNext}
              className="w-7 h-7 md:w-14 md:h-24 cursor-pointer pt-1 md:pt-2"
              data-carousel-next
            >
              <img
                className="rotate-180"
                src="/assets/images/crousel-buton2.gif"
                alt=""
              />
              <span className="sr-only">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
