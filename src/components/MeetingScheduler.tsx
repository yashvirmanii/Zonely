import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTimeContext } from "@/contexts/TimeContext";

const timeZones = [
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai/Delhi (IST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { value: "UTC", label: "UTC" },
];

const MeetingScheduler = () => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingTimezone, setMeetingTimezone] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("60");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [attendeeEmails, setAttendeeEmails] = useState("");

  const timeContext = useTimeContext();

  useEffect(() => {
    // Auto-fill from converted time if available
    if (timeContext.convertedTime && timeContext.convertedDate && timeContext.convertedTimezone) {
      setMeetingDate(timeContext.convertedDate);
      setMeetingTime(timeContext.convertedTime);
      setMeetingTimezone(timeContext.convertedTimezone);
      console.log("Auto-filled meeting time from converter:", {
        date: timeContext.convertedDate,
        time: timeContext.convertedTime,
        timezone: timeContext.convertedTimezone
      });
    }
  }, [timeContext.convertedTime, timeContext.convertedDate, timeContext.convertedTimezone]);

  const generateGoogleMeetLink = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in the meeting title, date, and time.",
        variant: "destructive",
      });
      return;
    }

    try {
      const startDateTime = new Date(`${meetingDate}T${meetingTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(meetingDuration) * 60000);
      
      const formatDateTime = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: meetingTitle,
        dates: `${formatDateTime(startDateTime)}/${formatDateTime(endDateTime)}`,
        details: meetingDescription || `Meeting scheduled via Time Zone Converter`,
        location: 'Google Meet (link will be generated)',
      });

      if (attendeeEmails) {
        params.append('add', attendeeEmails);
      }

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
      window.open(googleCalendarUrl, '_blank');
      
      toast({
        title: "Google Meet Link Generated",
        description: "Opening Google Calendar to create your meeting. Google Meet link will be generated automatically.",
      });
    } catch (error) {
      console.error("Error generating Google Meet link:", error);
      toast({
        title: "Error",
        description: "Failed to generate Google Meet link. Please check your input.",
        variant: "destructive",
      });
    }
  };

  const generateTeamsLink = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in the meeting title, date, and time.",
        variant: "destructive",
      });
      return;
    }

    try {
      const startDateTime = new Date(`${meetingDate}T${meetingTime}`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(meetingDuration) * 60000);
      
      const params = new URLSearchParams({
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        subject: meetingTitle,
        content: meetingDescription || `Meeting scheduled via Time Zone Converter`,
      });

      if (attendeeEmails) {
        params.append('attendees', attendeeEmails);
      }

      const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
      window.open(outlookUrl, '_blank');
      
      toast({
        title: "Teams Meeting Link Generated",
        description: "Opening Outlook Calendar to create your Teams meeting.",
      });
    } catch (error) {
      console.error("Error generating Teams link:", error);
      toast({
        title: "Error",
        description: "Failed to generate Teams meeting link. Please check your input.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Calendar className="h-6 w-6 text-green-600" />
          Meeting Scheduler
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-title">Meeting Title *</Label>
              <Input
                id="meeting-title"
                placeholder="Enter meeting title"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meeting-date">Date *</Label>
              <Input
                id="meeting-date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meeting-time">Time *</Label>
              <Input
                id="meeting-time"
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meeting-timezone">Timezone</Label>
              <Select value={meetingTimezone} onValueChange={setMeetingTimezone}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="meeting-duration">Duration (minutes)</Label>
              <Select value={meetingDuration} onValueChange={setMeetingDuration}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="attendee-emails">Attendee Emails</Label>
              <Input
                id="attendee-emails"
                placeholder="email1@example.com, email2@example.com"
                value={attendeeEmails}
                onChange={(e) => setAttendeeEmails(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="meeting-description">Description</Label>
              <Textarea
                id="meeting-description"
                placeholder="Meeting agenda or description..."
                value={meetingDescription}
                onChange={(e) => setMeetingDescription(e.target.value)}
                className="mt-1 h-20"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={generateGoogleMeetLink}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-6"
          >
            <Users className="h-4 w-4" />
            Schedule Google Meet
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={generateTeamsLink}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2 px-6"
          >
            <Clock className="h-4 w-4" />
            Schedule Teams Meeting
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 text-center bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">📝 How it works:</p>
          <p>Click the buttons above to open your calendar app with pre-filled meeting details. For Google Meet, the meeting link will be generated automatically. For Teams, you'll be redirected to Outlook Calendar to complete the scheduling.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingScheduler;
