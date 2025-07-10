import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Folder, Code } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const maxSize = 500 * 1024 * 1024; // 500MB - increased for larger files

    if (file.size > maxSize) {
      setErrorMessage('File too large. Maximum size is 500MB.');
      return false;
    }

    return true;
  };

  const getFileType = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const fileTypes: Record<string, string> = {
      'exe': 'Windows Executable',
      'dll': 'Dynamic Link Library',
      'sys': 'System File',
      'bin': 'Binary File',
      'msi': 'Windows Installer',
      'bat': 'Batch File',
      'cmd': 'Command File',
      'ps1': 'PowerShell Script',
      'vbs': 'VBScript File',
      'js': 'JavaScript File',
      'jar': 'Java Archive',
      'apk': 'Android Package',
      'dex': 'Android Executable',
      'elf': 'Linux Executable',
      'so': 'Shared Object',
      'dmg': 'macOS Disk Image',
      'app': 'macOS Application',
      'pkg': 'macOS Package',
      'zip': 'ZIP Archive',
      'rar': 'RAR Archive',
      '7z': '7-Zip Archive',
      'tar': 'TAR Archive',
      'gz': 'GZIP Archive',
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'xls': 'Excel Spreadsheet',
      'xlsx': 'Excel Spreadsheet',
      'ppt': 'PowerPoint Presentation',
      'pptx': 'PowerPoint Presentation',
      'txt': 'Text File',
      'rtf': 'Rich Text Format',
      'html': 'HTML File',
      'htm': 'HTML File',
      'xml': 'XML File',
      'json': 'JSON File',
      'csv': 'CSV File',
      'log': 'Log File',
      'cfg': 'Configuration File',
      'ini': 'Initialization File',
      'reg': 'Registry File',
      'iso': 'ISO Image',
      'img': 'Disk Image',
      'vhd': 'Virtual Hard Disk',
      'vmdk': 'VMware Disk',
      'ova': 'Virtual Appliance',
      'ovf': 'Virtual Machine Format'
    };
    
    return fileTypes[extension] || `${extension.toUpperCase()} File`;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Simulate file analysis time based on file size
      const analysisTime = Math.min(5000, Math.max(2000, file.size / 1000));
      
      setTimeout(() => {
        onFileSelect(file);
        setUploadStatus('success');
      }, analysisTime);
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('Error processing file. Please try again.');
      setUploadStatus('error');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ML Model Integration Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Code className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h3 className="text-blue-400 font-semibold mb-2">Jupyter Notebook Integration</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Place your trained model files in:</strong></p>
              <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Folder className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">public/models/</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div>├── malware_detection_model.json</div>
                  <div>├── malware_detection_weights.bin</div>
                  <div>├── feature_scaler.json</div>
                  <div>└── model_metadata.json</div>
                </div>
              </div>
              <p><strong>Your Jupyter notebook should be placed in:</strong></p>
              <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <Folder className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">src/ml/</span>
                </div>
                <div className="ml-6 space-y-1">
                  <div>├── malware_detection.ipynb</div>
                  <div>├── feature_extraction.py</div>
                  <div>├── model_converter.py</div>
                  <div>└── preprocessing.py</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all
          ${dragActive ? 'border-indigo-500 bg-indigo-50/5' : 'border-gray-700'}
          ${uploadStatus === 'success' ? 'border-green-500 bg-green-50/5' : ''}
          ${uploadStatus === 'error' ? 'border-red-500 bg-red-50/5' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept="*/*"
        />
        
        <div className="text-center">
          {uploadStatus === 'idle' && (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">
                Drag and drop any file here, or click to select
              </p>
              <p className="mt-1 text-xs text-gray-500">
                All file formats supported (Max 500MB)
              </p>
            </>
          )}
          
          {uploadStatus === 'uploading' && (
            <div className="pulse">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-sm text-indigo-400">Analyzing file...</p>
              <p className="mt-1 text-xs text-gray-500">
                Extracting features and running ML analysis
              </p>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-2 text-sm text-green-400">File analyzed successfully!</p>
            </>
          )}
          
          {uploadStatus === 'error' && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="mt-2 text-sm text-red-400">{errorMessage || 'Error analyzing file. Please try again.'}</p>
            </>
          )}
        </div>
      </div>

      {/* Supported File Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Executable Files
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>• Windows (.exe, .dll, .sys)</div>
            <div>• Linux (.elf, .so)</div>
            <div>• macOS (.app, .dmg)</div>
            <div>• Android (.apk, .dex)</div>
            <div>• Java (.jar, .class)</div>
            <div>• Scripts (.bat, .ps1, .vbs)</div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Document & Archive Files
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>• Documents (.pdf, .doc, .xls)</div>
            <div>• Archives (.zip, .rar, .7z)</div>
            <div>• Images (.iso, .img, .vhd)</div>
            <div>• Config (.cfg, .ini, .reg)</div>
            <div>• Data (.json, .xml, .csv)</div>
            <div>• Any other format</div>
          </div>
        </div>
      </div>

      {/* Integration Instructions */}
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Code className="w-4 h-4" />
          Model Integration Steps
        </h4>
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex items-start gap-2">
            <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">1</span>
            <span>Convert your Jupyter notebook model to TensorFlow.js format</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">2</span>
            <span>Place model files in the <code className="bg-gray-700 px-1 rounded">public/models/</code> directory</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
            <span>Update the ML service to load your actual model</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">4</span>
            <span>Implement feature extraction logic for different file types</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;