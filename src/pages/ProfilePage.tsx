import React from 'react';
import { motion } from 'framer-motion';
import { useCandidateProfile, useUpdateProfile } from '@/hooks/useCandidate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ProfilePage: React.FC = () => {
  const { data: profileData, isLoading } = useCandidateProfile();
  const updateProfile = useUpdateProfile();
  
  const [formData, setFormData] = React.useState({
    headline: '',
    summary: '',
    years_of_experience: '',
    current_salary: '',
    expected_salary: '',
    preferred_location: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });

  React.useEffect(() => {
    if (profileData?.data) {
      const p = profileData.data;
      setFormData({
        headline: p.headline || '',
        summary: p.summary || '',
        years_of_experience: p.years_of_experience?.toString() || '',
        current_salary: p.current_salary?.toString() || '',
        expected_salary: p.expected_salary?.toString() || '',
        preferred_location: p.preferred_location || '',
        linkedin_url: p.linkedin_url || '',
        github_url: p.github_url || '',
        portfolio_url: p.portfolio_url || '',
      });
    }
  }, [profileData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      headline: formData.headline,
      summary: formData.summary,
      years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : undefined,
      current_salary: formData.current_salary ? parseFloat(formData.current_salary) : undefined,
      expected_salary: formData.expected_salary ? parseFloat(formData.expected_salary) : undefined,
      preferred_location: formData.preferred_location,
      linkedin_url: formData.linkedin_url,
      github_url: formData.github_url,
      portfolio_url: formData.portfolio_url,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">
          Completion: {profileData?.data?.completion_percentage || 0}%
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                <Input
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell employers about yourself..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                  <Input
                    type="number"
                    name="years_of_experience"
                    value={formData.years_of_experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary ($)</label>
                  <Input
                    type="number"
                    name="current_salary"
                    value={formData.current_salary}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary ($)</label>
                  <Input
                    type="number"
                    name="expected_salary"
                    value={formData.expected_salary}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Location</label>
                <Input
                  name="preferred_location"
                  value={formData.preferred_location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <Input
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                <Input
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                <Input
                  name="portfolio_url"
                  value={formData.portfolio_url}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" isLoading={updateProfile.isPending}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;