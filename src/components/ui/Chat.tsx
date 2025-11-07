// import Button from "./../common/Button";
// import SmallerLoaderSpin from "./../common/SmallerLoaderSpin";
// import useAuthentication, { fetchWithAuth } from "@/hooks/use-authentication";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { clsx } from "clsx";
// import { Image as ImageIcon, RefreshCw, Send, User as UserIcon } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useInView } from "react-intersection-observer";
// import { Link, useLocation, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { ChatImage } from "./ChatImage";

// // --- API Base URL ---
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// // --- Chat Types ---
// interface ChatMessage {
//   id: string;
//   author: string; // User's public key
//   displayName?: string | null; // Optional: Author's display name
//   profileImage?: string | null; // Optional: Author's profile picture URL
//   tokenMint: string;
//   message: string;
//   parentId?: string | null;
//   timestamp: string;
//   isOptimistic?: boolean; // Flag for optimistically added messages
//   media?: string; // Added media field
// }

// interface GetMessagesResponse {
//   success: boolean;
//   messages?: ChatMessage[];
//   error?: string;
// }

// const CHAT_MESSAGE_LIMIT = 50; // Define limit constant

// export default function Chat({ maxHeight = "600px" }: { maxHeight?: string }) {
//   const { publicKey } = useWallet();
//   const { isAuthenticated } = useAuthentication();
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isChatLoading, setIsChatLoading] = useState(false);
//   const [isSendingMessage, setIsSendingMessage] = useState(false);
//   const [chatError, setChatError] = useState<string | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const [isRefreshingMessages, setIsRefreshingMessages] = useState(false);

//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [imageCaption, setImageCaption] = useState("");

//   // --- Pagination State ---
//   const [currentOffset, setCurrentOffset] = useState(0);
//   const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
//   const [hasOlderMessages, setHasOlderMessages] = useState(true);
//   const { ref: topSentinelRef, inView: isTopSentinelInView } = useInView({
//     threshold: 0,
//   });

//   // Get token mint from URL params
//   const { mint: tokenMint } = useParams<{ mint: string }>();

//   // --- Scrolling Helper ---
//   const scrollToBottom = useCallback((forceScroll = false) => {
//     if (!chatContainerRef.current) return;

//     const scrollThreshold = 100; // Pixels from bottom
//     const isNearBottom =
//       chatContainerRef.current.scrollHeight - chatContainerRef.current.clientHeight <=
//       chatContainerRef.current.scrollTop + scrollThreshold;

//     if (forceScroll || isNearBottom) {
//       setTimeout(() => {
//         if (chatContainerRef.current) {
//           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//         }
//       }, 10);
//     }
//   }, []);

//   const handleScroll = () => {
//     if (!chatContainerRef.current) return;

//     const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
//     const isNearBottom = scrollHeight - clientHeight <= scrollTop + 150; // 150px threshold
//   };

//   // --- Fetch Initial Messages ---
//   const fetchChatMessages = useCallback(
//     async (mint: string, isInitialLoad = false) => {
//       if (!mint) return;
//       setIsChatLoading(true);
//       setChatError(null);
//       if (isInitialLoad) {
//         setChatMessages([]); // Clear messages on initial load
//         setCurrentOffset(0); // Reset offset
//         setHasOlderMessages(true); // Reset pagination status
//       }

//       const url = `${API_BASE_URL}/api/chat/${mint}?limit=${CHAT_MESSAGE_LIMIT}&offset=0`;
//       try {
//         const response = await fetchWithAuth(url);
//         const data: GetMessagesResponse = await response.json();

//         if (!response.ok || !data.success || !data.messages) {
//           throw new Error(data.error || "Failed to fetch messages");
//         }

//         const sortedMessages = data.messages.sort(
//           (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//         );

//         setChatMessages(sortedMessages);
//         setCurrentOffset(sortedMessages.length); // Set offset for the next fetch
//         setHasOlderMessages(sortedMessages.length === CHAT_MESSAGE_LIMIT); // Assume more if we got a full page

//         if (isInitialLoad) {
//           scrollToBottom(true);
//         }

//         setChatError(null); // Clear error on success
//       } catch (error: any) {
//         console.error("Error fetching chat messages:", error);
//         setChatError(error?.message || "Could not load chat messages.");
//         setChatMessages([]); // Clear messages on error
//       } finally {
//         setIsChatLoading(false);
//         setIsRefreshingMessages(false);
//       }
//     },
//     [API_BASE_URL, fetchWithAuth, scrollToBottom]
//   );

//   // --- Fetch Older Messages (Pagination) ---
//   const fetchOlderMessages = useCallback(async () => {
//     if (isLoadingOlderMessages || !hasOlderMessages || !tokenMint) return;

//     setIsLoadingOlderMessages(true);
//     setChatError(null);

