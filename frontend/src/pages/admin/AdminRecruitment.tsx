import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recruitmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Plus, Users, UserCheck, Clock, Eye, Lock, Unlock, Pause, Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { JobPosting, RecruitmentStats } from '@/types';

export default function AdminRecruitment() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [stats, setStats] = useState<RecruitmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', department: '', description: '', requirements: '', salary_range: '', location: '', employment_type: 'Full-time' });
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [jobsData, statsData] = await Promise.all([recruitmentAPI.getJobs(), recruitmentAPI.getStats()]);
      setJobs(jobsData);
      setStats(statsData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await recruitmentAPI.createJob(formData);
      toast({ title: 'Success', description: 'Job posting created' });
      setIsDialogOpen(false);
      setFormData({ title: '', department: '', description: '', requirements: '', salary_range: '', location: '', employment_type: 'Full-time' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create job', variant: 'destructive' });
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      await recruitmentAPI.updateJobStatus(jobId, newStatus);
      toast({ 
        title: 'Success', 
        description: newStatus === 'closed' 
          ? 'Job posting closed. A notice has been sent to employees.' 
          : `Job status updated to ${newStatus}` 
      });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update job status', variant: 'destructive' });
    }
  };

  const copyCareerLink = (jobId: string) => {
    const url = `${window.location.origin}/careers/${jobId}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link Copied!', description: 'Shareable career link copied to clipboard.' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-green-500">Open</Badge>;
      case 'closed': return <Badge variant="destructive">Closed</Badge>;
      case 'on_hold': return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600 border-yellow-500">On Hold</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recruitment</h1>
            <p className="text-muted-foreground">Manage job postings and applicants</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Post Job</Button></DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Create Job Posting</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Job Title</Label><Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} required /></div>
                  <div><Label>Department</Label><Input value={formData.department} onChange={(e) => setFormData(p => ({ ...p, department: e.target.value }))} required /></div>
                </div>
                <div><Label>Description</Label><Textarea rows={3} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required /></div>
                <div><Label>Requirements</Label><Textarea rows={3} value={formData.requirements} onChange={(e) => setFormData(p => ({ ...p, requirements: e.target.value }))} required /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Salary Range</Label><Input value={formData.salary_range} onChange={(e) => setFormData(p => ({ ...p, salary_range: e.target.value }))} placeholder="e.g. $50k-70k" /></div>
                  <div><Label>Location</Label><Input value={formData.location} onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))} /></div>
                  <div><Label>Type</Label><Select value={formData.employment_type} onValueChange={(v) => setFormData(p => ({ ...p, employment_type: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Contract">Contract</SelectItem></SelectContent></Select></div>
                </div>
                <Button type="submit" className="w-full">Create Job Posting</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[{ label: 'Open Jobs', value: stats?.open_jobs || 0, icon: Briefcase, color: 'text-green-500' },
            { label: 'Total Applicants', value: stats?.total_applicants || 0, icon: Users, color: 'text-blue-500' },
            { label: 'In Interview', value: stats?.in_interview || 0, icon: Clock, color: 'text-orange-500' },
            { label: 'Hired', value: stats?.hired || 0, icon: UserCheck, color: 'text-purple-500' }].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Card key={i}><CardContent className="p-4 flex items-center gap-4"><div className={`p-3 rounded-xl bg-secondary`}><Icon className={`w-5 h-5 ${stat.color}`} /></div><div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-muted-foreground">{stat.label}</p></div></CardContent></Card>
              );
            })}
        </div>

        <Card>
          <CardHeader><CardTitle>Job Postings</CardTitle></CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No job postings yet</p></div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 bg-secondary/50 rounded-xl hover:bg-secondary/70 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">{job.department} • {job.employment_type} • {job.location || 'Remote'}</p>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-sm"><Users className="w-4 h-4 inline mr-1" />{job.applicant_count} applicants</span>
                          {job.salary_range && <span className="text-sm text-green-500">{job.salary_range}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(job.status)}
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => navigate(`/admin/recruitment/${job.id}/applicants`)}
                          data-testid={`view-applicants-${job.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View ({job.applicant_count})
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyCareerLink(job.id)}
                          title="Copy shareable link"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {job.status === 'open' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-yellow-600 border-yellow-500 hover:bg-yellow-500/10"
                              onClick={() => updateJobStatus(job.id, 'on_hold')}
                              data-testid={`hold-job-${job.id}`}
                            >
                              <Pause className="w-4 h-4 mr-1" />
                              Hold
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-500 hover:bg-red-500/10"
                              onClick={() => updateJobStatus(job.id, 'closed')}
                              data-testid={`close-job-${job.id}`}
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Close
                            </Button>
                          </>
                        ) : job.status === 'on_hold' ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-500 hover:bg-green-500/10"
                              onClick={() => updateJobStatus(job.id, 'open')}
                              data-testid={`reopen-job-${job.id}`}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Resume
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-500 hover:bg-red-500/10"
                              onClick={() => updateJobStatus(job.id, 'closed')}
                              data-testid={`close-job-${job.id}`}
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Close
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-500 hover:bg-green-500/10"
                            onClick={() => updateJobStatus(job.id, 'open')}
                            data-testid={`reopen-job-${job.id}`}
                          >
                            <Unlock className="w-4 h-4 mr-1" />
                            Reopen
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
