import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEmployerAnalytics, useEmployerJobs } from '@/hooks/useEmployer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const EmployerDashboardPage: React.FC = () => {
  const { data: analyticsData } = useEmployerAnalytics();
  const { data: jobsData } = useEmployerJobs(0, 5);

  const analytics = analyticsData?.data;
  const recentJobs = jobsData?.data?.items || [];

  const StatCard = ({ title, value, color, icon }: { title: string; value: string | number; color: string; icon: string }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Employer Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your jobs and track hiring progress</p>
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Total Jobs" value={analytics?.total_jobs || 0} color="bg-blue-100" icon="💼" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Active Jobs" value={analytics?.active_jobs || 0} color="bg-green-100" icon="✅" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard title="Total Applicants" value={analytics?.total_applicants || 0} color="bg-yellow-100" icon="👥" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <StatCard title="Shortlisted" value={analytics?.shortlisted_candidates || 0} color="bg-purple-100" icon="⭐" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'published' ? 'bg-green-100 text-green-700' :
                        job.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-gray-500">{job.application_count} applicants</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/employer/jobs">
              <Button variant="outline" className="w-full mt-4">Manage Jobs</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Hiring Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Interviews Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.interviews_scheduled || 0}</p>
                </div>
                <span className="text-3xl">📅</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Hired Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.hired_candidates || 0}</p>
                </div>
                <span className="text-3xl">🎉</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Avg Match Score</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.avg_match_score?.toFixed(1) || '0'}%</p>
                </div>
                <span className="text-3xl">📊</span>
              </div>
            </div>
            <Link to="/employer/applicants">
              <Button variant="outline" className="w-full mt-4">View Applicants</Button>
            </Link>
            <Link to="/employer/ranking">
              <Button variant="outline" className="w-full mt-2">AI Candidate Ranking</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;