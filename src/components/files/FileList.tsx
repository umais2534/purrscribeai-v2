import React, { useState } from "react";
import { FileItem } from "./FileManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  Download,
  Trash2,
  Share,
  Printer,
  Eye,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { FileViewer } from "./FileViewer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FileListProps {
  files: FileItem[];
  onDelete: (fileId: string) => void;
}

export const FileList = ({ files, onDelete }: FileListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewFile, setViewFile] = useState<FileItem | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareSuccess, setShareSuccess] = useState(false);

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort files based on sort criteria
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? a.uploadDate.getTime() - b.uploadDate.getTime()
        : b.uploadDate.getTime() - a.uploadDate.getTime();
    } else {
      // Sort by size
      return sortOrder === "asc" ? a.size - b.size : b.size - a.size;
    }
  });

  const handleSort = (criteria: "name" | "date" | "size") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) {
      return <FileText size={20} className="text-red-500" />;
    } else if (fileType.includes("word") || fileType.includes("doc")) {
      return <FileText size={20} className="text-blue-500" />;
    } else if (
      fileType.includes("sheet") ||
      fileType.includes("excel") ||
      fileType.includes("xls")
    ) {
      return <FileText size={20} className="text-green-500" />;
    } else if (
      fileType.includes("image") ||
      fileType.includes("jpg") ||
      fileType.includes("png")
    ) {
      return <FileText size={20} className="text-purple-500" />;
    } else {
      return <FileText size={20} className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handlePrint = (file: FileItem) => {
    // Open file in new window and trigger print
    const printWindow = window.open(file.url, "_blank");
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  };

  const handleShare = (file: FileItem) => {
    setViewFile(file);
    setShareDialogOpen(true);
    setShareSuccess(false);
    setShareEmail("");
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email sending
    setTimeout(() => {
      setShareSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {sortedFiles.length > 0 ? (
       <div className="border rounded-md overflow-x-auto">
  <table className="w-full min-w-[600px]">

            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-sm">
                  <button
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleSort("name")}
                  >
                    <span>Name</span>
                    {sortBy === "name" && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="text-left p-3 font-medium text-sm hidden md:table-cell">
                  <button
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleSort("date")}
                  >
                    <span>Date</span>
                    {sortBy === "date" && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="text-left p-3 font-medium text-sm hidden md:table-cell">
                  <button
                    className="flex items-center space-x-1 hover:text-primary"
                    onClick={() => handleSort("size")}
                  >
                    <span>Size</span>
                    {sortBy === "size" && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
                <th className="text-right p-3 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((file) => (
                <tr key={file.id} className="border-t hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <span className="font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground text-sm hidden md:table-cell">
                    {format(file.uploadDate, "MMM d, yyyy")}
                  </td>
                  <td className="p-3 text-muted-foreground text-sm hidden md:table-cell">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewFile(file)}
                        title="View"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(file.url, "_blank")}
                        title="Download"
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePrint(file)}
                        title="Print"
                      >
                        <Printer size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare(file)}
                        title="Share"
                      >
                        <Share size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete file?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{file.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(file.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium">No files found</h3>
          <p className="text-muted-foreground">
            Upload files or adjust your search
          </p>
        </div>
      )}

      {/* File Viewer Dialog */}
      {viewFile && (
        <Dialog
          open={!!viewFile}
          onOpenChange={(open) => !open && setViewFile(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getFileIcon(viewFile.type)}
                {viewFile.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto min-h-[60vh]">
              <FileViewer file={viewFile} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
          </DialogHeader>
          {!shareSuccess ? (
            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Recipient Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Add a message..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShareDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Share</Button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  File shared successfully!
                </h3>
                <p className="text-muted-foreground">
                  An email has been sent to {shareEmail} with a link to access
                  the file.
                </p>
              </div>
              <Button
                onClick={() => setShareDialogOpen(false)}
                className="mt-4"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
