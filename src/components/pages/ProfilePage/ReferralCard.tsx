// src/components/pages/ProfilePage/ReferralCard.tsx

import React from 'react';
import Button from '../../common/Button';
import Icon from '../../common/Icon';
import { FaLink } from 'react-icons/fa';

interface ReferralCardProps {
  inviteLink: string;
  onInviteClick: () => void;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ inviteLink, onInviteClick }) => {
  return (
    <div className="referral-section p-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
      <p className="mb-4">
        Give your friends a <strong>25% discount</strong> for 1 week and earn a <strong>50% commission</strong> for
        life-long referrals.
      </p>
      <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center bg-white bg-opacity-20 p-2 rounded-lg w-full">
          <FaLink className="mr-2" />
          <input
            type="text"
            value={inviteLink}
            readOnly
            className="bg-transparent border-none focus:ring-0 text-white flex-1"
          />
        </div>
        <Button onClick={onInviteClick} variant="primary" className="w-full sm:w-auto">
          Invite a Friend
        </Button>
      </div>
      <p className="mt-4 text-sm">
        Share your unique invite link below to start earning rewards!
      </p>
    </div>
  );
};

export default ReferralCard;
