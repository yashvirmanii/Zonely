
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
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
        title: "Time Converted Successfully",
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
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          Time Zone Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Source Time Section */}
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg text-blue-900">From</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="input-date" className="text-sm">Date</Label>
                <Input
                  id="input-date"
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="input-time" className="text-sm">Time</Label>
                <Input
                  id="input-time"
                  type="time"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="source-timezone" className="text-sm">Source Timezone</Label>
                <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                  <SelectTrigger className="mt-1 text-sm sm:text-base">
                    <SelectValue placeholder="Select source timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 sm:max-h-60">
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="text-sm">
                        <span className="block truncate">{tz.label}</span>
                        <span className="text-xs text-gray-500">({tz.offset})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Target Time Section */}
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-base sm:text-lg text-green-900">To</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="target-timezone" className="text-sm">Target Timezone</Label>
                <Select value={targetTimezone} onValueChange={setTargetTimezone}>
                  <SelectTrigger className="mt-1 text-sm sm:text-base">
                    <SelectValue placeholder="Select target timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48 sm:max-h-60">
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="text-sm">
                        <span className="block truncate">{tz.label}</span>
                        <span className="text-xs text-gray-500">({tz.offset})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {convertedTime && (
                <div className="space-y-2 pt-2 sm:pt-4">
                  <div className="p-2 sm:p-3 bg-white rounded border-2 border-green-200">
                    <Label className="text-xs sm:text-sm text-gray-600">Converted Date</Label>
                    <div className="text-base sm:text-lg font-semibold text-green-800 break-all">{convertedDate}</div>
                  </div>
                  <div className="p-2 sm:p-3 bg-white rounded border-2 border-green-200">
                    <Label className="text-xs sm:text-sm text-gray-600">Converted Time</Label>
                    <div className="text-base sm:text-lg font-semibold text-green-800">{convertedTime}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2 sm:pt-4">
          <Button 
            onClick={convertTime} 
            className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            Convert Time <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeConverter;