//     const url = `${API_BASE_URL}/api/chat/${tokenMint}?limit=${CHAT_MESSAGE_LIMIT}&offset=${currentOffset}`;

//     try {
//       const response = await fetchWithAuth(url);
//       const data: GetMessagesResponse = await response.json();

//       if (!response.ok || !data.success || !data.messages) {
//         throw new Error(data.error || "Failed to fetch older messages");
//       }

//       const sortedOlderMessages = data.messages.sort(
//         (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//       );

//       if (sortedOlderMessages.length > 0) {
//         setChatMessages((prev) => [...sortedOlderMessages, ...prev]);
//         setCurrentOffset((prevOffset) => prevOffset + sortedOlderMessages.length);
//       }

//       setHasOlderMessages(sortedOlderMessages.length === CHAT_MESSAGE_LIMIT);
//     } catch (error: any) {
//       console.error("Error fetching older messages:", error);
//       setChatError(error.message || "Could not load older messages.");
//       setHasOlderMessages(false);
//     } finally {
//       setIsLoadingOlderMessages(false);
//     }
//   }, [tokenMint, isLoadingOlderMessages, hasOlderMessages, currentOffset, fetchWithAuth, API_BASE_URL]);

//   // --- Effect to Load Older Messages on Scroll ---
//   useEffect(() => {
//     if (isTopSentinelInView && !isChatLoading && !isLoadingOlderMessages && hasOlderMessages) {
//       fetchOlderMessages();
//     }
//   }, [isTopSentinelInView, isChatLoading, isLoadingOlderMessages, hasOlderMessages, fetchOlderMessages]);

//   // --- Effect for Initial Load ---
//   useEffect(() => {
//     if (tokenMint) {
//       fetchChatMessages(tokenMint, true);
//     } else {
//       setChatMessages([]);
//       setChatError(null);
//       setIsChatLoading(false);
//       setCurrentOffset(0);
//       setHasOlderMessages(true);
//     }
//   }, [tokenMint, fetchChatMessages]);

//   // --- Send Chat Message ---
//   const handleSendMessage = useCallback(async () => {
//     if (!publicKey || !tokenMint) return;
//     if (isSendingMessage) return;

//     const messageText = selectedImage ? imageCaption.trim() : chatInput.trim();
//     let mediaBase64: string | null = null;

//     if (!messageText && !selectedImage) {
//       toast.error("Please enter a message or select an image.");
//       return;
//     }

//     setIsSendingMessage(true);

//     if (selectedImage) {
//       try {
//         mediaBase64 = await new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => resolve(reader.result as string);
//           reader.onerror = (error) => reject(error);
//           reader.readAsDataURL(selectedImage);
//         });
//       } catch (error) {
//         console.error("Error reading image file:", error);
//         toast.error("Failed to read image file.");
//         setIsSendingMessage(false);
//         return;
//       }
//     }

//     const payload = {
//       message: messageText,
//       media: mediaBase64,
//     };

//     const optimisticId = `optimistic-${Date.now()}`;
//     const optimisticMessage: ChatMessage = {
//       id: optimisticId,
//       author: publicKey.toBase58(),
//       displayName: "You",
//       profileImage: null,
//       tokenMint: tokenMint,
//       message: messageText,
//       media: imagePreview || undefined,
//       timestamp: new Date().toISOString(),
//       isOptimistic: true,
//     };

//     setChatMessages((prev) => [...prev, optimisticMessage]);
//     scrollToBottom(true);

//     setChatInput("");
//     setImageCaption("");
//     setSelectedImage(null);
//     setImagePreview(null);

//     try {
//       const response = await fetchWithAuth(`${API_BASE_URL}/api/chat/${tokenMint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.error || "Failed to send message");
//       }

//       setChatMessages((prev) =>
//         prev.map((msg) => (msg.id === optimisticId ? { ...result.message, isOptimistic: false } : msg))
//       );
//     } catch (error: any) {
//       console.error("Error sending message:", error);
//       toast.error(`Error: ${error.message || "Could not send message"}`);
//       setChatMessages((prev) => prev.filter((msg) => msg.id !== optimisticId));
//     } finally {
//       setIsSendingMessage(false);
//     }
//   }, [publicKey, tokenMint, chatInput, selectedImage, imageCaption, imagePreview, fetchWithAuth, scrollToBottom]);

//   return (
//     <div
//       className={clsx(
//         "relative flex flex-col bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden shadow-xl"
//       )}
//       style={{ height: maxHeight }}
//     >
//       <div
//         ref={chatContainerRef}
//         className="flex-1 h-full overflow-y-auto scroll-smooth px-3 pb-2 flex flex-col relative"
//         onScroll={handleScroll}
//       >
//         <div ref={topSentinelRef} style={{ height: "1px" }} />

