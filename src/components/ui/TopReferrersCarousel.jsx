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
            //!after fetching data from the API, replace username and rewards with the API data
            const referrerss = [
              {rank: 1, username: 'LaughingTom', rewards: 255, rank_image: '/assets/images/First-rank.svg' },
              {rank: 2, username: 'HistoryBuff', rewards: 255, rank_image: '/assets/images/send-rank.svg' },
              {rank: 3, username: 'CryptoChef', rewards: 255, rank_image: '/assets/images/third-rank.svg' },
              {rank: 4, username: 'HistoryBuff', rewards: 255, rank_image: '' },
              {rank: 5, username: 'CryptoChef', rewards: 255, rank_image: '' },
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
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        speed: 4000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: false, 
        nextArrow: <SampleNextArrow />,
        prevArrow: <SampleNextArrow />,
        responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          autoplaySpeed: 3000,
          speed: 5000,
        }
      }
    ]
      };
  return (
    <div className="slider-container bg-[#191919]  ">
      <Slider {...settings}>
      {referrers.map((ref, index) => (
          <div key={index}  className={`flex justify-center content-center h-10 ${
    ref.rank === 2 || ref.rank === 4 ? ' bg-[#262626] whitespace-nowrap' : ''
  }`}>
            

            <div className="text-xs md:text-sm mx-1 flex items-center justify-center gap-4 ">
              <div className="flex-shrink-0 w-8 h-4 ">
                { //if rank is 1, 2, or 3, show the rank image, otherwise show the rank number
                ref.rank > 3 ? (<span className='text-[#FFB92D] text-sm font-extrabold border-r-2 border-[#3C3C3C] pr-3'>{ref.rank}</span>) :   
              
                <img
                  className="border-r-2 border-[#3C3C3C] pr-3  w-[100%] h-[100%] object-cover"
                  src={ref.rank_image}
                  alt=""
                />
              }
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
