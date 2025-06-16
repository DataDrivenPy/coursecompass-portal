import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import MetricCard from '../shared/MetricCard';
import ScheduleCalendar from '../schedule/ScheduleCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, CheckCircle, Award, Calendar, FileText } from 'lucide-react';
import { useCourses } from '@/hooks/useCourses';
import { useGrades } from '@/hooks/useGrades';
import { useSchedules } from '@/hooks/useSchedules';

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { courses, loading: coursesLoading } = useCourses();
  const { grades, loading: gradesLoading } = useGrades();
  const { schedules, loading: schedulesLoading } = useSchedules();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-4 w-4" /> },
    { id: 'grades', label: 'Grades', icon: <Award className="h-4 w-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
  ];

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

  const calculateAverageGrade = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + grade.grade_value, 0);
    return Math.round(total / grades.length);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Enrolled Courses"
                value={coursesLoading ? "..." : courses.length.toString()}
                icon={BookOpen}
                description="Active this semester"
                color="blue"
              />
              <MetricCard
                title="Pending Assignments"
                value="3"
                icon={Clock}
                description="Due this week"
                color="orange"
              />
              <MetricCard
                title="Completed"
                value="12"
                icon={CheckCircle}
                description="This month"
                color="green"
              />
              <MetricCard
                title="Average Grade"
                value={gradesLoading ? "..." : `${calculateAverageGrade()}%`}
                icon={Award}
                description="Current semester"
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Course Progress</CardTitle>
                  <CardDescription className="text-gray-400">Your current progress in enrolled courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Data Structures', progress: 75, color: 'bg-blue-500' },
                    { name: 'Web Development', progress: 60, color: 'bg-green-500' },
                    { name: 'Database Systems', progress: 90, color: 'bg-purple-500' },
                    { name: 'Machine Learning', progress: 45, color: 'bg-orange-500' },
                  ].map((course) => (
                    <div key={course.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{course.name}</span>
                        <span className="text-gray-400">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
                  <CardDescription className="text-gray-400">Don't miss these important dates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Data Structures Assignment', course: 'CS-201', dueDate: 'Due in 2 days', priority: 'high' },
                    { title: 'Web Development Project', course: 'CS-301', dueDate: 'Due in 5 days', priority: 'medium' },
                    { title: 'Database Quiz', course: 'CS-401', dueDate: 'Due in 1 week', priority: 'low' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.course}</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}>
                          {item.dueDate}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">My Courses</h2>
              <Badge variant="secondary">{coursesLoading ? "..." : `${courses.length} Active Courses`}</Badge>
            </div>

            {coursesLoading ? (
              <div className="text-center text-gray-400">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="text-center text-gray-400">No courses enrolled</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                      <CardDescription className="text-gray-400">{course.code}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Credits</span>
                        <span className="text-gray-400">{course.credits || 3}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">{course.department}</span>
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          Enter Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'grades':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Grades</h2>
              <div className="flex gap-2">
                <Badge variant="default">Average: {calculateAverageGrade()}%</Badge>
                <Badge variant="secondary">{grades.length} Grades</Badge>
              </div>
            </div>

            {gradesLoading ? (
              <div className="text-center text-gray-400">Loading grades...</div>
            ) : grades.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400">No grades available yet</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Grade Report</CardTitle>
                  <CardDescription className="text-gray-400">Your academic performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Course</TableHead>
                        <TableHead className="text-gray-300">Assignment</TableHead>
                        <TableHead className="text-gray-300">Grade</TableHead>
                        <TableHead className="text-gray-300">Points</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id} className="border-gray-700">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{grade.course?.title || 'Unknown Course'}</div>
                              <div className="text-sm text-gray-400">{grade.course?.code}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {grade.assignment?.title || 'General Grade'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{grade.grade_value}%</span>
                              {grade.grade_letter && (
                                <Badge variant={grade.grade_value >= 90 ? 'default' : grade.grade_value >= 80 ? 'secondary' : 'destructive'}>
                                  {grade.grade_letter}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {grade.points_earned && grade.points_possible 
                              ? `${grade.points_earned}/${grade.points_possible}`
                              : '-'
                            }
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {grade.graded_at 
                              ? new Date(grade.graded_at).toLocaleDateString()
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Class Schedule</h2>
              <Badge variant="secondary">Fall 2024</Badge>
            </div>

            {schedulesLoading ? (
              <div className="text-center text-gray-400">Loading schedule...</div>
            ) : schedules.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400">No schedule available</p>
                </CardContent>
              </Card>
            ) : (
              <ScheduleCalendar schedules={schedules} />
            )}
          </div>
        );

      case 'assignments':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Assignments</h2>
              <div className="flex gap-2">
                <Badge variant="destructive">3 Pending</Badge>
                <Badge variant="default">12 Completed</Badge>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Binary Tree Implementation', course: 'Data Structures', dueDate: '2024-06-18', status: 'pending', priority: 'high' },
                { title: 'React Component Design', course: 'Web Development', dueDate: '2024-06-20', status: 'pending', priority: 'medium' },
                { title: 'SQL Query Optimization', course: 'Database Systems', dueDate: '2024-06-22', status: 'pending', priority: 'low' },
                { title: 'Sorting Algorithms Analysis', course: 'Data Structures', dueDate: '2024-06-10', status: 'completed', priority: 'completed' },
                { title: 'RESTful API Development', course: 'Web Development', dueDate: '2024-06-08', status: 'completed', priority: 'completed' },
              ].map((assignment, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{assignment.title}</h3>
                        <p className="text-gray-400 text-sm">{assignment.course}</p>
                        <p className="text-gray-500 text-xs mt-1">Due: {assignment.dueDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={assignment.status === 'completed' ? 'default' : 
                                  assignment.priority === 'high' ? 'destructive' : 
                                  assignment.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {assignment.status === 'completed' ? 'Completed' : assignment.priority.toUpperCase()}
                        </Badge>
                        {assignment.status === 'pending' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400">Content for {activeSection} coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        items={sidebarItems}
        activeItem={activeSection}
        onItemClick={setActiveSection}
        onLogout={onLogout}
        userRole="student"
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
