import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { employerApi } from '@/api/employer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { CandidateRanking, RankingComparison, InterviewQuestion } from '@/types/employer';

const METRICS: { key: keyof NonNullable<CandidateRanking['breakdown']>; label: string }[] = [
  { key: 'skills_match_percent', label: 'Skills' },
  { key: 'experience_match_percent', label: 'Experience' },
  { key: 'ats_score', label: 'ATS' },
  { key: 'education_relevance', label: 'Education' },
  { key: 'certifications_relevance', label: 'Certifications' },
  { key: 'project_relevance', label: 'Projects' },
];

const scoreColor = (v?: number | null) => {
  if (v == null) return 'bg-gray-200';
  if (v >= 75) return 'bg-green-500';
  if (v >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const EmployerRankingPage: React.FC = () => {
  const [jobs, setJobs] = React.useState<{ id: string; title: string }[]>([]);
  const [jobId, setJobId] = React.useState('');
  const [comparison, setComparison] = React.useState<RankingComparison | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [ranking, setRanking] = React.useState(false);

  // Interview question generator state
  const [questions, setQuestions] = React.useState<InterviewQuestion[]>([]);
  const [qCount, setQCount] = React.useState(6);
  const [qDifficulty, setQDifficulty] = React.useState(5);
  const [qSeniority, setQSeniority] = React.useState('');
  const [qGenerating, setQGenerating] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);

  React.useEffect(() => {
    employerApi.getJobs(0, 100).then((res) => {
      const items = (res.data?.items || []).map((j) => ({ id: j.id, title: j.title }));
      setJobs(items);
    }).catch(() => {});
  }, []);

  const loadRankings = React.useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const res = await employerApi.getRankings(jobId);
      setComparison(res.data);
    } catch (e) {
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  React.useEffect(() => {
    loadRankings();
  }, [jobId, loadRankings]);

  const handleRank = async () => {
    if (!jobId) return;
    setRanking(true);
    try {
      await employerApi.rankCandidates(jobId);
      toast.success('Candidates ranked with AI');
      await loadRankings();
    } catch (e) {
      toast.error('Ranking failed');
    } finally {
      setRanking(false);
    }
  };

  const handleGenerate = async () => {
    if (!jobId) return;
    setQGenerating(true);
    try {
      const res = await employerApi.generateInterviewQuestions(jobId, qCount, undefined, {
        difficulty: qDifficulty,
        seniority_level: qSeniority || undefined,
      });
      setQuestions(res.data || []);
      toast.success(`Generated ${res.data?.length || 0} questions`);
    } catch (e) {
      toast.error('Question generation failed');
    } finally {
      setQGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Candidate Ranking</h1>
        <p className="text-gray-600 mt-2">
          Rank applicants by relevance score across skills, experience, ATS, education, certifications and projects.
        </p>
      </motion.div>

      {/* Controls */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Job</label>
              <select
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">-- Choose a job posting --</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleRank} isLoading={ranking} disabled={!jobId}>
              Rank Candidates (AI)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ranking table */}
      {loading ? (
        <div className="h-40 bg-gray-200 rounded animate-pulse" />
      ) : comparison && comparison.candidates.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Ranking Table — {comparison.job_title}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-2">#</th>
                        <th className="py-2 pr-2">Candidate</th>
                        <th className="py-2 pr-2">Score</th>
                        {METRICS.map((m) => (
                          <th key={m.key} className="py-2 pr-2">{m.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.candidates.map((c) => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 pr-2 font-medium">{c.rank_position ?? '-'}</td>
                          <td className="py-2 pr-2">
                            <div className="font-medium text-gray-900">{c.candidate_name}</div>
                            <div className="text-xs text-gray-500">{c.candidate_email}</div>
                          </td>
                          <td className="py-2 pr-2">
                            <span className="font-bold text-primary-700">{c.score.toFixed(1)}</span>
                          </td>
                          {METRICS.map((m) => {
                            const v = c.breakdown[m.key] ?? null;
                            return (
                              <td key={m.key} className="py-2 pr-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full ${scoreColor(v)}`} style={{ width: `${v ?? 0}%` }} />
                                  </div>
                                  <span className="text-xs text-gray-600">{v != null ? v.toFixed(0) : '-'}</span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Score breakdown + AI summary */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Average Score Breakdown</h3>
                {METRICS.map((m) => {
                  const v = comparison.metric_averages[m.key] ?? null;
                  return (
                    <div key={m.key} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{m.label}</span>
                        <span className="font-medium">{v != null ? v.toFixed(1) : '-'}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${scoreColor(v)}`} style={{ width: `${v ?? 0}%` }} />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">AI Candidate Comparison</h3>
                <div className="space-y-3">
                  {comparison.candidates.slice(0, 4).map((c) => (
                    <div key={c.id} className="border-l-4 border-primary-300 pl-3">
                      <p className="text-sm font-medium">{c.candidate_name} — {c.score.toFixed(1)}</p>
                      <p className="text-xs text-gray-600">{c.ai_summary || 'No summary available.'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : jobId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No rankings yet for this job. Click "Rank Candidates" to generate AI rankings.</p>
            <Button onClick={handleRank} isLoading={ranking}>Rank Candidates (AI)</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Select a job to view candidate rankings.</p>
          </CardContent>
        </Card>
      )}

      {/* Interview question generator */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Interview Question Generator</h2>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"># Questions</label>
                <Input type="number" min={1} max={20} value={qCount} onChange={(e) => setQCount(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty (1-10)</label>
                <Input type="number" min={1} max={10} value={qDifficulty} onChange={(e) => setQDifficulty(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
                <select
                  value={qSeniority}
                  onChange={(e) => setQSeniority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Job default</option>
                  {['entry', 'junior', 'mid', 'senior', 'lead'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleGenerate} isLoading={qGenerating} disabled={!jobId}>
                Generate Questions
              </Button>
            </div>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((q) => (
              <Card key={q.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-wide bg-primary-100 text-primary-700 px-2 py-1 rounded-full mr-2">
                        {q.question_type}
                      </span>
                      <span className="text-xs text-gray-500">Difficulty {q.difficulty}/10</span>
                      {q.focus_area && <span className="text-xs text-gray-400 ml-2">· {q.focus_area}</span>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                      {expanded === q.id ? 'Hide' : 'Details'}
                    </Button>
                  </div>
                  <p className="mt-2 text-gray-900 font-medium">{q.question_text}</p>
                  {expanded === q.id && (
                    <div className="mt-3 space-y-3 text-sm">
                      {q.expected_answer && (
                        <div>
                          <p className="font-medium text-gray-700">Expected Answer</p>
                          <p className="text-gray-600">{q.expected_answer}</p>
                        </div>
                      )}
                      {q.evaluation_criteria && (
                        <div>
                          <p className="font-medium text-gray-700">Evaluation Criteria</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {(q.evaluation_criteria.key_points || []).map((k: string, i: number) => (
                              <li key={i}>{k}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {q.follow_up_questions && q.follow_up_questions.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-700">Follow-up Questions</p>
                          <ul className="list-disc list-inside text-gray-600">
                            {q.follow_up_questions.map((f: string, i: number) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerRankingPage;