// src/components/common/Icon.tsx

import React from 'react';
import { FaPencilAlt, FaHistory, FaCog, FaStar, FaUserFriends, FaExclamationCircle } from 'react-icons/fa';
import { RiRobot3Line } from 'react-icons/ri';

interface IconProps {
  name: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, size = 24 }) => {
  switch (name) {
    case 'pencil':
      return <FaPencilAlt size={size} />;
    case 'agents':
      return <RiRobot3Line size={size} />;
    case 'history':
      return <FaHistory size={size} />;
    case 'settings':
      return <FaCog size={size} />;
    case 'star':
      return <FaStar size={size} />;
    case 'reputation':
      return <FaExclamationCircle size={size} />; // Replace with a better icon if available
    default:
      return <FaStar size={size} />;
  }
};

export default Icon;
