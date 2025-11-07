import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';


const PrivacyPolicy: React.FC = () => {
    const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true));
  return (
    <>
      <Head>
        <title>Privacy Policy | Yozoon</title>
        <meta name="description" content="Privacy Policy for Yozoon - Learn how we protect your privacy and handle your data." />
      </Head>
      <main className="dark:text-white text-black">
        <div
          className={` text-center px-4 pb-6 sm:pb-8 pt-8 sm:pt-18 ${
           mounted && resolvedTheme === 'dark' ? 'inner-head' : 'outer-head'
          }`}
        >
            <h1 className="dark:text-white text-black text-[22px] sm:text-[30px] text-center sofia-fonts font-[700] uppercase">Privacy
                Policy
            </h1>
        </div>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
            <div className="text-center my-5 pb-6">
                <h1 className="dark:text-white text-black font-[700] sofia-fonts text-[22px] sm:text-[28px]">
                    YOZOON Privacy Portal
                </h1>
                <p className="dark:text-white text-black text-[13px] sm:text-[14px] inter-fonts font-[400] leading-6">
                    Learn how we collect, use, and protect your personal information when you use our platform.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div>
                    <h2 className="dark:text-white text-black text-[18px] sm:text-[24px] inter-fonts font-[600] mb-4">
                        Welcome to our Privacy Portal
                    </h2>
                    <p className="dark:text-white text-black text-[13px] sm:text-[14px] inter-fonts font-[400] mb-4 leading-6">
                        We created this page to help you navigate through key aspects of our Privacy Program and
                        learn more about your privacy rights.
                        <br/> <br/>
                        At YOZOON, we are dedicated to safeguarding your privacy and protecting your data. The
                        security of your personal information is paramount to us and we follow strict internal
                        guidelines, legal requirements and industry best practices to ensure that your data is
                        secure and used only for authorized purposes.
                        <br/> <br/>
                        Our transparency commitment means that we keep you informed about how your data is used and
                        shared. We update this portal and our privacy notices regularly, ensuring you stay informed
                        about any changes that may affect you. This helps us empower you to make informed decisions
                        about your data and privacy.
                    </p>
                </div>
                <div>
                  <img alt="Padlock with Bitcoin" className="rounded" src="/assets/images/privacy-lock-image.png"/>
                    
                </div>
            </div>
            <h1 className="dark:text-white text-black font-[700] sofia-fonts text-[22px] sm:text-[28px] text-center mb-8 pt-6">YOZOON
                Privacy Principles</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#1E2329] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                    <img alt="Privacy eye icon" className="w-[45px] h-auto" src="/assets/images/pravicy-eye.png"></img>
                        <img className="w-[45px] h-auto" src="/assets/images/pravicy-eye.png" alt=""/>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">Transparency at All
                        Times</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
                <div className="dark:bg-[#1E2329] bg-[#EAECEF] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                        
                        <img className="w-[45px] h-auto" src="/assets/images/privacy-data.png" alt=""></img>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">Data Minimization</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
                <div className="dark:bg-[#1E2329] bg-[#EAECEF] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                        <img className="w-[45px] h-auto" src="/assets/images/privacy-compliance.png" alt=""></img>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">Accountability and
                        Compliance</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
                <div className="dark:bg-[#1E2329] bg-[#EAECEF] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                        <img className="w-[45px] h-auto" src="/assets/images/privacy-user-right.png" alt=""></img>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">User's Rights and
                        Access</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
                <div className="bg-[#1E2329] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                        <img className="w-[45px] h-auto" src="/assets/images/privacy-security.png" alt=""></img>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">Data Security</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
                <div className="dark:bg-[#1E2329] bg-[#EAECEF] p-3 sm:p-5 rounded-[20px] border-1 border-[#9A9A9A] text-center">
                    <div className="flex items-center justify-center mb-3">
                        <img className="w-[45px] h-auto" src="/assets/images/privacy-design.png" alt=""></img>
                    </div>
                    <h2 className="dark:text-white text-black font-[700] sofia-fonts text-[16px] sm:text-[18px] mb-2">Privacy by Design</h2>
                    <p className="dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Our transparency
                        commitment means that we keep you informed about how your
                        data is used and shared. We update this portal and our privacy notices regularly, ensuring you
                        stay informed about any changes that may affect you. This helps us empower you to make informed
                        decisions about your data and privacy.</p>
                </div>
            </div>
            <div className="my-6 pt-4">
                <h3 className="dark:text-white text-black inter-fonts font-[700] text-[18px] sm:text-[22px]">1. Information We Collect</h3>
                <h1 className="inter-fonts dark:text-white text-black font-[600] text-[16px] sm:text-[18px] my-5">We collect different types
                    of information to provide and improve our services, including:</h1>
                <p className="my-5 dark:text-white text-black inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">Welcome to
                    yozoon! By accessing our website and using our services, you agree to comply with and be
                    bound by the following Terms of Service. If you do not agree with any part of these terms, please
                    refrain from using our platform.
                </p>
                <ul className="list-disc list-inside ml-2 text-[14px]">
                    <li className="inter-fonts font-[400] leading-6">Personal Information: Name, email address, contact
                        details, and payment information when you register or make transactions.</li>
                    <li className="inter-fonts font-[400] leading-6">Financial Data: Cryptocurrency wallet addresses,
                        transaction details, and financial activity.</li>
                    <li className="inter-fonts font-[400] leading-6">Technical Data: IP address, browser type, operating
                        system, and other tracking technologies.</li>
                    <li className="inter-fonts font-[400] leading-6">Usage Data: Interaction with our website, including
                        browsing history, preferences, and engagement metrics.</li>
                </ul>
                <h3 className="dark:text-white text-black inter-fonts font-[700] text-[18px] sm:text-[22px] my-5">2. How We Use Your
                    Information</h3>
                <ul className="list-disc list-inside ml-2 text-[14px]">
                    <li className="inter-fonts font-[400] leading-6">Provide and manage our crypto-related services.</li>
                    <li className="inter-fonts font-[400] leading-6">Process transactions and verify user identity.</li>
                    <li className="inter-fonts font-[400] leading-6">Improve website security and prevent fraudulent
                        activity.</li>
                    <li className="inter-fonts font-[400] leading-6">Comply with legal and regulatory obligations.</li>
                    <li className="inter-fonts font-[400] leading-6">Personalize your experience and offer relevant
                        features.</li>
                    <li className="inter-fonts font-[400] leading-6">Communicate with you about updates, promotions, and
                        support.</li>
                </ul>
                <h3 className="dark:text-white text-black inter-fonts font-[700] text-[18px] sm:text-[22px] my-5">3. Data Sharing &
                    Third-Party Services</h3>
                <ul className="list-disc list-inside ml-2 text-[14px]">
                    <li className="inter-fonts font-[400] leading-6">Regulatory Authorities: To comply with legal
                        requirements (e.g., AML/KYC regulations).</li>
                    <li className="inter-fonts font-[400] leading-6">Service Providers: Payment processors, security firms,
                        and analytics providers.</li>
                    <li className="inter-fonts font-[400] leading-6">Blockchain Networks: Transactions made on public
                        blockchains are immutable and visible to the public.</li>
                    <li className="inter-fonts font-[400] leading-6">Business Partners: If required for partnerships or
                        collaborations, with your consent.</li>
                </ul>
                <h3 className="dark:text-white text-black inter-fonts font-[700] text-[18px] sm:text-[22px] my-5">4. Data Security</h3>
                <ul className="list-disc list-inside ml-2 text-[14px]">
                    <li className="inter-fonts font-[400] leading-6">Regulatory Authorities: To comply with legal
                        requirements (e.g., AML/KYC regulations).</li>
                    <li className="inter-fonts font-[400] leading-6">Service Providers: Payment processors, security firms,
                        and analytics providers.</li>
                    <li className="inter-fonts font-[400] leading-6">Blockchain Networks: Transactions made on public
                        blockchains are immutable and visible to the public.</li>
                    <li className="inter-fonts font-[400] leading-6">Business Partners: If required for partnerships or
                        collaborations, with your consent.</li>
                </ul>
            </div>
        </div>

        <section className="EarningToday-sec dark:bg-[#1E2329] bg-[#EAECEF]">
            <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 lg:py-12 text-center">
                <h1 className="text-[16px] md:text-[30px] sofia-fonts font-[600] dark:text-white text-black mb-3.5">Start Earning Today</h1>
                <div>
                    <Link href="/signup">
                    
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