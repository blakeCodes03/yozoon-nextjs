// src/components/ui/ChatRoom.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import axios from 'axios';
import SmallerLoaderSpin from '../common/SmallerLoaderSpin';
import { formatDistanceToNow } from 'date-fns';
import Spinner from '../common/Spinner';

interface ChatRoomProps {
  coinId: string;
}

interface Replies {
  id: string;
  userId: string;
  coinId: string;
  message: string;
  createdAt: Date | string;
  user: {
    id: string;
    username: string;
    pictureUrl: string;
  };
}

const mockRepliess: Replies[] = [
  {
    id: '1',
    userId: 'user123',
    coinId: 'coin1',
    message: 'This is a great coin!',
    createdAt: new Date('2025-04-01T10:30:00Z'),
    user: {
      id: 'user123',
      username: 'CryptoFan123',
      pictureUrl:
        'https://images.pexels.com/photos/8369658/pexels-photo-8369658.jpeg',
    },
  },
  {
    id: '2',
    userId: 'user456',
    coinId: 'coin1',
    message: 'I think this coin has a lot of potential.',
    createdAt: new Date('2025-04-01T11:00:00Z'),
    user: {
      id: 'user456',
      username: 'BlockchainGuru',
      pictureUrl:
        'https://images.pexels.com/photos/10031276/pexels-photo-10031276.jpeg',
    },
  },
  {
    id: '3',
    userId: 'user789',
    coinId: 'coin1',
    message: 'Does anyone know the roadmap for this coin?',
    createdAt: new Date('2025-04-01T11:30:00Z'),
    user: {
      id: 'user789',
      username: 'InvestorJoe',
      pictureUrl:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
  },
];

const fetchCoinReplies = async (coinId: string): Promise<Replies[]> => {
  const response = await axios.get(`/api/coin/${coinId}/comments`);
  const data = response.data;

  // Example mock data for the "data" variable in Profile.tsx
  return data;
};

const CoinReplies: React.FC<ChatRoomProps> = ({ coinId }) => {
  const closeDialogref = React.createRef<HTMLButtonElement>();
  const openDialogref = React.createRef<HTMLButtonElement>(); //to open the dialog when "Post a Reply" button is clicked
  const { socket } = useContext(SocketContext);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Replies[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [postReplyError, setPostReplyError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // !!!uncoment real data
  // Fetch coin comments data
  // const {
  //   data: replies,
  //   error: getRepliesError,
  //   isLoading,
  // } = useQuery<Replies[], Error>({
  //   queryKey: ['coinId', coinId],
  //   queryFn: () => fetchCoinReplies(coinId),
  //   enabled: !!coinId,
  //   refetchInterval: 300000, // Poll every 1 minute
  //   refetchIntervalInBackground: false, // Stop polling when the tab is inactive
  // });

  // useEffect(() => {
  //   if (!socket) return;

  //   // Join the coin's chat room
  //   socket.emit('joinRoom', { coinId });

  //   // Listen for incoming messages
  //   socket.on('message', (message: Replies) => {
  //     setMessages((prevMessages) => [...prevMessages, message]);
  //   });

  //   // Fetch existing messages
  //   const fetchMessages = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await axios.get(`/api/coins/${coinId}/comments`);
  //       setMessages(response.data);

  //       //! Mock data for testing
  //       // setMessages(mockRepliess);

  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching chat messages:', error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchMessages();

  //   // Clean up event listeners on unmount
  //   return () => {
  //     socket.off('message');
  //   };
  // }, [socket, coinId]);

  const postReplyMutation = useMutation({
    mutationFn: async (newReply: {
      userId: string;
      coinId: string;
      message: string;
    }) => {
      const response = await axios.post(
        `/api/coin/${newReply.coinId}/comments`,
        newReply
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to post reply');
      }

      return response.data;
    },
    onSuccess: () => {
      // Invalidate the query to refetch replies after posting a new one
      queryClient.invalidateQueries({ queryKey: ['coinId', coinId] });
      setNewMessage('');
      setLoading(false);
    },
    onError: (error: any) => {
      console.error('Error posting reply:', error);
      setLoading(false);
      setPostReplyError('An error occurred while posting the reply');
      return;
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !session?.user?.id) return;
    setPostReplyError(null);

    setLoading(true);
    // Call the mutation function
    postReplyMutation.mutate({
      userId: session.user.id,
      coinId,
      message: newMessage,
    });

    setNewMessage('');
    // Delay closing the message dialog by 3 seconds
    setTimeout(() => {
      closeMessageDialog();
    }, 2000);
    setLoading(false);
  };

  const closeMessageDialog = () => {
    if (closeDialogref.current) {
      closeDialogref.current.click();
    }
  };

  const openMessageDialog = () => {
    if (openDialogref.current) {
      openDialogref.current.click();
    }
  };

  return (
    <div className="border-1 border-[#4B4B4B] p-2 sm:px-4 rounded-[10px] my-5">
      {/* {isLoading && (
        <div className="flex items-center justify-center h-32">
          {' '}
          <Spinner />
        </div>
      )} */}
      {/* {getRepliesError && (
        <div className="text-red-500 mb-1 font-bold">
          Failed to Load Replies
        </div>
      )} */}

      {/* Scrollable container for replies */}
      <div className="max-h-[400px] overflow-y-auto">
        {/* {replies?.map((msg) => ( */}
        {mockRepliess?.map((msg) => (
          <div
            key={msg.id}
            className="bg-[#1E2329] px-2 sm:px-5 py-2 rounded-[10px] my-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <Avatar>
                  <AvatarImage
                    src={
                      msg.user.pictureUrl || '/assets/avatar/default-avatar.png'
                    }
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {/* <img
                  className="w-[35px] h-auto rounded-full object-cover"
                  src={msg.user.pictureUrl || '/assets/avatar/default-avatar.png'}
                  alt="User profile image"
                /> */}
                <h1 className="sofia-fonts font-[700] text-[12px] sm:text-[16px] text-white">
                  {msg.user?.username || 'Unknown User'}
                </h1>
                <span className="sofia-fonts font-[400] text-[12px] sm:text-[14px] text-white">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <i className="fas fa-heart"></i>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="sofia-fonts font-[400] text-white text-[12px]">
                {msg.message}
              </p>
              <span className="replyBtn inter-fonts font-[700] text-[12px] text-[#FFB92D] cursor-pointer">
                Reply
              </span>
            </div>
          </div>
        ))}
        <div className="flex items-end justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="hidden"
                disabled={loading}
                type="button"
                ref={openDialogref} //to open the dialog when "Post a Reply" button is clicked
              ></button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Post a Reply</DialogTitle>
              </DialogHeader>
              {postReplyError && (
                <div className="text-red-500 font-bold mb-2">
                  {postReplyError}
                </div>
              )}
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="message" className="sr-only">
                    Message
                  </Label>
                  <Input
                    id="message"
                    placeholder="Post reply"
                    className="w-full"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  id="sendBtn"
                  className="text-[#FFB92D]  flex inter-fonts font-[700] text-[16px]"
                  disabled={loading || !newMessage.trim() || !session?.user?.id}
                  onClick={handleSendMessage}
                  type="button"
                >
                  Send {loading && <SmallerLoaderSpin />}
                </button>
              </DialogFooter>
              <DialogClose asChild className="hidden">
                <Button type="button" variant="secondary" ref={closeDialogref}>
                  Close
                </Button>
              </DialogClose>
              {/* //show alert if user is not logged in */}
              {!session?.user?.id && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Please log in to post a reply.
                  </AlertDescription>
                </Alert>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end px-2">
        <button
          className="text-[#FFB92D] inter-fonts font-[700] text-[16px]"
          disabled={loading}
          type="button"
          onClick={openMessageDialog}
        >
          Post a Reply
        </button>
      </div>

      {/* //old code */}
      {/* <div className="flex flex-col h-96 bg-neutral-lightGray p-4 rounded-lg">
        <div className="flex-grow overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <span className="font-semibold text-primary-blue">
                {msg.userId}
              </span>
              : {msg.message}
            </div>
          ))}
        </div>
        {session ? (
          <div className="flex">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-neutral-darkGray rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-blue"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-primary-blue text-neutral-white rounded-r-md hover:bg-primary-blue-dark focus:outline-none"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-body">
            Please sign in to participate in the chat.
          </div>
        )}
      </div> */}
    </div>
  );
};

export default CoinReplies;
