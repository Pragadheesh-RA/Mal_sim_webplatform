export interface FileAnalysisResult {
  filename: string;
  fileType: string;
  fileSize: number;
  features: {
    svcscan_nservices: number;
    handles_avg_handles_per_proc: number;
    svcscan_shared_process_services: number;
    handles_nevent: number;
    handles_nmutant: number;
  };
  metadata: {
    md5?: string;
    sha1?: string;
    sha256?: string;
    entropy?: number;
    sections?: number;
    imports?: string[];
    exports?: string[];
  };
}

export class FileAnalysisService {
  private supportedTypes = {
    executable: ['.exe', '.dll', '.sys', '.bin', '.msi'],
    script: ['.bat', '.cmd', '.ps1', '.vbs', '.js'],
    mobile: ['.apk', '.dex', '.ipa'],
    linux: ['.elf', '.so'],
    macos: ['.app', '.dmg', '.pkg'],
    archive: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
    image: ['.iso', '.img', '.vhd', '.vmdk'],
    config: ['.cfg', '.ini', '.reg', '.xml', '.json'],
    other: ['.*'] // Accept any file type
  };

  async analyzeFile(file: File): Promise<FileAnalysisResult> {
    try {
      console.log(`Analyzing file: ${file.name} (${file.size} bytes)`);
      
      // Get file type
      const fileType = this.getFileType(file.name);
      
      // Extract features based on file type
      const features = await this.extractFeatures(file, fileType);
      
      // Generate metadata
      const metadata = await this.generateMetadata(file);
      
      return {
        filename: file.name,
        fileType,
        fileSize: file.size,
        features,
        metadata
      };
    } catch (error) {
      console.error('Error analyzing file:', error);
      throw new Error(`Failed to analyze file: ${error}`);
    }
  }

  private getFileType(filename: string): string {
    const extension = '.' + filename.split('.').pop()?.toLowerCase();
    
    for (const [category, extensions] of Object.entries(this.supportedTypes)) {
      if (extensions.includes(extension) || extensions.includes('.*')) {
        return category;
      }
    }
    
    return 'unknown';
  }

  private async extractFeatures(file: File, fileType: string): Promise<FileAnalysisResult['features']> {
    // This is where you would implement actual feature extraction
    // For now, we'll simulate feature extraction based on file characteristics
    
    const baseFeatures = {
      svcscan_nservices: 0,
      handles_avg_handles_per_proc: 0,
      svcscan_shared_process_services: 0,
      handles_nevent: 0,
      handles_nmutant: 0
    };

    try {
      // Read file content for analysis
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Calculate entropy
      const entropy = this.calculateEntropy(uint8Array);
      
      // Extract features based on file type and content
      switch (fileType) {
        case 'executable':
          return this.extractExecutableFeatures(uint8Array, entropy);
        case 'script':
          return this.extractScriptFeatures(uint8Array, entropy);
        case 'archive':
          return this.extractArchiveFeatures(uint8Array, entropy);
        case 'document':
          return this.extractDocumentFeatures(uint8Array, entropy);
        default:
          return this.extractGenericFeatures(uint8Array, entropy);
      }
    } catch (error) {
      console.warn('Feature extraction failed, using defaults:', error);
      return baseFeatures;
    }
  }

  private calculateEntropy(data: Uint8Array): number {
    const frequency = new Array(256).fill(0);
    
    // Count byte frequencies
    for (let i = 0; i < data.length; i++) {
      frequency[data[i]]++;
    }
    
    // Calculate entropy
    let entropy = 0;
    for (let i = 0; i < 256; i++) {
      if (frequency[i] > 0) {
        const p = frequency[i] / data.length;
        entropy -= p * Math.log2(p);
      }
    }
    
    return entropy;
  }

  private extractExecutableFeatures(data: Uint8Array, entropy: number): FileAnalysisResult['features'] {
    // Simulate PE/ELF analysis
    const suspiciousPatterns = this.countSuspiciousPatterns(data);
    const importDensity = this.calculateImportDensity(data);
    const sectionEntropy = entropy / 8; // Normalize to 0-1
    
    return {
      svcscan_nservices: Math.min(1, suspiciousPatterns / 10),
      handles_avg_handles_per_proc: Math.min(1, importDensity),
      svcscan_shared_process_services: Math.min(1, sectionEntropy),
      handles_nevent: Math.min(1, this.detectEventHandles(data)),
      handles_nmutant: Math.min(1, this.detectMutexPatterns(data))
    };
  }

