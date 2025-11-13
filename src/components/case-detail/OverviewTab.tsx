import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, FileText, Clock } from "lucide-react";

interface OverviewTabProps {
  caseData: any;
  onUpdate: () => void;
}

export const OverviewTab = ({ caseData }: OverviewTabProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Case Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Case Title</p>
            <p className="font-medium">{caseData.title}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Case ID</p>
            <code className="px-2 py-1 bg-muted rounded text-sm">
              {caseData.id}
            </code>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{caseData.description || "No description provided"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Client Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Client Name</p>
            <p className="font-medium">{caseData.client_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-status-pending/10 text-status-pending">
              {caseData.status || "Pending"}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Priority</p>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
              {caseData.priority || "Normal"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(caseData.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
