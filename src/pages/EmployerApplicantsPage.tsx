import React from 'react';
import { motion } from 'framer-motion';
import { useApplicants, useUpdateApplicationStatus, useApplicantResume } from '@/hooks/useEmployer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const EmployerApplicantsPage: React.FC = () => {
  const { data: applicantsData, isLoading } = useApplicants(undefined, 0, 20);
  const updateStatus = useUpdateApplicationStatus();
  const viewResume = useApplicantResume();

  const [selectedJobId, setSelectedJobId] = React.useState<string>('');
  const [showStatusModal, setShowStatusModal] = React.useState(false);
  const [selectedApplication, setSelectedApplication] = React.useState<any>(null);
  const [newStatus, setNewStatus] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [resumePreview, setResumePreview] = React.useState<any>(null);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      reviewing: 'bg-blue-100 text-blue-700',
      shortlisted: 'bg-green-100 text-green-700',
      interviewed: 'bg-purple-100 text-purple-700',
      accepted: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handleStatusUpdate = (application: any) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setNotes('');
    setShowStatusModal(true);
  };

  const submitStatusUpdate = () => {
    if (selectedApplication && newStatus) {
      updateStatus.mutate({
        applicationId: selectedApplication.id,
        status: newStatus,
        notes,
      }, {
        onSuccess: () => {
          setShowStatusModal(false);
          setSelectedApplication(null);
        },
      });
    }
  };

  const handleViewResume = async (applicationId: string) => {
    const result = await viewResume.mutateAsync(applicationId);
    setResumePreview(result.data);
  };

  const applicants = applicantsData?.data?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-600 mt-2">Review and manage candidate applications</p>
      </motion.div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Filter by job ID..."
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : !applicants.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No applicants yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant, index) => (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {applicant.candidate_name}
                          </h3>
                          <p className="text-sm text-gray-600">{applicant.candidate_email}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(applicant.status)}`}>
                              {applicant.status}
                            </span>
                            {applicant.match_score && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                                {applicant.match_score.toFixed(1)}% match
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Applied {new Date(applicant.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewResume(applicant.application_id)}
                      >
                        View Resume
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(applicant)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold mb-4">Update Application Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Add any notes..."
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={submitStatusUpdate} isLoading={updateStatus.isPending}>
                  Update Status
                </Button>
                <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Resume Preview Modal */}
      {resumePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 my-8 max-h-screen overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resume Preview</h3>
              <Button variant="ghost" onClick={() => setResumePreview(null)}>Close</Button>
            </div>
            
            {resumePreview.ats_score && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">ATS Score</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Overall</p>
                      <p className="text-2xl font-bold">{resumePreview.ats_score.overall_score?.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Skills Match</p>
                      <p className="text-2xl font-bold">{resumePreview.ats_score.skills_match_score?.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience Match</p>
                      <p className="text-2xl font-bold">{resumePreview.ats_score.experience_match_score?.toFixed(1)}%</p>
                    </div>
                  </div>
                  {resumePreview.ats_score.missing_skills && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Missing Skills:</p>
                      <p className="text-sm text-gray-600">{resumePreview.ats_score.missing_skills.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {resumePreview.resume && (
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">Resume Details</h4>
                  <div className="space-y-2">
                    <p><strong>File:</strong> {resumePreview.resume.file_name}</p>
                    {resumePreview.resume.summary && (
                      <div>
                        <p className="font-medium">Summary:</p>
                        <p className="text-gray-600">{resumePreview.resume.summary}</p>
                      </div>
                    )}
                    {resumePreview.resume.skills && (
                      <div>
                        <p className="font-medium">Skills:</p>
                        <p className="text-gray-600">{resumePreview.resume.skills.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplicantsPage;