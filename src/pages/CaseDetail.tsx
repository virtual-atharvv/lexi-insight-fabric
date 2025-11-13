import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, FileSearch, Scale, BookOpen, FolderSearch, StickyNote, Bell, Activity } from "lucide-react";
import { caseApi } from "@/lib/api";
import { toast } from "sonner";
import { OverviewTab } from "@/components/case-detail/OverviewTab";
import { DocumentsTab } from "@/components/case-detail/DocumentsTab";
import { OCRTab } from "@/components/case-detail/OCRTab";
import { IPCTab } from "@/components/case-detail/IPCTab";
import { PrecedentsTab } from "@/components/case-detail/PrecedentsTab";
import { SimilarCasesTab } from "@/components/case-detail/SimilarCasesTab";
import { NotesTab } from "@/components/case-detail/NotesTab";
import { AlertsTab } from "@/components/case-detail/AlertsTab";
import { StatusTab } from "@/components/case-detail/StatusTab";

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      loadCase();
    }
  }, [id]);

  const loadCase = async () => {
    try {
      const data = await caseApi.getById(id!);
      setCaseData(data);
    } catch (error: any) {
      toast.error("Failed to load case", {
        description: error.message,
      });
      navigate("/cases");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading case...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!caseData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Case not found</p>
        </div>
      </MainLayout>
    );
  }

  const tabs = [
    { value: "overview", label: "Overview", icon: FileText },
    { value: "documents", label: "Documents", icon: FileSearch },
    { value: "ocr", label: "OCR & Text", icon: FileText },
    { value: "ipc", label: "IPC Suggestions", icon: Scale },
    { value: "precedents", label: "Precedents", icon: BookOpen },
    { value: "similar", label: "Similar Cases", icon: FolderSearch },
    { value: "notes", label: "Notes", icon: StickyNote },
    { value: "alerts", label: "Alerts", icon: Bell },
    { value: "status", label: "Status", icon: Activity },
  ];

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cases")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {caseData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                Case ID: <code className="px-2 py-1 bg-muted rounded text-sm">{id}</code>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex w-auto flex-wrap h-auto gap-2 p-2 bg-muted/50">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab caseData={caseData} onUpdate={loadCase} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <DocumentsTab caseId={id!} />
          </TabsContent>

          <TabsContent value="ocr" className="space-y-4">
            <OCRTab caseId={id!} />
          </TabsContent>

          <TabsContent value="ipc" className="space-y-4">
            <IPCTab caseId={id!} />
          </TabsContent>

          <TabsContent value="precedents" className="space-y-4">
            <PrecedentsTab />
          </TabsContent>

          <TabsContent value="similar" className="space-y-4">
            <SimilarCasesTab caseId={id!} />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <NotesTab caseId={id!} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <AlertsTab caseId={id!} />
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <StatusTab caseId={id!} caseData={caseData} onUpdate={loadCase} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
