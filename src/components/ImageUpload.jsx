import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabaseClient';

export default function ImageUpload({ onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const { error } = await supabase.storage.from('images').upload(path, file);
    setUploading(false);
    e.target.value = '';
    if (error) {
      toast.error('Upload failed - try again.');
      return;
    }
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    onUploaded(data.publicUrl);
    toast.success('Image uploaded');
  };

  return (
    <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 cursor-pointer mb-2">
      <Upload size={13} /> {uploading ? 'Uploading...' : 'Upload image'}
      <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
    </label>
  );
}
