import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/supabase";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useTimelineEvents(timelineId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`timeline_${timelineId}_events`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'events', filter: `timeline_id=eq.${timelineId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['timeline-events', timelineId] });
          toast({
            title: "Timeline updated",
            description: "The events have been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timelineId, queryClient, toast]);

  return useQuery({
    queryKey: ['timeline-events', timelineId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('timeline_id', timelineId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!timelineId,
  });
}