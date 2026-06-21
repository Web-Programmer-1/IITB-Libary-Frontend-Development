'use client';

import { useState } from 'react';
import { BookOpen, History, ArrowUpDown, Calendar, Pencil, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';
import { useMyIssues, useIssueHistory, useBooks, useUsers } from '@/apis/queries';
import { useIssueBook, useReturnBook, useUpdateIssueDueDate } from '@/apis/mutations';
import api from '@/apis/apis';
import { ENDPOINTS } from '@/apis/endpoints';
import { queryKeys } from '@/apis/keys';
import { getEstimatedFine, getOverdueDays, OVERDUE_FINE_PER_DAY } from '@/lib/fines';
import type { TriggerOverdueResponse } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export default function CirculationPage() {
  const [activeTab, setActiveTab] = useState<'my-issues' | 'issue' | 'history'>(
    'my-issues',
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">Circulation</h1>
        <p className="mt-2 text-slate-500">
          Issue, return, and track books
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
        <div className="flex gap-2">
          {[
            { key: 'my-issues' as const, label: 'My Issues', icon: BookOpen },
            { key: 'issue' as const, label: 'Issue Book', icon: ArrowUpDown },
            { key: 'history' as const, label: 'History', icon: History },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white/10 text-white'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <TriggerOverdueButton />
      </div>

      {activeTab === 'my-issues' && <MyIssuesTab />}
      {activeTab === 'issue' && <IssueBookTab onSuccess={() => setActiveTab('history')} />}
      {activeTab === 'history' && <HistoryTab />}
    </div>
  );
}

function TriggerOverdueButton() {
  const queryClient = useQueryClient();
  const [isTriggering, setIsTriggering] = useState(false);

  const handleTrigger = async () => {
    setIsTriggering(true);
    try {
      const { data } = await api.post<TriggerOverdueResponse>(
        ENDPOINTS.CIRCULATION.TRIGGER_OVERDUE,
        undefined,
        {
          params: { forceEmail: true },
        },
      );

      if (data.checked === 0) {
        toast(
          data.nextDueDate
            ? `No overdue issue yet. Next due date: ${data.nextDueDate}.`
            : 'No active issue found to process.',
          {
            icon: 'ℹ️',
          },
        );
      } else if (data.emailFailures > 0) {
        toast.error(data.message);
      } else {
        toast.success(
          `Updated ${data.processed} overdue fine(s), sent ${data.emailsSent} email(s).`,
        );
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.circulation.myIssues });
      queryClient.invalidateQueries({ queryKey: queryKeys.circulation.history });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.shared });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.mine });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to trigger overdue checks');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleTrigger}
      isLoading={isTriggering}
      className="text-xs border border-red-500/30 hover:border-red-500/60 bg-red-500/10 hover:bg-red-500/20 text-red-400"
    >
      Trigger Overdue Checks (Dev)
    </Button>
  );
}