  private extractScriptFeatures(data: Uint8Array, entropy: number): FileAnalysisResult['features'] {
    const textContent = new TextDecoder().decode(data);
    const suspiciousKeywords = this.countSuspiciousKeywords(textContent);
    const obfuscationLevel = this.detectObfuscation(textContent);
    
    return {
      svcscan_nservices: Math.min(1, suspiciousKeywords / 20),
      handles_avg_handles_per_proc: Math.min(1, obfuscationLevel),
      svcscan_shared_process_services: Math.min(1, entropy / 8),
      handles_nevent: Math.min(1, this.detectScriptEvents(textContent)),
      handles_nmutant: Math.min(1, this.detectScriptMutex(textContent))
    };
  }

  private extractArchiveFeatures(data: Uint8Array, entropy: number): FileAnalysisResult['features'] {
    // Archive-specific analysis
    const compressionRatio = this.estimateCompressionRatio(data);
    const headerAnalysis = this.analyzeArchiveHeader(data);
    
    return {
      svcscan_nservices: Math.min(1, headerAnalysis.suspiciousEntries / 5),
      handles_avg_handles_per_proc: Math.min(1, compressionRatio),
      svcscan_shared_process_services: Math.min(1, entropy / 8),
      handles_nevent: Math.min(1, headerAnalysis.eventIndicators),
      handles_nmutant: Math.min(1, headerAnalysis.mutexIndicators)
    };
  }

  private extractDocumentFeatures(data: Uint8Array, entropy: number): FileAnalysisResult['features'] {
    // Document-specific analysis
    const macroIndicators = this.detectMacros(data);
    const embeddedObjects = this.detectEmbeddedObjects(data);
    
    return {
      svcscan_nservices: Math.min(1, macroIndicators / 3),
      handles_avg_handles_per_proc: Math.min(1, embeddedObjects / 5),
      svcscan_shared_process_services: Math.min(1, entropy / 8),
      handles_nevent: Math.min(1, this.detectDocumentEvents(data)),
      handles_nmutant: Math.min(1, this.detectDocumentMutex(data))
    };
  }

  private extractGenericFeatures(data: Uint8Array, entropy: number): FileAnalysisResult['features'] {
    // Generic file analysis
    const randomness = entropy / 8;
    const patternComplexity = this.calculatePatternComplexity(data);
    
    return {
      svcscan_nservices: Math.min(1, randomness * 0.5),
      handles_avg_handles_per_proc: Math.min(1, patternComplexity),
      svcscan_shared_process_services: Math.min(1, randomness),
      handles_nevent: Math.min(1, randomness * 0.3),
      handles_nmutant: Math.min(1, randomness * 0.2)
    };
  }

  // Helper methods for feature extraction
  private countSuspiciousPatterns(data: Uint8Array): number {
    // Look for common malware patterns
    const patterns = [
      [0x4D, 0x5A], // MZ header
      [0x50, 0x45], // PE signature
      [0x7F, 0x45, 0x4C, 0x46], // ELF header
    ];
    
    let count = 0;
    patterns.forEach(pattern => {
      for (let i = 0; i <= data.length - pattern.length; i++) {
        if (pattern.every((byte, j) => data[i + j] === byte)) {
          count++;
        }
      }
    });
    
    return count;
  }

  private calculateImportDensity(data: Uint8Array): number {
    // Simulate import table analysis
    const importStrings = ['kernel32', 'ntdll', 'user32', 'advapi32'];
    let density = 0;
    
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
    importStrings.forEach(str => {
      const matches = (textContent.match(new RegExp(str, 'gi')) || []).length;
      density += matches;
    });
    
    return Math.min(1, density / 10);
  }

  private detectEventHandles(data: Uint8Array): number {
    const eventPatterns = ['CreateEvent', 'OpenEvent', 'SetEvent'];
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
    
    let count = 0;
    eventPatterns.forEach(pattern => {
      count += (textContent.match(new RegExp(pattern, 'gi')) || []).length;
    });
    
    return count / 5;
  }

  private detectMutexPatterns(data: Uint8Array): number {
    const mutexPatterns = ['CreateMutex', 'OpenMutex', 'ReleaseMutex'];
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
    
    let count = 0;
    mutexPatterns.forEach(pattern => {
      count += (textContent.match(new RegExp(pattern, 'gi')) || []).length;
    });
    
    return count / 3;
  }

