import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { departmentAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Building2, Plus, Edit, Trash2, Users, Sparkles, FolderTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Department } from '@/types';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentAPI.getDepartments();
      setDepartments(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch departments', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter a department name', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (editId) {
        await departmentAPI.updateDepartment(editId, formData);
        toast({ title: 'Success', description: 'Department updated successfully' });
      } else {
        await departmentAPI.createDepartment(formData);
        toast({ title: 'Success', description: 'Department created successfully' });
      }
      handleDialogClose();
      fetchDepartments();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save department', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? Employees will be reassigned to Unassigned.')) return;
    try {
      await departmentAPI.deleteDepartment(id);
      toast({ title: 'Success', description: 'Department deleted' });
      fetchDepartments();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete department', variant: 'destructive' });
    }
  };

  const openEdit = (dept: Department) => {
    setFormData({ name: dept.name, description: dept.description });
    setEditId(dept.id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({ name: '', description: '' });
    setEditId(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      handleDialogClose();
    } else {
      setIsDialogOpen(true);
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
              <Building2 className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-muted-foreground">Loading departments...</p>
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
              <FolderTree className="w-6 h-6 text-primary" />
              Departments
            </h1>
            <p className="text-muted-foreground">Organize your company structure</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {editId ? 'Edit Department' : 'Create Department'}
                </DialogTitle>
                <DialogDescription>
                  {editId 
                    ? 'Update the department details below.'
                    : 'Add a new department to organize your team structure.'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Department Name
                  </Label>
                  <Input 
                    id="name"
                    value={formData.name} 
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} 
                    required 
                    placeholder="e.g., Engineering, Marketing, Sales..."
                    className="h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea 
                    id="description"
                    rows={3}
                    value={formData.description} 
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} 
                    placeholder="Brief description of this department's responsibilities..."
                    className="resize-none"
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDialogClose}
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
                        {editId ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editId ? 'Update Department' : 'Create Department'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                  {/* Accent line */}
                  <div className="h-1 bg-gradient-to-r from-primary via-violet-500 to-primary" />
                  
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      
                      {dept.id !== 'unassigned' && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => openEdit(dept)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDelete(dept.id)}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {dept.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      <span>
                        <span className="font-semibold text-foreground">{dept.employee_count}</span> employees
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {departments.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No departments yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first department to organize your team
              </p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Department
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
