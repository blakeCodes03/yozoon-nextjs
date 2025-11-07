'use client';

import React, { useState } from 'react';
import 'react-day-picker/style.css';
import { DayPicker } from 'react-day-picker';
import axios from 'axios';
import { toast } from 'sonner';
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
import { set } from 'date-fns';

interface CreateTasksProps {
  coinId: string; // Define the type for the coinId prop
}

const CreateTasks: React.FC<CreateTasksProps> = ({ coinId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string | undefined>();
  const [twitterHandle, setTwitterHandle] = useState<string>('');
  const [telegramGroupId, setTelegramGroupId] = useState<string>('');
  const [rewardQuantity, setRewardQuantity] = useState<number>(1);
  const [instruction, setInstruction] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const { address, isConnected } = useAppKitAccount();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTaskChange = (value: string) => {
    setSelectedTask(value);
    if (value === 'twitter-follow') {
      setInstruction('Follow us on Twitter and mention @yozoon in a tweet.');
    } else if (value === 'telegram-join') {
      setInstruction('Join our Telegram group and introduce yourself.');
    }
    setError('');
    setTwitterHandle('');
    setTelegramGroupId('');
  };

  const handleTwitterHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwitterHandle(e.target.value);
    setError('');
  };

  const handleTelegramGroupIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelegramGroupId(e.target.value);
    setError('');
  };

  const handleRewardQuantityChange = (value: string) => {
    setRewardQuantity(Number(value));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!selectedTask) {
      setError('Please select a task.');
      setLoading(false);
      return;
    }

    if (selectedTask === 'twitter-follow' && !twitterHandle.trim()) {
      setError('Please enter your Twitter handle.');
      setLoading(false);
      return;
    }

    if (selectedTask === 'telegram-join' && !telegramGroupId.trim()) {
      setError('Please enter the Telegram group ID.');
      setLoading(false);
      return;
    }

    if (!selectedDate || selectedDate < new Date()) {
      setError('Please select a valid reward claim end date.');
      setLoading(false);
      return;
    }

    let payload

    try {
        if (selectedTask === 'twitter-follow'){

             payload = {
              taskType: selectedTask,
              twitterHandle: twitterHandle,
              rewardQuantity,
              instruction,
              rewardClaimEndDate: selectedDate,
            };
        } else if (selectedTask === 'telegram-join'){
             payload = {
              taskType: selectedTask,
              telegramGroupId:  telegramGroupId,
              rewardQuantity,
              instruction,
              rewardClaimEndDate: selectedDate,
            };

        }

     const response = await axios.post(`/api/coins/${coinId}/tasks`, payload);
     if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message);
      }

      toast('Task created successfully');
      setDialogOpen(false);
      setSuccess(true);
      setSelectedTask(undefined);
      setTwitterHandle('');
      setTelegramGroupId('');
      setRewardQuantity(1);
      setSelectedDate(undefined);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error creating task');
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
        <div className=' flex justify-center my-4 '>
            <p className="text-lg text-white mb-1">Create tasks to engage your community and reward them with Yozoon tokens.</p>
        </div>
        <div className=' flex justify-end '>

      <button
        className="bg-[#FFB92D] cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px]"
        onClick={() => setDialogOpen(true)}
      >
        Create Task
      </button>
        </div>
       

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => setDialogOpen(isOpen)}>
        <DialogContent className="max-w-[425px] lg:max-w-[600px] overflow-y-auto max-h-[90vh]">
          <DialogHeader className="text-center flex items-center justify-center">
            <DialogTitle className="text-2xl font-bold gap-2 p-2">Create Task</DialogTitle>
            <DialogDescription className="mt-2 font-semibold">Fill in the details below.</DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon className="mr-2 h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="mb-6">
              <Label htmlFor="task">Select Task</Label>
              <Select onValueChange={handleTaskChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="twitter-follow">Follow us on Twitter</SelectItem>
                    <SelectItem value="telegram-join">Join Telegram Group</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {selectedTask === 'twitter-follow' && (
              <div className="grid gap-1">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                
                <div className="flex items-center mt-2">
                            <span className="text-white bg-gray-700 px-3 py-1 rounded-l">
                              {' '}
                              @{' '}
                            </span>
                            <Input
                  id="twitterHandle"
                  value={twitterHandle}
                  onChange={handleTwitterHandleChange}
                  placeholder="Enter your Twitter handle"
                />
                          </div>
              </div>
            )}

            {selectedTask === 'telegram-join' && (
              <div className="grid gap-1">
                <Label htmlFor="telegramGroupId">Telegram Group ID</Label>
                <Input
                  id="telegramGroupId"
                  value={telegramGroupId}
                  onChange={handleTelegramGroupIdChange}
                  placeholder="Enter the Telegram group ID"
                />
              </div>
            )}

            <div className="grid gap-1">
              <Label htmlFor="instruction">Instruction</Label>
              <Textarea
                id="instruction"
                value={instruction}
                readOnly
                className=" text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="rewardQuantity">Reward Quantity</Label>
              <Select onValueChange={handleRewardQuantityChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reward quantity" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="date">Reward Claim Ends</Label>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
                  onClick={toggleDialog}
              >
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                <ChevronDownIcon />
              </Button>
              {isDialogOpen && (
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsDialogOpen(false);
                  }}
                  disabled={{ before: new Date() }}
                  className="max-w-[300px] max-h-[300px] py-2 px-3 mb-2"
                />
              )}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-center">
            <Button
              className="bg-[#FFB92D] w-full cursor-pointer inter-fonts font-[700] text-[14px] text-black py-2 px-8 rounded-[10px] hover:bg-[#ffb92d]"
              disabled={loading || !isConnected || error !== ''}
              onClick={handleSubmit}
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTasks;