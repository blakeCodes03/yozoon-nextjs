import React, { useEffect, useState } from 'react';
import axios from 'axios';import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-toastify';


function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "none" }}
        onClick={onClick}
      />
    );
  }

function TopReferrersCarousel() {
     const [referrers, setReferrers] = useState([]);
    
      useEffect(() => {
        const fetchReferrers = async () => {
          try {
            const response = await axios.get('/api/referrals/top');
            setReferrers(response.data);
    
            // Mock data
            const referrerss = [
              { username: 'LaughingTom', rewards: 100 },
              { username: 'HistoryBuff', rewards: 50 },
              { username: 'CryptoChef', rewards: 25 },
            ];
            setReferrers(referrerss);
          } catch (error) {
            console.error('Error fetching top referrers:', error);
            toast.error('Failed to load top referrers.');
          }
        };
    
        fetchReferrers();
      }, []);
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: false, 
        nextArrow: <SampleNextArrow />,
        prevArrow: <SampleNextArrow />,
      };
  return (
    <div className="slider-container bg-[#191919]  py-2">
      <Slider {...settings}>
      {referrers.map((ref, index) => (
          <div key={index} className="flex items-center space-x-2">
            {/* <FaStar />
            <span className="font-semibold">{ref.username}</span>
            <span>Earned {ref.rewards} SOL</span> */}

            <div className="text-xs md:text-lg mx-4 flex items-center gap-4 ">
              <div className="flex-shrink-0 w-8 h-4 ">
                <img
                  className="border-r-2 border-[#3C3C3C] pr-3  w-[100%] h-[100%] object-cover"
                  src="/assets/images/send-rank.svg"
                  alt=""
                />
              </div>

              <h1 className="instrument-fonts font-medium text-[#FFB92D] border-r-2 border-[#3C3C3C] pr-3">
                {ref.username}
              </h1>
              <h1 className="instrument-fonts font-medium text-[#FFB92D]">
                {ref.rewards} SOL
              </h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default TopReferrersCarousel;
