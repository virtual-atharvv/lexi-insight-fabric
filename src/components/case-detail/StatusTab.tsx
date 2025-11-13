import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { caseApi } from "@/lib/api";
import { toast } from "sonner";

interface StatusTabProps {
  caseId: string;
  caseData: any;
  onUpdate: () => void;
}

export const StatusTab = ({ caseId, caseData, onUpdate }: StatusTabProps) => {
  const [status, setStatus] = useState(caseData.status || "pending");
  const [priority, setPriority] = useState(caseData.priority || "normal");
  const [submitting, setSubmitting] = useState(false);

  const updateStatus = async () => {
    setSubmitting(true);
    try {
      await caseApi.updateStatus(caseId, status, priority);
      toast.success("Status updated");
      onUpdate();
    } catch (error: any) {
      toast.error("Failed to update status", {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Update Case Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Case Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={updateStatus}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Updating..." : "Update Status"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Status Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="font-medium">Case Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(caseData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            {caseData.status !== "pending" && (
              <div className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-status-progress" />
                <div className="flex-1">
                  <p className="font-medium">Status: {caseData.status}</p>
                  <p className="text-sm text-muted-foreground">Last updated</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
