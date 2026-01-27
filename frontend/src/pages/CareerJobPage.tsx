import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, MapPin, Clock, Building2, Calendar, ArrowLeft, 
  Share2, CheckCircle, Send, Loader2, DollarSign, Copy, 
  Twitter, Linkedin, Facebook, Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const API_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL || '';

interface JobDetails {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  employment_type: string;
  company_name: string;
  company_country: string;
  created_at: string;
  is_open: boolean;
}

export default function CareerJobPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: ''
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`${API_URL}/api/careers/${jobId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('This job posting is no longer available.');
          } else {
            setError('Failed to load job details.');
          }
          return;
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError('Failed to load job details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_URL}/api/careers/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit application');
      }
      
      setApplicationSuccess(true);
      toast({
        title: 'Application Submitted!',
        description: "We'll review your application and get back to you soon.",
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit application',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShare = async (platform: string) => {
    const title = job ? `${job.title} at ${job.company_name}` : 'Job Opportunity';
    const text = job ? `Check out this job: ${job.title} at ${job.company_name}` : '';
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
    };
    
    if (platform === 'copy') {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: 'Link Copied!', description: 'Share this link with anyone.' });
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-6">{error || 'This job posting is no longer available.'}</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Briefcase className="w-6 h-6" />
            Careers
          </Link>
          <Button variant="outline" size="sm" onClick={() => handleShare('copy')} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Job Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{job.company_name}</span>
              {job.company_country && (
                <>
                  <span>•</span>
                  <span>{job.company_country}</span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{job.title}</h1>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {job.department}
              </Badge>
              {job.location && (
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </Badge>
              )}
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Clock className="w-3.5 h-3.5" />
                {job.employment_type}
              </Badge>
              {job.salary_range && (
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  {job.salary_range}
                </Badge>
              )}
              <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About the Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                      {job.requirements}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Interested in this role?</h3>
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={() => setShowApplyDialog(true)}
                  >
                    Apply Now
                  </Button>
                  
                  {/* Share Options */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Share this opportunity:</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('email')}>
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleShare('copy')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Apply Dialog */}
      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application to {job.company_name}
            </DialogDescription>
          </DialogHeader>
          
          {applicationSuccess ? (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground">
                Thank you for applying. We'll review your application and get back to you soon.
              </p>
              <Button className="mt-6" onClick={() => setShowApplyDialog(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Cover Letter</label>
                <Textarea
                  placeholder="Tell us why you're interested in this role..."
                  rows={4}
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Resume/LinkedIn URL</label>
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowApplyDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
