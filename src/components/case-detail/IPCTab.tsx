import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, TrendingUp } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { toast } from "sonner";

interface IPCTabProps {
  caseId: string;
}

export const IPCTab = ({ caseId }: IPCTabProps) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-status-high-priority/10 text-status-high-priority border-status-high-priority/20";
      case "medium":
        return "bg-status-pending/10 text-status-pending border-status-pending/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          IPC Section Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              No IPC suggestions available yet
            </p>
            <p className="text-sm text-muted-foreground">
              Extract text from documents and run IPC analysis
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion: any, index: number) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-5 transition-all hover:shadow-md ${getSeverityColor(
                  suggestion.severity
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      IPC Section {suggestion.section}
                    </h3>
                    <p className="text-sm opacity-80 mt-1">{suggestion.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">
                        {(suggestion.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs opacity-70">Confidence</span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-background/50 rounded-full h-2">
                    <div
                      className="bg-current h-2 rounded-full transition-all"
                      style={{ width: `${suggestion.confidence * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Reason: </span>
                    <span className="opacity-90">{suggestion.reason}</span>
                  </div>
                  {suggestion.keywords && (
                    <div>
                      <span className="font-medium">Keywords: </span>
                      <span className="opacity-90">{suggestion.keywords.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