function MyIssuesTab() {
  const { data: issues, isLoading } = useMyIssues();
  const returnMutation = useReturnBook();

  const handleReturn = (id: string) => {
    returnMutation.mutate(id, {
      onSuccess: () => toast.success('Book returned!'),
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || 'Return failed'),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-slate-600" />
        <p className="text-slate-500">No active issues. You&apos;re all caught up!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const isOverdue = new Date(issue.dueDate) < new Date();
        const overdueDays = isOverdue ? getOverdueDays(issue.dueDate) : 0;
        const estimatedFine = isOverdue ? getEstimatedFine(issue.dueDate) : 0;
        const recordedFine = Number(issue.fineAmount) || 0;
        const displayFine = Math.max(recordedFine, estimatedFine);

        return (
          <Card key={issue.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900/80">
                  {issue.book?.bookImage &&
                  issue.book.bookImage !== 'https://example.com/book.jpg' ? (
                    <img
                      src={issue.book.bookImage}
                      alt={issue.book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-4 w-4 text-slate-600" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {issue.book?.title ?? 'Unknown'}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(issue.dueDate).toLocaleDateString()}
                    </span>
                    {isOverdue && <Badge variant="danger">Overdue</Badge>}
                    {overdueDays > 0 && (
                      <span className="text-amber-300">
                        {overdueDays} day(s) late
                      </span>
                    )}
                    {displayFine > 0 && (
                      <span className="text-red-400 font-semibold flex items-center gap-1">
                        Fine: ৳{displayFine} (৳{OVERDUE_FINE_PER_DAY}/day)
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleReturn(issue.id)}
                isLoading={returnMutation.isPending}
              >
                Return
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface IssueBookTabProps {
  onSuccess: () => void;
}

function IssueBookTab({ onSuccess }: IssueBookTabProps) {
  const issueMutation = useIssueBook();
  const { data: books, isLoading: isLoadingBooks } = useBooks({ limit: 100 });
  const { data: users, isLoading: isLoadingUsers } = useUsers();

  const today = new Date().toISOString().split('T')[0];
  const fourteenDaysLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    bookId: '',
    userId: '',
    issueDate: today,
    dueDate: fourteenDaysLater,
  });

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookId || !form.userId) {
      toast.error('Please fill in all fields');
      return;
    }

    issueMutation.mutate(form, {
      onSuccess: () => {
        toast.success('Book issued successfully!');
        setForm({
          bookId: '',
          userId: '',
          issueDate: today,
          dueDate: fourteenDaysLater,
        });
        onSuccess();
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.message || 'Issue failed'),
    });
  };

  return (
    <Card className="max-w-lg p-6">
      <h3 className="mb-4 text-lg font-semibold text-white">Issue a Book</h3>
      <form onSubmit={handleIssue} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Select Book *
          </label>
          <select
            value={form.bookId}
            onChange={(e) => setForm({ ...form, bookId: e.target.value })}
            required
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
          >
            <option value="" disabled className="bg-[var(--bg-secondary)]">
              {isLoadingBooks ? 'Loading books...' : 'Select a book'}
            </option>
            {books?.map((book) => (
              <option key={book.id} value={book.id} className="bg-[var(--bg-secondary)]">
                {book.title} ({book.author}) - {book.availableCopies} available
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-secondary)]">
            Select User *
          </label>
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
          >
            <option value="" disabled className="bg-[var(--bg-secondary)]">
              {isLoadingUsers ? 'Loading users...' : 'Select a user'}
            </option>
            {users?.map((u: any) => (
              <option key={u.id} value={u.id} className="bg-[var(--bg-secondary)]">
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Issue Date"
            type="date"
            value={form.issueDate}
            onChange={(e) => setForm({ ...form, issueDate: e.target.value })}
            required
          />
          <Input
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            required
          />
        </div>

        <Button type="submit" isLoading={issueMutation.isPending} className="w-full mt-2">
          Issue Book
        </Button>
      </form>
    </Card>
  );
}

function HistoryTab() {
  const { data: history, isLoading } = useIssueHistory();
  const updateDueDateMutation = useUpdateIssueDueDate();
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editingDueDate, setEditingDueDate] = useState('');

  const startEditingDueDate = (issueId: string, dueDate: string) => {
    setEditingIssueId(issueId);
    setEditingDueDate(new Date(dueDate).toISOString().split('T')[0]);
  };

  const cancelEditingDueDate = () => {
    setEditingIssueId(null);
    setEditingDueDate('');
  };

  const saveDueDate = (issueId: string) => {
    if (!editingDueDate) {
      toast.error('Please select a due date');
      return;
    }

    updateDueDateMutation.mutate(
      {
        issueId,
        dueDate: editingDueDate,
      },
      {
        onSuccess: () => {
          toast.success('Due date updated and fine recalculated.');
          cancelEditingDueDate();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || 'Failed to update due date',
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-500">No issue history found.</p>
      </Card>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Book
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Issue Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Due
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {history.map((item) => {
              const isOverdue =
                !item.isReturned && new Date(item.dueDate) < new Date();
              const isEditing = editingIssueId === item.id;
              const statusVariant = item.isReturned
                ? 'success'
                : isOverdue
                  ? 'danger'
                  : 'warning';
              const statusLabel = item.isReturned
                ? 'Returned'
                : isOverdue
                  ? 'Overdue'
                  : 'Active';

              return (
                <tr key={item.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-slate-900/80">
                        {item.book?.bookImage &&
                        item.book.bookImage !== 'https://example.com/book.jpg' ? (
                          <img
                            src={item.book.bookImage}
                            alt={item.book.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-4 w-4 text-slate-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.book?.title ?? '—'}
                        </p>
                        {item.book?.author && (
                          <p className="text-xs text-slate-500">
                            {item.book.author}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {item.user?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {new Date(item.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="date"
                          value={editingDueDate}
                          onChange={(e) => setEditingDueDate(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => saveDueDate(item.id)}
                            isLoading={updateDueDateMutation.isPending}
                            icon={<Check className="h-3.5 w-3.5" />}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditingDueDate}
                            icon={<X className="h-3.5 w-3.5" />}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p>{new Date(item.dueDate).toLocaleDateString()}</p>
                        {isOverdue && (
                          <p className="text-xs text-red-400">
                            {getOverdueDays(item.dueDate)} day(s) late
                          </p>
                        )}
                        {!item.isReturned && (
                          <button
                            type="button"
                            onClick={() => startEditingDueDate(item.id, item.dueDate)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300 transition-colors hover:text-emerald-200"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit due date
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
