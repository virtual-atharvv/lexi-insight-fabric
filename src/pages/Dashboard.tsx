import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FolderOpen, AlertCircle, TrendingUp, CheckCircle, Plus, Clock } from "lucide-react";
import { caseApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    highPriority: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const cases = await caseApi.getAll();
      
      setStats({
        total: cases.length,
        pending: cases.filter((c: any) => c.status === "pending").length,
        highPriority: cases.filter((c: any) => c.priority === "high").length,
        completed: cases.filter((c: any) => c.status === "completed").length,
      });
      
      setRecentCases(cases.slice(0, 5));
    } catch (error: any) {
      toast.error("Failed to load dashboard", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Cases",
      value: stats.total,
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Cases",
      value: stats.pending,
      icon: Clock,
      color: "text-status-pending",
      bgColor: "bg-status-pending/10",
    },
    {
      title: "High Priority",
      value: stats.highPriority,
      icon: AlertCircle,
      color: "text-status-high-priority",
      bgColor: "bg-status-high-priority/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-status-completed",
      bgColor: "bg-status-completed/10",
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your judicial cases
            </p>
          </div>
          <Button
            onClick={() => navigate("/cases/create")}
            className="gap-2 bg-gradient-primary hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Create New Case
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={stat.title}
              className="border-border hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Cases */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentCases.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No cases yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/cases/create")}
                >
                  Create Your First Case
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCases.map((case_: any) => (
                  <div
                    key={case_.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/cases/${case_.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{case_.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {case_.client_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          case_.priority === "high"
                            ? "bg-status-high-priority/10 text-status-high-priority"
                            : case_.priority === "medium"
                            ? "bg-status-pending/10 text-status-pending"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {case_.priority || "Normal"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {case_.id}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