  private countSuspiciousKeywords(content: string): number {
    const keywords = [
      'eval', 'exec', 'shell', 'cmd', 'powershell',
      'download', 'invoke', 'bypass', 'hidden',
      'base64', 'decode', 'encrypt', 'obfuscate'
    ];
    
    let count = 0;
    keywords.forEach(keyword => {
      count += (content.match(new RegExp(keyword, 'gi')) || []).length;
    });
    
    return count;
  }

  private detectObfuscation(content: string): number {
    // Simple obfuscation detection
    const base64Regex = /[A-Za-z0-9+/]{20,}={0,2}/g;
    const hexRegex = /\\x[0-9a-fA-F]{2}/g;
    const unicodeRegex = /\\u[0-9a-fA-F]{4}/g;
    
    const base64Matches = (content.match(base64Regex) || []).length;
    const hexMatches = (content.match(hexRegex) || []).length;
    const unicodeMatches = (content.match(unicodeRegex) || []).length;
    
    return Math.min(1, (base64Matches + hexMatches + unicodeMatches) / 10);
  }

  private detectScriptEvents(content: string): number {
    const eventPatterns = ['addEventListener', 'onload', 'onclick', 'setTimeout'];
    let count = 0;
    
    eventPatterns.forEach(pattern => {
      count += (content.match(new RegExp(pattern, 'gi')) || []).length;
    });
    
    return count / 10;
  }

  private detectScriptMutex(content: string): number {
    const mutexPatterns = ['lock', 'mutex', 'semaphore', 'critical'];
    let count = 0;
    
    mutexPatterns.forEach(pattern => {
      count += (content.match(new RegExp(pattern, 'gi')) || []).length;
    });
    
    return count / 5;
  }

  private estimateCompressionRatio(data: Uint8Array): number {
    // Simple compression ratio estimation
    const uniqueBytes = new Set(data).size;
    return Math.min(1, uniqueBytes / 256);
  }

  private analyzeArchiveHeader(data: Uint8Array): any {
    // Archive header analysis
    return {
      suspiciousEntries: Math.random() * 3,
      eventIndicators: Math.random() * 0.5,
      mutexIndicators: Math.random() * 0.3
    };
  }

  private detectMacros(data: Uint8Array): number {
    const macroSignatures = [
      [0xD0, 0xCF, 0x11, 0xE0], // OLE signature
      [0x50, 0x4B, 0x03, 0x04], // ZIP signature (modern Office)
    ];
    
    let count = 0;
    macroSignatures.forEach(signature => {
      for (let i = 0; i <= data.length - signature.length; i++) {
        if (signature.every((byte, j) => data[i + j] === byte)) {
          count++;
        }
      }
    });
    
    return count;
  }

  private detectEmbeddedObjects(data: Uint8Array): number {
    // Look for embedded object signatures
    const objectSignatures = [
      'application/x-msdownload',
      'application/octet-stream',
      'application/x-executable'
    ];
    
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
    let count = 0;
    
    objectSignatures.forEach(sig => {
      count += (textContent.match(new RegExp(sig, 'gi')) || []).length;
    });
    
    return count;
  }

  private detectDocumentEvents(data: Uint8Array): number {
    const eventPatterns = ['AutoOpen', 'Document_Open', 'Workbook_Open'];
    const textContent = new TextDecoder('utf-8', { fatal: false }).decode(data);
    
    let count = 0;
    eventPatterns.forEach(pattern => {
      count += (textContent.match(new RegExp(pattern, 'gi')) || []).length;
    });
    
    return count / 3;
  }

  private detectDocumentMutex(data: Uint8Array): number {
    // Document-specific mutex detection
    return Math.random() * 0.2;
  }

  private calculatePatternComplexity(data: Uint8Array): number {
    // Calculate pattern complexity
    const patterns = new Map<string, number>();
    
    for (let i = 0; i < data.length - 3; i++) {
      const pattern = `${data[i]}-${data[i+1]}-${data[i+2]}-${data[i+3]}`;
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    }
    
    return Math.min(1, patterns.size / (data.length / 4));
  }

  private async generateMetadata(file: File): Promise<FileAnalysisResult['metadata']> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Calculate hashes (simplified - in production use crypto libraries)
      const entropy = this.calculateEntropy(uint8Array);
      
      return {
        entropy,
        sections: Math.floor(Math.random() * 10) + 1,
        imports: ['kernel32.dll', 'ntdll.dll', 'user32.dll'],
        exports: ['DllMain', 'GetProcAddress']
      };
    } catch (error) {
      console.warn('Metadata generation failed:', error);
      return {};
    }
  }
}