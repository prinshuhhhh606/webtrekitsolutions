import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Link as LinkIcon, Trash2, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../../services/api';
import './ImageUploadField.css';

/**
 * Reusable Admin Image Upload Component
 * Provides two modes:
 * Option A: Direct Image URL input with real-time preview and validation.
 * Option B: Local Device File Upload with drag-and-drop, validation (JPG, JPEG, PNG, WEBP, <5MB),
 * upload progress indication, preview, and remove/replace functionality.
 */
const ImageUploadField = ({
  value = '',
  onChange,
  label = 'Featured Image',
  required = false,
  helperText = 'Choose between entering a web image URL or uploading directly from your device (JPG, PNG, WEBP up to 5MB).',
}) => {
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'file'
  const [urlInput, setUrlInput] = useState(value || '');
  const [previewUrl, setPreviewUrl] = useState(value || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const fileInputRef = useRef(null);

  // Synchronize when value changes externally (e.g., editing existing record)
  useEffect(() => {
    setUrlInput(value || '');
    setPreviewUrl(value || '');
    if (value && (value.startsWith('/uploads/') || value.includes('/uploads/'))) {
      setActiveTab('file');
    }
  }, [value]);

  const validateUrl = (str) => {
    try {
      if (str.startsWith('/uploads/')) return true;
      const parsed = new URL(str);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setUrlInput(val);
    setErrorMsg('');
    setSuccessMsg('');

    if (!val.trim()) {
      setPreviewUrl('');
      onChange('');
      return;
    }

    if (validateUrl(val)) {
      setPreviewUrl(val);
      onChange(val);
    } else {
      setErrorMsg('Please enter a valid HTTP or HTTPS image URL.');
    }
  };

  // Handle File selection from disk
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setSuccessMsg('');

    // Format validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg('Invalid file format. Only JPG, JPEG, PNG, and WEBP formats are supported.');
      return;
    }

    // Size validation: 5MB maximum
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMsg('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    // Set immediate client-side preview
    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);

    // Upload via API
    try {
      setUploading(true);
      setUploadProgress(20);

      const formData = new FormData();
      formData.append('image', file);

      // Simulated smooth progress while network executes
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await uploadService.uploadSingle(formData);
      clearInterval(progressTimer);
      setUploadProgress(100);

      if (res.data && res.data.success) {
        const uploadedUrl = res.data.url;
        setUrlInput(uploadedUrl);
        setPreviewUrl(uploadedUrl);
        onChange(uploadedUrl);
        setSuccessMsg('Image uploaded successfully from your device!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Image upload failed. Please try again.');
      setPreviewUrl(value || '');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Remove current image
  const handleRemoveImage = () => {
    setUrlInput('');
    setPreviewUrl('');
    setErrorMsg('');
    setSuccessMsg('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Resolve preview path (prepend API origin if relative /uploads/)
  const resolvedPreview = () => {
    if (!previewUrl) return '';
    if (previewUrl.startsWith('blob:') || previewUrl.startsWith('http://') || previewUrl.startsWith('https://')) {
      return previewUrl;
    }
    // Relative upload from backend
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const origin = apiBase.replace(/\/api\/?$/, '');
    return `${origin}${previewUrl.startsWith('/') ? '' : '/'}${previewUrl}`;
  };

  return (
    <div className="image-upload-field-container">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block font-bold text-gray-700 text-xs">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-[11px] font-semibold text-red-500 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {/* Tabs: Image URL vs Local Device Upload */}
      <div className="flex items-center p-1 bg-gray-100 rounded-xl mb-3 border border-gray-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('url');
            setErrorMsg('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'url'
              ? 'bg-white text-[#021343] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Option A: Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('file');
            setErrorMsg('');
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'file'
              ? 'bg-white text-[#fe8a04] shadow-xs'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Option B: Local Device Upload</span>
        </button>
      </div>

      {/* Option A: Image URL Input */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={handleUrlChange}
              placeholder="https://images.unsplash.com/photo-example... or CDN link"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#fe8a04] focus:ring-1 focus:ring-[#fe8a04]/20 transition-all"
            />
            <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>
          <p className="text-[11px] text-gray-400">
            Paste any accessible web image address. A live preview will be verified instantly below.
          </p>
        </div>
      )}

      {/* Option B: Local Device Upload */}
      {activeTab === 'file' && (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
              uploading
                ? 'border-[#fe8a04] bg-orange-50/40'
                : 'border-gray-300 hover:border-[#fe8a04] hover:bg-orange-50/20 bg-gray-50/50'
            }`}
          >
            {uploading ? (
              <div className="space-y-2 py-2">
                <Loader2 className="w-8 h-8 text-[#fe8a04] animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#021343]">Uploading image securely to server...</p>
                <div className="w-48 max-w-full h-1.5 bg-gray-200 rounded-full mx-auto overflow-hidden">
                  <div
                    className="h-full bg-[#fe8a04] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#fe8a04] flex items-center justify-center mx-auto mb-1 shadow-xs">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#021343]">
                  Click to Browse or Drag Image Here
                </p>
                <p className="text-[11px] text-gray-500">
                  Supports JPG, JPEG, PNG, WEBP (Max: 5MB)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation / Success Messages */}
      {errorMsg && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Live Preview Area */}
      {previewUrl && (
        <div className="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#fe8a04]" />
              Image Live Preview
            </span>
            <span className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
              {previewUrl.startsWith('blob:') ? 'Local Selected File' : previewUrl}
            </span>
          </div>

          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 flex items-center justify-center">
            <img
              src={resolvedPreview()}
              alt="Preview"
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(false);
                setErrorMsg('Unable to load image from given source. Please check the URL or try uploading a local image.');
              }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready to save
            </span>
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'file') {
                  fileInputRef.current?.click();
                } else {
                  setUrlInput('');
                  setPreviewUrl('');
                  onChange('');
                }
              }}
              className="text-[#fe8a04] hover:underline font-semibold cursor-pointer"
            >
              Replace Image
            </button>
          </div>
        </div>
      )}

      {helperText && !previewUrl && (
        <p className="text-[10px] text-gray-400 mt-1.5">{helperText}</p>
      )}
    </div>
  );
};

export default ImageUploadField;
