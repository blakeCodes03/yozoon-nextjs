import React, { useEffect, useState } from 'react';
import axios from 'axios';import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from 'react-toastify';
import MemecoinCard from './MemecoinCard'; 

const memecoins
 = [
    {
      name: 'Downald Trump',
      keyword: 'Trump',
      marketCap: '$500k',
      growthPercentage: '+10%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmfPchJVEVC3auXUZt5VhGmPsFyZRXuBuuL4AZipLVKaCb?img-width=128&img-dpr=2&img-onerror=redirect',
      createdBy: 'JohnDoe',
      time: 'in 10 min',
      replies: 25,
      driver: 'TRUMP',
      driverSymbol: '(TRUMP)',
      holozone: 'Holozone [HOLO]',
      description:
        'Downald Trump is the latest meme coin taking the crypto world by storm. Join the movement today!',
      progressBarColor: '#FF5733',
    },
    {
      name: 'Saratoga Spring Water',
      keyword: 'Water',
      marketCap: '$120k',
      growthPercentage: '+5%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/Qmd2Ar87gsVf2mXix9mxT8WCr3Zh27SutfXDJEqUQyLNX3?img-width=128&img-dpr=2&img-onerror=redirect',
      createdBy: 'JaneDoe',
      time: 'in 15 min',
      replies: 12,
      driver: 'WATER',
      driverSymbol: '(WATER)',
      holozone: 'Holozone [HOLO]',
      description:
        'Saratoga Spring Water coin is here to quench your thirst for profits. Dive in now!',
      progressBarColor: '#00E5FF',
    },
    {
      name: 'Pyramids',
      keyword: 'History',
      marketCap: '$230k',
      growthPercentage: '+8%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmQjJnXY4RqMatRJeUATBRQuimzQxpQLMh92ufCWdQ1UiT?img-width=128&img-dpr=2&img-onerror=redirect',
      createdBy: 'HistoryBuff',
      time: 'in 20 min',
      replies: 18,
      driver: 'PYRAMID',
      driverSymbol: '(PYRAMID)',
      holozone: 'Holozone [HOLO]',
      description:
        'Pyramids coin is a historical marvel in the crypto space. Build your wealth with us!',
      progressBarColor: '#FFD700',
    },
    {
      name: 'Italian Brainrot',
      keyword: 'Italy',
      marketCap: '$1M',
      growthPercentage: '+12%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmQ99Nt5FgHGomKZEMtFyVargviKBHLeExqebrTEzs4LnX?img-width=128&img-dpr=2&img-onerror=redirect',
      createdBy: 'CryptoChef',
      time: 'in 5 min',
      replies: 30,
      driver: 'ITALY',
      driverSymbol: '(ITALY)',
      holozone: 'Holozone [HOLO]',
      description:
        'Italian Brainrot coin brings the taste of Italy to the blockchain. Mangia bene, invest better!',
      progressBarColor: '#39FF14',
    },
    {
      name: 'Fartcoin',
      keyword: 'Humor',
      marketCap: '$300k',
      growthPercentage: '+20%',
      growthIcon: '/assets/images/grow-up.svg',
      trendingImage: 'https://pump.mypinata.cloud/ipfs/QmNptjnEqmZvTk7UKsyZDLg7rs5EgUHi2NZ3qLYPVCu4mH?img-width=128&img-dpr=2&img-onerror=redirect',
      createdBy: 'LaughingTom',
      time: 'in 2 min',
      replies: 50,
      driver: 'FART',
      driverSymbol: '(FART)',
      holozone: 'Holozone [HOLO]',
      description:
        'Fartcoin is the funniest way to invest in crypto. Laugh your way to the bank!',
      progressBarColor: '#FFB92D',
    },
  ];

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

function OtherTokensCarousel() {
     const [othetTokens, setOtherTokens] = useState([]);
    
      useEffect(() => {
        const fetchReferrers = async () => {
          try {
            const response = await axios.get('/api/referrals/top');
            setOtherTokens(response.data);
    
            // Mock datasetse
            setOtherTokens(memecoins);
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
        pauseOnHover: true, 
        nextArrow: <SampleNextArrow />,
        prevArrow: <SampleNextArrow />,
        responsive: [
      // {
      //   breakpoint: 1024,
      //   settings: {
      //     slidesToShow: 3,
      //     slidesToScroll: 1,
      //     infinite: true,
      //     dots: false
      //   }
      // },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
      };
  return (
    <div className="slider-container bg-[#191919]  py-2">
      <Slider {...settings}>
      {othetTokens.map((ref, index) => (
          <div key={index} className="flex items-center px-4">
           <MemecoinCard
           id={index}
            name={ref.name}
            keyword={ref.keyword}
            marketCap={ref.marketCap}
            growthPercentage={ref.growthPercentage}
            growthIcon={ref.growthIcon}
            trendingImage={ref.trendingImage}
            createdBy={ref.createdBy}
            time={ref.time}
            replies={ref.replies}
            driver={ref.driver}
            driverSymbol={ref.driverSymbol}
            holozone={ref.holozone}
            description={ref.description}
            progressBarColor={ref.progressBarColor}/>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default OtherTokensCarousel;
