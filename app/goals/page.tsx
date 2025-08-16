'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ArrowLeft, Edit3, Save, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  targetDate?: string;
  priority: number;
  savedAmount: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; targetAmount: string; targetDate: string; priority: string; savedAmount: string }>({ name: '', targetAmount: '', targetDate: '', priority: '3', savedAmount: '' });

  // form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('3');

  const loadGoals = async () => {
    try {
      const res = await fetch('/api/goals', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setGoals(data.goals || []);
      }
    } catch (e) {
      console.error('Load goals error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGoals(); }, []);

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, targetAmount, targetDate: targetDate || undefined, priority })
      });
      if (res.ok) {
        setName(''); setTargetAmount(''); setTargetDate(''); setPriority('3');
        await loadGoals();
      }
    } catch (e) { console.error('Add goal error', e); }
  };

  const pct = (g: Goal) => g.targetAmount > 0 ? Math.min(100, (g.savedAmount / g.targetAmount) * 100) : 0;
  const daysLeft = (g: Goal) => g.targetDate ? Math.ceil((new Date(g.targetDate).getTime() - Date.now()) / (1000*60*60*24)) : undefined;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addGoal} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Emergency fund" />
            </div>
            <div>
              <Label>Target Amount (₹)</Label>
              <Input type="number" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} placeholder="50000" />
            </div>
            <div>
              <Label>Target Date</Label>
              <Input type="date" value={targetDate} onChange={e=>setTargetDate(e.target.value)} />
            </div>
            <div>
              <Label>Priority (1-5)</Label>
              <Input type="number" min={1} max={5} value={priority} onChange={e=>setPriority(e.target.value)} />
            </div>
            <Button type="submit" className="sm:col-span-2 lg:col-span-4">Add Goal</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-slate-500">Loading...</div>
          ) : goals.length === 0 ? (
            <div className="text-slate-500">No goals yet. Add one above.</div>
          ) : (
            <div className="space-y-4">
              {goals.map(g => (
                <div key={g._id} className="p-4 rounded-lg border bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{g.name}</div>
                    <div className="flex items-center space-x-2">
                      {editingId === g._id ? (
                        <>
                          <Button size="sm" className="h-8 px-3" onClick={async () => {
                            const res = await fetch(`/api/goals/${g._id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type':'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({
                                name: editForm.name,
                                targetAmount: editForm.targetAmount,
                                targetDate: editForm.targetDate || undefined,
                                priority: editForm.priority,
                                savedAmount: editForm.savedAmount,
                              })
                            });
                            if (res.ok) { setEditingId(null); await loadGoals(); }
                          }}>
                            <Save className="w-4 h-4 mr-1"/> Save
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 px-3" onClick={()=>setEditingId(null)}>
                            <X className="w-4 h-4 mr-1"/> Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="text-sm text-slate-600">Target: ₹{g.targetAmount.toLocaleString()}</div>
                          <Button size="sm" variant="outline" className="h-8 px-3" onClick={() => {
                            setEditingId(g._id);
                            setEditForm({
                              name: g.name,
                              targetAmount: String(g.targetAmount),
                              targetDate: g.targetDate ? g.targetDate.slice(0,10) : '',
                              priority: String(g.priority),
                              savedAmount: String(g.savedAmount),
                            });
                          }}>
                            <Edit3 className="w-4 h-4 mr-1"/> Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    {editingId === g._id && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
                        <Input value={editForm.name} onChange={e=>setEditForm({...editForm, name: e.target.value})} placeholder="Name" />
                        <Input type="number" value={editForm.targetAmount} onChange={e=>setEditForm({...editForm, targetAmount: e.target.value})} placeholder="Target Amount" />
                        <Input type="date" value={editForm.targetDate} onChange={e=>setEditForm({...editForm, targetDate: e.target.value})} />
                        <Input type="number" min={1} max={5} value={editForm.priority} onChange={e=>setEditForm({...editForm, priority: e.target.value})} placeholder="Priority" />
                        <Input type="number" value={editForm.savedAmount} onChange={e=>setEditForm({...editForm, savedAmount: e.target.value})} placeholder="Saved" />
                      </div>
                    )}

                    <Progress value={pct(g)} />
                    <div className="text-sm text-slate-600 mt-1">
                      Saved: ₹{g.savedAmount.toLocaleString()} ({pct(g).toFixed(0)}%)
                      {g.targetDate && (
                        <span className="ml-2">• {daysLeft(g)} days left</span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Priority: {g.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

