import { useRouter } from "next/router";
import { memecoins, Memecoin } from "../../components/ui/TrendingSectionTable"; // Import mock data
import CoinInfo from "@/components/pages/CoinPage/CoinInfo";

const CoinPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the memecoin ID from the URL

  // Fetch the memecoin data based on the ID (mock data used here)
  const coinData = memecoins; // Replace this with actual data fetching logic
  const selectedCoin = coinData.find((coin: Memecoin) => coin.id === id);

  if (!coinData) {
    return <p>Loading...</p>; // Show a loading state if data is not available
  }

  return (
    <div>
      {/* Pass the coin data to the CoinInfo component */}
      <CoinInfo coinData={selectedCoin} />
    </div>
  );
};

export default CoinPage;