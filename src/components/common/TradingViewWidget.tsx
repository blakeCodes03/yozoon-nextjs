// src/components/common/TradingViewWidget.tsx

import React, { useEffect } from 'react';

interface TradingViewWidgetProps {
  symbol: string; // e.g., "BTCUSD"
}

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({ symbol }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.TradingView) {
      new window.TradingView.widget({
        width: '100%',
        height: 500,
        symbol: symbol,
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        hide_side_toolbar: false,
        container_id: 'tradingview_chart',
      });
    }
  }, [symbol]);

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview_chart" />
    </div>
  );
};

export default TradingViewWidget;
