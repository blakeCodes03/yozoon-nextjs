import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  ShieldCheck,
  ShieldAlert,
  AlertCircleIcon,
  ChevronDownIcon,
} from 'lucide-react';
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
} from '@reown/appkit/react';
import BuyYozoon from '@/components/ui/BuyYozoon';
import Spinner from '@/components/common/Spinner';

interface ActiveProposalProps {
  coinId: string; // Define the type for the coinId prop
}

const ActiveProposal: React.FC<ActiveProposalProps> = ({ coinId }) => {
  const [proposals, setProposals] = useState<any[]>([]); // State to store proposals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [yozoonBalance, setYozoonBalance] = useState<number>(0);
  const [hasSufficientYozoon, setHasSufficientYozoon] =
    useState<boolean>(false);
  const { address, isConnected } = useAppKitAccount();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);  
  const [voteLoading, setVoteLoading] = useState<boolean>(false);

  //to handle opening/closing of buy-yozoon side drawer
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  

  

  
  // Fetch proposals from the GET endpoint
  const fetchProposals = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/coins/${coinId}/proposals`, {
        params: { coinId }, // Pass coinId as a query parameter
      });
      setProposals(response.data); // Store proposals in state
    } catch (err: any) {
      setError( 'Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  // Place a vote using the PUT endpoint
  const placeVote = async (proposalId: string, vote: number) => {
    setVoteLoading(true);
    setError('');

    // implement vote staking logic here 
    try {
      await axios.put(`/api/coins/${coinId}/proposals`, {
        proposalId,
        vote, // 1 for "for", -1 for "against"
        coinId,
      });
      // Refresh proposals after voting
      fetchProposals();
      setDialogOpen(false); // Close the dialog after voting
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place vote');
    } finally {
      setVoteLoading(false);
    }
  };

  const votesForSliderWidth = (votesFor:number, votesAgainst:number) => {
    return (Math.round((votesFor/(votesFor + votesAgainst))*100))
  }
  const votesAgainstSliderWidth = (votesFor:number, votesAgainst:number) => {
    return (Math.round((votesAgainst/(votesFor + votesAgainst))*100))
  }


  // Fetch proposals on component mount
  useEffect(() => {
    fetchProposals();
  }, [coinId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {loading ? (
        <p className="text-white flex items-center justify-center">Loading proposals...</p>
      ) : error ? (
        <p className="text-red-500 flex items-center justify-center"></p>
      ) : proposals.length === 0 ? (
        <p className="text-white flex items-center justify-center">No proposals for this coin.</p>
      ) : (
        proposals.map((proposal) => (
          <div className="bg-[#1E2329] p-4 rounded-[10px] shadow-lg">
            <div className="block sm:flex justify-between items-center mb-2">
              <h2 className="sofia-fonts font-[600] text-[18px] sm:text-[20px] text-white">
                {proposal.title}
              </h2>
              <div className="text-sm text-gray-400 flex items-center">
                <i className="far fa-clock text-white mr-3"></i>
                <span className="sofia-fonts font-[500] text-[16px] sm:text-[18px] text-white">
                  Ends {proposal.votingEnds}
                </span>
              </div>
            </div>
            <p className="text-[#BABABA] robboto-fonts font-[500] text-[14px] mb-4 overflow-hidden text-ellipsis whitespace-nowrap">
              {proposal.description}
            </p>
            <div className="flex justify-between text-sm mb-2">
              <span className="sofia-fonts font-[700] text-white text-[13px]">
                For: {proposal.votesFor}
              </span>
              <span className="sofia-fonts font-[700] text-white text-[13px]">
                Against: {proposal.votesAgainst}
              </span>
            </div>
            <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-[#2EBD85]"
                style={{ width: votesForSliderWidth(proposal.votesFor, proposal.votesAgainst) + '%' }}
              ></div>
              <div
                className="absolute right-0 top-0 h-full bg-[#F6465D]"
                style={{ width: votesAgainstSliderWidth(proposal.votesFor, proposal.votesAgainst) + '%' }}
              ></div>
            </div>
            <div className="flex items-center justify-center mt-2">
              <button
                className="bg-[#FFB92D] cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px]  hover:bg-[#ffb92d]"
                onClick={() => setDialogOpen(true)}
              >
                Vote
              </button>
            </div>
            {/* // Vote Dialog */}
            <Dialog
              open={dialogOpen}
              onOpenChange={(isOpen) => setDialogOpen(isOpen)}
            >
              <DialogContent className="max-w-[425px] lg:max-w-[600px] overflow-y-auto max-h-[90vh]">
                {error && (
                  <div>
                    <Alert variant="destructive">
                      <AlertCircleIcon className="mr-2 h-4 w-4" />
                      <AlertTitle></AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </div>
                )}
                <DialogHeader className="text-center flex ">
                  <DialogTitle className="text-2xl font-bold gap-2 p-2">
                    {proposal.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 font-semibold ">
                    {proposal.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6">
                  {!isConnected ? (
                    <Alert variant="destructive">
                      <AlertCircleIcon />
                      <AlertTitle>Please connect your wallet</AlertTitle>
                    </Alert>
                  ) : hasSufficientYozoon ? (
                    <Alert className="bg-green-600">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <AlertTitle>Sufficient Yozoon tokens</AlertTitle>
                      <AlertDescription>
                        You hold sufficient YOZOON tokens to cast vote.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <AlertTitle>Insufficient YOZOON tokens</AlertTitle>
                      <AlertDescription>
                        You need at least 100 Yozoon tokens to vote. <br />
                        <a
                          href="#"
                          className="underline text-blue-400"
                          onClick={handleOpenDrawer}
                        >
                          Purchase YOZOON
                        </a>
                        <BuyYozoon
                          isOpen={isDrawerOpen}
                          onClose={handleCloseDrawer}
                        />
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <DialogFooter className="flex items-center justify-center">
                    {voteLoading && <Spinner/>}
                  <Button
                    className="bg-[#2EBD85] w-1/2 cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] hover:bg-[#ffb92d]"
                    disabled={
                      voteLoading ||
                      !isConnected ||
                      error !== '' ||
                      !hasSufficientYozoon
                    }
                    onClick={() => placeVote(proposal.id, 1)}
                  >
                    Vote For 
                  </Button>
                  <Button
                    className="bg-[#F6465D] w-1/2 cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] hover:bg-[#ffb92d]"
                    disabled={
                      voteLoading ||
                      !isConnected ||
                      error !== '' ||
                      !hasSufficientYozoon
                    }
                    onClick={() => placeVote(proposal.id, -1)}
                  >
                    Vote Against
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))
      )}
    </div>
  );
};

export default ActiveProposal;
