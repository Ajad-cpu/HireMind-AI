import React from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useJob, useApplyJob, useSaveJob, useUnsaveJob } from '@/hooks/useJobs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: jobData, isLoading } = useJob(id || '');
  const applyJob = useApplyJob();
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [selectedResumeId, setSelectedResumeId] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');

  const job = jobData?.data;

  const handleApply = () => {
    if (!selectedResumeId) return;
    applyJob.mutate({
      jobId: id!,
      resumeId: selectedResumeId,
      coverLetter,
    }, {
      onSuccess: () => {
        setShowApplyModal(false);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Job not found</p>
        <Link to="/jobs"><Button className="mt-4">Back to Jobs</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-xl text-gray-600 mt-2">{job.company}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => unsaveJob.mutate(job.id)}>
                Unsave
              </Button>
              <Button variant="outline" onClick={() => saveJob.mutate(job.id)}>
                Save
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            {job.location && (
              <span className="text-gray-600">📍 {job.location}</span>
            )}
            <span className="text-gray-600 capitalize">
              {job.job_type?.replace('_', ' ')}
            </span>
            <span className="text-gray-600 capitalize">
              {job.experience_level}
            </span>
            <span className="text-gray-500 text-sm">
              {job.application_count} applicants
            </span>
            <span className="text-gray-500 text-sm">
              {job.views_count} views
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </div>
              </CardContent>
            </Card>

            {/* Skills Required */}
            {job.skills_required && job.skills_required.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Skills Required</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills_required.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Salary */}
            {job.salary_min && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Salary</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    ${job.salary_min.toLocaleString()}
                    {job.salary_max && ` - ${job.salary_max.toLocaleString()}`}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            {user && (
              <Card>
                <CardContent className="pt-6">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Job Info */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Job Type</h3>
                  <p className="text-gray-600 capitalize">{job.job_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Experience Level</h3>
                  <p className="text-gray-600 capitalize">{job.experience_level}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Posted</h3>
                  <p className="text-gray-600">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold mb-4">Apply to {job.title}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Resume *
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Choose a resume...</option>
                  {/* Add resume list here */}
                  <option value="resume1">My Resume.pdf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter (optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tell the employer why you're a great fit..."
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApply}
                  isLoading={applyJob.isPending}
                  disabled={!selectedResumeId}
                  className="flex-1"
                >
                  Submit Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;