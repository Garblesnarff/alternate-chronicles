import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Timeline } from "@/types/supabase";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export function useTimelines() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('timelines_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'timelines' },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['timelines'] });
          toast({
            title: "Timeline updated",
            description: "The timeline list has been updated.",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return useQuery({
    queryKey: ['timelines'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timelines')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Timeline[];
    },
  });
}