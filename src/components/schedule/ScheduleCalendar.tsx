
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';

interface Schedule {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string | null;
  course?: {
    title: string;
    code: string;
  };
}

interface ScheduleCalendarProps {
  schedules: Schedule[];
}

const ScheduleCalendar = ({ schedules }: ScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get schedules for the selected date's day of week
  const getSchedulesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return schedules.filter(schedule => schedule.day_of_week === dayOfWeek);
  };

  const selectedDaySchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  // Create a map of days that have schedules for calendar highlighting
  const scheduleDays = schedules.reduce((acc, schedule) => {
    acc[schedule.day_of_week] = true;
    return acc;
  }, {} as Record<number, boolean>);

  const modifiers = {
    hasSchedule: (date: Date) => scheduleDays[date.getDay()]
  };

  const modifiersStyles = {
    hasSchedule: {
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Class Calendar</CardTitle>
          <CardDescription className="text-gray-400">
            Select a date to view your schedule. Orange highlights indicate days with classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border border-gray-600"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </CardContent>
      </Card>

      {/* Schedule Details */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedDate ? (
              <>Schedule for {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}</>
            ) : (
              'Select a Date'
            )}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {selectedDaySchedules.length > 0 
              ? `${selectedDaySchedules.length} class${selectedDaySchedules.length > 1 ? 'es' : ''} scheduled`
              : 'No classes scheduled'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedDaySchedules.length > 0 ? (
            selectedDaySchedules
              .sort((a, b) => a.start_time.localeCompare(b.start_time))
              .map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">
                        {schedule.course?.title || 'Unknown Course'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {schedule.course?.code}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-orange-600 text-white">
                      {getDayName(schedule.day_of_week)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                      </span>
                    </div>
                    
                    {schedule.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{schedule.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No classes scheduled for this day</p>
              <p className="text-gray-500 text-sm mt-2">
                Select a different date or check your course enrollments
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleCalendar;
