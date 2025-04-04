import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Support | Yozoon</title>
        <meta name="description" content="Privacy Policy for Yozoon - Learn how we protect your privacy and handle your data." />
      </Head>
      <main className="text-white">
        <div className="inner-head text-center px-4 pb-6 sm:pb-8 pt-8 sm:pt-18">
            <h1 className="text-white text-[22px] sm:text-[30px] text-center sofia-fonts font-[700] uppercase">Support</h1>
        </div>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
            <h3 className="text-white inter-fonts font-[700] text-[18px] pb-3 sm:text-[22px] my-2 sm:my-6 leading-7 text-center">How Can We Help You?</h3>
            <form action="" className="relative w-full md:w-[52%] mx-auto bg-[#1E2329] focus:border-0 focus:outline-none focus:ring-0">
                <img className="w-5 h-5 absolute top-3.5 left-3" src="/assets/images/support-input-icon.png" alt=""></img>
                <input className="focus:outline-none border-1 border-[#FFB92D] robboto-fonts placeholder:text-sm placeholder:text-[#A6A6A6] text-[#A6A6A6] text-xs focus:border-0 inter-fonts relative forn-control w-full h-11 rounded-[10px] pl-9 pr-27 md:pr-36" type="search" placeholder="message type here"/>
                <div className="absolute top-1 right-1"><button className="inter-fonts py-[9px] md:py-2 lg:py-2 text-dark px-8 md:px-12 rounded-md bg-[#FFB92D] text-[12px] md:text-[14px] inter-fonts font-[600] md:text-sm">Search</button>
                </div>
            </form>
            <h3 className="text-white inter-fonts font-[700] text-[18px] pt-7 sm:text-[22px] my-0 sm:my-6 leading-7 text-center">Contact Us Directly</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-9">
                <a href="mailto:">
                    <div
                        className="bg-[#1E2329] rounded-[15px] flex flex-col items-center justify-center p-4 border-1 border-[#9A9A9A]">
                        <img className="w-[35px] h-auto my-2" src="/assets/images/contact-mail-box.png" alt=""></img>
                        <h3 className="text-white sofia-fonts font-[700] text-[14px] sm:text-[16px] leading-7">Email Support
                        </h3>
                        <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-7">
                            support@yozoon.com</p>
                    </div>
                </a>
                <a href="#">
                    <div
                        className="bg-[#1E2329] rounded-[15px] flex flex-col items-center justify-center p-4 border-1 border-[#9A9A9A]">
                        <img className="w-[35px] h-auto my-3" src="/assets/images/contact-telegram.png" alt=""></img>
                        <h3 className="text-white sofia-fonts font-[700] text-[14px] sm:text-[16px] leading-7">Telegram
                            Community</h3>
                        <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-7">
                            telegram/YOZOONOFFICIAL</p>
                    </div>
                </a>
                <a href="#">
                    <div
                        className="bg-[#1E2329] rounded-[15px] flex flex-col items-center justify-center p-4 border-1 border-[#9A9A9A]">
                        <img className="w-[35px] h-auto my-3" src="/assets/images/contact-x.png" alt=""></img>
                        <h3 className="text-white sofia-fonts font-[700] text-[14px] sm:text-[16px] leading-7">Twitter</h3>
                        <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-7">
                            x.com/YOZOONOFFICIAL</p>
                    </div>
                </a>
                <a href="#">
                    <div
                        className="bg-[#1E2329] rounded-[15px] flex flex-col items-center justify-center p-4 border-1 border-[#9A9A9A]">
                        <img className="w-[35px] h-auto my-3" src="/assets/images/contact-tiktok.png" alt=""></img>
                        <h3 className="text-white sofia-fonts font-[700] text-[14px] sm:text-[16px] leading-7">TikTok</h3>
                        <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-7">
                            tiktok.com/@yozoonofficial</p>
                    </div>
                </a>
            </div>
        </div>



        <section className="EarningToday-sec bg-[#1E2329]">
            <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 lg:py-12 text-center">
                <h1 className="text-[16px] md:text-[30px] sofia-fonts font-[600] text-white mb-3.5">Start Earning Today</h1>
                <div>
                    <Link
                    href="/signup">
                    
                    <button
                        className="colfaxfont bg-[#FFB92D] hover:bg-white hover:text-[#FFB92D] hover:border-1 hover:border-[#FFB92D] text-black text-xs md:text-sm md:font-[700] rounded-lg px-7 py-2 font-[500] shadow-xs shadow-black transition-all duration-300 ease-in-out">
                        Sign Up Now
                    </button>
                    </Link>
                </div>
            </div>
        </section>
    </main>
    </>
  );
};

export default PrivacyPolicy;