//         {isLoadingOlderMessages && (
//           <div className="flex items-center justify-center py-2">
//             <SmallerLoaderSpin />
//           </div>
//         )}

//         {!hasOlderMessages && chatMessages.length > 0 && !isLoadingOlderMessages && (
//           <div className="text-center text-gray-500 text-xs py-2">Beginning of chat history</div>
//         )}

//         {(isChatLoading && chatMessages.length === 0) && !isLoadingOlderMessages && (
//           <div className="flex-1 flex items-center justify-center w-full h-full">
//             <SmallerLoaderSpin />
//           </div>
//         )}

//         {chatError && !isChatLoading && !isLoadingOlderMessages && (
//           <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
//             <p className="text-red-500 mb-2">{chatError}</p>
//             <Button onClick={() => fetchChatMessages(tokenMint || "", true)} disabled={isChatLoading || isRefreshingMessages}>
//               {isRefreshingMessages ? <SmallerLoaderSpin /> : "Try Again"}
//             </Button>
//           </div>
//         )}

//         {!isChatLoading && chatMessages.length === 0 && !chatError && !isLoadingOlderMessages && (
//           <div className="flex-1 flex flex-col items-center justify-center h-full text-center py-16">
//             <p className="text-gray-500 mb-2">No messages yet in this chat.</p>
//             {!isAuthenticated && <p className="text-yellow-500 text-sm">Connect your wallet to chat.</p>}
//           </div>
//         )}

//         {!isChatLoading &&
//           chatMessages.map((msg) => {
//             const displayName =
//               msg.displayName ||
//               `${msg.author.substring(0, 4)}...${msg.author.substring(msg.author.length - 4)}`;
//             const profilePicUrl = msg.profileImage;

//             return (
//               <div key={msg.id} className={`flex gap-2 py-2 ${msg.isOptimistic ? "opacity-70" : ""}`}>
//                 <Link to={`/profiles/${msg.author}`} className="flex-shrink-0 mt-1 self-start">
//                   {profilePicUrl ? (
//                     <img
//                       src={profilePicUrl}
//                       alt={`${displayName}'s avatar`}
//                       className="w-8 h-8 rounded-full object-cover border border-neutral-600"
//                       onError={(e) => {
//                         e.currentTarget.src = "/default-avatar.png";
//                         e.currentTarget.onerror = null;
//                       }}
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center border border-neutral-600">
//                       <UserIcon className="w-4 h-4 text-neutral-400" />
//                     </div>
//                   )}
//                 </Link>

//                 <div className={`ml-1 max-w-[85%]`}>
//                   <div className="flex justify-start items-center mb-1 gap-3">
//                     <Link
//                       to={`/profiles/${msg.author}`}
//                       className="text-xs font-medium text-neutral-300 hover:text-white hover:underline truncate"
//                     >
//                       {displayName}
//                     </Link>
//                     <span className="text-xs text-gray-400 flex-shrink-0">
//                       {new Date(msg.timestamp).toLocaleTimeString()}
//                     </span>
//                   </div>
//                   {msg.media ? (
//                     <div className="flex flex-col gap-1 mt-1">
//                       <ChatImage
//                         author={msg.author}
//                         timestamp={msg.timestamp}
//                         imageUrl={msg.media}
//                         caption={msg.message || undefined}
//                       />
//                     </div>
//                   ) : (
//                     <p className="text-sm break-words whitespace-pre-wrap my-1">{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       <div className="p-2 flex-shrink-0 border-t border-gray-700 bg-black/50">
//         <div className="flex items-center space-x-2">
//           <label className="cursor-pointer flex-shrink-0">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 if (file) {
//                   const reader = new FileReader();
//                   reader.onloadend = () => setImagePreview(reader.result as string);
//                   reader.readAsDataURL(file);
//                   setSelectedImage(file);
//                 }
//               }}
//               className="hidden"
//             />
//             <div className="w-10 h-10 border-2 border-gray-600 flex items-center justify-center transition-all">
//               <ImageIcon className="w-5 h-5 text-gray-500" />
//             </div>
//           </label>

//           <input
//             type="text"
//             value={selectedImage ? imageCaption : chatInput}
//             onChange={(e) =>
//               selectedImage ? setImageCaption(e.target.value) : setChatInput(e.target.value)
//             }
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Type your message..."
//             className="flex-1 h-10 border bg-gray-800 border-gray-600 text-white focus:outline-none focus:border-[#03FF24] focus:ring-1 focus:ring-[#03FF24] px-3 text-sm"
//           />

//           <button
//             onClick={handleSendMessage}
//             disabled={isSendingMessage || (!selectedImage && !chatInput.trim())}
//             className="h-10 px-4 bg-[#03FF24] text-black hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
//           >
//             {isSendingMessage ? "Sending..." : <Send size={18} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }