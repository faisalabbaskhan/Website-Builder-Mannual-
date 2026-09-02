import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Video, Trash2, Copy, Check, HardDrive } from 'lucide-react';
import { MediaAsset } from '../../types';
import { loadMediaAssets, saveMediaAsset } from '../../utils/storage';
import { generateId } from '../../utils/idGenerator';

export const MediaLibraryView: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(loadMediaAssets());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((fileObj) => {
      const file = fileObj as File;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        if (!url) return;

        const newAsset: MediaAsset = {
          id: generateId('media'),
          name: file.name,
          url,
          type: file.type.startsWith('video') ? 'video' : 'image',
          size: file.size,
          createdAt: new Date().toISOString(),
        };

        const updated = saveMediaAsset(newAsset);
        setMediaList(updated);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    const updated = mediaList.filter((m) => m.id !== id);
    setMediaList(updated);
    localStorage.setItem('webforge_media_v1', JSON.stringify(updated));
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]/10">
        <div>
          <h1 className="text-3xl font-serif italic text-[#1A1A1A]">Media Assets Library</h1>
          <p className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 mt-1">
            Curate images and media to utilize across your website projects.
          </p>
        </div>

        <label className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#333333] text-[#F9F7F2] rounded-full text-xs font-semibold shadow-md cursor-pointer flex items-center gap-2 transition-all uppercase tracking-wider">
          <Upload className="w-4 h-4" />
          <span>Upload Asset</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Drag & Drop Area */}
      <div className="border-2 border-dashed border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40 bg-[#E5E2D9]/60 rounded-2xl p-8 text-center transition-colors">
        <Upload className="w-8 h-8 text-[#1A1A1A] mx-auto mb-2" />
        <p className="text-sm font-semibold text-[#1A1A1A]">Drag & drop computer media files here</p>
        <p className="text-xs text-[#1A1A1A]/60 mt-1">Supports PNG, JPG, WebP, SVG, MP4, WebM (up to 20MB)</p>
      </div>

      {/* Media Grid */}
      {mediaList.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaList.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#E5E2D9] border border-[#1A1A1A]/10 rounded-2xl overflow-hidden group hover:border-[#1A1A1A]/30 transition-all shadow-sm relative"
            >
              <div className="h-32 bg-[#F9F7F2] relative overflow-hidden flex items-center justify-center border-b border-[#1A1A1A]/10">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={asset.url} className="w-full h-full object-cover" />
                )}

                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#F9F7F2]/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase text-[#1A1A1A] border border-[#1A1A1A]/20 flex items-center gap-1">
                  {asset.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                  {asset.type}
                </span>
              </div>

              <div className="p-3">
                <p className="text-xs font-semibold text-[#1A1A1A] truncate">{asset.name}</p>
                <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5 font-mono uppercase tracking-wider">
                  {(asset.size / 1024).toFixed(0)} KB &bull; {new Date(asset.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center gap-1 mt-3 pt-2 border-t border-[#1A1A1A]/10">
                  <button
                    onClick={() => handleCopyUrl(asset.url, asset.id)}
                    className="flex-1 py-1 bg-[#F9F7F2] hover:bg-[#DED9CE] text-[#1A1A1A] text-[10px] font-semibold uppercase tracking-wider rounded-full border border-[#1A1A1A]/10 flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#1A1A1A]" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#1A1A1A]/60" /> Copy URL
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 bg-[#F9F7F2] hover:bg-rose-100 text-rose-700 text-[10px] rounded-full border border-[#1A1A1A]/10 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-[#1A1A1A]/60 font-serif italic text-lg">
          No media files uploaded yet. Upload images or videos to populate your library.
        </div>
      )}
    </div>
  );
};
