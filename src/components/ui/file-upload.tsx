import { useState, useRef, ChangeEvent } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, FileImage, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  onUpload?: (files: File[]) => Promise<string[]>;
  disabled?: boolean;
  className?: string;
  label?: string;
  description?: string;
  showProgress?: boolean;
  progress?: number;
  uploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  clearable?: boolean;
  onClear?: () => void;
  showUploadButton?: boolean;
  _uploadedUrls?: string[];
}

export const FileUpload = ({
  accept = "image/*",
  multiple = true,
  maxFiles = 10,
  onFilesSelected,
  onUpload,
  disabled = false,
  className,
  label = "Upload Images",
  description = "Upload multiple images (JPG, PNG, etc.)",
  showProgress = false,
  progress = 0,
  uploadStatus = 'idle',
  errorMessage,
  clearable = true,
  onClear,
  showUploadButton = true,
  _uploadedUrls = [],
}: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusInternal, setUploadStatusInternal] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFileUrls, setUploadedFileUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        return acceptTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else if (type.endsWith('/*')) {
            return file.type.startsWith(type.slice(0, -2));
          } else {
            return file.type === type;
          }
        });
      }
      return true;
    });

    if (validFiles.length > 0) {
      handleFilesChange(validFiles);
    }
  };

  const handleFilesChange = (files: File[]) => {
    const newFiles = multiple 
      ? [...selectedFiles, ...files].slice(0, maxFiles)
      : files.slice(0, 1);
    
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFilesChange(files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setUploadedFileUrls([]);
    onFilesSelected([]);
    if (onClear) {
      onClear();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !onUpload) return;
    
    setIsUploading(true);
    setUploadStatusInternal('uploading');
    setUploadProgress(0);
    
    try {
      const urls = await onUpload(selectedFiles);
      setUploadedFileUrls(urls);
      setUploadProgress(100);
      setUploadStatusInternal('success');
      
      // Clear selected files after successful upload
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Reset status after a delay
      setTimeout(() => {
        setUploadStatusInternal('idle');
        setUploadProgress(0);
      }, 2000);
    } catch (_error) {
      setUploadStatusInternal('error');
      setTimeout(() => {
        setUploadStatusInternal('idle');
        setUploadProgress(0);
      }, 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          uploadStatus === 'uploading' && "pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-2">
          {uploadStatusInternal === 'uploading' || (showProgress && uploadStatus === 'uploading') ? (
            <div className="animate-pulse">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>
          ) : uploadStatusInternal === 'success' || (showProgress && uploadStatus === 'success') ? (
            <CheckCircle className="h-10 w-10 text-green-500" />
          ) : uploadStatusInternal === 'error' || (showProgress && uploadStatus === 'error') ? (
            <AlertCircle className="h-10 w-10 text-red-500" />
          ) : (
            <Upload className="h-10 w-10 text-muted-foreground" />
          )}
          
          <div className="text-sm">
            {uploadStatusInternal === 'uploading' || (showProgress && uploadStatus === 'uploading') ? (
              <span>Uploading files...</span>
            ) : uploadStatusInternal === 'success' || (showProgress && uploadStatus === 'success') ? (
              <span className="text-green-600">Upload completed!</span>
            ) : uploadStatusInternal === 'error' || (showProgress && uploadStatus === 'error') ? (
              <span className="text-red-600">Upload failed</span>
            ) : (
              <span>
                Drag & drop files here or{" "}
                <span className="text-primary underline">browse</span>
              </span>
            )}
          </div>
          
          {description && uploadStatusInternal === 'idle' && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected Files:</div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileImage className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                {!disabled && uploadStatus !== 'uploading' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {clearable && uploadStatus !== 'uploading' && !isUploading && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
              >
                Clear All
              </Button>
            )}
            
            {showUploadButton && selectedFiles.length > 0 && !isUploading && onUpload && (
              <Button
                type="button"
                size="sm"
                onClick={handleUpload}
                className="flex-1"
              >
                Upload Files
              </Button>
            )}
          </div>
        </div>
      )}

      {(showProgress || isUploading) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Upload Progress</span>
            <span>{isUploading ? uploadProgress : progress}%</span>
          </div>
          <Progress value={isUploading ? uploadProgress : progress} className="w-full" />
          
          {(uploadStatusInternal === 'success' || uploadStatus === 'success') && (
            <div className="flex items-center text-green-600 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Upload completed successfully!
            </div>
          )}
          
          {(uploadStatusInternal === 'error' || uploadStatus === 'error') && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage || "Upload failed. Please try again."}
            </div>
          )}
        </div>
      )}
      
      {uploadedFileUrls.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Uploaded Files:</div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {uploadedFileUrls.map((url, index) => (
              <div key={index} className="text-xs text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                {url.split('/').pop() || `File ${index + 1}`}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};