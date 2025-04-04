import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Contact: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact | Yozoon</title>
        <meta name="description" content="Privacy Policy for Yozoon - Learn how we protect your privacy and handle your data." />
      </Head>
      <main className="text-white">
        <div className="inner-head text-center px-4 pb-6 sm:pb-8 pt-8 sm:pt-18">
            <h1 className="text-white text-[22px] sm:text-[30px] text-center sofia-fonts font-[700] uppercase">Contact</h1>
        </div>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
           
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

export default Contact;