import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new URLSearchParams()
      // Let the user strictly provide email/password or use the defaults on empty
      const loginEmail = email || (isAdmin ? 'admin@performova.com' : 'learner@performova.com');
      const loginPassword = password || 'admin';

      formData.append('username', loginEmail)
      formData.append('password', loginPassword)

      const res = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem("access_token", data.access_token)
        localStorage.setItem("user_role", data.role)

        if (data.role === "Admin" || isAdmin) {
          navigate('/admin');
        } else {
          navigate('/learner');
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.detail || "Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error(err)
      setError("Network error connecting to the backend server. Is it running?");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-zinc-900">Performova</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Welcome Back!</h1>
            <p className="text-zinc-600">Continue your learning journey</p>
          </div>

          <Tabs defaultValue="learner" className="w-full" onValueChange={(value) => setIsAdmin(value === 'admin')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="learner" data-testid="learner-tab">Learner</TabsTrigger>
              <TabsTrigger value="admin" data-testid="admin-tab">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="learner">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-11"
                      data-testid="email-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-11"
                      data-testid="password-input"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  data-testid="login-button"
                >
                  Sign In as Learner
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-11"
                      data-testid="admin-email-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-zinc-900 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11 h-11"
                      data-testid="admin-password-input"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  data-testid="admin-login-button"
                >
                  Sign In as Admin
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Home
            </button>
          </div>

          <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
            <p className="text-sm text-zinc-700 text-center">
              <strong>Demo Access:</strong> Use any email/password to explore the platform
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />

        <div className="relative z-10 text-center text-white">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <Award className="w-32 h-32 mx-auto mb-6" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">Transform Your Training</h2>
          <p className="text-xl text-indigo-100 max-w-md mx-auto">
            Join thousands of teams making learning engaging, effective, and measurable.
          </p>

          <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
            {[
              { value: '10k+', label: 'Active Learners' },
              { value: '500+', label: 'Companies' },
              { value: '95%', label: 'Satisfaction' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-indigo-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
