"use client"


import React, { useState } from 'react';
import 'react-day-picker/style.css';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import {toast} from 'sonner'
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
import { select } from '@material-tailwind/react';

interface CreateProposalProps {
  coinId: string; // Define the type for the coinId prop
}

const CreateProposal: React.FC<CreateProposalProps> = ({ coinId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = React.useState(true); //date picker popover
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [yozoonBalance, setYozoonBalance] = useState<number>(0);
  const [hasSufficientYozoon, setHasSufficientYozoon] =
    useState<boolean>(false);
  const { address, isConnected } = useAppKitAccount();
  const [selected, setSelected] = useState<Date>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  //to handle opening/closing of buy-yozoon side drawer
  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    setDescription(e.target.value);
  };

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setError('');
    setTitle(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    if (!title || title.trim() === '') {
      setError('Please Enter Title');
      setLoading(false);
      return;
    } else if (
      !description ||
      description.replace(/<[^>]+>/g, '').trim() === ''
    ) {
      setError('Please Enter Description');
      setLoading(false);
      return;
    } else if (selected === undefined || selected < new Date()) {
      setError('Please select a valid date');
      setLoading(false);
      return;
    }

    //implement staking logic here

    try {
      await axios.post(`/api/coins/${coinId}/proposals`, {
        title,
        description,
        date,
      });
      toast('Proposal created successfully');
      setDialogOpen(false); // Close the dialog after creating
      setSuccess(true);
      setTitle('');
      setDescription('');
      setSelected(undefined);
      window.location.reload(); // Reload the page to reflect the new proposal
    } catch (err: any) {
      setError('Failed to create proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle the dialog visibility
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen);

  const onSelectDate = () => {
    // setSelected(date);
    setIsDialogOpen(false);
  };

  return (
    <div>
      <button
        className="bg-[#FFB92D] cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px]"
        onClick={() => setDialogOpen(true)}
      >
        Create Proposal
      </button>

      {/* Dialog for agent details */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(isOpen) => setDialogOpen(isOpen)}
      >
        <DialogContent className="max-w-[425px] lg:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader className="text-center flex items-center justify-center">
            <DialogTitle className="text-2xl font-bold gap-2 p-2">
              Create Proposal
            </DialogTitle>
            <DialogDescription className="mt-2 font-semibold ">
              Fill in the details below to create a proposal.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div>
              <Alert variant="destructive">
                <AlertCircleIcon className="mr-2 h-4 w-4" />
                <AlertTitle></AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={handleTitleChange}
                maxLength={50}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                maxLength={250}
                value={description}
                onChange={handleDescriptionChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-700 rounded-md shadow-sm "
              />
              <div className="text-right text-sm text-gray-500">
                {description.replace(/<[^>]+>/g, '').length}/250
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="date" className="px-1">
                Vote Ends On
              </Label>
              <div className="relative flex gap-2">
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                  onClick={toggleDialog}
                >
                  {selected ? selected.toLocaleDateString() : 'Select date'}
                  <ChevronDownIcon />
                </Button>
                {isDialogOpen && (
                  <DayPicker
                    mode="single"
                    selected={selected}
                    onSelect={(date) => {
                      setSelected(date);
                      onSelectDate();
                    }}
                    disabled={{ before: new Date() }}
                    className="max-w-[300px] max-h-[300px] py-2 px-3 mb-2"
                  />
                )}
              </div>
            </div>
          </div>
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
                  You hold sufficient YOZOON tokens for creating proposals.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <ShieldAlert className="mr-2 h-4 w-4" />
                <AlertTitle>Insufficient YOZOON tokens</AlertTitle>
                <AlertDescription>
                  You need at least 1000 Yozoon tokens to create a proposal.{' '}
                  <br />
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
            <Button
              className="bg-[#FFB92D] w-full cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] hover:bg-[#ffb92d]"
              disabled={
                loading || !isConnected || error !== '' || !hasSufficientYozoon
              }
              onClick={handleSubmit}
            >
              Create Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProposal;
