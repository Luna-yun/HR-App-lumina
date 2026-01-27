import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { recruitmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft, Users, Mail, Phone, FileText, ExternalLink, 
  Calendar, Clock, MapPin, Briefcase, DollarSign, Building2,
  CheckCircle, XCircle, UserCheck, MessageSquare, Star,
  Download, Send, MoreHorizontal, Filter, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  cover_letter: string;
  resume_url: string;
  status: string;
  applied_at: string;
  notes?: string;
  interview_date?: string;
}

interface JobDetails {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_range: string;
  location: string;
  employment_type: string;
  status: string;
  applicant_count: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  new: { label: 'New', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: Users },
  screening: { label: 'Screening', color: 'text-yellow-600', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', icon: FileText },
  interview: { label: 'Interview', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30', icon: MessageSquare },
  offer: { label: 'Offer', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30', icon: Star },
  hired: { label: 'Hired', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: UserCheck },
  rejected: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
};

export default function AdminApplicants() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  useEffect(() => {
    filterApplicants();
  }, [applicants, statusFilter, searchQuery]);

  const fetchData = async () => {
    try {
      const [jobsData, applicantsData] = await Promise.all([
        recruitmentAPI.getJobs(),
        recruitmentAPI.getApplicants(jobId!)
      ]);
      
      const jobData = jobsData.find((j: JobDetails) => j.id === jobId);
      if (jobData) {
        setJob(jobData);
      }
      setApplicants(applicantsData);
      if (applicantsData.length > 0) {
        setSelectedApplicant(applicantsData[0]);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredApplicants(filtered);
  };

  const updateApplicantStatus = async (applicantId: string, newStatus: string) => {
    try {
      await recruitmentAPI.updateApplicantStatus(applicantId, newStatus);
      toast({ title: 'Success', description: `Status updated to ${statusConfig[newStatus]?.label || newStatus}` });
      
      // Refresh data
      const applicantsData = await recruitmentAPI.getApplicants(jobId!);
      setApplicants(applicantsData);
      
      // Update selected applicant
      const updated = applicantsData.find((a: Applicant) => a.id === applicantId);
      if (updated) {
        setSelectedApplicant(updated);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: applicants.length };
    applicants.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Briefcase className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
          <Button onClick={() => navigate('/admin/recruitment')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recruitment
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/admin/recruitment')}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Recruitment
            </Button>
            <h1 className="text-2xl font-bold text-foreground">{job.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location || 'Remote'}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {applicants.length} applicants
              </span>
            </div>
          </div>
          <Badge className={job.status === 'open' ? 'bg-green-500' : job.status === 'closed' ? 'bg-red-500' : 'bg-yellow-500'}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Badge>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
            className="shrink-0"
          >
            All ({statusCounts.all || 0})
          </Button>
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = statusCounts[key] || 0;
            return (
              <Button
                key={key}
                variant={statusFilter === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(key)}
                className={`shrink-0 ${statusFilter !== key ? config.color : ''}`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {config.label} ({count})
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {applicants.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Applicants Yet</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                When candidates apply for this position, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Applicants List */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Applicants</CardTitle>
                <CardDescription>
                  {filteredApplicants.length} of {applicants.length} shown
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="divide-y">
                    {filteredApplicants.map((applicant) => {
                      const config = statusConfig[applicant.status] || statusConfig.new;
                      const isSelected = selectedApplicant?.id === applicant.id;
                      
                      return (
                        <motion.div
                          key={applicant.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => setSelectedApplicant(applicant)}
                          className={`p-4 cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-primary/10 border-l-2 border-l-primary' 
                              : 'hover:bg-secondary/50'
                          }`}
                          data-testid={`applicant-${applicant.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {applicant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-medium text-foreground truncate">
                                  {applicant.name}
                                </h4>
                                <Badge 
                                  variant="outline" 
                                  className={`${config.bgColor} ${config.color} border-0 text-xs shrink-0`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {applicant.email}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Applied {applicant.applied_at 
                                  ? formatDistanceToNow(new Date(applicant.applied_at), { addSuffix: true })
                                  : 'recently'
                                }
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Applicant Details */}
            <Card className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {selectedApplicant ? (
                  <motion.div
                    key={selectedApplicant.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white text-xl font-semibold">
                              {selectedApplicant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">{selectedApplicant.name}</CardTitle>
                            <CardDescription className="mt-1">
                              Applied {selectedApplicant.applied_at 
                                ? format(new Date(selectedApplicant.applied_at), 'MMMM d, yyyy \'at\' h:mm a')
                                : 'Recently'
                              }
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select 
                            value={selectedApplicant.status} 
                            onValueChange={(value) => updateApplicantStatus(selectedApplicant.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(statusConfig).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  <span className={config.color}>{config.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(`mailto:${selectedApplicant.email}`)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              {selectedApplicant.resume_url && (
                                <DropdownMenuItem onClick={() => window.open(selectedApplicant.resume_url, '_blank')}>
                                  <Download className="w-4 h-4 mr-2" />
                                  View Resume
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject Applicant
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Contact Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                          <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <a 
                              href={`mailto:${selectedApplicant.email}`}
                              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                              {selectedApplicant.email}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
                            <Phone className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            {selectedApplicant.phone ? (
                              <a 
                                href={`tel:${selectedApplicant.phone}`}
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                              >
                                {selectedApplicant.phone}
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">Not provided</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Resume/Portfolio */}
                      {selectedApplicant.resume_url && (
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Resume / Portfolio
                          </h4>
                          <a
                            href={selectedApplicant.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-all group"
                          >
                            <div className="p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50 transition-colors">
                              <ExternalLink className="w-5 h-5 text-violet-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                View Resume / Portfolio
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {selectedApplicant.resume_url}
                              </p>
                            </div>
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </a>
                        </div>
                      )}

                      <Separator />

                      {/* Cover Letter */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          Cover Letter
                        </h4>
                        {selectedApplicant.cover_letter ? (
                          <div className="p-4 rounded-lg bg-secondary/30 border">
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                              {selectedApplicant.cover_letter}
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-lg bg-secondary/30 border border-dashed text-center">
                            <p className="text-sm text-muted-foreground">
                              No cover letter provided
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Application Timeline */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Application Status
                        </h4>
                        <div className="flex items-center gap-2">
                          {Object.entries(statusConfig).map(([key, config], index) => {
                            const Icon = config.icon;
                            const isActive = key === selectedApplicant.status;
                            const isPast = Object.keys(statusConfig).indexOf(selectedApplicant.status) > index;
                            
                            return (
                              <React.Fragment key={key}>
                                <div 
                                  className={`flex flex-col items-center gap-1 ${
                                    isActive ? 'opacity-100' : isPast ? 'opacity-60' : 'opacity-30'
                                  }`}
                                >
                                  <div className={`p-2 rounded-full ${isActive ? config.bgColor : 'bg-secondary'}`}>
                                    <Icon className={`w-4 h-4 ${isActive ? config.color : 'text-muted-foreground'}`} />
                                  </div>
                                  <span className={`text-xs ${isActive ? 'font-medium ' + config.color : 'text-muted-foreground'}`}>
                                    {config.label}
                                  </span>
                                </div>
                                {index < Object.keys(statusConfig).length - 1 && (
                                  <div className={`h-0.5 w-8 ${isPast ? 'bg-primary' : 'bg-secondary'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`mailto:${selectedApplicant.email}`)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        {selectedApplicant.phone && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`tel:${selectedApplicant.phone}`)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                        {selectedApplicant.status === 'new' && (
                          <Button 
                            size="sm"
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'screening')}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Start Screening
                          </Button>
                        )}
                        {selectedApplicant.status === 'screening' && (
                          <Button 
                            size="sm"
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'interview')}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </Button>
                        )}
                        {selectedApplicant.status === 'interview' && (
                          <Button 
                            size="sm"
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'offer')}
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Make Offer
                          </Button>
                        )}
                        {selectedApplicant.status === 'offer' && (
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateApplicantStatus(selectedApplicant.id, 'hired')}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Mark as Hired
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                ) : (
                  <CardContent className="flex flex-col items-center justify-center h-[600px]">
                    <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">Select an applicant to view details</p>
                  </CardContent>
                )}
              </AnimatePresence>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
