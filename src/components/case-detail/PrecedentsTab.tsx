import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, TrendingUp } from "lucide-react";
import { analysisApi } from "@/lib/api";
import { toast } from "sonner";

export const PrecedentsTab = () => {
  const [query, setQuery] = useState("");
  const [precedents, setPrecedents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPrecedents = async () => {
    if (!query.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const results = await analysisApi.findPrecedents(query, 10);
      setPrecedents(results);
      toast.success("Precedents found");
    } catch (error: any) {
      toast.error("Search failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search Precedents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Enter search query or paste extracted text..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchPrecedents()}
            />
            <Button
              onClick={searchPrecedents}
              disabled={loading}
              className="gap-2"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {precedents.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Relevant Precedents ({precedents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {precedents.map((precedent: any, index: number) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-5 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">
                        {precedent.title || `Precedent ${index + 1}`}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {precedent.snippet || precedent.text}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-primary">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold">
                          {((precedent.score || 0.85) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">Relevance</span>
                    </div>
                  </div>

                  {precedent.citation && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Citation: {precedent.citation}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
