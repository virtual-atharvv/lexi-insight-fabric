import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus } from "lucide-react";
import { noteApi } from "@/lib/api";
import { toast } from "sonner";

interface NotesTabProps {
  caseId: string;
}

export const NotesTab = ({ caseId }: NotesTabProps) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [caseId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await noteApi.getAll(caseId);
      setNotes(data);
    } catch (error: any) {
      toast.error("Failed to load notes", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    setSubmitting(true);
    try {
      await noteApi.add(caseId, newNote);
      toast.success("Note added");
      setNewNote("");
      loadNotes();
    } catch (error: any) {
      toast.error("Failed to add note", {
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
            <Plus className="h-5 w-5 text-primary" />
            Add Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Enter your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
          />
          <Button
            onClick={addNote}
            disabled={submitting}
            className="w-full gap-2"
          >
            {submitting ? "Adding..." : "Add Note"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            Notes ({notes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note: any) => (
                <div
                  key={note.id}
                  className="border border-border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow"
                >
                  <p className="text-sm leading-relaxed">{note.content}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{new Date(note.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
