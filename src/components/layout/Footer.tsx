// src/components/layout/Footer.tsx

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ToggleTheme } from '../ui/ThemeToggle';

const Footer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true));

  // Example usage for your social icons:
  const twitterIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-x.svg'
      : '/assets/images/social-icons/twitter.svg';

  const feedbackIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-link.svg'
      : '/assets/images/social-icons/feedback.svg';

  const discardIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-discort.svg'
      : '/assets/images/social-icons/discard.svg';

  const youtubeIcon =
    resolvedTheme === 'light'
      ? '/assets/images/black-youtube.svg'
      : '/assets/images/social-icons/youtube.svg';

  return (
    <footer>
      <div className="container mx-auto px-5 sm:px-10 py-1 lg:px-10 xl:px-25 md:py-3">
        <div className="grid grid-cols-12 mt-10 border-b dark:border-white border-black gap-10 pb-5 mx-auto max-w-full overflow-hidden">
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 md:w-full">
            <div className="">
              <label
                htmlFor=""
                className="dark:text-white text-black font-[600] text-[16x] sofia-fonts"
              >
                Community
              </label>

              {
                mounted && (

              <div className="flex row items-center justify-start pt-1 mt-3.5 md:mt-4.5 gap-3">
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src={twitterIcon}
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src={feedbackIcon}
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src={discardIcon}
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src={youtubeIcon}
                      alt=""
                    />
                  </a>
                </div>
              </div>
                )
              }

              <div className="mt-3 flex-col w-full justify-start">
                <div className=" w-full justify-start">
                  <div className="relative flex items-center">
                    {/* <!-- Image for Language --> */}
                    <img
                      className=" w-5 h-5 pointer-events-none"
                      src="/assets/images/footer-images/footer-language.svg"
                      alt="zee"
                    />

                    {/* <!-- Select Dropdown --> */}
                    <select
                      id="countries"
                      className="inter-fonts font-[500]  text-[12px]  block w-28 py-2.5 pl-5 pr-2 text-left bg-transparent dark:text-[#EAECEF] text-black border-0 outline-none appearance-none"
                    >
                      <option className="text-black" defaultValue="English">
                        English
                      </option>

                      {/* <option className="text-black" value="FA">
                          Persian
                        </option>
                        <option className="text-black" value="PL">
                          Polish
                        </option>
                        <option className="text-black" value="PT">
                          Portuguese
                        </option> */}
                    </select>
                  </div>
                </div>
               
                <div>
                  <ToggleTheme />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 w-65 md:w-full">
            <div>
              <label
                htmlFor=""
                className="dark:text-white text-black font-[600] text-[16x] sofia-fonts"
              >
                Quick Links
              </label>

              <ul className="mt-3 pt-1 dark:text-[#EAECEF] text-black text-[13px] font-[400] inter-fonts">
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/">Home</Link>
                </li>
                 <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/tokens">Tokens</Link>
                </li>
                
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/marketplace">Marketplace</Link>
                </li>
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/education">Education</Link>
                </li>
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/contact">Contact</Link>
                </li>
               
              </ul>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 w-65 md:w-full">
            <div className="lg:pl-4">
              <label
                htmlFor=""
                className="dark:text-white text-black font-[600] text-[16x] sofia-fonts"
              >
                Other Links
              </label>

              <ul className="mt-3 pt-1 dark:text-[#EAECEF] text-black text-[13px] font-[400] inter-fonts">
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/terms-of-service">Terms of Service</Link>
                </li>
                {/* <li className="mt-1">
                  <Link href="">GitBook </Link>
                </li> */}
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/support">Support </Link>
                </li>
                <li className="mt-1">
                  <Link className="transition-all duration-300 ease-in-out hover:text-[#FFB92D] hover:border-b" href="/contact">Contact </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 w-65 md:w-full">
            <div className="lg:pl-4">
              <label
                htmlFor=""
                className="text-white font-[600] text-[16x] sofia-fonts"
              >
                Contact us
              </label>

              <ul className="mt-3 pt-1 dark:text-[#EAECEF] text-black text-[13px]  inter-fonts">
                <li className="mt-1 font-[200]">
                  <a className="text-[13px]" href="tel:123456790">
                    <span className="mr-2 font-[500] text-sm">Phone:</span>123
                    4567 90
                  </a>
                </li>
                <li className="mt-1 font-[200] ">
                  <a className="text-[13px]" href="mailto:info@YOZOON3335.com">
                    <span className="mr-2 font-[500] text-sm">Email: </span>
                    info@YOZOON3335.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p className="robboto-fonts dark:text-[#FFFFFF] text-black text-center py-3 text-sm font-[300]">
          &copy; {new Date().getFullYear()} YOZOON. All rights reserved.{' '}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
