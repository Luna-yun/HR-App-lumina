import React, { useState, useEffect } from 'react';
import { salaryAPI } from '@/services/api';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { MySalary } from '@/types';

export default function EmployeeSalary() {
  const [salary, setSalary] = useState<{ has_salary: boolean; salary: MySalary | null }>({ has_salary: false, salary: null });
  const [history, setHistory] = useState<MySalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salaryData, historyData] = await Promise.all([salaryAPI.getMySalary(), salaryAPI.getMyHistory()]);
        setSalary(salaryData);
        setHistory(historyData.records);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch salary data', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" /></div></DashboardLayout>;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Salary</h1>
          <p className="text-muted-foreground">View your salary information</p>
        </div>

        {!salary.has_salary ? (
          <Card><CardContent className="py-20 text-center text-muted-foreground"><DollarSign className="w-16 h-16 mx-auto mb-4 opacity-30" /><h3 className="text-lg font-semibold text-foreground">No Salary Record</h3><p className="mt-2">Your salary information will appear here once published by HR.</p></CardContent></Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white"><CardContent className="p-6"><DollarSign className="w-8 h-8 mb-4 opacity-80" /><p className="text-sm opacity-80">Net Salary</p><p className="text-3xl font-bold mt-1">{salary.salary?.currency} {salary.salary?.net_salary?.toLocaleString()}</p><p className="text-sm opacity-80 mt-2">{months[(salary.salary?.month || 1) - 1]} {salary.salary?.year}</p></CardContent></Card>
              <Card><CardContent className="p-6 flex items-center gap-4"><div className="p-3 rounded-xl bg-blue-500/10"><TrendingUp className="w-6 h-6 text-blue-500" /></div><div><p className="text-sm text-muted-foreground">Gross Salary</p><p className="text-2xl font-bold">{salary.salary?.currency} {salary.salary?.gross_salary?.toLocaleString()}</p></div></CardContent></Card>
              <Card><CardContent className="p-6 flex items-center gap-4"><div className="p-3 rounded-xl bg-red-500/10"><Calendar className="w-6 h-6 text-red-500" /></div><div><p className="text-sm text-muted-foreground">Deductions</p><p className="text-2xl font-bold text-red-500">-{salary.salary?.currency} {salary.salary?.deductions?.toLocaleString()}</p></div></CardContent></Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Salary History</CardTitle></CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No salary history available</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((record, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                        <div>
                          <p className="font-medium">{months[record.month - 1]} {record.year}</p>
                          <p className="text-sm text-muted-foreground">Gross: {record.currency} {record.gross_salary.toLocaleString()} | Deductions: {record.currency} {record.deductions.toLocaleString()}</p>
                        </div>
                        <p className="text-lg font-bold text-green-500">{record.currency} {record.net_salary.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
