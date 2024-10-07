'use client';
import { AlertTriangle, CheckCheckIcon, Loader, UploadIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = (e: any) => {
    // Check if there are files selected
    if (e.target.files.length > 0) {
      // Update state with the first file selected
      setFile(e.target.files[0]);
      setIsUploading(true);
    } else {
      // If no file is selected (e.g., user canceled), reset the state
      setFile(null);
      setIsUploading(false);
    }
  };

  const create = useMutation({
    mutationKey: ['upload-data'],
    mutationFn: async () => {
      const formData = new FormData();
      if (!file) {
        throw new Error('Please upload file');
      }
      formData.append('file', file);
      setFile(null);
      return await api
        .post(`/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err;
        });
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        icon: <AlertTriangle />,
      });
      setIsUploading(false);
    },
    onSuccess: (data, variables, context) => {
      toast.success('File Uploaded Successfully', {
        icon: <CheckCheckIcon />,
      });
      setIsUploading(false);
    },
  });

  return (
    <div className="px-1">
      <label
        htmlFor="file-input"
        className="inline-flex cursor-pointer items-center rounded-[4px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <UploadIcon className="mx-3 h-4 w-4" /> <p className="hidden md:block">Upload Data</p>
        <input
          id="file-input"
          type="file"
          accept=".xlsx"
          className="sr-only"
          onChange={handleFileChange}
        />{' '}
      </label>
      <Dialog
        open={isUploading}
        onOpenChange={(open) => {
          if (create.isPending) {
            return false;
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Upload</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {create.isPending && (
            <div className="flex flex-col items-center justify-center">
              <Loader className="h-4 w-4 animate-spin" />
              <div className="text-base font-semibold">Uploading...</div>
              <div className="text-sm font-medium text-muted-foreground">
                Please wait It may take while..
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button
              disabled={create.isPending}
              variant="destructive"
              onClick={async () => create.mutateAsync()}
            >
              Confirm
            </Button>
            <div>
              <Button
                disabled={create.isPending}
                variant="outline"
                className="w-full"
                onClick={() => setIsUploading(false)}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
