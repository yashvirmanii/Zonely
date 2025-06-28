
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, MapPin, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTimeContext } from "@/contexts/TimeContext";

interface TimeZone {
  value: string;
  label: string;
  offset: string;
}

const timeZones: TimeZone[] = [
  { value: "America/New_York", label: "New York (EST/EDT)", offset: "UTC-5/-4" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)", offset: "UTC-8/-7" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)", offset: "UTC-6/-5" },
  { value: "Europe/London", label: "London (GMT/BST)", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)", offset: "UTC+1/+2" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)", offset: "UTC+1/+2" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+9" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "UTC+8" },
  { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+4" },
  { value: "Asia/Kolkata", label: "Mumbai/Delhi (IST)", offset: "UTC+5:30" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)", offset: "UTC+10/+11" },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)", offset: "UTC+12/+13" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: "UTC+0" },
];

const TimeConverter = () => {
  const [inputTime, setInputTime] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [sourceTimezone, setSourceTimezone] = useState("");
  const [targetTimezone, setTargetTimezone] = useState("");
  const [convertedTime, setConvertedTime] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  
  const timeContext = useTimeContext();

  useEffect(() => {
    // Set current time and date
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const dateString = now.toISOString().slice(0, 10);
    
    setInputTime(timeString);
    setInputDate(dateString);
    
    // Auto-detect user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("Detected user timezone:", userTimezone);
    
    const matchingTimezone = timeZones.find(tz => tz.value === userTimezone);
    if (matchingTimezone) {
      setSourceTimezone(userTimezone);
      console.log("Set source timezone to:", userTimezone);
    } else {
      // Fallback to UTC if user's timezone is not in our list
      setSourceTimezone("UTC");
      console.log("Fallback to UTC timezone");
    }
  }, []);

  const convertTime = () => {
    if (!inputTime || !inputDate || !sourceTimezone || !targetTimezone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to convert time.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a date object from the input
      const inputDateTime = new Date(`${inputDate}T${inputTime}`);
      
      // Format the result using proper timezone conversion
      const options: Intl.DateTimeFormatOptions = {
        timeZone: targetTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      
      const formatted = new Intl.DateTimeFormat('en-CA', options).format(inputDateTime);
      const [dateResult, timeResult] = formatted.split(', ');
      
      setConvertedDate(dateResult);
      setConvertedTime(timeResult);
      
      // Update context with converted time data
      timeContext.setConvertedTime(timeResult);
      timeContext.setConvertedDate(dateResult);
      timeContext.setConvertedTimezone(targetTimezone);
      
      toast({
        title: "✅ Time Converted Successfully",
        description: `${inputTime} ${timeZones.find(tz => tz.value === sourceTimezone)?.label} = ${timeResult} ${timeZones.find(tz => tz.value === targetTimezone)?.label}`,
      });
    } catch (error) {
      console.error("Error converting time:", error);
      toast({
        title: "Conversion Error",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg border-b border-blue-100">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold text-slate-800">
          <div className="p-2 bg-blue-100 rounded-full">
            <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
          </div>
          Time Zone Converter
        </CardTitle>
        <p className="text-slate-600 mt-2">Convert time between different time zones instantly</p>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Source Time Section */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-lg text-blue-900">From</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-date" className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="input-date"
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-time" className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time
                </Label>
                <Input
                  id="input-time"
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source-timezone" className="text-sm font-medium text-blue-800">Source Timezone</Label>
                <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                  <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Select source timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white">
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="focus:bg-blue-50">
                        <div className="flex flex-col">
                          <span className="font-medium">{tz.label}</span>
                          <span className="text-xs text-slate-500">{tz.offset}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Target Time Section */}
          <div className="space-y-6 p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl border border-emerald-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-lg text-emerald-900">To</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target-timezone" className="text-sm font-medium text-emerald-800">Target Timezone</Label>
                <Select value={targetTimezone} onValueChange={setTargetTimezone}>
                  <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="Select target timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 bg-white">
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="focus:bg-emerald-50">
                        <div className="flex flex-col">
                          <span className="font-medium">{tz.label}</span>
                          <span className="text-xs text-slate-500">{tz.offset}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {convertedTime && (
                <div className="space-y-3 pt-4">
                  <div className="p-4 bg-white rounded-lg border-2 border-emerald-300 shadow-sm">
                    <Label className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Converted Date</Label>
                    <div className="text-xl font-bold text-emerald-800 mt-1">{convertedDate}</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border-2 border-emerald-300 shadow-sm">
                    <Label className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Converted Time</Label>
                    <div className="text-xl font-bold text-emerald-800 mt-1">{convertedTime}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <Button 
            onClick={convertTime} 
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg"
            size="lg"
          >
            Convert Time 
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeConverter;
