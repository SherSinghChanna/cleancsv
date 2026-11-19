import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TranslationStrings } from '../translations';
import { CleanedFile, Language } from '../types';
import { parseCSV, cleanCSVData, stringifyCSV, triggerDownload, SAMPLE_MESSY_CSV } from '../utils/csvEngine';
import { exportToExcel, exportToJSON } from '../utils/exportEngine';
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
  Sliders,
  X,
  Search,
  Check,
  Plus,
  Lock,
  FileJson,
  HelpCircle
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
  onIncrementUsage,
  onFileCleaned,
  onNavigateToPricing,
  onOpenSupportModal,
  currentUser,
}) => {
  const location = useLocation();
  const isExcelPage = location.pathname === '/csv-to-excel';
  const isViewerPage = location.pathname === '/csv-viewer';
  const isDuplicatesPage = location.pathname === '/remove-duplicates';
  const isBankPage = location.pathname === '/bank-csv-cleaner';

  let pageTitle = "Clean & Format CSV Files Instantly | CleanCSV";
  let pageDesc = "Remove duplicates, trim accidental spaces, fix date formats, and validate delimiters 100% locally in your browser — completely free & unlimited CSV cleaning.";
  let pageH1 = "Clean & Format CSV Files Instantly";

  if (isExcelPage) {
    pageTitle = "Convert CSV to Excel Online Free | CleanCSV";
    pageDesc = "Convert your messy CSV files into clean Excel formats directly in your browser. No upload required.";
    pageH1 = "Convert CSV to Excel Instantly";
  } else if (isViewerPage) {
    pageTitle = "CSV Viewer Online – View CSV Files Free | CleanCSV";
    pageDesc = "View and edit your CSV files online without downloading any software. Fast and 100% private.";
    pageH1 = "Online CSV Viewer & Editor";
  } else if (isDuplicatesPage) {
    pageTitle = "Remove Duplicate Rows from CSV Online Free | CleanCSV";
    pageDesc = "Easily find and remove duplicate rows from your CSV files online. Fast, secure, and browser-based.";
    pageH1 = "Remove Duplicate Rows from CSV";
  } else if (isBankPage) {
    pageTitle = "Clean Bank Statement CSV Online – Merge Debit/Credit | CleanCSV";
    pageDesc = "Convert your bank statement CSV into a clean, standardized format. Combine Debit and Credit columns, fix dates, and export easily.";
    pageH1 = "Bank Statement CSV Cleaner";
  }

  const [footerModal, setFooterModal] = useState<'venue' | 'privacy' | 'terms' | 'sla' | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [rawCSVContent, setRawCSVContent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [cleanedFile, setCleanedFile] = useState<CleanedFile | null>(null);
  const [isDeletedMessage, setIsDeletedMessage] = useState<string | null>(null);
  const [proLockNotice, setProLockNotice] = useState<string | null>(null);
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

  const [bankOptions, setBankOptions] = useState({
    mergeDebitCredit: false,
    targetDateFormat: 'YYYY-MM-DD',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const userPlan = String(currentUser?.plan || 'BASIC').toUpperCase();
  const isSoleAdmin = String(currentUser?.email || '').trim().toLowerCase() === 'shersinghchanna0@gmail.com';
  const hasProExportAccess = Boolean(
    isSoleAdmin ||
    currentUser?.is_pro === true ||
    userPlan === 'PRO' ||
    userPlan === 'YEARLY_PRO' ||
    userPlan === 'BUSINESS'
  );

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
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.name.match(/\.(csv|tsv|txt)$/i)) {
      alert("Please upload a valid .csv, .tsv, or .txt file.");
      return;
    }
    setSelectedFileName(file.name);
    setIsDeletedMessage(null);
    setProLockNotice(null);
    setCleanedFile(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawCSVContent(text);
    };
    reader.readAsText(file);
  };

  const handleCellEdit = (rowIndex: number, colIndex: number, newValue: string) => {
    if (!cleanedFile) return;
    const updatedRows = cleanedFile.rows.map((r, rIdx) =>
      rIdx === rowIndex ? r.map((c, cIdx) => (cIdx === colIndex ? newValue : c)) : r
    );
    setCleanedFile({
      ...cleanedFile,
      rows: updatedRows,
      cleanedSize: new Blob([stringifyCSV(cleanedFile.headers, updatedRows)]).size,
    });
  };

  const handleAddRow = () => {
    if (!cleanedFile) return;
    const emptyRow = new Array(cleanedFile.headers.length).fill('');
    const updatedRows = [...cleanedFile.rows, emptyRow];
    setCleanedFile({
      ...cleanedFile,
      rows: updatedRows,
      cleanedSize: new Blob([stringifyCSV(cleanedFile.headers, updatedRows)]).size,
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!cleanedFile) return;
    const updatedRows = cleanedFile.rows.filter((_, idx) => idx !== rowIndex);
    setCleanedFile({
      ...cleanedFile,
      rows: updatedRows,
      cleanedSize: new Blob([stringifyCSV(cleanedFile.headers, updatedRows)]).size,
    });
  };

  const handleLoadSample = () => {
    setSelectedFileName('global_messy_sales_data.csv');
    setRawCSVContent(SAMPLE_MESSY_CSV);
    setIsDeletedMessage(null);
    setProLockNotice(null);
    setCleanedFile(null);
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    try {
      setIsProcessing(true);
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
    if (!rawCSVContent) {
      handleLoadSample();
      executeClean(SAMPLE_MESSY_CSV, 'global_messy_sales_data.csv');
      return;
    }
    executeClean(rawCSVContent, selectedFileName || 'cleaned_data.csv');
  };

  const executeClean = (rawText: string, fileName: string) => {
    setIsProcessing(true);
    setProgressPercent(15);
    setIsDeletedMessage(null);
    setProLockNotice(null);

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
      const cleaningOptions = isBankPage
        ? { ...options, ...bankOptions, isBankMode: true }
        : options;

      const { headers, rows, stats } = cleanCSVData(parsed, cleaningOptions);

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
      onIncrementUsage();

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
    }, 650);
  };

  const handleDownloadCSV = () => {
    if (!cleanedFile) return;
    const csvContent = stringifyCSV(cleanedFile.headers, cleanedFile.rows);
    triggerDownload(csvContent, cleanedFile.name);
  };

  const handleDownloadExcel = () => {
    if (!cleanedFile) return;
    if (!hasProExportAccess) {
      setProLockNotice('Excel (.xlsx) export is available on Unlimited Pro ($1.99/mo), Yearly Pro, and Business plans.');
      onNavigateToPricing();
      return;
    }
    exportToExcel(cleanedFile.headers, cleanedFile.rows, cleanedFile.name);
  };

  const handleDownloadJSON = () => {
    if (!cleanedFile) return;
    if (!hasProExportAccess) {
      setProLockNotice('JSON (.json) export is available on Unlimited Pro ($1.99/mo), Yearly Pro, and Business plans.');
      onNavigateToPricing();
      return;
    }
    exportToJSON(cleanedFile.headers, cleanedFile.rows, cleanedFile.name);
  };

  const handleDeleteFromServer = () => {
    setCleanedFile(null);
    setRawCSVContent(null);
    setSelectedFileName(null);
    setProLockNotice(null);
    setShowPreviewModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsDeletedMessage(t.deleteConfirmed);
  };

  const filteredRows = cleanedFile
    ? cleanedFile.rows
        .map((row, originalIndex) => ({ row, originalIndex }))
        .filter(({ row }) =>
          previewSearch === ''
            ? true
            : row.some((cell) => cell.toLowerCase().includes(previewSearch.toLowerCase()))
        )
    : [];

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-[#eef2f8] pb-16 overflow-x-hidden">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
      </Helmet>

      {/* Background Graphic Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M -100 280 C 150 180, 250 480, 600 380 S 1100 500, 1600 320" fill="none" stroke="#10b981" strokeWidth="1.4" opacity="0.45" />
          <path d="M -80 420 C 220 520, 480 200, 850 320 S 1350 180, 1700 450" fill="none" stroke="#0284c7" strokeWidth="1.2" opacity="0.4" />
        </svg>
      </div>

      <div className="relative max-w-3xl mx-auto px-3 sm:px-6 pt-5 sm:pt-10">
        {/* H1 Heading (Dynamic) */}
        <div className="text-center mb-6 sm:mb-8 px-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 leading-tight">
            {pageH1}
          </h1>
          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            {pageDesc}
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

                <div className="flex flex-col items-center justify-center py-2 sm:py-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
                    <UploadCloud className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2]" />
                  </div>
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">
                    Drag & Drop your CSV file here
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 max-w-xs sm:max-w-md">
                    Supports .csv, .tsv, and .txt files — processed 100% locally in your browser
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

                  <div className="w-full sm:w-auto flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                    <label
                      htmlFor="csv-file-input"
                      className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 cursor-pointer shadow-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-600" />
                      <span>{t.chooseFile}</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sample Messy CSV</span>
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
                <button type="button" onClick={() => setShowCleaningOptions(!showCleaningOptions)} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-3 text-left cursor-pointer">
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

                {isBankPage && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Bank Statement Advanced Mode
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={bankOptions.mergeDebitCredit}
                          onChange={(e) => setBankOptions({ ...bankOptions, mergeDebitCredit: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>Combine Debit & Credit into one Amount column (-500 / +1200)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-700 font-medium">Target Date Format:</span>
                        <select
                          value={bankOptions.targetDateFormat}
                          onChange={(e) => setBankOptions({ ...bankOptions, targetDateFormat: e.target.value })}
                          className="px-2 py-1 border border-slate-300 rounded text-xs focus:ring-blue-500"
                        >
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 sm:mt-6 flex flex-col items-center">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={startCleaningProcess}
                  className="w-full sm:w-auto sm:min-w-[260px] px-6 sm:px-8 py-3 text-sm sm:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{rawCSVContent ? 'Clean & Process CSV' : 'Try Sample or Clean CSV'}</span>
                </button>

                {isProcessing && (
                  <div className="mt-4 w-full max-w-md space-y-1.5">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Cleaning & Formatting... {progressPercent}%</span>
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

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 mb-3">
                <button
                  type="button"
                  onClick={handleDownloadCSV}
                  className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV (Free)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className={`w-full sm:w-auto px-5 py-3 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasProExportAccess
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 border border-slate-300'
                  }`}
                >
                  {hasProExportAccess ? <FileSpreadsheet className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
                  <span>Download Excel</span>
                  {!hasProExportAccess && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-100 text-amber-900 border border-amber-300">
                      PRO
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadJSON}
                  className={`w-full sm:w-auto px-5 py-3 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    hasProExportAccess
                      ? 'bg-slate-800 hover:bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 border border-slate-300'
                  }`}
                >
                  {hasProExportAccess ? <FileJson className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
                  <span>Download JSON</span>
                  {!hasProExportAccess && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-100 text-amber-900 border border-amber-300">
                      PRO
                    </span>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-2.5 sm:gap-3">
                <button type="button" onClick={() => setShowPreviewModal(true)} className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>{t.previewData} / Edit</span>
                </button>
                <button type="button" onClick={handleDeleteFromServer} className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                  <span>{t.deleteFromServer}</span>
                </button>
              </div>

              {proLockNotice && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                  🔒 {proLockNotice}
                </div>
              )}
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

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px]">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
              <span>{hasProExportAccess ? 'PRO ACTIVE: CSV, EXCEL & JSON UNLOCKED' : 'FREE BASIC: UNLIMITED CSV DOWNLOAD'}</span>
            </div>
          </div>
        </div>

        {/* How to Use (3 Steps) & FAQ Section */}
        <div className="mt-10 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">How It Works (3 Simple Steps)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm mb-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-indigo-600 mb-1">1. Upload or Load Sample</div>
              <p className="text-slate-600 text-xs leading-relaxed">Drag & drop a .csv, .tsv, or .txt file, or click Sample Messy CSV to test immediately.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-emerald-600 mb-1">2. Clean & Edit in Browser</div>
              <p className="text-slate-600 text-xs leading-relaxed">Remove duplicate rows, trim extra spaces, fix dates, or edit cells directly in the preview table.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="font-bold text-slate-800 mb-1">3. Download Instantly</div>
              <p className="text-slate-600 text-xs leading-relaxed">Export your cleaned CSV file locally with zero server uploads and complete privacy.</p>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <span>Frequently Asked Questions</span>
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="border-b border-slate-100 pb-2.5">
              <div className="font-semibold text-slate-800">Are my CSV files uploaded to a server?</div>
              <p className="text-slate-600 text-xs mt-1">No. All parsing and cleaning happen locally inside your browser.</p>
            </div>
            <div>
              <div className="font-semibold text-slate-800">Is CSV cleaning free?</div>
              <p className="text-slate-600 text-xs mt-1">Yes, core CSV cleaning and CSV export work directly in your browser without forced login.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview / Edit Modal */}
      {showPreviewModal && cleanedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 sm:p-6 flex flex-col max-h-[88vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  Preview & Edit: {cleanedFile.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredRows.length} of {cleanedFile.rows.length} rows
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="Search cells..."
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-2 border-b border-slate-200 text-slate-500 font-semibold w-10">#</th>
                    {cleanedFile.headers.map((header, hIdx) => (
                      <th key={hIdx} className="p-2 border-b border-slate-200 font-bold text-slate-700 whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                    <th className="p-2 border-b border-slate-200 text-slate-500 font-semibold w-12 text-center">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map(({ row, originalIndex }) => (
                    <tr key={originalIndex} className="hover:bg-slate-50/80">
                      <td className="p-2 text-slate-400 font-mono">{originalIndex + 1}</td>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellEdit(originalIndex, cIdx, e.target.value)}
                            className="w-full min-w-[110px] px-2 py-1 text-xs text-slate-800 bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white rounded focus:outline-hidden"
                          />
                        </td>
                      ))}
                      <td className="p-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(originalIndex)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadCSV}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Updated CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer"
              >
                Done
              </button>
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
                {footerModal === 'privacy' && 'Privacy Policy'}
                {footerModal === 'terms' && 'Terms of Service'}
                {footerModal === 'sla' && '24/7 SLA for PRO'}
              </h3>
              <button onClick={() => setFooterModal(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              {footerModal === 'venue' && (
                <>
                  <p>Global operational infrastructure and client-side privacy architecture.</p>
                  <p>Our tool operates entirely in your web browser. No files are ever uploaded to our servers.</p>
                </>
              )}
              {footerModal === 'privacy' && (
                <>
                  <p className="font-bold text-slate-900">1. Zero Data Retention</p>
                  <p>CleanCSV operates entirely in your web browser. We do not upload, store, or transfer your CSV files to any server. All processing happens locally. We do not have access to your data.</p>
                  <p className="font-bold text-slate-900 mt-2">2. Information We Collect</p>
                  <p>If you create an account, we collect your name and email. For Pro purchases, payments are processed securely by third-party gateways (we do not store card details).</p>
                  <p className="font-bold text-slate-900 mt-2">3. Cookies</p>
                  <p>We use cookies to remember your preferences and analyze traffic via Google Analytics.</p>
                  <p>Contact us at support@cleancsv.online for privacy queries.</p>
                </>
              )}
              {footerModal === 'terms' && (
                <>
                  <p className="font-bold text-slate-900">1. Service Description</p>
                  <p>CleanCSV provides a browser-based tool to clean, format, and convert CSV data. The Free tier allows unlimited CSV downloads. The Pro tier unlocks Excel/JSON exports.</p>
                  <p className="font-bold text-slate-900 mt-2">2. "As-Is" Disclaimer</p>
                  <p>Our service is provided on an "as-is" basis. We do not guarantee 100% accuracy of the cleaning results. You are responsible for verifying your data before using it. We are not liable for any data loss.</p>
                  <p className="font-bold text-slate-900 mt-2">3. Pro Subscriptions</p>
                  <p>Pro plans renew automatically. You can cancel anytime from your dashboard. Refunds are subject to our Pricing Terms.</p>
                </>
              )}
              {footerModal === 'sla' && (
                <>
                  <p className="font-bold text-slate-900">Priority Support for Pro Users</p>
                  <p>If you are a Pro user, you get 24/7 priority email support. We aim to respond to all queries within 12-24 hours.</p>
                  <p>Email: support@cleancsv.online</p>
                </>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
              <button onClick={() => setFooterModal(null)} className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};