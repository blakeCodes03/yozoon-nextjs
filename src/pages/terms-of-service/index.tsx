import React from 'react';
import Head from 'next/head';
import BottomSignup from '../../components/ui/BottomSignup';

const TermsOfService: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms | Yozoon</title>
        <meta name="description" content="Terms of Service for Yozoon." />
      </Head>
      <div className="text-white">
        <div className="inner-head text-center px-4 pb-6 sm:pb-8 pt-8 sm:pt-18">
          <h1 className="text-white text-[22px] sm:text-[30px] text-center sofia-fonts font-[700] uppercase">
            TERMS OF SERVICE
          </h1>
        </div>
        <div className="container mx-auto px-4 py-2 lg:px-10 xl:px-25 md:py-3">
          <div className="pt-4">
            <h3 className="text-white inter-fonts font-[700] text-[16px] sm:text-[18px]">
              Last Updated: 03 June 2024
            </h3>
            <br />
            <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">
              We created this page to help you navigate through key aspects of
              our Privacy Program and learn more about your privacy rights.
              <br />
              At YOZOON, we are dedicated to safeguarding your privacy and
              protecting your data. The security of your personal information is
              paramount to us and we follow strict internal guidelines, legal
              requirements and industry best practices to ensure that your data
              is secure and used only for authorized purposes.
              <br />
              <br />
              Our transparency commitment means that we keep you informed about
              how your data is used and shared. We update this portal and our
              privacy notices regularly, ensuring you stay informed about any
              changes that may affect you. This helps us empower you to make
              informed decisions about your data and privacy
            </p>
          </div>
          <div className="bg-[#1E2329] p-3 sm:p-5 mt-6 rounded-[20px] border-1  shadow-lg border border-gray-600">
            <h2 className="text-white sofia-fonts font-[700] text-[16px] sm:text-[18px]">
              RISK WARNING
            </h2>
            <br />
            <p className="text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">
              As with any asset, the value of Digital Assets can fluctuate
              significantly and there is a material risk of economic loss when
              buying, selling, holding or investing in Digital Assets. You
              should therefore consider whether trading or holding Digital
              Assets is suitable for you in light of your financial
              circumstances.
              <br /> <br />
              Further information on the risks associated with using the Binance
              Services is set out in our{' '}
              <a href="#" className="text-white underline">
                Risk Warning
              </a>
              , which may be updated from time to time. You should read the Risk
              Warning carefully, however it does not explain all of the risks
              that may arise, or how such risks relate to your personal
              circumstances.
              <br /> <br />
              It is important that you fully understand the risks involved
              before making a decision to use the Binance Services.
            </p>
          </div>
          <p className="mt-5 text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">
            We are not your broker, intermediary, agent or advisor and we have
            no fiduciary relationship or obligation to you in connection with
            any Transactions or other activities you undertake when using the
            Binance Services. We do not provide investment or consulting advice
            of any kind and no communication or information that we provide to
            you is intended as, or should be construed as, advice of any kind. 
            <br /> <br />
            It is your responsibility to determine whether any investment,
            investment strategy or related transaction is appropriate for you
            according to your personal investment objectives, financial
            circumstances and risk tolerance and you are responsible for any
            associated loss or liability. We do not recommend that any Digital
            Asset should be bought, earned, sold or held by you. Before making
            the decision to buy, sell or hold any Digital Asset, you should
            conduct your own due diligence and consult your financial advisor.
            We are not responsible for the decisions you make to buy, earn, sell
            or hold Digital Assets based on the information provided by us,
            including any losses you incur arising from those decisions.
          </p>
          <div className="mb-6">
            <h1 className="inter-fonts text-white font-[700] text-[16px] sm:text-[24px] my-5">
              INFORMATION ABOUT OUR AGREEMENT WITH YOU
            </h1>
            <h3 className="text-white inter-fonts font-[600] text-[16px] sm:text-[18px]">
               Introduction:{' '}
            </h3>
            <p className="mt-5 text-white inter-fonts font-[400] text-[13px] sm:text-[14px] leading-6">
              Welcome to yozoon! By accessing our website and using our
              services, you agree to comply with and be bound by the following
              Terms of Service. If you do not agree with any part of these
              terms, please refrain from using our platform.
            </p>
            <h3 className="text-white my-5 inter-fonts font-[600] text-[16px] sm:text-[18px]">
              User Accounts:{' '}
            </h3>
            <ul className="list-disc list-inside ml-2 text-[14px]">
              <li className="inter-fonts font-[600]">
                To access certain features, you may need to create an account.
              </li>
              <li className="inter-fonts font-[600]">
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li className="inter-fonts font-[600]">
                Any activity under your account is your responsibility.
              </li>
            </ul>
            <h3 className="text-white my-5 inter-fonts font-[600] text-[16px] sm:text-[18px]">
              Payments & Transactions:
            </h3>
            <ul className="list-disc list-inside ml-2 text-[14px]">
              <li className="inter-fonts font-[600]">
                If applicable, all transactions must be completed securely
                through our payment gateway.
              </li>
              <li className="inter-fonts font-[600]">
                We are not responsible for transaction failures due to
                third-party services.
              </li>
              <li className="inter-fonts font-[600]">
                Refund policies, if any, will be stated separately.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <BottomSignup />
    </>
  );
};

export default TermsOfService;
