// src/components/pages/ProfilePage/EditProfileModal.tsx

import React, { useState } from 'react';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  currentPictureUrl: string;
  onSave: (newUsername: string, newPictureUrl?: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  currentPictureUrl,
  onSave,
}) => {
  const [username, setUsername] = useState<string>(currentUsername);
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(currentPictureUrl);
  const [errors, setErrors] = useState<string>('');

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        toast.error('Only JPEG, PNG, and GIF files are allowed.');
        return;
      }

      if (file.size > maxSize) {
        toast.error('File size should not exceed 2MB.');
        return;
      }

      setPictureFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!username) {
      toast.error('Username cannot be empty.');
      return;
    }

    // Optional: Additional client-side username validation

    if (pictureFile) {
      // Convert image file to base64 or upload to a storage service and get the URL
      // For simplicity, we'll assume base64 encoding here
      onSave(username, preview);
    } else {
      onSave(username);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <div className="flex flex-col items-center">
          <Image src={preview} alt="Profile Picture" width={100} height={100} className="rounded-full mb-2" />
          <Input
            label="Change Profile Picture"
            name="profilePicture"
            type="file"
            onChange={handlePictureChange}
            accept="image/jpeg, image/png, image/gif"
            required={false}
          />
          <small className="text-gray-500">Allowed types: JPEG, PNG, GIF. Max size: 2MB.</small>
        </div>
        <Input
          label="Username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary">
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
