import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderSearch, TrendingUp } from "lucide-react";
import { caseApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface SimilarCasesTabProps {
  caseId: string;
}

export const SimilarCasesTab = ({ caseId }: SimilarCasesTabProps) => {
  const [similarCases, setSimilarCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSimilarCases();
  }, [caseId]);

  const loadSimilarCases = async () => {
    try {
      const results = await caseApi.getSimilar(caseId);
      setSimilarCases(results);
    } catch (error: any) {
      toast.error("Failed to load similar cases", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderSearch className="h-5 w-5 text-primary" />
          Similar Cases
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          </div>
        ) : similarCases.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <FolderSearch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No similar cases found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {similarCases.map((case_: any, index: number) => (
              <div
                key={case_.id}
                className="border border-border rounded-lg p-5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/cases/${case_.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{case_.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client: {case_.client_name}
                    </p>
                    {case_.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {case_.description.slice(0, 150)}...
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-semibold">
                        {((case_.similarity || 0.8) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Similarity</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
