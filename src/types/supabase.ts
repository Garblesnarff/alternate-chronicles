export type Timeline = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  base_timeline_id: string | null;
  user_id: string;
};

export type Event = {
  id: string;
  timeline_id: string;
  title: string;
  description: string | null;
  date: string;
  category: 'Technology' | 'Political' | 'Cultural' | 'Economic' | 'Military' | 'Scientific';
  confidence_score: number;
  impact_analysis: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
};