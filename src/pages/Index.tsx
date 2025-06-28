
import TimeConverter from "@/components/TimeConverter";
import MeetingScheduler from "@/components/MeetingScheduler";
import { Separator } from "@/components/ui/separator";
import { TimeProvider } from "@/contexts/TimeContext";
import { Clock, Calendar, Globe } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full shadow-lg">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Global Time Hub
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 px-4 max-w-3xl mx-auto leading-relaxed">
            Convert time across different time zones and schedule meetings with Google Meet or Microsoft Teams
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Real-time Conversion</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Meeting Scheduler</span>
            </div>
          </div>
        </div>
        
        <TimeProvider>
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            <TimeConverter />
            
            <div className="relative">
              <Separator className="my-8 sm:my-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-600">Meeting Scheduler</span>
                </div>
              </div>
            </div>
            
            <MeetingScheduler />
          </div>
        </TimeProvider>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm">
          <div className="border-t border-slate-200 pt-8">
            <p>&copy; 2024 Global Time Hub. Streamline your global communications.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
