import React from 'react';

const KingoftheHill: React.FC = () => {
  const cards = [
    {
      id: 1,
      imageSrc: '/assets/images/Zilliqa.png',
      shadowColor: '#00E5FF',
      titleColor: '#00E5FF',
      title: 'King of the Hill',
      createdBy: 'FaYr5e',
      userImage: '/assets/images/king-user.png',
      time: 'in 5 min',
      replies: 19,
      driver: 'DRIVER',
      driverSymbol: '(DRIVER)',
      holozone: 'Holozone [HOLO]',
      description:
        'Four is evolving, and the future is $FORM. To bring clarity and truly return Four to the community, we are revising the token symbol from $Four to $FORM.',
      marketCap: '4.89 K',
      progressBarColor: '#00E5FF',
    },
    {
      id: 2,
      imageSrc: '/assets/images/btc-cash.png',
      shadowColor: '#39FF14',
      titleColor: '#39FF14',
      title: 'King of the Hill',
      createdBy: 'FaYr5e',
      userImage: '/assets/images/king-user.png',
      time: 'in 5 min',
      replies: 19,
      driver: 'DRIVER',
      driverSymbol: '(DRIVER)',
      holozone: 'Holozone [HOLO]',
      description:
        'Four is evolving, and the future is $FORM. To bring clarity and truly return Four to the community, we are revising the token symbol from $Four to $FORM.',
      marketCap: '4.89 K',
      progressBarColor: '#39FF14',
    },
    {
      id: 3,
      imageSrc: '/assets/images/Chainlink.png',
      shadowColor: '#5A00FA',
      titleColor: '#5A00FA',
      title: 'King of the Hill',
      createdBy: 'FaYr5e',
      userImage: '/assets/images/king-user.png',
      time: 'in 5 min',
      replies: 19,
      driver: 'DRIVER',
      driverSymbol: '(DRIVER)',
      holozone: 'Holozone [HOLO]',
      description:
        'Four is evolving, and the future is $FORM. To bring clarity and truly return Four to the community, we are revising the token symbol from $Four to $FORM.',
      marketCap: '4.89 K',
      progressBarColor: '#5A00FA',
    },
  ];
  return (
    
      <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 mt-5">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-20 xl:gap-38  ">
          {/* <!-- //to turn animation off, conditionally add/remove the className "king-card" to the element --> */}
          {cards.map((card) => (
            <div
              key={card.id}
              className={`king-card${card.id} shadow-sm rounded-[20px] h-auto `}
              style={{boxShadow: card.shadowColor}}
            >
              <div className="py-2 px-2.5">
                <div className="mt-2 flex-shrink-0 w-[80px]  md:w-[85px] h-[auto]  mx-auto">
                  <img
                    className={`w-[100%] h-[100%] object-cover shadow-xl inset-shadow-sm shadow-[${card.shadowColor}] rounded-full`}
                    // style={{boxShadow: card.shadowColor}}
                    src={card.imageSrc}
                    alt=""
                  />
                </div>
                <div>
                  <h1 className={`mt-1 sofia-fonts font-[700] text-[${card.shadowColor}] uppercase text-[20px] text-center`} style={{color: card.titleColor}}>
                  {card.title}
                  </h1>
                  <div className=" flex flex-row space-x-1 items-center justify-center">
                    <div className=" relative">
                      <div className="absolute top-[-5px] left-[-3px] w-7 h-7">
                        <img src={card.userImage} alt="user profile image" />
                      </div>
                      <h1 className=" leading-[15px]  rounded-l-lg robboto-fonts pl-7 pr-1 text-[11px]" style={{background: card.shadowColor}}>
                        created by {card.createdBy}
                      </h1>
                    </div>
                    <div className={`rounded-r-lg`} style={{background: card.titleColor}}>
                      <h1 className=" leading-[15px]  robboto-fonts pl-5 pr-2 text-[11px]  ">
                        {card.time}
                      </h1>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <h1 className="sofia-fonts font-[700] text-[18px] text-[#FFFFFF] leading-none">
                    {card.driver}
                      <span className="text-[13px] mt-1 font-[500]">
                      {card.driverSymbol}
                      </span>
                    </h1>
                    <h1 className="inter-fonts font-[500] text-[#FFFFFF] text-[10px]">
                      Replies:<span className="font-[200] ml-1">{card.replies}</span>
                    </h1>
                  </div>
                  <h1 className="inter-fonts font-[200]  text-[10px] text-[#FFFFFF]">
                  {card.holozone}
                  </h1>
                  <div>
                    <p className="break-words text-[#ffffffad] text-[10px] font-[100] mt-1 leading-3.5">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <div className="w-5 h-5 mt-3">
                      <img
                        className="w-[100%] h-[100%] object-cover"
                        src="/assets/images/thunder.svg"
                        alt=""
                      />
                    </div>
                    <div>
                      <h1 className={`text-center  font-[700] text-[11px] mb-1`} style={{color: card.titleColor}}>
                        Market Cap:{card.marketCap}
                      </h1>

                      <div className=" w-[170px] bg-[#D9D9D9] rounded-full h-1.5 ">
                        <div className={` h-1.5 rounded-full`} style={{background: card.titleColor}}></div>
                      </div>
                    </div>
                    <div className="w-4 h-5 mt-3">
                      <img
                        className="w-[100%] h-[100%] object-cover"
                        src="/assets/images/download.svg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  
  );
};

export default KingoftheHill;
