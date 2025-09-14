'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getModelById } from '@/lib/models';

interface ModelChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentModel: string;
  newModel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ModelChangeDialog({
  open,
  onOpenChange,
  currentModel,
  newModel,
  onConfirm,
  onCancel,
}: ModelChangeDialogProps) {
  const currentModelData = getModelById(currentModel);
  const newModelData = getModelById(newModel);

  if (!currentModelData || !newModelData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-indigo-900/95 border-slate-600/50 text-white backdrop-blur-xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-white">
              Switch AI Model?
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-300 text-base leading-relaxed">
            Switching from <span className="font-medium text-blue-400">{currentModelData.name}</span> to{' '}
            <span className="font-medium text-blue-400">{newModelData.name}</span> will clear your current conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-600/30">
            <h4 className="font-medium text-blue-300 mb-3">Model Comparison</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="text-slate-400">Current Model</p>
                <p className="font-medium text-white">{currentModelData.name}</p>
                <p className="text-xs text-slate-400">{currentModelData.provider}</p>
              </div>
              <div className="space-y-2">
                <p className="text-slate-400">New Model</p>
                <p className="font-medium text-white">{newModelData.name}</p>
                <p className="text-xs text-slate-400">{newModelData.provider}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-sm text-amber-200 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              Your conversation history will be permanently cleared and cannot be recovered.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-slate-500 italic">
              Powered by Scriptcreator.online
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white"
              >
                Keep Current Model
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg"
              >
                Switch & Clear Chat
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}