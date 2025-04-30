import { ThemeSwitcher } from "@/components/mode-toggle.tsx";
import { DetectionPreview, DetectionsTabs } from "@/entities/Detections";

export const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-6 relative">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 md:max-w-7xl w-full">
        <DetectionsTabs />
        <DetectionPreview />
      </div>
      <ThemeSwitcher className="opacity-60 active:opacity-100 hover:opacity-100 md:opacity-100 absolute bottom-4 right-4" />
    </div>
  );
};
