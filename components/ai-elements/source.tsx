'use client';

import { BookIcon, ChevronDownIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

export type SourcesProps = ComponentProps<'div'>;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn('not-prose mb-4 bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-indigo-900/60 backdrop-blur-xl rounded-xl border border-slate-600/50 shadow-lg overflow-hidden', className)}
    {...props}
  />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className="w-full flex items-center justify-between px-2 py-1 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 transition-all duration-200 text-white border-b border-slate-600/20"
    {...props}
  >
    {children ?? (
      <div className="flex items-center justify-between w-full">
        <span className="text-xs text-green-200">{count} sources</span>
        <ChevronDownIcon className="size-3 text-green-300 transition-transform duration-200 data-[state=open]:rotate-180" />
      </div>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      'p-2 bg-gradient-to-br from-slate-800/10 to-blue-900/10',
      'outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2',
      className,
    )}
    {...props}
  />
);

export type SourceProps = ComponentProps<'a'>;

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="block text-xs text-blue-300 hover:text-blue-200 transition-colors truncate"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}
  >
    {children ?? new URL(href || '').hostname}
  </a>
);
