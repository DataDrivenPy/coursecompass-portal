import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import MetricCard from '../shared/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, FileText, BarChart3, MessageSquare, Upload, Edit, Eye } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface FacultyDashboardProps {
  onLogout: () => void;
}

const FacultyDashboard = ({ onLogout }: FacultyDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { profile } = useUserProfile();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'courses', label: 'My Courses', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
    { id: 'assignments', label: 'Assignments', icon: <FileText className="h-4 w-4" /> },
    { id: 'content', label: 'Content Management', icon: <Upload className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'Faculty User';

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Students"
                value="156"
                icon={Users}
                description="Across all courses"
                color="blue"
              />
              <MetricCard
                title="Active Courses"
                value="4"
                icon={BookOpen}
                description="This semester"
                color="green"
              />
              <MetricCard
                title="Pending Reviews"
                value="23"
                icon={FileText}
                description="Assignments to grade"
                color="orange"
              />
              <MetricCard
                title="Avg. Performance"
                value="82%"
                icon={BarChart3}
                description="Class average"
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Course Performance</CardTitle>
                  <CardDescription className="text-gray-400">Student performance across your courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'Data Structures', students: 45, avgGrade: 85, color: 'bg-blue-500' },
                    { name: 'Web Development', students: 52, avgGrade: 78, color: 'bg-green-500' },
                    { name: 'Database Systems', students: 38, avgGrade: 91, color: 'bg-purple-500' },
                    { name: 'Software Engineering', students: 21, avgGrade: 74, color: 'bg-orange-500' },
                  ].map((course) => (
                    <div key={course.name} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{course.name}</div>
                        <div className="text-sm text-gray-400">{course.students} students</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">{course.avgGrade}%</div>
                        <div className="text-sm text-gray-400">avg grade</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Submissions</CardTitle>
                  <CardDescription className="text-gray-400">Latest assignment submissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { student: 'Alice Johnson', assignment: 'Binary Tree Implementation', course: 'Data Structures', time: '2 hours ago' },
                    { student: 'Bob Smith', assignment: 'React Component', course: 'Web Development', time: '4 hours ago' },
                    { student: 'Carol Brown', assignment: 'SQL Queries', course: 'Database Systems', time: '6 hours ago' },
                    { student: 'David Wilson', assignment: 'API Documentation', course: 'Software Engineering', time: '8 hours ago' },
                  ].map((submission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{submission.student}</div>
                        <div className="text-sm text-gray-400">{submission.assignment}</div>
                        <div className="text-xs text-gray-500">{submission.course}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">{submission.time}</div>
                        <Button size="sm" variant="outline" className="mt-1">
                          Review
                        </Button>
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
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Upload className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Data Structures & Algorithms', code: 'CS-201', students: 45, assignments: 8, status: 'active' },
                { title: 'Web Development', code: 'CS-301', students: 52, assignments: 6, status: 'active' },
                { title: 'Database Systems', code: 'CS-401', students: 38, assignments: 7, status: 'active' },
                { title: 'Software Engineering', code: 'CS-501', students: 21, assignments: 5, status: 'draft' },
              ].map((course, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{course.title}</CardTitle>
                        <CardDescription className="text-gray-400">{course.code}</CardDescription>
                      </div>
                      <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Students</div>
                        <div className="text-white font-semibold">{course.students}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Assignments</div>
                        <div className="text-white font-semibold">{course.assignments}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
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
        userRole="faculty"
        userName={displayName}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
