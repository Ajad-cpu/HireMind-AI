import React from 'react';
import { motion } from 'framer-motion';
import { useEmployerJobs, useCreateJob, useUpdateJob, useDeleteJob } from '@/hooks/useEmployer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const EmployerJobsPage: React.FC = () => {
  const { data: jobsData, isLoading } = useEmployerJobs(0, 20);
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const [showForm, setShowForm] = React.useState(false);
  const [editingJob, setEditingJob] = React.useState<any>(null);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const [formData, setFormData] = React.useState({
    title: '',
    company: '',
    description: '',
    location: '',
    job_type: 'full_time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    skills_required: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      description: '',
      location: '',
      job_type: 'full_time',
      experience_level: 'mid',
      salary_min: '',
      salary_max: '',
      skills_required: '',
    });
    setEditingJob(null);
    setShowForm(false);
  };

  const handleEdit = (job: any) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      description: '', // Would need full job data
      location: job.location || '',
      job_type: job.job_type,
      experience_level: job.experience_level,
      salary_min: '',
      salary_max: '',
      skills_required: '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      salary_min: formData.salary_min ? parseFloat(formData.salary_min) : undefined,
      salary_max: formData.salary_max ? parseFloat(formData.salary_max) : undefined,
      skills_required: formData.skills_required ? formData.skills_required.split(',') : undefined,
    };

    if (editingJob) {
      updateJob.mutate({ jobId: editingJob.id, data });
    } else {
      createJob.mutate(data);
    }
    resetForm();
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob.mutate(jobId);
    }
  };

  const filteredJobs = jobsData?.data?.items?.filter((job: any) => {
    const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-2">Create, edit, and manage your job postings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Job'}
        </Button>
      </motion.div>

      {/* Job Creation/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      value={formData.job_type}
                      onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="entry">Entry</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                    <Input
                      value={formData.skills_required}
                      onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
                      placeholder="Python, React, PostgreSQL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" isLoading={createJob.isPending || updateJob.isPending}>
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job: any, index: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="flex items-start justify-between py-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600 mt-1">{job.company}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            job.status === 'published' ? 'bg-green-100 text-green-700' :
                            job.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {job.status}
                          </span>
                          <span className="text-sm text-gray-500 capitalize">
                            {job.job_type?.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {job.application_count} applicants
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(job.id)}>
                      Delete
                    </Button>
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

export default EmployerJobsPage;