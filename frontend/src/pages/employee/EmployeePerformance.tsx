import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { performanceAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Award, Star, TrendingUp, Target, MessageSquare, 
  Calendar, User, ChevronRight, Sparkles, Trophy
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

const ScoreBar = ({ label, score, maxScore = 5 }: { label: string; score: number; maxScore?: number }) => {
  const percentage = (score / maxScore) * 100;
  const color = percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-blue-500' : percentage >= 40 ? 'bg-amber-500' : 'bg-red-500';
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{score}/{maxScore}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );
};

const getOverallScoreColor = (score: number) => {
  if (score >= 4) return 'text-green-600 bg-green-100';
  if (score >= 3) return 'text-blue-600 bg-blue-100';
  if (score >= 2) return 'text-amber-600 bg-amber-100';
  return 'text-red-600 bg-red-100';
};

const getOverallScoreLabel = (score: number) => {
  if (score >= 4.5) return 'Exceptional';
  if (score >= 4) return 'Excellent';
  if (score >= 3.5) return 'Very Good';
  if (score >= 3) return 'Good';
  if (score >= 2.5) return 'Satisfactory';
  if (score >= 2) return 'Needs Improvement';
  return 'Below Expectations';
};

export default function EmployeePerformance() {
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
  const avgOverallScore = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.overall_score, 0) / reviews.length 
    : 0;
  const avgGoalsAchieved = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.goals_achieved, 0) / reviews.length
    : 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
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
            <Award className="w-7 h-7 text-primary" />
            My Performance
          </h1>
          <p className="text-muted-foreground mt-1">
            View your performance reviews and feedback
          </p>
        </div>

        {/* Summary Cards */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/20">
                    <Trophy className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-foreground">{avgOverallScore.toFixed(1)}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Goals Achievement</p>
                    <p className="text-2xl font-bold text-foreground">{avgGoalsAchieved.toFixed(0)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold text-foreground">{reviews.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reviews List */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-lg">Performance Reviews</CardTitle>
            <CardDescription>Your historical performance evaluations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Award className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No Reviews Yet</h3>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  Your performance reviews will appear here once your manager completes an evaluation.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReview(review)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${getOverallScoreColor(review.overall_score)}`}>
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{review.review_period}</h4>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              Reviewed by {review.reviewer_name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(review.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">{review.overall_score.toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">{getOverallScoreLabel(review.overall_score)}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  {selectedReview.review_period} Review
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Overall Score */}
                <div className={`p-6 rounded-xl ${getOverallScoreColor(selectedReview.overall_score)} text-center`}>
                  <Sparkles className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-4xl font-bold">{selectedReview.overall_score.toFixed(1)}/5</p>
                  <p className="text-lg font-medium mt-1">{getOverallScoreLabel(selectedReview.overall_score)}</p>
                  <p className="text-sm mt-2 opacity-75">Goals Achieved: {selectedReview.goals_achieved}%</p>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Performance Breakdown</h4>
                  <div className="space-y-3">
                    <ScoreBar label="Quality of Work" score={selectedReview.quality_score} />
                    <ScoreBar label="Productivity" score={selectedReview.productivity_score} />
                    <ScoreBar label="Teamwork" score={selectedReview.teamwork_score} />
                    <ScoreBar label="Communication" score={selectedReview.communication_score} />
                  </div>
                </div>

                {/* Feedback Sections */}
                {selectedReview.feedback && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Overall Feedback
                    </h4>
                    <p className="text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                      {selectedReview.feedback}
                    </p>
                  </div>
                )}

                {selectedReview.strengths && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Strengths
                    </h4>
                    <p className="text-muted-foreground bg-green-50 p-4 rounded-lg border border-green-200">
                      {selectedReview.strengths}
                    </p>
                  </div>
                )}

                {selectedReview.areas_for_improvement && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-amber-600 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Areas for Improvement
                    </h4>
                    <p className="text-muted-foreground bg-amber-50 p-4 rounded-lg border border-amber-200">
                      {selectedReview.areas_for_improvement}
                    </p>
                  </div>
                )}

                {selectedReview.goals_for_next_period && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Goals for Next Period
                    </h4>
                    <p className="text-muted-foreground bg-blue-50 p-4 rounded-lg border border-blue-200">
                      {selectedReview.goals_for_next_period}
                    </p>
                  </div>
                )}

                {/* Reviewer Info */}
                <div className="text-sm text-muted-foreground text-center pt-4 border-t">
                  Reviewed by <span className="font-medium">{selectedReview.reviewer_name}</span> on{' '}
                  {format(new Date(selectedReview.created_at), 'MMMM d, yyyy')}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
