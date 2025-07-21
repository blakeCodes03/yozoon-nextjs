// src/components/pages/ProfilePage/InviteFriendModal.tsx

import React from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { FaWhatsapp, FaTelegram, FaTwitter, FaCopy } from 'react-icons/fa';

interface InviteFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  inviteLink: string;
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({ isOpen, onClose, inviteLink }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp />,
      url: `https://wa.me/?text=${encodeURIComponent(inviteLink)}`,
    },
    {
      name: 'Telegram',
      icon: <FaTelegram />,
      url: `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}`,
    },
    {
      name: 'Twitter',
      icon: <FaTwitter />,
      url: `https://x.com/intent/tweet?url=${encodeURIComponent(inviteLink)}&text=Join%20me%20on%20Yozoon!`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Friends">
      <div className="space-y-4">
        <p>Share your unique invite link to earn rewards!</p>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="w-full px-3 py-2 border border-line rounded focus:outline-none focus:ring-2 focus:ring-accentBlue"
          />
          <button onClick={handleCopy} className="btn btn-secondary flex items-center">
            <FaCopy className="mr-2" /> Copy
          </button>
        </div>
        <div className="flex justify-around">
          {shareOptions.map((option) => (
            <a
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-accentBlue hover:text-neonBlue transition-colors"
            >
              {option.icon}
              <span className="text-sm">{option.name}</span>
            </a>
          ))}
        </div>
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default InviteFriendModal;
