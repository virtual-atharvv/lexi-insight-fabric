import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, Loader2, FileText } from "lucide-react";
import { documentApi } from "@/lib/api";
import { toast } from "sonner";

interface DocumentsTabProps {
  caseId: string;
}

export const DocumentsTab = ({ caseId }: DocumentsTabProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [caseId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await documentApi.getAll(caseId);
      setDocuments(data);
    } catch (error: any) {
      toast.error("Failed to load documents", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await documentApi.upload(caseId, file);
      toast.success("Document uploaded successfully");
      loadDocuments();
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const runOCR = async (documentId: string) => {
    try {
      await documentApi.runOCR(caseId, documentId);
      toast.success("OCR processing started");
    } catch (error: any) {
      toast.error("OCR failed", {
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Document
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              {uploading ? (
                <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="h-10 w-10 text-muted-foreground" />
              )}
              <p className="text-sm font-medium">
                {uploading ? "Uploading..." : "Click to upload document"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, DOCX, or images
              </p>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{doc.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : "Size unknown"}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => runOCR(doc.id)}
                  >
                    Run OCR
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
