import { TimelineEvent } from "./TimelineEvent";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { useTimelines } from "@/hooks/useTimelines";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const Timeline = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ name: '', description: '' });
  const { data: timelines, isLoading: timelinesLoading } = useTimelines();
  const { data: events, isLoading: eventsLoading } = useTimelineEvents(timelines?.[0]?.id);
  const { toast } = useToast();

  const handleCreateTimeline = async () => {
    setIsCreating(true);
    try {
      const { error } = await supabase
        .from('timelines')
        .insert([{
          name: newTimeline.name,
          description: newTimeline.description,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline created successfully",
      });
      setNewTimeline({ name: '', description: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create timeline",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (timelinesLoading || eventsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full md:w-auto" variant="secondary">
            Create New Timeline
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Timeline</DialogTitle>
            <DialogDescription>
              Create a new timeline to start tracking historical events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Timeline name"
                value={newTimeline.name}
                onChange={(e) => setNewTimeline(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                value={newTimeline.description}
                onChange={(e) => setNewTimeline(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={handleCreateTimeline}
              disabled={isCreating || !newTimeline.name}
            >
              {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Create Timeline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <TimelineEvent key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};