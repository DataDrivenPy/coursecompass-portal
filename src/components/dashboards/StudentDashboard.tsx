
import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import MetricCard from '../shared/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, CheckCircle, Award, Calendar, FileText, Video, Download } from 'lucide-react';

interface StudentDashboardProps {
  onLogout: () => void;
}

const StudentDashboard = ({ onLogout }: StudentDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-4 w-4" /> },
    { id: 'grades', label: 'Grades', icon: <Award className="h-4 w-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="h-4 w-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Enrolled Courses"
                value="6"
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
                value="87%"
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
              <Badge variant="secondary">6 Active Courses</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Data Structures & Algorithms', instructor: 'Dr. Smith', progress: 75, students: 45, color: 'blue' },
                { title: 'Web Development', instructor: 'Prof. Johnson', progress: 60, students: 52, color: 'green' },
                { title: 'Database Systems', instructor: 'Dr. Brown', progress: 90, students: 38, color: 'purple' },
                { title: 'Machine Learning', instructor: 'Prof. Davis', progress: 45, students: 41, color: 'orange' },
                { title: 'Software Engineering', instructor: 'Dr. Wilson', progress: 30, students: 47, color: 'red' },
                { title: 'Computer Networks', instructor: 'Prof. Miller', progress: 85, students: 39, color: 'blue' },
              ].map((course, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                    <CardDescription className="text-gray-400">{course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Progress</span>
                      <span className="text-gray-400">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{course.students} students</span>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Enter Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
        userName="John Doe"
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
