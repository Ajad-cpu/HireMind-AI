import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDashboardStats, useRecommendedJobs, useSavedJobs, useApplications, useNotifications } from '@/hooks/useCandidate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const DashboardPage: React.FC = () => {
  const { data: statsData } = useDashboardStats();
  const { data: recommendedData } = useRecommendedJobs();
  const { data: savedData } = useSavedJobs();
  const { data: applicationsData } = useApplications();
  const { data: notificationsData } = useNotifications();

  const stats = statsData?.data;
  const recommendedJobs = recommendedData?.data;
  const savedJobs = savedData?.data;
  const applications = applicationsData?.data;
  const notifications = notificationsData?.data;

  const StatCard = ({ title, value, color }: { title: string; value: string | number; color: string }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
            <span className="text-2xl">📊</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your job search overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <StatCard title="Profile Completion" value={`${stats?.profile_completion ?? 0}%`} color="bg-blue-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <StatCard title="Total Applications" value={stats?.total_applications ?? 0} color="bg-green-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <StatCard title="Saved Jobs" value={stats?.saved_jobs_count ?? 0} color="bg-yellow-100" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <StatCard title="Unread Notifications" value={stats?.unread_notifications ?? 0} color="bg-red-100" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommended Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs?.slice(0, 5).map((job: any, index: number) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {job.job_type?.replace('_', ' ')}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {job.match_score}% match
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link to="/jobs">
              <Button variant="outline" className="w-full mt-4">View All Jobs</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications?.items?.slice(0, 5).map((app: any, index: number) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{app.job?.title}</h4>
                    <p className="text-sm text-gray-600">{app.job?.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </motion.div>
              ))}
            </div>
            <Link to="/applications">
              <Button variant="outline" className="w-full mt-4">View All Applications</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedJobs?.items?.slice(0, 5).map((saved: any, index: number) => (
                <motion.div
                  key={saved.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-gray-900">{saved.job.title}</h4>
                  <p className="text-sm text-gray-600">{saved.job.company}</p>
                </motion.div>
              ))}
            </div>
            <Link to="/saved-jobs">
              <Button variant="outline" className="w-full mt-4">View Saved Jobs</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications?.items?.slice(0, 5).map((notification: any, index: number) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 border rounded-lg ${!notification.is_read ? 'bg-blue-50' : ''}`}
                >
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </motion.div>
              ))}
            </div>
            <Link to="/notifications">
              <Button variant="outline" className="w-full mt-4">View All Notifications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;