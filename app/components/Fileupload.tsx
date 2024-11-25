"use client"
import React, { useState } from 'react'
import Image from 'next/image';
import { X } from 'lucide-react';
import { UploadDropzone } from '../lib/uploadthing';
import { ourFileRouter } from '../api/uploadthing/core';

interface FileUploadProps {
    onChange: (urls: string[]) => void;
    endpoint: keyof typeof ourFileRouter;
    value?: string[];
}

export const Fileupload = ({ onChange, endpoint, value = [] }: FileUploadProps) => {
    const [urls, setUrls] = useState<string[]>(value);

    const handleUploadComplete = (newUrls: { url: string }[]) => {
        const uploadedUrls = newUrls.map(file => file.url);
        const updatedUrls = [...urls, ...uploadedUrls];
        setUrls(updatedUrls);
        onChange(updatedUrls);
    };

    const handleRemove = (urlToRemove: string) => {
        const updatedUrls = urls.filter(url => url !== urlToRemove);
        setUrls(updatedUrls);
        onChange(updatedUrls);
    };

    return (
        <div className="space-y-4 w-full">
            <div className="flex flex-wrap gap-4">
                {urls.map((url, index) => (
                    <div key={index} className="relative group">
                        <div className="relative w-40 h-40">
                            <Image
                                src={getImageUrl(url)}
                                alt={`Upload ${index + 1}`}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <button
                            onClick={() => handleRemove(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    if (res) {
                        handleUploadComplete(res);
                    }
                }}
                onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    alert(`Upload failed: ${error.message}`);
                }}
            />
        </div>
    )
}

export const getImageUrl = (fileKey: string) => {
    if (fileKey.startsWith('http')) {
        return fileKey;
    }
    return `https://uploadthing.com/f/${fileKey}`;
};