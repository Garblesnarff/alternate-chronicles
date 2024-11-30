import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

interface TimelineEventProps {
  title: string;
  date: string;
  description: string;
  category: string;
  confidenceScore: number;
}

export const TimelineEvent = ({
  title,
  date,
  description,
  category,
  confidenceScore,
}: TimelineEventProps) => {
  return (
    <Card className="w-full max-w-md bg-timeline-card p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow animate-fade-up">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <Badge variant="secondary" className="bg-secondary text-white">
          {category}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 text-gray-400 mb-3">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{date}</span>
      </div>
      
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Confidence Score</span>
        </div>
        <span className="text-secondary font-medium">{confidenceScore}%</span>
      </div>
    </Card>
  );
};