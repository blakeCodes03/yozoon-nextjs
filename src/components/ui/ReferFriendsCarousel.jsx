import React from 'react';
import Image from 'next/image';
import { Carousel, Typography, IconButton } from '@material-tailwind/react';

export function ReferFriendsCarousel() {
  return (
    <div className="container mx-auto px-4 py-1 lg:px-10 xl:px-25 md:py-3">
      <div className="relative w-full block md:flex flex-row items-center space-x-1">
        <Carousel
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
          {/* // first carousel item */}
          <div className="relative h-50 w-full md:w-7/7">
            <div
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="relative w-full h-[150px] bg-[url(/assets/images/ReferFriends.png)] bg-no-repeat   border-1 border-[#9A9A9A] rounded-[20px]"
            />
            {/* <!-- Overlay Content (Text + Right Image) --> */}
            <div className="absolute top-0 left-0 w-full h-full text-center block lg:flex items-center justify-between px-6">
              {/* <!-- Left Side: Text --> */}
              <div className="text-center md:text-left  text-white w-full lg:w-3/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="mt-1 md-mt-0 text-[14px] md:text-[28px] font-[600] sofia-fonts"
                >
                  Refer Friends. Earn Crypto Together. <br />{' '}
                </Typography>
                <Typography
                  variant="p"
                  color="white"
                  className="text-[#FFFFFF] text-[12px] md:text-[14px] font-[200] mt-3 md:mt-[10px] inter-fonts"
                >
                  Explore newly launched crypto tokens with real-time market
                  insights and community discussions. Stay informed with market
                  cap updates, project details, and investor replies. Track
                  token performance and make informed decisions effortlessly. 🚀{' '}
                </Typography>
              </div>
              {/* <!-- Right Side: Extra Image --> */}
              <div class="hidden lg:block w-1/3 absolute right-[-70px] top-[-23px]">
                <Image
                  src="/assets/images/business-plan.png"
                  className="flex-shrink-0 w-50 h-45 object-cover"
                  alt="Side Image"
                >
                  {' '}
                </Image>
              </div>
            </div>
          </div>
            {/* // second carousel item */}
            <div className="relative h-50 w-full md:w-7/7">
            <div
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="relative w-full h-[150px] bg-[url(/assets/images/ReferFriends.png)] bg-no-repeat   border-1 border-[#9A9A9A] rounded-[20px]"
            />
            {/* <!-- Overlay Content (Text + Right Image) --> */}
            <div className="absolute top-0 left-0 w-full h-full text-center block lg:flex items-center justify-between px-6">
              {/* <!-- Left Side: Text --> */}
              <div className="text-center md:text-left  text-white w-full lg:w-3/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="mt-1 md-mt-0 text-[14px] md:text-[28px] font-[600] sofia-fonts"
                >
                  Refer Earn Crypto .<br />{' '}
                </Typography>
                <Typography
                  variant="p"
                  color="white"
                  className="text-[#FFFFFF] text-[12px] md:text-[14px] font-[200] mt-3 md:mt-[10px] inter-fonts"
                >
                  Explore newly launched crypto tokens with real-time market insights
                                                    and community discussions. Stay informed with market cap updates,
                                                    project details, and investor replies. Track token performance and
                                                    make informed decisions effortlessly. 🚀
                </Typography>
              </div>
              {/* <!-- Right Side: Extra Image --> */}
              <div class="hidden lg:block w-1/3 absolute right-[-70px] top-[-23px]">
                <Image
                  src="/assets/images/bit-coin.svg"
                  className="flex-shrink-0 w-50 h-45 object-cover"
                  alt="Side Image"
                >
                  {' '}
                </Image>
              </div>
            </div>
          </div>
           {/* // 3rd carousel item */}
           <div className="relative h-50 w-full md:w-7/7">
            <div
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="relative w-full h-[150px] bg-[url(/assets/images/ReferFriends.png)] bg-no-repeat   border-1 border-[#9A9A9A] rounded-[20px]"
            />
            {/* <!-- Overlay Content (Text + Right Image) --> */}
            <div className="absolute top-0 left-0 w-full h-full text-center block lg:flex items-center justify-between px-6">
              {/* <!-- Left Side: Text --> */}
              <div className="text-center md:text-left  text-white w-full lg:w-3/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="mt-1 md-mt-0 text-[14px] md:text-[28px] font-[600] sofia-fonts"
                >
                  Refer Friends. Earn Crypto Together. <br />{' '}
                </Typography>
                <Typography
                  variant="p"
                  color="white"
                  className="text-[#FFFFFF] text-[12px] md:text-[14px] font-[200] mt-3 md:mt-[10px] inter-fonts"
                >
                  Explore newly launched crypto tokens with real-time market
                  insights and community discussions. Stay informed with market
                  cap updates, project details, and investor replies. Track
                  token performance and make informed decisions effortlessly. 🚀{' '}
                </Typography>
              </div>
              {/* <!-- Right Side: Extra Image --> */}
              <div class="hidden lg:block w-1/3 absolute right-[-70px] top-[-23px]">
                <Image
                  src="/assets/images/business-plan.png"
                  className="flex-shrink-0 w-50 h-45 object-cover"
                  alt="Side Image"
                >
                  {' '}
                </Image>
              </div>
            </div>
          </div>
           {/* // 4th carousel item */}
           <div className="relative h-50 w-full md:w-7/7">
            <div
              src="/assets/images/silderimge.png"
              alt="image 1"
              className="relative w-full h-[150px] bg-[url(/assets/images/ReferFriends.png)] bg-no-repeat   border-1 border-[#9A9A9A] rounded-[20px]"
            />
            {/* <!-- Overlay Content (Text + Right Image) --> */}
            <div className="absolute top-0 left-0 w-full h-full text-center block lg:flex items-center justify-between px-6">
              {/* <!-- Left Side: Text --> */}
              <div className="text-center md:text-left  text-white w-full lg:w-3/4">
                <Typography
                  variant="h1"
                  color="white"
                  className="mt-1 md-mt-0 text-[14px] md:text-[28px] font-[600] sofia-fonts"
                >
                  Refer Earn Crypto .<br />{' '}
                </Typography>
                <Typography
                  variant="p"
                  color="white"
                  className="text-[#FFFFFF] text-[12px] md:text-[14px] font-[200] mt-3 md:mt-[10px] inter-fonts"
                >
                  Explore newly launched crypto tokens with real-time market insights
                                                    and community discussions. Stay informed with market cap updates,
                                                    project details, and investor replies. Track token performance and
                                                    make informed decisions effortlessly. 🚀
                </Typography>
              </div>
              {/* <!-- Right Side: Extra Image --> */}
              <div class="hidden lg:block w-1/3 absolute right-[-70px] top-[-23px]">
                <Image
                  src="/assets/images/bit-coin.svg"
                  className="flex-shrink-0 w-50 h-45 object-cover"
                  alt="Side Image"
                >
                  {' '}
                </Image>
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
      </div>
    </div>
  );
}
