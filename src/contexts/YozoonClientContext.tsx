// import React, { createContext, useContext, useState } from "react";
// import { YozoonClient } from "../token-mill/utils/yozoon-client";

// export const YozoonClientContext = createContext<YozoonClient | null>(null);

// export const useYozoonClient = () => useContext(YozoonClientContext);

// export const YozoonClientProvider = ({ children }: { children: React.ReactNode }) => {
//   const [yozoonClient, setYozoonClient] = useState<YozoonClient | null>(null);

//   return (
//     <YozoonClientContext.Provider value={yozoonClient}>
//       {children}
//     </YozoonClientContext.Provider>
//   );
// };