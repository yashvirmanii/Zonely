
import TimeConverter from "@/components/TimeConverter";
import MeetingScheduler from "@/components/MeetingScheduler";
import { Separator } from "@/components/ui/separator";
import { TimeProvider } from "@/contexts/TimeContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 px-2">
            Global Time Zone Converter
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-4 max-w-2xl mx-auto">
            Convert time across different time zones and schedule meetings with Google Meet or Microsoft Teams
          </p>
        </div>
        
        <TimeProvider>
          <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
            <TimeConverter />
            <Separator className="my-6 sm:my-8" />
            <MeetingScheduler />
          </div>
        </TimeProvider>
      </div>
    </div>
  );
};

export default Index;
