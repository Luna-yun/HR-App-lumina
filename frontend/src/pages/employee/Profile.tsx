import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Building2, 
  MapPin, 
  Calendar,
  Briefcase,
  Save,
  Loader2,
  Shield,
  Edit3
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EmployeeProfile() {
  const { userProfile, updateProfile, updatePassword } = useAuth();
  const { employee, currentSalary, isLoading } = useEmployeeData();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    fullName: userProfile?.fullName || "",
    email: userProfile?.email || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    setIsSaving(true);
    const { error } = await updateProfile({
      fullName: editForm.fullName,
      companyName: userProfile?.companyName || "",
      country: userProfile?.country || "",
    });

    setIsSaving(false);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    const { error } = await updatePassword(
      passwordForm.currentPassword,
      passwordForm.newPassword
    );

    setIsChangingPassword(false);

    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully!");
      setIsPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">View and manage your personal information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="card-elevated p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-primary">
                  {userProfile?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-center">{userProfile?.fullName || 'User'}</h2>
              <p className="text-sm text-muted-foreground">{employee?.job_title || 'Employee'}</p>
              <span className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                {employee?.employment_status || 'Active'}
              </span>
            </div>

            {/* Quick Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{userProfile?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{userProfile?.companyName}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{userProfile?.country}</span>
              </div>
              {employee?.hire_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Joined {format(new Date(employee.hire_date), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 pt-6 border-t border-border space-y-2">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
              
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full gap-2">
                    <Shield className="w-4 h-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      />
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="w-full"
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Details Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Information
              </h3>
              {!isEditing && (
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={editForm.fullName}
                      onChange={(e) => setEditForm(f => ({ ...f, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Full Name</p>
                  <p className="font-medium">{userProfile?.fullName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Email</p>
                  <p className="font-medium">{userProfile?.email || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Company</p>
                  <p className="font-medium">{userProfile?.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Country</p>
                  <p className="font-medium">{userProfile?.country || '-'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Employment Information */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <Briefcase className="w-5 h-5 text-primary" />
              Employment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Employee ID</p>
                <p className="font-medium font-mono">{employee?.employee_code || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Job Title</p>
                <p className="font-medium">{employee?.job_title || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Department</p>
                <p className="font-medium">{employee?.department?.name || 'Not Assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Employment Type</p>
                <p className="font-medium capitalize">{employee?.employment_type || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Start Date</p>
                <p className="font-medium">
                  {employee?.hire_date ? format(new Date(employee.hire_date), "MMMM d, yyyy") : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 capitalize">
                  {employee?.employment_status || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* Salary Information (Read-Only) */}
          <div className="card-elevated p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
              <span className="text-primary">$</span>
              Compensation
            </h3>

            {currentSalary ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Base Salary</p>
                  <p className="text-2xl font-bold text-primary">
                    {currentSalary.currency || '$'}{Number(currentSalary.base_salary).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pay Period</p>
                  <p className="font-medium capitalize">{currentSalary.pay_period || 'Monthly'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Effective From</p>
                  <p className="font-medium">
                    {format(new Date(currentSalary.effective_date), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Salary information not yet published</p>
                <p className="text-sm text-muted-foreground mt-1">Contact HR for more information</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
