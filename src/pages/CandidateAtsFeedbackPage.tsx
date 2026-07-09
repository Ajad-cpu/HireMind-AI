import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { candidateApi } from '@/api/candidate';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ATSFeedback, CandidateRankingView } from '@/types/candidate';

const scoreColor = (v?: number | null) => {
  if (v == null) return 'bg-gray-200';
  if (v >= 75) return 'bg-green-500';
  if (v >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const CandidateAtsFeedbackPage: React.FC = () => {
  const [applications, setApplications] = React.useState<{ job_id: string; job: { title: string } }[]>([]);
  const [jobId, setJobId] = React.useState('');
  const [feedback, setFeedback] = React.useState<ATSFeedback | null>(null);
  const [myRanking, setMyRanking] = React.useState<CandidateRankingView | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    candidateApi.getApplications(0, 100).then((res) => {
      const items = (res.data?.items || []).map((a) => ({ job_id: a.job_id, job: a.job }));
      setApplications(items);
    }).catch(() => {});
  }, []);

  const load = React.useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const [fb, rk] = await Promise.allSettled([
        candidateApi.getAtsFeedback(jobId),
        candidateApi.getMyRanking(jobId),
      ]);
      if (fb.status === 'fulfilled') setFeedback(fb.value.data);
      else setFeedback(null);
      if (rk.status === 'fulfilled') setMyRanking(rk.value.data);
      else setMyRanking(null);
    } catch (e) {
      toast.error('Failed to load ATS feedback');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    load();
  }, [jobId, load]);

  const BREAKDOWN: { key: keyof NonNullable<CandidateRankingView['breakdown']>; label: string }[] = [
    { key: 'skills_match_percent', label: 'Skills Match' },
    { key: 'experience_match_percent', label: 'Experience Match' },
    { key: 'ats_score', label: 'ATS Score' },
    { key: 'education_relevance', label: 'Education Relevance' },
    { key: 'certifications_relevance', label: 'Certifications' },
    { key: 'project_relevance', label: 'Project Relevance' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI ATS Feedback</h1>
        <p className="text-gray-600 mt-2">
          Understand how your resume matches each role, discover skill gaps and get tailored improvements.
        </p>
      </motion.div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select a Job You Applied To</label>
          <select
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Choose an application --</option>
            {applications.map((a) => (
              <option key={a.job_id} value={a.job_id}>{a.job?.title}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
      ) : jobId && feedback ? (
        <div className="space-y-6">
          {/* AI Summary + score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">ATS Feedback — {feedback.job_title}</h3>
                {feedback.ats_score != null && (
                  <span className="text-2xl font-bold text-primary-700">{feedback.ats_score.toFixed(1)}%</span>
                )}
              </div>
              {feedback.ai_summary && (
                <p className="text-gray-700 bg-primary-50 border border-primary-100 rounded-lg p-3">{feedback.ai_summary}</p>
              )}
            </CardContent>
          </Card>

          {/* Matched / missing skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3 text-green-700">Matched Skills</h4>
                {feedback.matched_skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {feedback.matched_skills.map((s) => (
                      <span key={s} className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">None detected.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3 text-red-700">Missing Skills</h4>
                {feedback.missing_skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {feedback.missing_skills.map((s) => (
                      <span key={s} className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-500">No major gaps — great match!</p>}
              </CardContent>
            </Card>
          </div>

          {/* Skill gaps detail */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Skill Gaps & Suggestions</h4>
              {feedback.skill_gaps.length ? (
                <div className="space-y-3">
                  {feedback.skill_gaps.map((g) => (
                    <div key={g.skill} className="flex items-start justify-between border-b pb-2">
                      <div>
                        <p className="font-medium text-gray-900">{g.skill}</p>
                        <p className="text-xs text-gray-600">{g.suggestion}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        g.importance === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {g.importance}
                      </span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500">No skill gaps identified.</p>}
            </CardContent>
          </Card>

          {/* Suggested improvements */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Suggested Improvements</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {feedback.suggested_improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Your ranking / score breakdown */}
          {myRanking && (
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">
                  Your Relevance Score: {myRanking.score.toFixed(1)}
                  {myRanking.rank_position != null && (
                    <span className="text-sm text-gray-500 ml-2">· Rank #{myRanking.rank_position}</span>
                  )}
                </h4>
                {BREAKDOWN.map((b) => {
                  const v = myRanking.breakdown[b.key] ?? null;
                  return (
                    <div key={b.key} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{b.label}</span>
                        <span className="font-medium">{v != null ? v.toFixed(1) : '-'}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${scoreColor(v)}`} style={{ width: `${v ?? 0}%` }} />
                      </div>
                    </div>
                  );
                })}
                {myRanking.ai_summary && (
                  <p className="text-sm text-gray-700 mt-2 bg-primary-50 border border-primary-100 rounded-lg p-3">
                    {myRanking.ai_summary}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : jobId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No ATS feedback available yet. Make sure a resume is attached to this application.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Select one of your applications to see AI feedback.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidateAtsFeedbackPage;