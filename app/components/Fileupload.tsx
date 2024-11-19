"use client"
import React from 'react'
import Image from 'next/image';

import { UploadDropzone } from '../lib/uploadthing';
import { ourFileRouter } from '../api/uploadthing/core';

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
    showUpload: boolean;
    value?: string;
}
export const Fileupload = ({ onChange, endpoint, showUpload, value }: FileUploadProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
    {value && (
        <div className="relative w-40 h-40">
          <Image
            src={getImageUrl(value)}
            alt="Upload"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    {showUpload ? ( 
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url);
                
            }}
            onUploadError={(error: Error)=>{
                alert(`ERROR! ${error.message}`);
            }}
        />
    ):null
    }
    </div>

    
  )
}
export const getImageUrl = (fileKey: string) => {
    // If it's already a full URL, return it
    if (fileKey.startsWith('http')) {
      return fileKey;
    }
    
    // Otherwise, construct the UploadThing URL
    return `https://uploadthing.com/f/${fileKey}`;
  };
