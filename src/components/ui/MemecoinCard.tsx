import React, {useEffect} from "react";
import { useRouter } from "next/router";


interface CardProps {
  id: string; 
  name: string;
  keyword: string;
  marketCap: string;
  // growthPercentage: string;
  // growthIcon: string;
  coinImage: string;
  creator: {
    username: string;
    pictureUrl: string;
  };
  time: string;
  replies: number;
  ticker: string;
  description: string;  
  // holozone: string;
  // progressBarColor: string;
}

const MemecoinCard: React.FC<CardProps> = ({
  id,
  name,
  keyword,
  marketCap,
  // growthPercentage,
  // growthIcon,
  coinImage,
  creator,
  time,
  replies,
  ticker,
  description, 
  // holozone,
  // progressBarColor,
}) => {

  const router = useRouter();

  useEffect(() => {
    router.prefetch('/coin/[id]');
  }, []);

  const handleCardClick: any = () => {
    router.push(`/coin/${id}`);
  };
  // console.log(creator, "creator username")
  return (
    <div className="bg-[#1E2329]  rounded-[20px] relative"  onClick={handleCardClick}>
           

      <div className="relative w-full h-[150px]">
        {/* Growth Percentage */}
        {/* <div className="absolute top-0 right-0 z-20 text-[#FFFFFF] px-2 py-[4px] flex flex-row items-center bg-[#181A20E5] shadow-black shadow-sm rounded-l-lg rounded-t-lg">
          <h1 className="text-xs font-[600] inter-fonts">{growthPercentage}</h1>
          <img className="w-3 h-3" src={growthIcon} alt="Growth Icon" />
        </div> */}

        {/* Trending Image */}
        <img
          className="rounded-t-lg w-[100%] h-[100%] object-contain  object-center"
          src={coinImage}
          alt="Trending Coin"
        />

        {/* Meme Tag */}
        <div className="absolute bottom-[-14px] flex flex-row items-center justify-between w-full">
          <div className="flex flex-row items-center space-x-2 pl-1">
            <div className="w-7 h-7">
              {/* //!add user profile image */ }
              <img src={creator?.pictureUrl} alt="User Icon" />
            </div>
            <div>
              <h1 className="rounded-full font[200] bg-[#00E5FF] robboto-fonts font-[400] text-[12px] px-3 py-[1px]">
                {keyword}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="robboto-fonts bg-[#404040] rounded-l-lg px-2 font-[200] py-[1px] text-[#FFFFFF] text-[11px]">
              {time}
            </h1>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-2 py-[10px] border-[2px]  items-center  border-[#404040] rounded-b-[20px]">
        {/* Created By and Replies */}
        <div className="mt-3 mb-1 flex flex-row items-center justify-between">
          <div>
            <h1 className="text-[#00E5FF] text-xs">
              created by {creator?.username}
            </h1>
          </div>
          <div>
            <h1 className="inter-fonts font-[500] text-[#FFFFFF] text-[12px]">
              Replies:<span className="font-[200] ml-1">{replies}</span>
            </h1>
          </div>
        </div>

        {/* Driver and Holozone */}
        <div className="flex items-center justify-between max-w-[20rem] lg:max-w-full h-10">
          <h1 className="sofia-fonts font-[700] text-[18px]  text-[#FFFFFF] leading-none max-h-full truncate ">
            {name} ({ticker})
          </h1>
          {/* <h1 className="inter-fonts font-[200] text-[10px] h-full text-[#FFFFFF]">
            {holozone}
          </h1> */}
        </div>

        {/* Description */}
        <div>
          <p className="mt-1 break-words text-[#ffffffad] text-[10px] font-[100] h-10 leading-3.5 overflow-hidden text-ellipsis ">
            {description}
          </p>
        </div>

        {/* Market Cap and Icons */}
        <div className="mt-1 flex justify-between items-center  bottom-0">
          <div className="w-5 h-5 mt-3">
            <img
              className="w-[100%] h-[100%] object-cover"
              src="/assets/images/thunder.svg"
              alt="Thunder Icon"
            />
          </div>
          <div>
            <h1 className="text-center text-[#00E5FF] font-[700] text-[11px] mb-1">
              Market Cap: {marketCap}
            </h1>
            <div className="w-[170px] bg-[#D9D9D9] rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full"
                style={{ backgroundColor: "#00E5FF" }}
              ></div>
            </div>
          </div>
          <div className="w-4 h-5 mt-3">
            <img
              className="w-[100%] h-[100%] object-cover"
              src="/assets/images/download.svg"
              alt="Download Icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemecoinCard;