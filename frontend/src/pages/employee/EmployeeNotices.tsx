import React, { useState, useEffect } from 'react';
import { noticeAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Notice } from '@/types';

export default function EmployeeNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await noticeAPI.getNotices();
        setNotices(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch notices', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Notices</h1>
          <p className="text-muted-foreground">Stay updated with company announcements</p>
        </div>

        {notices.length === 0 ? (
          <Card><CardContent className="py-20 text-center text-muted-foreground"><Bell className="w-16 h-16 mx-auto mb-4 opacity-30" /><h3 className="text-lg font-semibold text-foreground">No Notices</h3><p className="mt-2">There are no notices at the moment.</p></CardContent></Card>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <Card key={notice.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">By {notice.publisher_name} • {format(new Date(notice.created_at), 'MMMM d, yyyy')}</p>
                      <p className="mt-4 text-foreground/80 whitespace-pre-wrap">{notice.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
