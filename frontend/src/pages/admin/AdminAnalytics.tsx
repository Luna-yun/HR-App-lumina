import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employeeAPI, taskAPI, performanceAPI, departmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { 
  BarChart3, Users, TrendingUp, Target, Star, Plus, CheckCircle, Clock, 
  AlertCircle, Trophy, Sparkles, ListTodo, Award, ChevronRight 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Employee } from '@/types';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_to_name: string;
  assigned_by_name: string;
  status: string;
  priority: string;
  category: string;
  due_date?: string;
  created_at: string;
}

interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  reviewer_name: string;
  review_period: string;
  goals_achieved: number;
  quality_score: number;
  productivity_score: number;
  teamwork_score: number;
  communication_score: number;
  overall_score: number;
  feedback: string;
  strengths: string;
  areas_for_improvement: string;
  goals_for_next_period: string;
  created_at: string;
}

interface Analytics {
  reviews: {
    total: number;
    avg_overall_score: number;
    avg_goals_achieved: number;
    score_distribution: {
      excellent: number;
      good: number;
      average: number;
      needs_improvement: number;
    };
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
    in_progress: number;
    completion_rate: number;
  };
  top_performers: Array<{ id: string; name: string; avg_score: number }>;
}

export default function AdminAnalytics() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [taskDialog, setTaskDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    category: 'general'
  });
  
  const [reviewForm, setReviewForm] = useState({
    employee_id: '',
    review_period: '',
    goals_achieved: 50,
    quality_score: 3,
    productivity_score: 3,
    teamwork_score: 3,
    communication_score: 3,
    feedback: '',
    strengths: '',
    areas_for_improvement: '',
    goals_for_next_period: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [empData, taskData, reviewData, analyticsData] = await Promise.all([
        employeeAPI.getEmployees(),
        taskAPI.getAllTasks(),
        performanceAPI.getAllReviews(),
        performanceAPI.getAnalytics()
      ]);
      setEmployees(empData.filter(e => e.is_approved));
      setTasks(taskData.tasks);
      setReviews(reviewData.reviews);
      setAnalytics(analyticsData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!taskForm.title || !taskForm.assigned_to) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await taskAPI.createTask(taskForm);
      toast({ title: 'Success', description: 'Task created successfully' });
      setTaskDialog(false);
      setTaskForm({ title: '', description: '', assigned_to: '', due_date: '', priority: 'medium', category: 'general' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create task', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReview = async () => {
    if (!reviewForm.employee_id || !reviewForm.review_period) {
      toast({ title: 'Error', description: 'Please select employee and review period', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await performanceAPI.createReview(reviewForm);
      toast({ title: 'Success', description: 'Performance review created' });
      setReviewDialog(false);
      setReviewForm({
        employee_id: '',
        review_period: '',
        goals_achieved: 50,
        quality_score: 3,
        productivity_score: 3,
        teamwork_score: 3,
        communication_score: 3,
        feedback: '',
        strengths: '',
        areas_for_improvement: '',
        goals_for_next_period: ''
      });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create review', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await taskAPI.updateTask(taskId, { status });
      toast({ title: 'Success', description: 'Task status updated' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'medium': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-amber-500/10 text-amber-600 border-amber-200';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-violet-600 mx-auto mb-4 flex items-center justify-center"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Analytics & Performance
            </h1>
            <p className="text-muted-foreground">Company insights, tasks, and performance reviews</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={taskDialog} onOpenChange={setTaskDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ListTodo className="w-4 h-4" />
                  Assign Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Create New Task
                  </DialogTitle>
                  <DialogDescription>
                    Assign a task to an employee for tracking and performance evaluation.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Task Title <span className="text-destructive">*</span></Label>
                    <Input
                      value={taskForm.title}
                      onChange={(e) => setTaskForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="Enter task title..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Assign To <span className="text-destructive">*</span></Label>
                    <Select value={taskForm.assigned_to} onValueChange={(v) => setTaskForm(p => ({ ...p, assigned_to: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.full_name || emp.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={taskForm.priority} onValueChange={(v) => setTaskForm(p => ({ ...p, priority: v }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input
                        type="date"
                        value={taskForm.due_date}
                        onChange={(e) => setTaskForm(p => ({ ...p, due_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Task description..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTaskDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateTask} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg shadow-primary/25">
                  <Award className="w-4 h-4" />
                  New Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Create Performance Review
                  </DialogTitle>
                  <DialogDescription>
                    Evaluate an employee's performance for the review period.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Employee <span className="text-destructive">*</span></Label>
                      <Select value={reviewForm.employee_id} onValueChange={(v) => setReviewForm(p => ({ ...p, employee_id: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id}>
                              {emp.full_name || emp.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Review Period <span className="text-destructive">*</span></Label>
                      <Select value={reviewForm.review_period} onValueChange={(v) => setReviewForm(p => ({ ...p, review_period: v }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Q1 2026">Q1 2026</SelectItem>
                          <SelectItem value="Q2 2026">Q2 2026</SelectItem>
                          <SelectItem value="Q3 2026">Q3 2026</SelectItem>
                          <SelectItem value="Q4 2026">Q4 2026</SelectItem>
                          <SelectItem value="2025 Annual">2025 Annual</SelectItem>
                          <SelectItem value="2026 Annual">2026 Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Goals Achievement: {reviewForm.goals_achieved}%</Label>
                    <Slider
                      value={[reviewForm.goals_achieved]}
                      onValueChange={([v]) => setReviewForm(p => ({ ...p, goals_achieved: v }))}
                      max={100}
                      step={5}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { key: 'quality_score', label: 'Quality' },
                      { key: 'productivity_score', label: 'Productivity' },
                      { key: 'teamwork_score', label: 'Teamwork' },
                      { key: 'communication_score', label: 'Communication' },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <Label>{label}: {reviewForm[key as keyof typeof reviewForm]}/5</Label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(score => (
                            <Button
                              key={score}
                              type="button"
                              size="sm"
                              variant={reviewForm[key as keyof typeof reviewForm] === score ? 'default' : 'outline'}
                              className="w-8 h-8 p-0"
                              onClick={() => setReviewForm(p => ({ ...p, [key]: score }))}
                            >
                              {score}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Feedback</Label>
                    <Textarea
                      value={reviewForm.feedback}
                      onChange={(e) => setReviewForm(p => ({ ...p, feedback: e.target.value }))}
                      placeholder="Overall feedback for the employee..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Strengths</Label>
                      <Textarea
                        value={reviewForm.strengths}
                        onChange={(e) => setReviewForm(p => ({ ...p, strengths: e.target.value }))}
                        placeholder="Key strengths..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Areas for Improvement</Label>
                      <Textarea
                        value={reviewForm.areas_for_improvement}
                        onChange={(e) => setReviewForm(p => ({ ...p, areas_for_improvement: e.target.value }))}
                        placeholder="Areas to improve..."
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Goals for Next Period</Label>
                    <Textarea
                      value={reviewForm.goals_for_next_period}
                      onChange={(e) => setReviewForm(p => ({ ...p, goals_for_next_period: e.target.value }))}
                      placeholder="Goals and objectives for the next review period..."
                      rows={2}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setReviewDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateReview} disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Review'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-500/10">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{analytics.tasks.completion_rate}%</p>
                    <p className="text-sm text-muted-foreground">Task Completion</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{analytics.reviews.avg_goals_achieved}%</p>
                    <p className="text-sm text-muted-foreground">Avg Goals Achieved</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Star className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{analytics.reviews.avg_overall_score}</p>
                    <p className="text-sm text-muted-foreground">Avg Review Score</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/10">
                    <ListTodo className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{analytics.tasks.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="performers">Top Performers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ListTodo className="w-5 h-5 text-primary" />
                  Assigned Tasks ({tasks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {tasks.length === 0 ? (
                    <div className="text-center py-16">
                      <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No tasks assigned yet</p>
                    </div>
                  ) : (
                    tasks.slice(0, 10).map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">
                            {task.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : task.status === 'in_progress' ? (
                              <Clock className="w-5 h-5 text-blue-500" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-amber-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{task.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Assigned to {task.assigned_to_name}
                              {task.due_date && ` • Due ${format(new Date(task.due_date), 'MMM d, yyyy')}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                          <Select
                            value={task.status}
                            onValueChange={(v) => handleUpdateTaskStatus(task.id, v)}
                          >
                            <SelectTrigger className="w-[130px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="w-5 h-5 text-primary" />
                  Performance Reviews ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {reviews.length === 0 ? (
                    <div className="text-center py-16">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </div>
                  ) : (
                    reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{review.employee_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {review.review_period} • Reviewed by {review.reviewer_name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-lg">{review.overall_score}</span>
                              <span className="text-muted-foreground">/5</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {review.goals_achieved}% goals achieved
                            </p>
                          </div>
                        </div>
                        {review.feedback && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {review.feedback}
                          </p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performers">
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-secondary/30">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {analytics?.top_performers.length === 0 ? (
                  <div className="text-center py-16">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No performance data yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {analytics?.top_performers.map((performer, index) => (
                      <motion.div
                        key={performer.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-primary'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{performer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Average Score: {performer.avg_score.toFixed(2)}/5
                            </p>
                          </div>
                        </div>
                        {index === 0 && <Trophy className="w-6 h-6 text-amber-500" />}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
