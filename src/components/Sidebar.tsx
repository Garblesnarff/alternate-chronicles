import { Button } from "@/components/ui/button";
import { Clock, Plus, Settings } from "lucide-react";
import { useTimelines } from "@/hooks/useTimelines";

export const Sidebar = () => {
  const { data: timelines } = useTimelines();

  return (
    <div className="w-64 bg-background border-r border-gray-800 p-4 flex flex-col h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-white">Reality Remixer</h1>
      </div>
      
      <Button className="mb-4 w-full" variant="secondary">
        <Plus className="w-4 h-4 mr-2" />
        New Timeline
      </Button>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-2 py-1 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Recent Timelines</span>
        </div>
        <div className="space-y-1">
          {timelines?.slice(0, 5).map((timeline) => (
            <Button
              key={timeline.id}
              variant="ghost"
              className="w-full justify-start text-sm font-normal"
            >
              {timeline.name}
            </Button>
          ))}
        </div>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};