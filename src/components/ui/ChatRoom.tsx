// src/components/ui/ChatRoom.tsx

import React, { useEffect, useState } from 'react';
interface ChatMessage {
  id: string;
  userId: string;
  coinId: string;
  message: string;
  createdAt: Date;
}
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { SocketContext } from '../../contexts/SocketContext';
import axios from 'axios';

interface ChatRoomProps {
  coinId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ coinId }) => {
  const { socket } = useContext(SocketContext);
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (!socket) return;

    // Join the coin's chat room
    socket.emit('joinRoom', { coinId });

    // Listen for incoming messages
    socket.on('message', (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/messages/${coinId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
      }
    };

    fetchMessages();

    // Clean up event listeners on unmount
    return () => {
      socket.off('message');
    };
  }, [socket, coinId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !session?.user?.id) return;

    const messagePayload = {
      userId: session.user.id,
      coinId,
      message: newMessage,
    };

    // Emit the message to the server
    if (socket) {
      socket.emit('chatMessage', messagePayload);
    }

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-96 bg-neutral-lightGray p-4 rounded-lg">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <span className="font-semibold text-primary-blue">{msg.userId}</span>: {msg.message}
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
        <div className="text-body">Please sign in to participate in the chat.</div>
      )}
    </div>
  );
};

export default ChatRoom;
