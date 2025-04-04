// src/components/pages/ProfilePage/HistoryModal.tsx

import React from 'react';
import Modal from '../../common/Modal';
import { VoteHistory } from './Profile'; // Ensure proper import path

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  voteHistory: VoteHistory[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, activeTab, voteHistory }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'History':
        return <p>Complete History Content Goes Here.</p>;
      case 'Settings':
        return <p>Settings Content Goes Here.</p>;
      case 'Favorites':
        return <p>Favorites Content Goes Here.</p>;
      case 'ReputationHistory':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Reputation History</h3>
            <ul className="list-disc list-inside">
              {/* Example Data */}
              <li>+10 Reputation for supporting successful coin XYZ on 01/01/2024</li>
              <li>-5 Reputation for voting on scam coin ABC on 02/01/2024</li>
              {/* Replace with actual data */}
            </ul>
          </div>
        );
      default:
        return <p>No Content Available.</p>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activeTab}>
      <div className="space-y-4">{renderContent()}</div>
    </Modal>
  );
};

export default HistoryModal;
