
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GraduationCap, Mail, Lock, User, UserCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user came from email confirmation
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      toast.error(`Authentication error: ${errorDescription || error}`);
    }
    
    if (user) {
      navigate('/');
    }
  }, [user, navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting sign in for:', email);
        const { error } = await signIn(email, password);
        if (error) {
          console.error('Sign in error:', error);
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link before signing in.');
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. Please check your credentials.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Successfully signed in!');
          // Force page reload for clean state
          window.location.href = '/';
        }
      } else {
        console.log('Attempting sign up for:', email, 'with role:', role);
        const { error } = await signUp(email, password, firstName, lastName, role);
        if (error) {
          console.error('Sign up error:', error);
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please try signing in instead.');
            setIsLogin(true);
          } else {
            toast.error(error.message);
          }
        } else {
          setConfirmationEmail(email);
          setShowConfirmation(true);
          toast.success('Account created! Please check your email for confirmation.');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-white">Check Your Email</CardTitle>
              <CardDescription className="text-gray-400">
                We've sent a confirmation link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="bg-gray-700/50 p-4 rounded-lg mb-4">
                  <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium">{confirmationEmail}</p>
                </div>
                
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p>Click the confirmation link in your email to activate your account</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p>Check your spam folder if you don't see the email</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <p>After confirming, return here and sign in with your credentials</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-600">
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    setShowConfirmation(false);
                    setIsLogin(true);
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-white">CourseCompass</h1>
          </div>
          <p className="text-gray-300">Your Learning Management System</p>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin 
                ? 'Sign in to access your dashboard' 
                : 'Join CourseCompass to start learning'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="pl-10 bg-gray-700 border-gray-600 text-white"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-gray-300">Select Your Role</Label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="pl-10 bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Choose your role" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="student" className="text-white hover:bg-gray-600">
                            Student
                          </SelectItem>
                          <SelectItem value="faculty" className="text-white hover:bg-gray-600">
                            Faculty
                          </SelectItem>
                          <SelectItem value="admin" className="text-white hover:bg-gray-600">
                            Administrator
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-400 hover:text-orange-300 text-sm"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-300 text-center">
                  💡 If you just signed up, please check your email and click the confirmation link first
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
