import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react'; // Changed Mail to User
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../components/ui/card';

export const Login = (): JSX.Element => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(userId, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#282b35] to-[#1a1c22] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          {/* <div className="flex items-center justify-center mb-4">
            <img className="w-8 h-8" alt="Icon" src="/icon.png" />
            <img className="w-20 h-6 ml-2" alt="Penta" src="/penta.svg" />
          </div> */}
          <h1 className="text-2xl font-semibold text-white font-['Poppins',Helvetica]">
            Welcome Back
          </h1>
          <p className="text-text-80 text-sm mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="bg-bgsec border-stroke">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-xl font-semibold text-white text-center font-['Poppins',Helvetica]">
              Sign In
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">User ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-80 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="pl-10 bg-bgsec-2 border-stroke text-white placeholder:text-text-80"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-80 w-4 h-4" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-bgsec-2 border-stroke text-white placeholder:text-text-80"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-80 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  {/* <input type="checkbox" className="rounded border-stroke" /> */}
                  {/* <span className="text-sm text-text-80">Remember me</span> */}
                </label>
                {/* <Link to="/forgot-password" className="text-sm text-sec-100 hover:underline">
                  Forgot password?
                </Link> */}
              </div>

              <Button
                type="submit"
                className="w-full bg-sec-100 hover:bg-sec-100/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-80 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-sec-100 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
