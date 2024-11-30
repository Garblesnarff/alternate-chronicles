import { TimelineEvent } from "./TimelineEvent";

const sampleEvents = [
  {
    title: "First Steam Engine",
    date: "1698",
    description: "Thomas Savery patents the first steam engine, leading to the Industrial Revolution.",
    category: "Technology",
    confidenceScore: 95,
  },
  {
    title: "American Revolution",
    date: "1776",
    description: "Declaration of Independence signed, establishing the United States of America.",
    category: "Political",
    confidenceScore: 98,
  },
  {
    title: "World Wide Web",
    date: "1989",
    description: "Tim Berners-Lee invents the World Wide Web at CERN.",
    category: "Technology",
    confidenceScore: 97,
  },
];

export const Timeline = () => {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleEvents.map((event, index) => (
          <TimelineEvent key={index} {...event} />
        ))}
      </div>
    </div>
  );
};