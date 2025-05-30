// src/components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';
import { FaTwitter, FaTelegramPlane, FaDiscord } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container mx-auto px-5 sm:px-10 py-1 lg:px-10 xl:px-25 md:py-3">
        <div className="grid grid-cols-12 mt-10 border-b border-white gap-10 pb-5 mx-auto max-w-full overflow-hidden">
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 md:w-full">
            <div className=''>
              <label
                htmlFor=""
                className="text-white font-[600] text-[16x] sofia-fonts"
              >
                Community
              </label>

              <div className="flex row items-center justify-start pt-1 mt-3.5 md:mt-4.5 gap-3">
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src="/assets/images/footer-images/footer-twitter.svg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src="/assets/images/footer-images/footer-rocket.svg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src="/assets/images/footer-images/footer-discard.svg"
                      alt=""
                    />
                  </a>
                </div>
                <div className="w-[22px] h-[18px]">
                  <a href="">
                    <img
                      className="w-[100%] h-[100%] object-cover"
                      src="/assets/images/footer-images/footer-youtube.svg"
                      alt=""
                    />
                  </a>
                </div>
              </div>
              <div className="mt-3 flex-col w-full justify-start">
                <div className='flex-col w-full justify-start'>
                  <form className=" mx-auto">
                    <div className="relative">
                      {/* <!-- Image for Language --> */}
                      <img
                        className="absolute w-5 h-5 top-1.5 left-1 pointer-events-none"
                        src="/assets/images/footer-images/footer-language.svg"
                        alt="zee"
                      />

                      {/* <!-- Select Dropdown --> */}
                      <select
                        id="countries"
                        className="inter-fonts font-[500]  text-[12px]  block w-28 py-2.5 pl-9 pr-2 text-left bg-transparent text-[#EAECEF] border-0 outline-none appearance-none"
                      >
                        <option className="text-black" defaultValue="English">
                          English
                        </option>
                        <option className="text-black" value="LA">
                          Latin
                        </option>
                        <option className="text-black" value="LV">
                          Latvian
                        </option>
                        <option className="text-black" value="LT">
                          Lithuanian
                        </option>
                        <option className="text-black" value="MK">
                          Macedonian
                        </option>
                        <option className="text-black" value="MS">
                          Malay
                        </option>
                        <option className="text-black" value="ML">
                          Malayalam
                        </option>
                        <option className="text-black" value="MT">
                          Maltese
                        </option>
                        <option className="text-black" value="MR">
                          Marathi
                        </option>
                        <option className="text-black" value="MN">
                          Mongolian
                        </option>
                        <option className="text-black" value="NE">
                          Nepali
                        </option>
                        <option className="text-black" value="NO">
                          Norwegian
                        </option>
                        <option className="text-black" value="FA">
                          Persian
                        </option>
                        <option className="text-black" value="PL">
                          Polish
                        </option>
                        <option className="text-black" value="PT">
                          Portuguese
                        </option>
                      </select>
                    </div>
                  </form>
                </div>
                <div>
                  <form className=" mx-auto">
                    <div className="relative">
                      {/* <!-- Image for Language --> */}
                      <img
                        className="absolute w-5 h-5 top-1.5 left-1 pointer-events-none"
                        src="/assets/images/footer-images/footer-currency.svg"
                        alt="zee"
                      />

                      {/* <!-- Select Dropdown --> */}
                      <select
                        id="currency"
                        className="inter-fonts font-[500] text-[12px] block w-28 py-2.5 pl-9 pr-2 text-left bg-transparent text-[#EAECEF] border-0 outline-none appearance-none"
                      >
                        <option className="text-black" defaultValue="USD">
                          Usd-$
                        </option>
                        <option className="text-black" value="LA">
                          PKR
                        </option>
                        <option className="text-black" value="LV">
                          UK
                        </option>
                      </select>
                    </div>
                  </form>
                </div>
                <div>
                  <form className=" mx-auto">
                    <div className="relative">
                      {/* <!-- Image for theme --> */}
                      <img
                        className="absolute w-5 h-5 top-1.5 left-1 pointer-events-none"
                        src="/assets/images/footer-images/footer-mode.svg"
                        alt="zee"
                      />

                      {/* <!-- Select Dropdown --> */}
                      <select
                        id="theme"
                        className="inter-fonts font-[500] text-[12px] block w-28 py-2.5 pl-9 pr-2 text-left bg-transparent text-[#EAECEF] border-0 outline-none appearance-none"
                      >
                        <option className="text-black" defaultValue="System">
                          Theme
                        </option>
                        <option className="text-black" value="LA">
                          Dark
                        </option>
                        <option className="text-black" value="LV">
                          Light
                        </option>
                      </select>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 md:col-span-3 lg:col-span-3 w-65 md:w-full">
            <div>
              <label
                htmlFor=""
                className="text-white font-[600] text-[16x] sofia-fonts"
              >
                Quick Links
              </label>

              <ul className="mt-3 pt-1 text-[#EAECEF] text-[13px] font-[400] inter-fonts">
                <li className="mt-1">
                  <Link href="/">Home</Link>
                </li>
                <li className="mt-1">
                  <Link href="">How It Works</Link>
                </li>
                <li className="mt-1">
                  <Link href="/marketplace">Marketplace</Link>
                </li>
                <li className="mt-1">
                  <Link href="/education">Education</Link>
                </li>
                <li className="mt-1">
                  <Link href="/summary">Summary</Link>
                </li>
                <li className="mt-1">
                  <Link href="/tokens">Tokens</Link>
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
                Other Links
              </label>

              <ul className="mt-3 pt-1 text-[#EAECEF] text-[13px] font-[400] inter-fonts">
                <li className="mt-1">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="mt-1">
                  <Link href="/terms-of-service">Terms of Service Works</Link>
                </li>
                <li className="mt-1">
                  <Link href="">GitBook </Link>
                </li>
                <li className="mt-1">
                  <Link href="/support">Support </Link>
                </li>
                <li className="mt-1">
                  <Link href="contact">Contact </Link>
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

              <ul className="mt-3 pt-1 text-[#EAECEF] text-[13px]  inter-fonts">
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

        <p className="robboto-fonts text-[#FFFFFF] text-center py-3 text-sm font-[300]">
          &copy; {new Date().getFullYear()} YOZOON. All rights reserved.{' '}
        </p>
      </div>

      {/* //old design
      <div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        About Us
        <div>
          <h3 className="text-h3 font-heading mb-4 text-textPrimary">About Us</h3>
          <p className="text-textSecondary">
            Meme Launchpad is dedicated to creating a secure and engaging cryptocurrency ecosystem for meme enthusiasts worldwide.
          </p>
        </div>
        Quick Links
        <div>
          <h3 className="text-h3 font-heading mb-4 text-textPrimary">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy-policy" className="text-textSecondary hover:text-accentBlue">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="text-textSecondary hover:text-accentBlue">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/support" className="text-textSecondary hover:text-accentBlue">
                Support
              </Link>
            </li>
          </ul>
        </div>
        Social Icons
        <div>
          <h3 className="text-h3 font-heading mb-4 text-textPrimary">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://twitter.com/memelaunchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accentBlue text-2xl"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://telegram.org/memelaunchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accentBlue text-2xl"
              aria-label="Telegram"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://discord.com/memelaunchpad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accentBlue text-2xl"
              aria-label="Discord"
            >
              <FaDiscord />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-textSecondary">
        &copy; {new Date().getFullYear()} Meme Launchpad. All rights reserved.
      </div>
      </div> */}
    </footer>
  );
};

export default Footer;
