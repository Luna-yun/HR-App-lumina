import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { taskAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ListTodo, Clock, CheckCircle, AlertCircle, PlayCircle,
  Calendar, User, MessageSquare, Loader2, Filter, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assigned_to_name: string;
  assigned_by: string;
  assigned_by_name: string;
  status: string;
  priority: string;
  category: string;
  due_date?: string;
  completed_at?: string;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600', icon: Clock, bgColor: 'bg-amber-100' },
  in_progress: { label: 'In Progress', color: 'text-blue-600', icon: PlayCircle, bgColor: 'bg-blue-100' },
  completed: { label: 'Completed', color: 'text-green-600', icon: CheckCircle, bgColor: 'bg-green-100' },
  cancelled: { label: 'Cancelled', color: 'text-slate-600', icon: AlertCircle, bgColor: 'bg-slate-100' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-700' },
  medium: { label: 'Medium', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'Urgent', color: 'bg-red-100 text-red-700' },
};

export default function EmployeeTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskAPI.getMyTasks();
      setTasks(data.tasks || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch tasks', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTask || !newStatus) return;
    
    setIsUpdating(true);
    try {
      await taskAPI.updateTask(selectedTask.id, { 
        status: newStatus,
        notes: statusNote 
      });
      
      toast({ 
        title: 'Task Updated', 
        description: `Task status changed to ${statusConfig[newStatus]?.label || newStatus}` 
      });
      
      // Update local state
      setTasks(tasks.map(t => 
        t.id === selectedTask.id 
          ? { ...t, status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : t.completed_at }
          : t
      ));
      
      setUpdateDialog(false);
      setSelectedTask(null);
      setNewStatus('');
      setStatusNote('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update task', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const openUpdateDialog = (task: Task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setStatusNote('');
    setUpdateDialog(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ListTodo className="w-7 h-7 text-primary" />
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              View and update tasks assigned to you
            </p>
          </div>
          <Button variant="outline" onClick={fetchTasks} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'all', label: 'Total Tasks', icon: ListTodo, color: 'bg-violet-100 text-violet-600' },
            { key: 'pending', label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-600' },
            { key: 'in_progress', label: 'In Progress', icon: PlayCircle, color: 'bg-blue-100 text-blue-600' },
            { key: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          ].map((stat) => (
            <Card 
              key={stat.key} 
              className={`cursor-pointer transition-all ${activeTab === stat.key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setActiveTab(stat.key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{taskCounts[stat.key as keyof typeof taskCounts]}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tasks List */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {activeTab === 'all' ? 'All Tasks' : statusConfig[activeTab]?.label || 'Tasks'}
              </CardTitle>
              <Badge variant="secondary">{filteredTasks.length} task(s)</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ListTodo className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No Tasks</h3>
                <p className="text-muted-foreground mt-1">
                  {activeTab === 'all' 
                    ? "You don't have any tasks assigned yet." 
                    : `No ${statusConfig[activeTab]?.label.toLowerCase()} tasks.`}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredTasks.map((task, index) => {
                  const status = statusConfig[task.status] || statusConfig.pending;
                  const priority = priorityConfig[task.priority] || priorityConfig.medium;
                  const StatusIcon = status.icon;
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Task Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${status.bgColor} shrink-0`}>
                              <StatusIcon className={`w-4 h-4 ${status.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate">{task.title}</h4>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Assigned by {task.assigned_by_name}
                                </span>
                                {task.due_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(new Date(task.created_at), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Badges & Actions */}
                        <div className="flex items-center gap-2 lg:flex-shrink-0">
                          <Badge className={priority.color}>{priority.label}</Badge>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => openUpdateDialog(task)}
                            disabled={task.status === 'cancelled'}
                          >
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Status Dialog */}
      <Dialog open={updateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Task Status</DialogTitle>
            <DialogDescription>
              {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="in_progress">
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-blue-500" />
                      In Progress
                    </span>
                  </SelectItem>
                  <SelectItem value="completed">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Completed
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Add a Note (Optional)</label>
              <Textarea
                placeholder="Add any comments or updates about this task..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating || !newStatus}>
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
