import { Timeline } from "@/components/Timeline";
import { Sidebar } from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Timeline />
      </main>
    </div>
  );
};

export default Index;