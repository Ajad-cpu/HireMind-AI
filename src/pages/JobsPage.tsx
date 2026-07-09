import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBrowseJobs, useSaveJob, useUnsaveJob } from '@/hooks/useJobs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { JobFilters } from '@/types';

const JobsPage: React.FC = () => {
  const [filters, setFilters] = React.useState<JobFilters>({});
  const [skip, setSkip] = React.useState(0);
  const limit = 12;

  const { data: jobsData, isLoading } = useBrowseJobs(filters, skip, limit);
  const saveJob = useSaveJob();
  const unsaveJob = useUnsaveJob();

  const jobs = jobsData?.data?.items || [];

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setSkip(0);
  };

  const loadMore = () => {
    setSkip(prev => prev + limit);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <Input
                    placeholder="Search jobs..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <Input
                    placeholder="City or state"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select
                    value={filters.job_type || ''}
                    onChange={(e) => handleFilterChange('job_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Types</option>
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
                    value={filters.experience_level || ''}
                    onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary ($)</label>
                  <Input
                    type="number"
                    placeholder="50000"
                    value={filters.salary_min || ''}
                    onChange={(e) => handleFilterChange('salary_min', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remote_only"
                    checked={filters.remote_only || false}
                    onChange={(e) => handleFilterChange('remote_only', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="remote_only" className="text-sm text-gray-700">
                    Remote only
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posted Within</label>
                  <select
                    value={filters.posted_within_days || ''}
                    onChange={(e) => handleFilterChange('posted_within_days', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Any time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="7">Last week</option>
                    <option value="30">Last month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sort_by || 'created_at'}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="created_at">Newest</option>
                    <option value="salary_min">Salary</option>
                    <option value="application_count">Most Popular</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Job Listings */}
        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-600 mt-2">
              {jobsData?.data?.total || 0} jobs found
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !jobs.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No jobs found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <Link to={`/jobs/${job.id}`}>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                                {job.title}
                              </h3>
                            </Link>
                            <p className="text-gray-600 mt-1">{job.company}</p>
                          </div>
                          {job.is_featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {job.location && (
                            <span className="text-sm text-gray-500">📍 {job.location}</span>
                          )}
                          <span className="text-sm text-gray-500 capitalize">
                            {job.job_type?.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500 capitalize">
                            {job.experience_level}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {job.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {job.salary_min && (
                              <span>${job.salary_min.toLocaleString()}+</span>
                            )}
                            <span className="ml-2">{job.application_count} applicants</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => saveJob.mutate(job.id)}
                            >
                              Save
                            </Button>
                            <Link to={`/jobs/${job.id}`}>
                              <Button size="sm">View</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {jobsData?.data?.total_pages && skip + limit < (jobsData.data.total || 0) && (
                <div className="mt-8 text-center">
                  <Button onClick={loadMore} variant="outline">
                    Load More Jobs
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobsPage;