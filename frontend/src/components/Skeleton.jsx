import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="glass-card p-6 space-y-4 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-1/4 mb-6"></div>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-slate-100 rounded-xl flex items-end justify-between p-4">
        <div className="w-12 bg-slate-200 rounded-t h-1/3"></div>
        <div className="w-12 bg-slate-200 rounded-t h-1/2"></div>
        <div className="w-12 bg-slate-200 rounded-t h-3/4"></div>
        <div className="w-12 bg-slate-200 rounded-t h-2/3"></div>
        <div className="w-12 bg-slate-200 rounded-t h-5/6"></div>
      </div>
    </div>
  );
}
