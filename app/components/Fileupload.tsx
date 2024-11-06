"use client"
import React from 'react'

import { UploadDropzone } from '../lib/uploadthing';
import { ourFileRouter } from '../api/uploadthing/core';

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
    showUpload: boolean;
}
export const Fileupload = ({ onChange, endpoint, showUpload }: FileUploadProps) => {
  return (
    showUpload ? ( 
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
  )
}
