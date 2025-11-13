import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Plus, Calendar } from "lucide-react";
import { alertApi } from "@/lib/api";
import { toast } from "sonner";

interface AlertsTabProps {
  caseId: string;
}

export const AlertsTab = ({ caseId }: AlertsTabProps) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [alertDate, setAlertDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, [caseId]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertApi.getAll(caseId);
      setAlerts(data);
    } catch (error: any) {
      toast.error("Failed to load alerts", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async () => {
    if (!message.trim() || !alertDate) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await alertApi.add(caseId, message, alertDate);
      toast.success("Alert added");
      setMessage("");
      setAlertDate("");
      loadAlerts();
    } catch (error: any) {
      toast.error("Failed to add alert", {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    const alertDate = new Date(date);
    const diff = Math.ceil((alertDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Alert Message</Label>
            <Input
              id="message"
              placeholder="Enter alert message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Alert Date</Label>
            <Input
              id="date"
              type="date"
              value={alertDate}
              onChange={(e) => setAlertDate(e.target.value)}
            />
          </div>
          <Button
            onClick={addAlert}
            disabled={submitting}
            className="w-full gap-2"
          >
            {submitting ? "Adding..." : "Add Alert"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Active Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts set</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert: any) => {
                const daysUntil = getDaysUntil(alert.alert_date);
                return (
                  <div
                    key={alert.id}
                    className={`border-2 rounded-lg p-4 ${
                      daysUntil <= 0
                        ? "border-status-high-priority bg-status-high-priority/5"
                        : daysUntil <= 7
                        ? "border-status-pending bg-status-pending/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-2">{alert.message}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(alert.alert_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-semibold ${
                            daysUntil <= 0
                              ? "text-status-high-priority"
                              : daysUntil <= 7
                              ? "text-status-pending"
                              : "text-muted-foreground"
                          }`}
                        >
                          {daysUntil <= 0
                            ? "Overdue"
                            : daysUntil === 0
                            ? "Today"
                            : `${daysUntil} days`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
