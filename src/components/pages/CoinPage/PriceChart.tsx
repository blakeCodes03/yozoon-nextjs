'use client';

import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickSeries,
  CrosshairMode,
  Time,
} from 'lightweight-charts';
import { useRef, useEffect, useState } from 'react';
import { getOHLCData } from '@/lib/priceOHLCdata';
import axios from 'axios';
import { se } from 'date-fns/locale';

// Define the props interface for TypeScript
interface PriceChartProps {
  coinId: string;
}

  //!!mock data for price history
const mockOhlcData = [
  {
    timestamp: new Date('2025-09-30T09:00:00Z'),
    open: 25000,
    high: 25200,
    low: 24850,
    close: 25100,
  },
  {
    timestamp: new Date('2025-09-30T09:30:00Z'),
    open: 25100,
    high: 25300,
    low: 25000,
    close: 25050,
  },
  {
    timestamp: new Date('2025-09-30T10:00:00Z'),
    open: 25050,
    high: 25250,
    low: 24950,
    close: 25180,
  },
  {
    timestamp: new Date('2025-09-30T10:30:00Z'),
    open: 25180,
    high: 25350,
    low: 25050,
    close: 25220,
  },
  {
    timestamp: new Date('2025-09-30T11:00:00Z'),
    open: 25220,
    high: 25400,
    low: 25100,
    close: 25300,
  },
  {
    timestamp: new Date('2025-09-30T11:30:00Z'),
    open: 25300,
    high: 25450,
    low: 25200,
    close: 25250,
  },
  {
    timestamp: new Date('2025-09-30T12:00:00Z'),
    open: 25250,
    high: 25350,
    low: 25150,
    close: 25200,
  },
  {
    timestamp: new Date('2025-09-30T12:30:00Z'),
    open: 25200,
    high: 25300,
    low: 25050,
    close: 25300,
  },
  {
    timestamp: new Date('2025-09-30T13:00:00Z'),
    open: 25300,
    high: 25250,
    low: 24950,
    close: 25000,
  },
  {
    timestamp: new Date('2025-09-30T13:30:00Z'),
    open: 25000,
    high: 25150,
    low: 24850,
    close: 24900,
  },
  {
    timestamp: new Date('2025-09-30T14:00:00Z'),
    open: 24900,
    high: 25050,
    low: 24750,
    close: 24800,
  },
  {
    timestamp: new Date('2025-09-30T14:30:00Z'),
    open: 24800,
    high: 24950,
    low: 24650,
    close: 24700,
  },
  {
    timestamp: new Date('2025-09-30T15:00:00Z'),
    open: 24700,
    high: 24850,
    low: 24550,
    close: 24500,
  },
  {
    timestamp: new Date('2025-09-30T15:30:00Z'),
    open: 24500,
    high: 24750,
    low: 24450,
    close: 24500,
  },
  {
    timestamp: new Date('2025-09-30T16:00:00Z'),
    open: 24500,
    high: 24650,
    low: 24350,
    close: 24600,
  },
  {
    timestamp: new Date('2025-09-30T16:30:00Z'),
    open: 24600,
    high: 24550,
    low: 24250,
    close: 24300,
  },
  {
    timestamp: new Date('2025-09-30T17:00:00Z'),
    open: 24300,
    high: 24450,
    low: 24150,
    close: 24200,
  },
  {
    timestamp: new Date('2025-09-30T17:30:00Z'),
    open: 24200,
    high: 24350,
    low: 24050,
    close: 24800,
  },
  {
    timestamp: new Date('2025-09-30T18:00:00Z'),
    open: 24800,
    high: 24250,
    low: 23950,
    close: 24000,
  },
  {
    timestamp: new Date('2025-09-30T18:30:00Z'),
    open: 24000,
    high: 24150,
    low: 23850,
    close: 23900,
  },
  {
    timestamp: new Date('2025-09-30T19:00:00Z'),
    open: 23900,
    high: 24050,
    low: 23750,
    close: 23800,
  },
  {
    timestamp: new Date('2025-09-30T19:30:00Z'),
    open: 23800,
    high: 23950,
    low: 23750,
    close: 23900,
  },
  {
    timestamp: new Date('2025-09-30T20:00:00Z'),
    open: 23900,
    high: 23850,
    low: 23550,
    close: 23600,
  },
];




// Component to display the candlestick price chart
const PriceChart: React.FC<PriceChartProps> = ({ coinId }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [ohlcData, setOhlcData] = useState<
    {
      timestamp: Date;
      open: number;
      high: number;
      low: number;
      close: number;
    }[]
  >();
  
 useEffect(() => {
    setOhlcData(mockOhlcData); // Use mock data for now
  }, []); 
  // Initialize the chart when the component mounts
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        // height: 600,
        // localization: {
        //   priceFormatter: myPriceFormatter,
        // },

        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 8,
        },

        layout: {
          background: { color: '#000000' },
          textColor: '#ffff',
        },
        grid: {
          vertLines: { color: '#212121' },
          horzLines: { color: '#212121' },
        },
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
          mode: CrosshairMode.Normal,

          // Vertical crosshair line (showing Date in Label)
          vertLine: {
            labelBackgroundColor: '#FFB92D',
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: '#FFB92D',
            labelBackgroundColor: '#FFB92D',
          },
        },
      });
      chartRef.current = chart;
      chartRef.current.timeScale().fitContent();

      // Add candlestick series
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#26a69a', // Green for rising candles
        downColor: '#ef5350', // Red for falling candles
        borderVisible: false,
        wickUpColor: '',
        wickDownColor: '',
      });
      seriesRef.current = candlestickSeries;


      // Handle window resize to keep the chart responsive
      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.resize(chartContainerRef.current.clientWidth, 300);
        }
      };
      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, []);

  useEffect(() => {
  if (seriesRef.current && ohlcData) {
    const formattedData = ohlcData.map((data) => ({
      time: Math.floor(new Date(data.timestamp).getTime() / 1000) as Time, // Convert to UNIX timestamp
      open: data.open,
      high: data.high,
      low: data.low,
      close: data.close,
    }));
    seriesRef.current.setData(formattedData);
  }
}, [ohlcData]);



  // Fetch OHLC data every 5 minutes
  // useEffect(() => {
  //   const fetchOHLCData = async () => {
  //     try {
  //       const response = await axios.get('/api/coins/price-data', {
  //         params: { id: coinId },
  //       });

  //       if (response.status !== 200) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       if (!response.data.priceHistory || response.data.priceHistory.length === 0) {
  //         console.warn('No price history data available');
  //         return;
  //       }
  //       const data = await getOHLCData(response.data.priceHistory);
  //       setOhlcData(data);
  //       console.log('Prices updated');
  //     } catch (error) {
  //       console.error('Error updating prices', error);
  //     }
  //   };

  //   // Fetch immediately on mount
  //   fetchOHLCData();

  //   // Set up interval to fetch every 5 minutes
  //   const interval = setInterval(fetchOHLCData, 5 * 60 * 1000); // = 5 minutes

  //   // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [coinId]);
  


  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
  );
};

// // Get the current users primary locale
// const currentLocale = window.navigator.languages[0];
// // Create a number format using Intl.NumberFormat
// const myPriceFormatter = Intl.NumberFormat(currentLocale, {
//   style: 'currency',
//   currency: 'USD', // Currency for data points
// }).format;

export default PriceChart;
