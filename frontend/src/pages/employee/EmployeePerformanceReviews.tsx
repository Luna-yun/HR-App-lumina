import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { performanceAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  BarChart3, Star, Target, TrendingUp, Award, 
  Calendar, User, MessageSquare, Loader2, ChevronRight, Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PerformanceReview {
  id: string;
  employee_id: string;
  employee_name: string;
  reviewer_id: string;
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

const scoreLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Needs Improvement', color: 'text-red-500' },
  2: { label: 'Below Average', color: 'text-orange-500' },
  3: { label: 'Meets Expectations', color: 'text-blue-500' },
  4: { label: 'Exceeds Expectations', color: 'text-green-500' },
  5: { label: 'Outstanding', color: 'text-emerald-500' },
};

function getScoreLabel(score: number) {
  const rounded = Math.round(score);
  return scoreLabels[rounded] || scoreLabels[3];
}

export default function EmployeePerformanceReviews() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await performanceAPI.getMyReviews();
      setReviews(data.reviews || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch performance reviews', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate averages
  const avgScore = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.overall_score, 0) / reviews.length 
    : 0;
  const avgGoals = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.goals_achieved, 0) / reviews.length 
    : 0;

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
            <p className="text-muted-foreground">Loading your reviews...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            My Performance Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            View your performance evaluations and feedback from your managers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500" />
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <Star className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {avgScore > 0 ? avgScore.toFixed(1) : '--'}
                    </p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/10">
                    <Target className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">
                      {avgGoals > 0 ? `${Math.round(avgGoals)}%` : '--'}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Goals Achieved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/10">
                    <Award className="w-6 h-6 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{reviews.length}</p>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Reviews List */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-secondary/30">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Review History
            </CardTitle>
            <CardDescription>
              Click on a review to see detailed feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">No Reviews Yet</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  Your performance reviews will appear here once your manager completes them.
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[500px]">
                <div className="divide-y">
                  {reviews.map((review, index) => {
                    const scoreInfo = getScoreLabel(review.overall_score);
                    
                    return (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedReview(review)}
                        className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer group"
                        data-testid={`review-item-${review.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
                                <Star className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">
                                  {review.review_period}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                  <User className="w-3 h-3" />
                                  <span>Reviewed by {review.reviewer_name}</span>
                                  <span>•</span>
                                  <Calendar className="w-3 h-3" />
                                  <span>{format(new Date(review.created_at), 'MMM d, yyyy')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="font-bold text-lg">{review.overall_score.toFixed(1)}</span>
                                <span className="text-muted-foreground">/5</span>
                              </div>
                              <p className={`text-xs font-medium ${scoreInfo.color}`}>
                                {scoreInfo.label}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>

                        {/* Progress indicators */}
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Goals</span>
                              <span className="font-medium">{review.goals_achieved}%</span>
                            </div>
                            <Progress value={review.goals_achieved} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Quality</span>
                              <span className="font-medium">{review.quality_score}/5</span>
                            </div>
                            <Progress value={review.quality_score * 20} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Productivity</span>
                              <span className="font-medium">{review.productivity_score}/5</span>
                            </div>
                            <Progress value={review.productivity_score * 20} className="h-1.5" />
                          </div>
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Teamwork</span>
                              <span className="font-medium">{review.teamwork_score}/5</span>
                            </div>
                            <Progress value={review.teamwork_score * 20} className="h-1.5" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Performance Review - {selectedReview?.review_period}
            </DialogTitle>
            <DialogDescription>
              Reviewed by {selectedReview?.reviewer_name} on{' '}
              {selectedReview && format(new Date(selectedReview.created_at), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="flex items-center justify-center p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                    <span className="text-5xl font-bold text-foreground">
                      {selectedReview.overall_score.toFixed(1)}
                    </span>
                    <span className="text-2xl text-muted-foreground">/5</span>
                  </div>
                  <p className={`text-lg font-medium mt-2 ${getScoreLabel(selectedReview.overall_score).color}`}>
                    {getScoreLabel(selectedReview.overall_score).label}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Score Breakdown</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Goals Achieved', value: selectedReview.goals_achieved, max: 100, suffix: '%' },
                    { label: 'Quality', value: selectedReview.quality_score, max: 5, suffix: '/5' },
                    { label: 'Productivity', value: selectedReview.productivity_score, max: 5, suffix: '/5' },
                    { label: 'Teamwork', value: selectedReview.teamwork_score, max: 5, suffix: '/5' },
                    { label: 'Communication', value: selectedReview.communication_score, max: 5, suffix: '/5' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium">
                          {item.value}{item.suffix}
                        </span>
                      </div>
                      <Progress 
                        value={(item.value / item.max) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              {selectedReview.feedback && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Overall Feedback
                  </h4>
                  <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                    {selectedReview.feedback}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {selectedReview.strengths && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Strengths
                  </h4>
                  <p className="text-muted-foreground bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {selectedReview.strengths}
                  </p>
                </div>
              )}

              {/* Areas for Improvement */}
              {selectedReview.areas_for_improvement && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-500" />
                    Areas for Improvement
                  </h4>
                  <p className="text-muted-foreground bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    {selectedReview.areas_for_improvement}
                  </p>
                </div>
              )}

              {/* Goals for Next Period */}
              {selectedReview.goals_for_next_period && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    Goals for Next Period
                  </h4>
                  <p className="text-muted-foreground bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-200 dark:border-violet-800">
                    {selectedReview.goals_for_next_period}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
