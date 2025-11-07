"use client";
import React from 'react';

interface VideoEmbedProps {
    videoSrc: string;
    title: string;
    description: string;
    buttonText: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoSrc, title, description, buttonText }) => {
    return (
        <div className="h-full">
            <div className="px-3 py-4 bg-[#1E2329] rounded-[15px] block md:flex flex-row md:space-x-5 items-start">
                <div>
                    <div className="mx-auto w-full md:max-w-[540px] md:w-[170px] lg:w-[250px] h-[130px] md:h-[179px] relative group shadow-sm">
                        <video
                            className="rounded-[15px] w-full h-full object-cover"
                            src={videoSrc}
                            autoPlay
                            loop
                            controls
                        ></video>
                        <div className="absolute rounded-[15px] top-0 left-0 w-full h-full bg-black opacity-60 group-hover:opacity-0 transition-opacity duration-300"></div>

                        <div className="z-[999] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-0">
                            <img
                                className="w-[40px] h-[40px]"
                                src="/assets/images/play.svg"
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                <div className="text-center md:text-left">
                    <h1 className="sofia-fonts text-[#FFFFFF] font-[600] text-[14px] md:text-[16px] leading-6 break-words">
                        {title}
                    </h1>
                    <p className="mt-1 lg:mt-3.5 inter-fonts text-[#FFFFFF] font-[200] text-[11px] leading-5 break-words">
                        {description}
                    </p>
                    <div>
                        <button className="colfaxfont text-[12px] lg:text-[15px] mt-3.5 bg-[#FFB92D] rounded-[7px] text-[#121212] font-[700] py-1 px-6 leading-7">
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoEmbed;