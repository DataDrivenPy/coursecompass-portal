
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from './dashboards/StudentDashboard';
import FacultyDashboard from './dashboards/FacultyDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export type UserRole = 'student' | 'faculty' | 'admin' | null;

const CourseCompass = () => {
  const { user, userRole, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, show the main landing page
      return;
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If user is authenticated, show appropriate dashboard
  if (user && userRole) {
    const handleLogout = async () => {
      await signOut();
      navigate('/');
    };

    switch (userRole) {
      case 'student':
        return <StudentDashboard onLogout={handleLogout} />;
      case 'faculty':
        return <FacultyDashboard onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard onLogout={handleLogout} />;
      default:
        return <StudentDashboard onLogout={handleLogout} />;
    }
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-orange-500 mr-3" />
            <h1 className="text-5xl font-bold text-white">CourseCompass</h1>
          </div>
          <p className="text-xl text-gray-300 mb-8">Navigate Your Learning Journey</p>
          <div className="flex justify-center gap-4">
            <Link to="/auth">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit group-hover:bg-blue-500/30 transition-colors">
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
              <CardTitle className="text-white">Student Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Access courses, assignments, and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started as Student
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-500/20 rounded-full w-fit group-hover:bg-green-500/30 transition-colors">
                <GraduationCap className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-white">Faculty Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Manage courses, students, and create content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Get Started as Faculty
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-orange-500/20 rounded-full w-fit group-hover:bg-orange-500/30 transition-colors">
                <Users className="h-8 w-8 text-orange-400" />
              </div>
              <CardTitle className="text-white">Admin Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Full platform control and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/auth" className="block">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Get Started as Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Sign in to access your personalized dashboard and features
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCompass;
