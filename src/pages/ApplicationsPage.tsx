import React from 'react';
import { motion } from 'framer-motion';
import { useApplications } from '@/hooks/useCandidate';
import { Card, CardContent } from '@/components/ui/Card';

const ApplicationsPage: React.FC = () => {
  const { data: applicationsData, isLoading } = useApplications();

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewing: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-green-100 text-green-700',
      interviewed: 'bg-purple-100 text-purple-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">
          Track your job applications
        </p>
      </motion.div>

      {!applicationsData?.items?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No applications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicationsData.items.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {app.job?.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{app.job?.company}</p>
                      {app.job?.location && (
                        <p className="text-sm text-gray-500 mt-1">📍 {app.job.location}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                        {app.match_score && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                            {app.match_score}% match
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        Applied on {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;