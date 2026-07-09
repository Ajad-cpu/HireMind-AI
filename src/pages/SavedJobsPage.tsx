import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSavedJobs, useUnsaveJob } from '@/hooks/useCandidate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const SavedJobsPage: React.FC = () => {
  const { data: savedData, isLoading } = useSavedJobs();
  const unsaveJob = useUnsaveJob();

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-600 mt-2">
          {savedData?.total || 0} jobs saved
        </p>
      </motion.div>

      {!savedData?.items?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No saved jobs yet</p>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedData.items.map((saved, index) => (
            <motion.div
              key={saved.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-start justify-between py-4">
                  <div className="flex-1">
                    <Link to={`/jobs/${saved.job_id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {saved.job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{saved.job.company}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {saved.job.location && (
                        <span className="text-sm text-gray-500">📍 {saved.job.location}</span>
                      )}
                      <span className="text-sm text-gray-500 capitalize">
                        {saved.job.job_type?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => unsaveJob.mutate(saved.job_id)}
                    isLoading={unsaveJob.isPending}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;