import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { noticeAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Bell, Plus, Edit, Trash2, Calendar, User, Megaphone, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Notice } from '@/types';

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    try {
      const data = await noticeAPI.getAllNotices();
      setNotices(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch notices', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) {
        await noticeAPI.updateNotice(editId, formData);
        toast({ title: 'Success', description: 'Notice updated successfully' });
      } else {
        await noticeAPI.createNotice(formData);
        toast({ title: 'Success', description: 'Notice published successfully' });
      }
      setIsDialogOpen(false);
      setFormData({ title: '', content: '' });
      setEditId(null);
      fetchNotices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save notice', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await noticeAPI.deleteNotice(id);
      toast({ title: 'Success', description: 'Notice deleted' });
      fetchNotices();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete notice', variant: 'destructive' });
    }
  };

  const openEdit = (notice: Notice) => {
    setFormData({ title: notice.title, content: notice.content });
    setEditId(notice.id);
    setIsDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData({ title: '', content: '' });
      setEditId(null);
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
              <Bell className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading notices...</p>
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
              <Megaphone className="w-6 h-6 text-primary" />
              Notices
            </h1>
            <p className="text-muted-foreground">Create and manage company announcements</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {editId ? 'Edit Notice' : 'Create New Notice'}
                </DialogTitle>
                <DialogDescription>
                  {editId 
                    ? 'Update the notice content below. Changes will be visible immediately.'
                    : 'Create a new announcement for your team. Use formatting to make it stand out.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Notice Title
                  </Label>
                  <Input 
                    id="title"
                    value={formData.title} 
                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} 
                    required 
                    placeholder="Enter a compelling title..."
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Content
                  </Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(p => ({ ...p, content }))}
                    placeholder="Write your announcement here. Use the toolbar to format text..."
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleDialogOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        {editId ? 'Updating...' : 'Publishing...'}
                      </>
                    ) : (
                      <>
                        {editId ? 'Update Notice' : 'Publish Notice'}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notices List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="border-dashed">
                  <CardContent className="py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No notices yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first announcement to keep your team informed
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Create Notice
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                    {/* Accent line */}
                    <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-primary" />
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                            {notice.title}
                          </h3>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              {notice.publisher_name}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {format(new Date(notice.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          
                          {/* Rich text content display */}
                          <div 
                            className="prose prose-sm dark:prose-invert max-w-none text-foreground/80"
                            dangerouslySetInnerHTML={{ __html: notice.content }}
                          />
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => openEdit(notice)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(notice.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
