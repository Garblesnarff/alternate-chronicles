import { Button } from "@/components/ui/button";
import { Clock, Plus, Settings } from "lucide-react";
import { useTimelines } from "@/hooks/useTimelines";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const Sidebar = () => {
  const { data: timelines, isLoading } = useTimelines();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ name: '', description: '' });
  const { toast } = useToast();

  const handleCreateTimeline = async () => {
    if (!newTimeline.name) return;
    
    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('timelines')
        .insert({
          name: newTimeline.name,
          description: newTimeline.description,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline created successfully",
      });
      setNewTimeline({ name: '', description: '' });
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error creating timeline:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create timeline",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-background border-r border-gray-800 p-4 flex flex-col h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-white">Reality Remixer</h1>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4 w-full" variant="secondary">
            <Plus className="w-4 h-4 mr-2" />
            New Timeline
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
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 py-1 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Recent Timelines</span>
        </div>
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            timelines?.slice(0, 5).map((timeline) => (
              <Button
                key={timeline.id}
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
              >
                {timeline.name}
              </Button>
            ))
          )}
        </div>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};