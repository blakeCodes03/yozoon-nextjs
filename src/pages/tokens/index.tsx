import React from 'react'
import { memecoins, Memecoin } from "../../components/ui/TrendingSectionTable"
import CoinInfo from '@/components/pages/CoinPage/CoinInfo'

const index = () => {
    // Fetch the memecoin data based on the ID (mock data used here)
      const coinData = memecoins; // fetch the first coin as an example
      const selectedCoin = coinData[0]; // Replace this with actual data fetching logic
  return (
    <>
    {/* <CoinInfo coinData={selectedCoin} /> */}
    </>
  )
}

export default index