// src/components/ui/SetUsernameModal.tsx
import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import axios from 'axios';
import { toast } from 'react-toastify';

interface SetUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetUsernameModal: React.FC<SetUsernameModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/users/set-username', { username });
      if (response.status === 200) {
        toast.success('Username set successfully!');
        onClose();
        // Optionally, redirect to profile or another page
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to set username.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Set Your Username</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Enter a unique username"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Setting...
            </>
          ) : (
            'Set Username'
          )}
        </Button>
      </form>
    </Modal>
  );
};

export default SetUsernameModal;
