import { useRef, useState, ChangeEvent, DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn, formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeInMB?: number;
  className?: string;
}

interface UploadedFile {
  file: File;
  preview?: string;
  progress: number;
  error?: string;
  uploaded: boolean;
}

function FileUpload({
  onFilesSelected,
  maxFiles = 5,
  acceptedFileTypes = "*",
  maxSizeInMB = 10,
  className,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const addFiles = (files: File[]) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    const newFiles = files.map(file => {
      // Check file size
      if (file.size > maxSizeInBytes) {
        return {
          file,
          progress: 100,
          error: `File exceeds maximum size of ${maxSizeInMB}MB`,
          uploaded: false
        };
      }
      
      // Check file type if specific types are required
      if (acceptedFileTypes !== "*") {
        const fileType = file.type;
        const acceptedTypes = acceptedFileTypes.split(",");
        if (!acceptedTypes.some(type => fileType.includes(type))) {
          return {
            file,
            progress: 100,
            error: `File type not accepted. Please upload ${acceptedFileTypes}`,
            uploaded: false
          };
        }
      }
      
      // Create preview for images
      let preview = undefined;
      if (file.type.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }
      
      return {
        file,
        preview,
        progress: 0,
        uploaded: false
      };
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload
    newFiles.forEach((fileObj, index) => {
      if (!fileObj.error) {
        simulateUpload(uploadedFiles.length + index);
      }
    });
    
    // Pass valid files to parent component
    const validFiles = newFiles.filter(f => !f.error).map(f => f.file);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };
  
  const simulateUpload = (fileIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles(prev => {
        const newFiles = [...prev];
        if (newFiles[fileIndex]) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            progress,
            uploaded: progress === 100
          };
        }
        return newFiles;
      });
      
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      
      // Revoke object URL if there's a preview
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      
      newFiles.splice(index, 1);
      return newFiles;
    });
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:border-primary/60",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          uploadedFiles.length > 0 ? "pb-2" : "py-12 text-center"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        {uploadedFiles.length === 0 ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Upload Materials</h3>
            <p className="text-muted-foreground">
              Drag & drop files here or click to browse
            </p>
            <Button 
              type="button" 
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              Select Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Max file size: {maxSizeInMB}MB. Allowed types: {acceptedFileTypes === "*" ? "All files" : acceptedFileTypes}
            </p>
          </div>
        ) : (
          <div className="text-center py-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="text-sm"
              onClick={(e) => {
                e.stopPropagation();
                triggerFileInput();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Add more files
            </Button>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadedFiles.map((fileObj, index) => (
            <div key={index} className="bg-card border rounded-lg p-3 flex items-center">
              <div className="mr-3 flex-shrink-0">
                {fileObj.preview ? (
                  <img 
                    src={fileObj.preview} 
                    alt={fileObj.file.name} 
                    className="w-10 h-10 rounded object-cover" 
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                    <File className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="truncate pr-2 text-sm font-medium">{fileObj.file.name}</div>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{formatFileSize(fileObj.file.size)}</span>
                  
                  {fileObj.error ? (
                    <span className="ml-2 text-destructive">{fileObj.error}</span>
                  ) : fileObj.uploaded ? (
                    <span className="ml-2 flex items-center text-green-600 dark:text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" /> Uploaded
                    </span>
                  ) : (
                    <span className="ml-2">{fileObj.progress}%</span>
                  )}
                </div>
                
                {!fileObj.error && fileObj.progress < 100 && (
                  <Progress value={fileObj.progress} className="h-1 mt-2" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
