import React, { useState, useEffect } from 'react';
import { recruitmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Briefcase, Plus, Users, UserCheck, Clock, XCircle, Eye, Mail, Phone, FileText, ExternalLink, ChevronRight, Lock, Unlock, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { JobPosting, RecruitmentStats } from '@/types';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url: string;
  status: string;
  applied_at: string;
}

export default function AdminRecruitment() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [stats, setStats] = useState<RecruitmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
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

  const viewApplicants = async (job: JobPosting) => {
    setSelectedJob(job);
    setLoadingApplicants(true);
    try {
      const data = await recruitmentAPI.getApplicants(job.id);
      setApplicants(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch applicants', variant: 'destructive' });
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateApplicantStatus = async (applicantId: string, newStatus: string) => {
    try {
      await recruitmentAPI.updateApplicantStatus(applicantId, newStatus);
      toast({ title: 'Success', description: 'Applicant status updated' });
      // Refresh applicants list
      if (selectedJob) {
        const data = await recruitmentAPI.getApplicants(selectedJob.id);
        setApplicants(data);
      }
      fetchData(); // Refresh stats
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getApplicantStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-blue-500">New</Badge>;
      case 'screening': return <Badge className="bg-yellow-500">Screening</Badge>;
      case 'interview': return <Badge className="bg-orange-500">Interview</Badge>;
      case 'offer': return <Badge className="bg-purple-500">Offer</Badge>;
      case 'hired': return <Badge className="bg-green-500">Hired</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
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
                          variant="outline" 
                          size="sm" 
                          onClick={() => viewApplicants(job)}
                          data-testid={`view-applicants-${job.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
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

        {/* Applicants Dialog */}
        <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Applicants for {selectedJob?.title}
              </DialogTitle>
              <DialogDescription>
                {selectedJob?.department} • {selectedJob?.location || 'Remote'}
              </DialogDescription>
            </DialogHeader>
            
            {loadingApplicants ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : applicants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No applicants yet for this position</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="p-4 border rounded-xl hover:bg-secondary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                              {applicant.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{applicant.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Applied {applicant.applied_at ? format(new Date(applicant.applied_at), 'MMM d, yyyy') : 'Recently'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-3 text-sm">
                            <a href={`mailto:${applicant.email}`} className="flex items-center gap-1 text-blue-500 hover:underline">
                              <Mail className="w-4 h-4" />
                              {applicant.email}
                            </a>
                            {applicant.phone && (
                              <a href={`tel:${applicant.phone}`} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                                <Phone className="w-4 h-4" />
                                {applicant.phone}
                              </a>
                            )}
                            {applicant.resume_url && (
                              <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-green-500 hover:underline">
                                <ExternalLink className="w-4 h-4" />
                                Resume/Portfolio
                              </a>
                            )}
                          </div>
                          
                          {applicant.cover_letter && (
                            <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                              <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Cover Letter
                              </p>
                              <p className="text-sm text-foreground line-clamp-3">{applicant.cover_letter}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 ml-4">
                          {getApplicantStatusBadge(applicant.status)}
                          <Select 
                            value={applicant.status} 
                            onValueChange={(value) => updateApplicantStatus(applicant.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="screening">Screening</SelectItem>
                              <SelectItem value="interview">Interview</SelectItem>
                              <SelectItem value="offer">Offer</SelectItem>
                              <SelectItem value="hired">Hired</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
