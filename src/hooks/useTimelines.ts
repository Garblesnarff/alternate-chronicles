import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Timeline } from "@/types/supabase";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

export function useTimelines() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('timelines_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'timelines', filter: `user_id=eq.${user.id}` },
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
  }, [queryClient, toast, user]);

  return useQuery({
    queryKey: ['timelines'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Timeline[];
    },
    enabled: !!user,
  });
}