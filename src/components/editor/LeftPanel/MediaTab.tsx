import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Check } from 'lucide-react';
import { MediaAsset, CanvasElement } from '../../../types';
import { loadMediaAssets, saveMediaAsset } from '../../../utils/storage';
import { generateId } from '../../../utils/idGenerator';

interface MediaTabProps {
  selectedElement: CanvasElement | null;
  onUpdateElementSrc: (src: string) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ selectedElement, onUpdateElementSrc }) => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(loadMediaAssets());

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((fileObj) => {
      const file = fileObj as File;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (!url) return;

        const asset: MediaAsset = {
          id: generateId('media'),
          name: file.name,
          url,
          type: file.type.startsWith('video') ? 'video' : 'image',
          size: file.size,
          createdAt: new Date().toISOString(),
        };

        const updated = saveMediaAsset(asset);
        setMediaList(updated);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="p-4 space-y-4 text-[#1A1A1A]">
      <div>
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/80">Media Library</h3>
        <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
          {selectedElement && (selectedElement.type === 'image' || selectedElement.type === 'video')
            ? `Click an asset to set image/video source for [${selectedElement.name}].`
            : 'Upload or view assets.'}
        </p>
      </div>

      <label className="w-full py-2.5 bg-[#E5E2D9] border border-[#1A1A1A]/15 hover:border-[#1A1A1A] rounded-full text-xs font-semibold text-[#1A1A1A] flex items-center justify-center gap-2 cursor-pointer transition-all uppercase tracking-wider">
        <Upload className="w-4 h-4 text-[#1A1A1A]" />
        <span>Upload Computer File</span>
        <input type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" />
      </label>

      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-1">
        {mediaList.map((asset) => (
          <div
            key={asset.id}
            onClick={() => onUpdateElementSrc(asset.url)}
            className="group relative h-24 bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl overflow-hidden cursor-pointer hover:border-[#1A1A1A] transition-all"
          >
            {asset.type === 'image' ? (
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
            ) : (
              <video src={asset.url} className="w-full h-full object-cover" />
            )}

            <div className="absolute inset-0 bg-[#1A1A1A]/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[9px] font-bold text-[#F9F7F2] bg-[#1A1A1A] px-2.5 py-1 rounded-full uppercase tracking-wider">Select</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
