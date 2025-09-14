'use client';

import * as React from 'react';
import { useState, useMemo } from 'react';
import { Check, ChevronDown, Search, Star, Zap, Clock, Grid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allModels, providers, categories, getPopularModels, getModelsByCategory, type AIModel } from '@/lib/models';

interface ModelSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

const speedIcons = {
  fast: <Zap className="h-3 w-3 text-green-500" />,
  medium: <Clock className="h-3 w-3 text-yellow-500" />,
  slow: <Clock className="h-3 w-3 text-red-500" />,
};

const categoryColors = {
  chat: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  coding: 'bg-green-500/20 text-green-300 border-green-400/30',
  reasoning: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  multimodal: 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  embedding: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
};

const providerColors = {
  'OpenAI': 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  'Anthropic': 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  'Google': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  'Meta': 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  'Mistral': 'bg-red-500/20 text-red-300 border-red-400/30',
  'DeepSeek': 'bg-violet-500/20 text-violet-300 border-violet-400/30',
  'Alibaba': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
  'Perplexity': 'bg-teal-500/20 text-teal-300 border-teal-400/30',
  'Cohere': 'bg-pink-500/20 text-pink-300 border-pink-400/30',
  'Together': 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
  'Fireworks': 'bg-rose-500/20 text-rose-300 border-rose-400/30',
  'Inflection': 'bg-lime-500/20 text-lime-300 border-lime-400/30',
  'x.ai': 'bg-slate-500/20 text-slate-300 border-slate-400/30',
};

function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  if (price < 0.001) return `$${(price * 1000).toFixed(4)}/1M`;
  return `$${price.toFixed(3)}/1K`;
}

