import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Eye, Copy, Filter } from "lucide-react";
import { caseApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function CaseList() {
  const [cases, setCases] = useState<any[]>([]);
  const [filteredCases, setFilteredCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cases.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCases(filtered);
    } else {
      setFilteredCases(cases);
    }
  }, [searchQuery, cases]);

  const loadCases = async () => {
    try {
      const data = await caseApi.getAll();
      setCases(data);
      setFilteredCases(data);
    } catch (error: any) {
      toast.error("Failed to load cases", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-status-completed/10 text-status-completed";
      case "pending":
        return "bg-status-pending/10 text-status-pending";
      case "in_progress":
        return "bg-status-progress/10 text-status-progress";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-status-high-priority/10 text-status-high-priority";
      case "medium":
        return "bg-status-pending/10 text-status-pending";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading cases...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Cases</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all judicial cases
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, client name, or case ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No cases found matching your search" : "No cases yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredCases.map((case_: any, index) => (
              <Card
                key={case_.id}
                className="border-border hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {case_.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Client: {case_.client_name}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              Case ID:
                              <code className="px-2 py-0.5 bg-muted rounded text-xs">
                                {case_.id}
                              </code>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(case_.id);
                                }}
                                className="hover:text-foreground transition-colors"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          case_.status
                        )}`}
                      >
                        {case_.status || "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          case_.priority
                        )}`}
                      >
                        {case_.priority || "Normal"}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/cases/${case_.id}`)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
