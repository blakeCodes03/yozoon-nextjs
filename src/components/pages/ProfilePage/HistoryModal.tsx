// ...existing code...
import React, { useState } from 'react';
import Modal from '../../common/Modal';
// import { VoteHistory } from './Profile'; // Ensure proper import path
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Mock agent tokens data (replace with real data as needed)
const mockAgents = [
  {
    id: 'agent-1',
    name: 'AlphaBot',
    telegramLink: 'https://t.me/YozoonBot?start=agent-1',
    discordLink:
      'https://discord.com/oauth2/authorize?client_id=123&scope=bot&permissions=8',
  },
  {
    id: 'agent-2',
    name: 'BetaBot',
    telegramLink: 'https://t.me/YozoonBot?start=agent-2',
    discordLink:
      'https://discord.com/oauth2/authorize?client_id=456&scope=bot&permissions=8',
  },
];

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  // voteHistory: VoteHistory[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  activeTab,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<
    (typeof mockAgents)[0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (agent: (typeof mockAgents)[0]) => {
    setSelectedAgent(agent);
    setDialogOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Agents':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Created Agents</h3>
            <ul className="space-y-2">
              {mockAgents.map((agent) => (
                <li
                  key={agent.id}
                  className="flex items-center justify-between  rounded p-2"
                >
                  <span className="font-medium">{agent.name}</span>
                  <button
                    className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]"
                    onClick={() => handleViewDetails(agent)}
                  >
                    Setup Agent
                  </button>
                </li>
              ))}
            </ul>
            {/* Dialog for agent details */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="max-w-[425px] lg:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2 p-2">
                    {selectedAgent?.name || 'Agent Details'}
                  </DialogTitle>
                  <DialogDescription className="mt-2 font-semibold ">
                    Setup your agent in Telegram or Discord to start using it.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center mb-4 ">
                  <div className="h-full flex items-center gap-1 justify-center font-semibold">
                    <span className="font-semibold">Agent ID: </span>
                    <code className="bg-gray-700 py-1 px-2 truncate rounded rounded-r-none max-w-[200px] md:max-w-full max-h-full ">
                      {selectedAgent?.id}
                    </code>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="mb-4 text-muted-foreground text-sm font-semibold">
                    Add @YozoonBot to your Telegram or Discord group to receive
                    updates.
                  </p>
                  <h4 className="font-semibold">Telegram</h4>
                  <p className="mb-2 text-muted-foreground text-sm font-semibold">
                    Click the link below to add @YozoonBot to your group. It
                    will automatically link to your agent.
                  </p>
                  <a
                    href={selectedAgent?.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]">
                      Add to Telegram
                    </button>
                  </a>
                  <p className="text-sm my-2">
                    Alternatively, add @YozoonBot manually and run: <br />
                    <code className="bg-gray-600 p-1 mt-1 rounded max-w-full">
                      /setup {selectedAgent?.id}
                    </code>
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold">Discord</h4>
                  <p className="mb-2 text-muted-foreground text-sm font-semibold">
                    Click the link below to add @YozoonBot to your server, then
                    run the setup command in a channel.
                  </p>
                  <a
                    href={selectedAgent?.discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline"
                  >
                    <button className="cursor-pointer px-2 py-1 text-sm font-semibold bg-[#FFB92D] text-white rounded shadow hover:bg-[#c28407]">
                      Add to Discord
                    </button>
                  </a>
                  <p className="text-sm mt-2">
                    After adding, run: <br />
                    <code className="bg-gray-600 p-1 rounded max-w-full">
                      !setup {selectedAgent?.id}
                    </code>
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
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
              <li>
                +10 Reputation for supporting successful coin XYZ on 01/01/2024
              </li>
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
// ...existing code...