function ModelCard({ model, isSelected, onSelect }: { model: AIModel; isSelected: boolean; onSelect: () => void }) {
  const providerColor = providerColors[model.provider as keyof typeof providerColors] || providerColors['x.ai'];

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 group relative overflow-hidden h-full',
        'bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl',
        'border hover:shadow-lg',
        isSelected
          ? 'border-blue-400 bg-gradient-to-br from-blue-600/15 via-slate-800/70 to-indigo-600/15 shadow-blue-500/20'
          : 'border-slate-600/50 hover:border-blue-400/60 hover:shadow-blue-500/10'
      )}
      onClick={onSelect}
    >
      {/* Popular badge */}
      {model.popular && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-2 py-1 shadow-md">
            <Star className="h-3 w-3 inline mr-1" />
            Popular
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="space-y-3">
          {/* Provider and category */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={cn('text-xs font-medium px-2 py-1', providerColor)}>
              {model.provider}
            </Badge>
            <Badge variant="outline" className={cn('text-xs px-2 py-1', categoryColors[model.category])}>
              {model.category}
            </Badge>
          </div>

          {/* Model name and speed */}
          <div className="space-y-2">
            <CardTitle className="text-lg font-bold text-white leading-tight">
              {model.name}
            </CardTitle>
            <div className="flex items-center gap-1">
              {speedIcons[model.speed]}
              <span className="text-xs text-slate-400 capitalize">{model.speed}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {model.description}
        </p>

        {/* Pricing */}
        <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/30">
          <div className="text-xs text-slate-400 font-medium mb-2">Pricing per 1K tokens</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Input</div>
              <div className="text-green-400 font-semibold">{formatPrice(model.inputPrice)}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400 mb-1">Output</div>
              <div className="text-green-400 font-semibold">{formatPrice(model.outputPrice)}</div>
            </div>
          </div>
        </div>

        {/* Context and features */}
        <div className="space-y-3">
          {/* Context window */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Context Window</span>
            <span className="text-white font-medium">
              {model.contextWindow >= 1000000
                ? `${(model.contextWindow / 1000000).toFixed(1)}M tokens`
                : `${(model.contextWindow / 1000).toFixed(0)}K tokens`
              }
            </span>
          </div>

          {/* Features */}
          <div>
            <div className="text-xs text-slate-400 mb-2">Key Features</div>
            <div className="flex flex-wrap gap-1">
              {model.features.slice(0, 3).map((feature, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-blue-500/15 text-blue-300 border-blue-400/30"
                >
                  {feature}
                </Badge>
              ))}
              {model.features.length > 3 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-slate-600/40 text-slate-300 border-slate-500/40"
                >
                  +{model.features.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModelListItem({ model, isSelected, onSelect }: { model: AIModel; isSelected: boolean; onSelect: () => void }) {
  const providerColor = providerColors[model.provider as keyof typeof providerColors] || providerColors['x.ai'];

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 cursor-pointer rounded-lg transition-all border bg-slate-800/40 hover:bg-slate-800/60 relative',
        isSelected ? 'bg-blue-500/10 border-blue-500 shadow-blue-500/20' : 'border-slate-600/50 hover:border-blue-400/50'
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex-1 space-y-1">
          {/* Model name and indicators */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-white">{model.name}</span>
            {model.popular && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs font-bold px-2">
                <Star className="h-3 w-3 inline mr-1" />
                Popular
              </Badge>
            )}
            <div className="flex items-center gap-1">
              {speedIcons[model.speed]}
              <span className="text-xs text-slate-400 capitalize">{model.speed}</span>
            </div>
          </div>

          {/* Provider, category, and description */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn('text-xs font-medium', providerColor)}>
              {model.provider}
            </Badge>
            <Badge variant="outline" className={cn('text-xs', categoryColors[model.category])}>
              {model.category}
            </Badge>
            <span className="text-xs text-slate-400 truncate max-w-md">{model.description}</span>
          </div>
        </div>

        {/* Pricing and specs */}
        <div className="text-right space-y-1 min-w-0 flex-shrink-0">
          <div className="flex items-center gap-3 text-sm">
            <div className="text-green-400 font-medium">
              <span className="text-xs text-slate-400">In:</span> {formatPrice(model.inputPrice)}
            </div>
            <div className="text-green-400 font-medium">
              <span className="text-xs text-slate-400">Out:</span> {formatPrice(model.outputPrice)}
            </div>
          </div>
          <div className="text-xs text-slate-400">
            {model.contextWindow >= 1000000 ?
              `${(model.contextWindow / 1000000).toFixed(1)}M ctx` :
              `${(model.contextWindow / 1000).toFixed(0)}K ctx`
            }
          </div>
        </div>

        {isSelected && (
          <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

export function ModelSelector({ value, onValueChange, className }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');

  const selectedModel = allModels.find((model) => model.id === value);

  const filteredModels = useMemo(() => {
    let models = allModels;

    // Filter by tab
    if (activeTab === 'popular') {
      models = getPopularModels();
    } else if (activeTab !== 'all') {
      models = getModelsByCategory(activeTab);
    }

    // Filter by provider
    if (selectedProvider !== 'all') {
      models = models.filter(m => m.provider === selectedProvider);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      models = models.filter(m => m.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const lowQuery = searchQuery.toLowerCase();
      models = models.filter(m =>
        m.name.toLowerCase().includes(lowQuery) ||
        m.provider.toLowerCase().includes(lowQuery) ||
        m.features.some(f => f.toLowerCase().includes(lowQuery)) ||
        m.description?.toLowerCase().includes(lowQuery)
      );
    }

    return models;
  }, [activeTab, selectedProvider, selectedCategory, searchQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between min-w-[200px] bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white', className)}
        >
          <div className="flex items-center gap-2">
            {selectedModel ? (
              <>
                <span className="truncate">{selectedModel.name}</span>
                <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200 border-blue-400/30">
                  {selectedModel.provider}
                </Badge>
              </>
            ) : (
              'Select model...'
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[1000px] p-0 bg-gradient-to-br from-slate-800/95 via-blue-900/95 to-indigo-900/95 border-slate-600/50 backdrop-blur-xl"
        align="start"
      >
        <div className="flex flex-col h-[700px]">
          {/* Header */}
          <div className="p-4 border-b border-slate-600/50 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">Select AI Model</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ?
                    'bg-blue-600 hover:bg-blue-700 text-white' :
                    'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ?
                    'bg-blue-600 hover:bg-blue-700 text-white' :
                    'border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, provider, features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 h-4 w-4 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Providers</SelectItem>
                  {providers.map(provider => (
                    <SelectItem key={provider} value={provider} className="text-white hover:bg-slate-700">
                      {provider} ({allModels.filter(m => m.provider === provider).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-600 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all" className="text-white hover:bg-slate-700">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-slate-700 capitalize">
                      {category} ({allModels.filter(m => m.category === category).length})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-800/50 border border-slate-600 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  All Models ({allModels.length})
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  Popular ({getPopularModels().length})
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  Chat ({getModelsByCategory('chat').length})
                </TabsTrigger>
                <TabsTrigger value="coding" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  Coding ({getModelsByCategory('coding').length})
                </TabsTrigger>
                <TabsTrigger value="reasoning" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  Reasoning ({getModelsByCategory('reasoning').length})
                </TabsTrigger>
                <TabsTrigger value="multimodal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 px-3">
                  Multimodal ({getModelsByCategory('multimodal').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Models List */}
          <div className="flex-1 overflow-auto p-4">
            {filteredModels.length === 0 ? (
              <div className="text-center text-slate-400 py-8">
                No models found matching your criteria.
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-3 gap-3">
                {filteredModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    isSelected={value === model.id}
                    onSelect={() => {
                      onValueChange?.(model.id);
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredModels.map((model) => (
                  <ModelListItem
                    key={model.id}
                    model={model}
                    isSelected={value === model.id}
                    onSelect={() => {
                      onValueChange?.(model.id);
                      setOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-600/50 p-3 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>{filteredModels.length} models available • Prices per 1K tokens</span>
              <span className="italic text-slate-500">Powered by Scriptcreator.online</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}