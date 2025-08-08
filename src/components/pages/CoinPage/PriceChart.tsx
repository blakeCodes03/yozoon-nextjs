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

// Define the props interface for TypeScript
interface PriceChartProps {
  coinId: string;
}

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

  // Initialize the chart when the component mounts
  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        // height: 600,
        localization: {
          priceFormatter: myPriceFormatter,
        },

        timeScale: {
          timeVisible: true,
          secondsVisible: false,
          barSpacing: 12,
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
  useEffect(() => {
    const fetchOHLCData = async () => {
      try {
        const response = await axios.get('/api/coins/price-data', {
          params: { id: coinId },
        });

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (!response.data.priceHistory || response.data.priceHistory.length === 0) {
          console.warn('No price history data available');
          return;
        }
        const data = await getOHLCData(response.data.priceHistory);
        setOhlcData(data);
        console.log('Prices updated');
      } catch (error) {
        console.error('Error updating prices', error);
      }
    };

    // Fetch immediately on mount
    fetchOHLCData();

    // Set up interval to fetch every 5 minutes
    const interval = setInterval(fetchOHLCData, 5 * 60 * 1000); // = 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [coinId]);
  


  return (
    <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
  );
};

// Get the current users primary locale
const currentLocale = window.navigator.languages[0];
// Create a number format using Intl.NumberFormat
const myPriceFormatter = Intl.NumberFormat(currentLocale, {
  style: 'currency',
  currency: 'USD', // Currency for data points
}).format;

export default PriceChart;
