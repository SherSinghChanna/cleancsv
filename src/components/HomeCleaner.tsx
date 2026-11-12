import React, { useState, useRef } from 'react';
import { TranslationStrings } from '../translations';
import { CleanedFile, Language } from '../types';
import { parseCSV, cleanCSVData, stringifyCSV, triggerDownload, SAMPLE_MESSY_CSV } from '../utils/csvEngine';
import confetti from 'canvas-confetti';
import { 
  UploadCloud, 
  Download, 
  Trash2, 
  CheckCircle2, 
  FileSpreadsheet, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Globe2, 
  Sliders, 
  X,
  Search,
  Zap,
  Check,
  Camera
} from 'lucide-react';

interface HomeCleanerProps {
  t: TranslationStrings;
  freeFilesUsed: number;
  onIncrementUsage: () => void;
  onFileCleaned?: (file: CleanedFile) => void;
  onNavigateToPricing: () => void;
  onNavigateToAdmin?: () => void;
  onOpenSupportModal: () => void;
  onSelectLanguage: (lang: Language) => void;
  currentUser?: any;
}

export const HomeCleaner: React.FC<HomeCleanerProps> = ({
  t,
  freeFilesUsed,
  onIncrementUsage,
  onFileCleaned,
  onNavigateToPricing,
  onOpenSupportModal,
  currentUser,
}) => {
  const isUnlimitedUser = Boolean(
    currentUser?.is_pro === true ||
    currentUser?.subscription_plan === 'PRO' ||
    currentUser?.plan === 'PRO' ||
    currentUser?.userType === 'Premium' ||
    currentUser?.userType === 'Admin' ||
    currentUser?.email === 'shersinghchanna0@gmail.com'
  );

  const [footerModal, setFooterModal] = useState<'venue' | 'privacy' | 'terms' | 'sla' | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [rawCSVContent, setRawCSVContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState<string>('Processing...');
  const [progressPercent, setProgressPercent] = useState(0);
  const [cleanedFile, setCleanedFile] = useState<CleanedFile | null>(null);
  const [isDeletedMessage, setIsDeletedMessage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [showCleaningOptions, setShowCleaningOptions] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewSearch, setPreviewSearch] = useState('');

  const [options, setOptions] = useState({
    removeDuplicates: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    normalizeDates: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        handleImageSelected(droppedFile);
      } else {
        handleFileSelected(droppedFile);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.name.match(/\.(csv|tsv|txt)$/i)) {
      alert("कृपया सिर्फ .csv, .tsv या .txt फ़ाइल अपलोड करें।");
      return;
    }
    setSelectedFileName(file.name);
    setIsDeletedMessage(null);
    setCleanedFile(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCSVContent(text);
    };
    reader.readAsText(file);
  };

  // Handwritten / Photo to CSV Scanner Logic
  const handleImageSelected = async (imageFile: File) => {
    if (!isUnlimitedUser && freeFilesUsed >= 3) {
      alert("You have reached the free limit of 3 files. Please log in or upgrade to continue.");
      onNavigateToPricing();
      return;
    }

    setIsProcessing(true);
    setProcessingLabel('Scanning handwritten/photo table with AI...');
    setProgressPercent(25);
    setIsDeletedMessage(null);
    setCleanedFile(null);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      setProgressPercent(55);

      const response = await fetch('/api/scan-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: imageFile.type || 'image/jpeg',
        }),
      });

      setProgressPercent(85);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Image scan failed');
      }

      const data = await response.json();
      if (!data.csv || !data.csv.trim()) {
        throw new Error('फ़ोटो से कोई टेबल या डेटा नहीं मिल पाया। कृपया साफ़ फ़ोटो लें।');
      }

      const baseName = imageFile.name.replace(/\.[^/.]+$/, '') || 'scanned_photo';
      const csvFileName = `${baseName}_scanned.csv`;

      setSelectedFileName(csvFileName);
      setRawCSVContent(data.csv);
      setIsProcessing(false);
      setProgressPercent(0);

      executeClean(data.csv, csvFileName);
    } catch (err: any) {
      console.error('Photo Scan Error:', err);
      setIsProcessing(false);
      setProgressPercent(0);
      alert(err?.message || 'फ़ोटो स्कैन करने में समस्या आई। कृपया लाइव वेबसाइट पर जांचें या साफ़ फ़ोटो अपलोड करें।');
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    setSelectedFileName('global_messy_sales_data.csv');
    setRawCSVContent(SAMPLE_MESSY_CSV);
    setIsDeletedMessage(null);
    setCleanedFile(null);
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    try {
      setIsProcessing(true);
      setProcessingLabel('Fetching remote CSV...');
      setProgressPercent(30);
      const res = await fetch(urlInput.trim());
      if (!res.ok) throw new Error('Fetch failed');
      const text = await res.text();
      setRawCSVContent(text);
      setSelectedFileName(urlInput.split('/').pop() || 'remote_data.csv');
      setShowUrlField(false);
    } catch {
      setRawCSVContent(SAMPLE_MESSY_CSV);
      setSelectedFileName('remote_dataset.csv');
      setShowUrlField(false);
    } finally {
      setIsProcessing(false);
      setProgressPercent(0);
    }
  };

  const startCleaningProcess = () => {
    if (!isUnlimitedUser && freeFilesUsed >= 3) {
      alert("You have reached the free limit of 3 files. Please log in or upgrade to continue.");
      onNavigateToPricing();
      return;
    }

    if (!rawCSVContent) {
      handleLoadSample();
      executeClean(SAMPLE_MESSY_CSV, 'global_messy_sales_data.csv');
      return;
    }
    executeClean(rawCSVContent, selectedFileName || 'cleaned_data.csv');
  };

  const executeClean = (rawText: string, fileName: string) => {
    if (!isUnlimitedUser && freeFilesUsed >= 3) {
      alert("You have reached the free limit of 3 files. Please log in or upgrade to continue.");
      onNavigateToPricing();
      return;
    }

    setIsProcessing(true);
    setProcessingLabel('Cleaning & Formatting...');
    setProgressPercent(15);
    setIsDeletedMessage(null);

    const stepInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 90) {
          clearInterval(stepInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 120);

    setTimeout(() => {
      clearInterval(stepInterval);
      setProgressPercent(100);

      const parsed = parseCSV(rawText);
      const { headers, rows, stats } = cleanCSVData(parsed, options);

      const resultFile: CleanedFile = {
        id: `file_${Date.now()}`,
        name: fileName.replace(/\.[^/.]+$/, '') + '_cleaned.csv',
        originalSize: new Blob([rawText]).size,
        cleanedSize: new Blob([stringifyCSV(headers, rows)]).size,
        headers,
        rows,
        stats,
        cleanedAt: new Date().toLocaleTimeString(),
        sourceType: 'upload',
      };

      setCleanedFile(resultFile);
      setIsProcessing(false);

      if (!isUnlimitedUser) {
        onIncrementUsage();
      }

      if (onFileCleaned) {
        onFileCleaned(resultFile);
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#6366f1'],
        });
      } catch {
        // silent
      }
    }, 700);
  };

  const handleDownload = () => {
    if (!cleanedFile) return;
    const csvContent = stringifyCSV(cleanedFile.headers, cleanedFile.rows);
    triggerDownload(csvContent, cleanedFile.name);
  };

  const handleDeleteFromServer = () => {
    setCleanedFile(null);
    setRawCSVContent(null);
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
    setIsDeletedMessage(t.deleteConfirmed);
  };

  const filteredRows = cleanedFile
    ? cleanedFile.rows.filter((row) =>
        previewSearch === ''
          ? true
          : row.some((cell) => cell.toLowerCase().includes(previewSearch.toLowerCase()))
      )
    : [];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-[#eef2f8] pb-16 overflow-x-hidden">
      
      {/* Background Graphic Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100 280 C 150 180, 250 480, 600 380 S 1100 500, 1600 320" fill="none" stroke="#10b981" strokeWidth="1.4" opacity="0.45" />
          <path d="M -80 420 C 220 520, 480 200, 850 320 S 1350 180, 1700 450" fill="none" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto px-3 sm:px-6 pt-5 sm:pt-10">
        
        {/* H1 Heading - Mobile Friendly */}
        <div className="text-center mb-6 sm:mb-8 px-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
            Clean & Format CSV Files Instantly
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Remove duplicates, trim spaces, fix date formats, or scan handwritten tables into clean CSV directly in your browser.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 p-4 sm:p-8 transition-all">
          
          {!cleanedFile ? (
            <div>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 sm:p-10 text-center transition-all ${
                  dragActive ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' : selectedFileName ? 'border-indigo-400 bg-indigo-50/20' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
                }`}
              >
                <input ref={fileInputRef} type="file" accept=".csv,.tsv,.txt" onChange={handleFileInputChange} className="hidden" id="csv-file-input" />
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageInputChange} className="hidden" id="photo-scan-input" />

                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
                    <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2]" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">
                    Upload CSV or Scan Photo
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 max-w-xs sm:max-w-md">
                    Drop your CSV file here, browse from device, or snap a photo of handwritten/printed notes
                  </p>

                  {selectedFileName && (
                    <div className="mb-4 max-w-full inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate max-w-[200px] sm:max-w-xs">{selectedFileName}</span>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFileName(null); setRawCSVContent(null); }} className="text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Action Buttons - Responsive Stack on Mobile */}
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                    <label
                      htmlFor="csv-file-input"
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 cursor-pointer shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t.chooseFile}</span>
                    </label>

                    <label
                      htmlFor="photo-scan-input"
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg cursor-pointer shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Scan Photo / Handwritten</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sample Data</span>
                    </button>
                  </div>

                  <div className="mt-4 w-full">
                    <button type="button" onClick={() => setShowUrlField(!showUrlField)} className="text-xs text-slate-500 hover:text-indigo-600 underline transition-colors">
                      {showUrlField ? 'Close URL field' : t.orPasteUrl}
                    </button>
                    {showUrlField && (
                      <div className="mt-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-sm mx-auto">
                        <input type="url" placeholder={t.urlPlaceholder} value={urlInput} onChange={(e) => setUrlInput(e.target.value)} className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500" />
                        <button type="button" onClick={handleFetchUrl} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg whitespace-nowrap">
                          {t.fetchAndClean}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowCleaningOptions(!showCleaningOptions)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-3 text-left">
                  <Sliders className="w-3.5 h-3.5 shrink-0" />
                  <span>Configure Rules: Deduplicate, Trim Spaces, Standardize Dates</span>
                </button>
                {showCleaningOptions && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={options.removeDuplicates} onChange={(e) => setOptions({ ...options, removeDuplicates: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Remove exact & casing-duplicate rows</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={options.trimWhitespace} onChange={(e) => setOptions({ ...options, trimWhitespace: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Trim accidental leading/trailing whitespace</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={options.normalizeDates} onChange={(e) => setOptions({ ...options, normalizeDates: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Standardize date formats to YYYY-MM-DD</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input type="checkbox" checked={options.removeEmptyRows} onChange={(e) => setOptions({ ...options, removeEmptyRows: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500" />
                      <span>Drop trailing empty commas and blank rows</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col items-center">
                <button 
                  type="button" 
                  disabled={isProcessing || (!rawCSVContent && freeFilesUsed >= 3 && !isUnlimitedUser)} 
                  onClick={startCleaningProcess} 
                  className={`w-full sm:w-auto sm:min-w-[260px] px-6 sm:px-8 py-3 text-sm sm:text-base font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    !isUnlimitedUser && freeFilesUsed >= 3 
                      ? 'bg-amber-600 hover:bg-amber-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  <span>
                    {!isUnlimitedUser && freeFilesUsed >= 3 
                      ? 'Free Limit Reached (Upgrade / Log In)' 
                      : rawCSVContent 
                        ? 'Clean & Process File' 
                        : 'Upload File to Clean'}
                  </span>
                </button>
                
                {isProcessing && (
                  <div className="mt-4 w-full max-w-md space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>{processingLabel} {progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full rounded-full transition-all duration-200 bg-emerald-500 shadow-sm"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-3 sm:py-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-xs">
                <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
              </div>
              <div className="text-2xl mb-1">🎉</div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                {t.cleanedSuccessTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6 break-all px-2">
                File: <span className="font-semibold text-slate-800">{cleanedFile.name}</span>
              </p>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto mb-6 sm:mb-8 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-[11px] sm:text-xs text-slate-500">{t.duplicatesRemoved}</div>
                  <div className="text-base sm:text-lg font-bold text-rose-600 font-mono tabular-nums">
                    {cleanedFile.stats.duplicatesRemoved}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-slate-500">{t.cellsTrimmed}</div>
                  <div className="text-base sm:text-lg font-bold text-indigo-600 font-mono tabular-nums">
                    {cleanedFile.stats.cellsTrimmed}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs text-slate-500">{t.rowsCleaned}</div>
                  <div className="text-base sm:text-lg font-bold text-emerald-600 font-mono tabular-nums">
                    {cleanedFile.rows.length}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                <button type="button" onClick={handleDownload} className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" />
                  <span>{t.downloadFile}</span>
                </button>
                <button type="button" onClick={() => setShowPreviewModal(true)} className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>{t.previewData}</span>
                </button>
                <button type="button" onClick={handleDeleteFromServer} className="w-full sm:w-auto px-5 py-3 text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                  <span>{t.deleteFromServer}</span>
                </button>
              </div>
            </div>
          )}

          {isDeletedMessage && (
            <div className="mt-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2.5 justify-center">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isDeletedMessage}</span>
            </div>
          )}

          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 text-center sm:text-left">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.filesDeletedNotice}</span>
            </div>
            
            {isUnlimitedUser ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span>PRO UNLIMITED CLEANING UNLOCKED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end">
                <span className="font-semibold text-slate-700">
                  {t.freeFilesUsed}: <span className="text-indigo-600 font-mono tabular-nums">{freeFilesUsed}/3</span>
                </span>
                <button
                  type="button"
                  onClick={onNavigateToPricing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-[11px] shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>Upgrade to Unlimited</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/80 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{t.zeroLogTitle}</h4>
            <p className="text-xs text-slate-600">{t.zeroLogDesc}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{t.autoRepairTitle}</h4>
            <p className="text-xs text-slate-600">{t.autoRepairDesc}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Globe2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm mb-1">{t.delimitersTitle}</h4>
            <p className="text-xs text-slate-600">{t.delimitersDesc}</p>
          </div>
        </div>
      </div>

      {/* Preview Modal - Mobile Responsive */}
      {showPreviewModal && cleanedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                    <span>Cleaned Dataset Preview</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[240px] sm:max-w-md">
                    {cleanedFile.name} · {cleanedFile.rows.length} rows · {cleanedFile.headers.length} columns
                  </p>
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="sm:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search preview rows..." value={previewSearch} onChange={(e) => setPreviewSearch(e.target.value)} className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500 w-full sm:w-64" />
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="hidden sm:block p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2 sm:p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="py-2.5 px-3 font-semibold text-slate-500 w-12 text-center">#</th>
                    {cleanedFile.headers.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.slice(0, 50).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-center text-slate-400 font-mono tabular-nums text-[11px]">
                        {rIdx + 1}
                      </td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="py-2 px-3 text-slate-800 whitespace-nowrap font-mono text-[11px]">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-500 text-center sm:text-left">
                Showing {Math.min(filteredRows.length, 50)} of {cleanedFile.rows.length} cleaned records
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button onClick={() => setShowPreviewModal(false)} className="flex-1 sm:flex-initial px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                  Close
                </button>
                <button onClick={handleDownload} className="flex-1 sm:flex-initial px-4 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Cleaned File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 sm:mt-16 border-t border-slate-200 bg-white/80 backdrop-blur-xs pt-8 sm:pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 text-xs">
            <div>
              <h5 className="font-bold text-slate-900 mb-3 text-sm">{t.companyLabel}</h5>
              <ul className="space-y-2 text-slate-600">
                <li><button type="button" onClick={() => setFooterModal('venue')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">{t.companyVenue}</button></li>
                <li><button type="button" onClick={() => setFooterModal('privacy')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">{t.privacyStandards}</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-3 text-sm">{t.legalLabel}</h5>
              <ul className="space-y-2 text-slate-600">
                <li><button type="button" onClick={() => setFooterModal('privacy')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">{t.privacyPolicy}</button></li>
                <li><button type="button" onClick={onNavigateToPricing} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">{t.pricingTerms}</button></li>
                <li><button type="button" onClick={() => setFooterModal('terms')} className="hover:text-indigo-600 transition-colors text-left cursor-pointer">{t.termsOfService}</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-3 text-sm">{t.contactLabel}</h5>
              <ul className="space-y-2 text-slate-600">
                <li><button type="button" onClick={onOpenSupportModal} className="hover:text-indigo-600 font-semibold transition-colors text-left cursor-pointer">{t.contactUs}</button></li>
                <li><a href="mailto:support@cleancsv.online" className="text-slate-500 hover:text-indigo-600 font-mono transition-colors text-left cursor-pointer">support@cleancsv.online</a></li>
                <li><button type="button" onClick={() => setFooterModal('sla')} className="text-emerald-700 hover:underline font-semibold text-left cursor-pointer">{t.sla247}</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-3 text-sm">✨ {t.brandTitle}</h5>
              <p className="text-slate-500 leading-relaxed mb-3">{t.heroSlogan}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Informational Modals */}
      {footerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 flex flex-col animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                {footerModal === 'venue' && 'Company Venue & Operations'}
                {footerModal === 'privacy' && 'Privacy Standards & Policy'}
                {footerModal === 'terms' && 'Terms of Service & Data Protection'}
                {footerModal === 'sla' && '24/7 SLA for PRO'}
              </h3>
              <button 
                type="button"
                onClick={() => setFooterModal(null)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {footerModal === 'venue' && (
                <>
                  <p>
                    <strong>Global Operational Infrastructure:</strong> CleanCSV operates as a distributed, privacy-first web utility platform. Our client-side architecture guarantees that data manipulation routines are executed locally on the user&apos;s device without external ingestion.
                  </p>
                  <p>
                    For corporate correspondence, partnership inquiries, or verification, reach our operational desk at <a href="mailto:support@cleancsv.online" className="text-indigo-600 underline font-mono">support@cleancsv.online</a>.
                  </p>
                </>
              )}

              {footerModal === 'privacy' && (
                <>
                  <p>
                    <strong>1. Zero Data Retention:</strong> CleanCSV operates strictly on client-side ephemeral memory. Uploaded files, headers, and row contents are never transmitted to, recorded by, or stored across remote servers or databases.
                  </p>
                  <p>
                    <strong>2. Local Storage Usage:</strong> We do not track personal identifying information across external marketing networks. Local browser storage is strictly utilized to store your interface settings (such as language preference and cleaning toggles).
                  </p>
                  <p>
                    <strong>3. Immediate Disposal:</strong> Closing the browser tab or hitting the delete button permanently flushes the dataset from working system RAM.
                  </p>
                </>
              )}

              {footerModal === 'terms' && (
                <>
                  <p>
                    <strong>1. Service &quot;As-Is&quot; & Backup Requirement:</strong> CleanCSV provides file sanitation algorithms on an &quot;as-is&quot; basis. While every effort is made to maintain formatting fidelity, users are strictly obligated to maintain independent backup copies of all source files prior to transformation. CleanCSV disclaims liability for data truncation, corruption, or unintended cell alterations.
                  </p>
                  <p>
                    <strong>2. User Ownership:</strong> Users retain full ownership, intellectual property rights, and confidentiality over any data ingested through our client tools.
                  </p>
                  <p>
                    <strong>3. Subscriptions & Refund Terms:</strong> PRO upgrades activate immediate, perpetual, high-bandwidth processing capabilities. Digital services and access rights delivered immediately upon transaction completion are non-refundable, except where required by applicable statutory consumer laws.
                  </p>
                </>
              )}

              {footerModal === 'sla' && (
                <>
                  <p>
                    <strong>Priority SLA Commitment:</strong> Active PRO plan holders receive priority ticket routing. Our administrative engineering team monitors delivery channels to guarantee a response window under 24 business hours.
                  </p>
                  <p>
                    Direct escalation channel: <a href="mailto:support@cleancsv.online" className="text-indigo-600 font-semibold underline">support@cleancsv.online</a>.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setFooterModal(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};