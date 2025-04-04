import React from 'react'

const BottomSignup: React.FC = () => {
  return (
    <section className="mt-7 EarningToday-sec bg-[#1E2329]">
        <div className="container mx-auto px-4 py-5 lg:px-10 xl:px-25 lg:py-12 text-center">
          <h1 className="text-[16px] md:text-[30px] sofia-fonts font-[600] text-white mb-3.5">
            Start Earning Today
          </h1>
          <div>
            <button className="colfaxfont bg-[#FFB92D] hover:bg-white hover:text-[#FFB92D] hover:border-1 hover:border-[#FFB92D] text-black text-xs md:text-sm md:font-[700] rounded-lg px-7 py-2 font-[500] shadow-xs shadow-black transition-all duration-300 ease-in-out">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
  )
}

export default BottomSignup