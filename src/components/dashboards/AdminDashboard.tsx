import React, { useState } from 'react';
import Sidebar from '../shared/Sidebar';
import MetricCard from '../shared/MetricCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, BarChart3, Settings, UserPlus, Database, Shield, Activity } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const { profile } = useUserProfile();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="h-4 w-4" /> },
    { id: 'courses', label: 'Course Oversight', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-4 w-4" /> },
    { id: 'system', label: 'System Settings', icon: <Settings className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  ];

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'Admin User';

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Users"
                value="2,847"
                icon={Users}
                description="+12% from last month"
                trend={{ value: 12, label: 'vs last month', isPositive: true }}
                color="blue"
              />
              <MetricCard
                title="Active Courses"
                value="156"
                icon={BookOpen}
                description="Across all departments"
                color="green"
              />
              <MetricCard
                title="Platform Usage"
                value="94%"
                icon={Activity}
                description="System uptime"
                color="purple"
              />
              <MetricCard
                title="Storage Used"
                value="847GB"
                icon={Database}
                description="of 2TB capacity"
                color="orange"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Distribution</CardTitle>
                  <CardDescription className="text-gray-400">Platform user breakdown by role</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { role: 'Students', count: 2456, percentage: 86, color: 'bg-blue-500' },
                    { role: 'Faculty', count: 342, percentage: 12, color: 'bg-green-500' },
                    { role: 'Admins', count: 49, percentage: 2, color: 'bg-orange-500' },
                  ].map((item) => (
                    <div key={item.role} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.role}</span>
                        <span className="text-gray-400">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${item.color}`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activities</CardTitle>
                  <CardDescription className="text-gray-400">Latest platform activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { action: 'New user registration', user: 'Emily Chen', time: '5 min ago', type: 'user' },
                    { action: 'Course created', user: 'Dr. Johnson', time: '15 min ago', type: 'course' },
                    { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'system' },
                    { action: 'Faculty role assigned', user: 'Admin', time: '2 hours ago', type: 'role' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="text-white text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-gray-400">by {activity.user}</div>
                      </div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                  <CardDescription className="text-gray-400">Platform performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { metric: 'Server Uptime', value: '99.8%', status: 'excellent' },
                    { metric: 'Response Time', value: '245ms', status: 'good' },
                    { metric: 'Error Rate', value: '0.02%', status: 'excellent' },
                    { metric: 'Active Sessions', value: '1,234', status: 'normal' },
                  ].map((item) => (
                    <div key={item.metric} className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.value}</span>
                        <Badge 
                          variant={item.status === 'excellent' ? 'default' : 
                                  item.status === 'good' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <MetricCard
                title="Students"
                value="2,456"
                icon={Users}
                description="Active student accounts"
                color="blue"
              />
              <MetricCard
                title="Faculty"
                value="342"
                icon={Users}
                description="Teaching staff"
                color="green"
              />
              <MetricCard
                title="Admins"
                value="49"
                icon={Shield}
                description="Administrative users"
                color="orange"
              />
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent User Activities</CardTitle>
                <CardDescription className="text-gray-400">Latest user registrations and role changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Emily Chen', email: 'emily.chen@email.com', role: 'Student', action: 'Registered', time: '5 min ago' },
                    { name: 'Dr. Michael Brown', email: 'm.brown@university.edu', role: 'Faculty', action: 'Role Updated', time: '1 hour ago' },
                    { name: 'Sarah Wilson', email: 's.wilson@email.com', role: 'Student', action: 'Registered', time: '2 hours ago' },
                    { name: 'Prof. David Lee', email: 'd.lee@university.edu', role: 'Faculty', action: 'Registered', time: '3 hours ago' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{user.role}</Badge>
                        <div className="text-sm text-gray-400">{user.action}</div>
                        <div className="text-xs text-gray-500">{user.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
        userRole="admin"
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

export default AdminDashboard;
