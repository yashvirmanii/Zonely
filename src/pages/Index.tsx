
import TimeConverter from "@/components/TimeConverter";
import MeetingScheduler from "@/components/MeetingScheduler";
import { Separator } from "@/components/ui/separator";
import { TimeProvider } from "@/contexts/TimeContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Time Zone Converter</h1>
          <p className="text-lg text-gray-600">Convert time across different time zones and schedule meetings</p>
        </div>
        
        <TimeProvider>
          <div className="max-w-4xl mx-auto space-y-8">
            <TimeConverter />
            <Separator className="my-8" />
            <MeetingScheduler />
          </div>
        </TimeProvider>
      </div>
    </div>
  );
};

export default Index;
