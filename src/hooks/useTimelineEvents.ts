import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/supabase";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export function useTimelineEvents(timelineId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !timelineId) return;

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
  }, [timelineId, queryClient, toast, user]);

  return useQuery({
    queryKey: ['timeline-events', timelineId],
    queryFn: async () => {
      if (!user || !timelineId) return [];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('timeline_id', timelineId)
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!timelineId && !!user,
  });
}