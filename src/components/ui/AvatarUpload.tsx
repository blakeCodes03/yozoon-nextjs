"use client";
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Upload, X, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import { compressImage } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AvatarUpload({ onAvatarChange }: { onAvatarChange: any }) {
  const [avatar, setAvatar] = useState<any>();
  const [displayAvatar, setDisplayAvatar] = useState<any>();
  const [hasChanged, setHasChanged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setDisplayAvatar(compressedImage);
        setHasChanged(true);
        onAvatarChange(file); // <-- Pass the image object up to the parent
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleRemoveAvatar = () => {
    if (avatar) {
      setAvatar(null);
      setHasChanged(true);
    onAvatarChange(null); // <-- Remove avatar in parent

    }
  };

  return (
    <div className="rounded-lg w-full">
      

      <div className="flex flex-col items-center gap-4 pb-4 max-w-sm mx-auto">
        {/* Image preview area */}
        {displayAvatar ? (
          <div className="w-64 h-64 mb-2">
            <img
              src={displayAvatar}
              alt="Agent Avatar"
              className="object-cover w-full h-full rounded-lg border"
            />
          </div>
        ) : (
          <div
            className="w-64 h-64 flex items-center justify-center border border-dashed border-gray-600 rounded-lg text-gray-500 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="w-10 h-10" />
              <span className="text-sm">Click to upload</span>
            </div>
          </div>
        )}

        {/* Controls area */}
        <div className="flex flex-col gap-3 w-64">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
// onChange={(e) => {
//                         if (e.target.files && e.target.files.length > 0) {
//                           const file = e.target.files[0];
//                           if (file.size > 2 * 1024 * 1024) {
//                             <Alert variant="destructive">
//                               <AlertCircle className="h-4 w-4" />
//                               <AlertTitle>Error</AlertTitle>
//                               <AlertDescription>
//                                 File size exceeds 2MB
//                               </AlertDescription>
//                             </Alert>;
//                           }
//                           setAvatar(file);
//                           onAvatarChange(file);
//                           setHasChanged(true);
//                         }
//                       }}     
                           />

          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2 flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5" />
              {avatar ? 'Replace' : 'Upload'}
            </Button>

            {avatar && (
              <Button
                variant="outline"
                className="flex items-center"
                onClick={handleRemoveAvatar}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {hasChanged && (
            <div className="text-sm text-blue-500 mt-1 text-center">
              Avatar has been updated
            </div>
          )}

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
            <Info className="w-3.5 h-3.5" />
            <span>Images greater than 300x300 will be resized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
