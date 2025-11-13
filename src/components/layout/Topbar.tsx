import { Bell, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/lib/api";

export const Topbar = () => {
  const { email } = useAuth();

  const openApiDocs = () => {
    const token = getToken();
    window.open(`https://anonymousananta-jif-backend.hf.space/docs?token=${token}`, "_blank");
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, documents..."
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={openApiDocs}
            className="gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            API Docs
          </Button>

          <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
              {email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{email}</p>
              <p className="text-xs text-muted-foreground">Judge</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
