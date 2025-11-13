import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Copy, Send } from "lucide-react";
import { toast } from "sonner";

interface OCRTabProps {
  caseId: string;
}

export const OCRTab = ({ caseId }: OCRTabProps) => {
  const [extractedText, setExtractedText] = useState<string>("");

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success("Text copied to clipboard");
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Extracted Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!extractedText ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No OCR data available. Upload a document and run OCR to extract text.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-muted/30 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {extractedText}
              </pre>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={copyText} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Text
              </Button>
              <Button className="gap-2">
                <Send className="h-4 w-4" />
                Send to IPC Analysis
              </Button>
              <Button variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                Find Precedents
              </Button>
              <Button variant="outline" className="gap-2">
                <Send className="h-4 w-4" />
                Find Similar Cases
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
