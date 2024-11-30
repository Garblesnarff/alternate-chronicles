import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Trash2, Edit, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Event } from "@/types/supabase";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TimelineEventProps extends Event {
  onEdit?: (event: Event) => void;
}

export const TimelineEvent = ({
  id,
  title,
  date,
  description,
  category,
  confidence_score,
  impact_analysis,
  onEdit,
  ...props
}: TimelineEventProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      setIsOpen(false);
    }
  };

  const getCategoryColor = (category: Event['category']) => {
    const colors = {
      Technology: 'bg-blue-500',
      Political: 'bg-red-500',
      Cultural: 'bg-purple-500',
      Economic: 'bg-green-500',
      Military: 'bg-orange-500',
      Scientific: 'bg-cyan-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Card className="w-full max-w-md bg-timeline-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 cursor-pointer animate-fade-up">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <Badge variant="secondary" className={`${getCategoryColor(category)} text-white`}>
              {category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400 mb-3">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
          
          <p className="text-gray-300 mb-4 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Confidence Score</span>
            </div>
            <span className="text-secondary font-medium">{confidence_score}%</span>
          </div>
        </Card>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-xl bg-timeline-card border-timeline-connector">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold text-white">{title}</SheetTitle>
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          <Badge className={`${getCategoryColor(category)} text-white`}>
            {category}
          </Badge>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
            <p className="text-gray-300">{description}</p>
          </div>

          {impact_analysis && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Impact Analysis</h4>
              <p className="text-gray-300">{impact_analysis}</p>
            </div>
          )}

          <div>
            <h4 className="text-lg font-semibold text-white mb-2">Confidence Score</h4>
            <Progress value={confidence_score} className="h-2 mb-2" />
            <span className="text-sm text-gray-400">{confidence_score}% confidence in this event's accuracy</span>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="secondary" onClick={() => onEdit?.({
              id,
              title,
              date,
              description,
              category,
              confidence_score,
              impact_analysis,
              ...props
            })}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the event.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};