'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Trash2, Check, X, Loader2, Eye, EyeOff, Zap } from 'lucide-react';
import { ModelRegistry } from '@repo/ai-engine/client';

type ProviderType = 'openai' | 'anthropic' | 'google' | 'mistral' | 'ollama' | 'openrouter' | 'custom';

interface AIProvider {
    id: string;
    name: string;
    type: ProviderType;
    model: string;
    baseURL?: string;
    organization?: string;
    isActive: boolean;
    isDefault: boolean;
    hasApiKey: boolean;
    createdAt: string;
    updatedAt: string;
}

const PROVIDER_ICONS: Record<ProviderType, string> = {
    openai: '🤖',
    anthropic: '🧠',
    google: '🔍',
    mistral: '🌊',
    ollama: '🦙',
    openrouter: '🔀',
    custom: '⚙️',
};

const PROVIDER_LABELS: Record<ProviderType, string> = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google',
    mistral: 'Mistral',
    ollama: 'Ollama',
    openrouter: 'OpenRouter',
    custom: 'Custom',
};

export default function AIProvidersPage() {
    const [providers, setProviders] = useState<AIProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [testingProvider, setTestingProvider] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        type: 'openai' as ProviderType,
        model: '',
        apiKey: '',
        baseURL: '',
        organization: '',
        isDefault: false,
    });
    const [showApiKey, setShowApiKey] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        try {
            const response = await fetch('/api/ai-providers');
            if (!response.ok) throw new Error('Failed to load providers');
            const data = await response.json();
            setProviders(data.providers);
        } catch (error) {
            toast.error('Failed to load AI providers');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProvider = async () => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/ai-providers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to add provider');
            }

            toast.success('Provider added successfully');
            setShowAddDialog(false);
            resetForm();
            await loadProviders();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to add provider');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteProvider = async (id: string) => {
        if (!confirm('Are you sure you want to delete this provider?')) return;

        try {
            const response = await fetch(`/api/ai-providers/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete provider');

            toast.success('Provider deleted');
            await loadProviders();
        } catch (error) {
            toast.error('Failed to delete provider');
            console.error(error);
        }
    };

    const handleActivateProvider = async (id: string) => {
        try {
            const response = await fetch(`/api/ai-providers/${id}/activate`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to activate provider');

            toast.success('Provider activated');
            await loadProviders();
        } catch (error) {
            toast.error('Failed to activate provider');
            console.error(error);
        }
    };

    const handleTestProvider = async (id: string) => {
        setTestingProvider(id);
        try {
            const response = await fetch(`/api/ai-providers/${id}/test`, {
                method: 'POST',
            });

            const result = await response.json();

            if (result.success) {
                toast.success('Connection successful!');
            } else {
                toast.error(`Connection failed: ${result.error}`);
            }
        } catch (error) {
            toast.error('Failed to test connection');
            console.error(error);
        } finally {
            setTestingProvider(null);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'openai',
            model: '',
            apiKey: '',
            baseURL: '',
            organization: '',
            isDefault: false,
        });
        setShowApiKey(false);
    };

    const getAvailableModels = (type: ProviderType) => {
        const models = ModelRegistry.getModels(type);
        return models.map(m => ({ id: m.id, name: m.name }));
    };

    const requiresApiKey = (type: ProviderType) => {
        return type !== 'ollama';
    };

    const requiresBaseURL = (type: ProviderType) => {
        return type === 'ollama' || type === 'custom';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">AI Providers</h1>
                    <p className="text-muted-foreground">
                        Manage your AI model providers and API keys
                    </p>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Provider
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add AI Provider</DialogTitle>
                            <DialogDescription>
                                Configure a new AI model provider
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Provider Name</Label>
                                <Input
                                    id="name"
                                    placeholder="My OpenAI"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Label htmlFor="type">Provider Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value: ProviderType) => {
                                        setFormData({ ...formData, type: value, model: '' });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(PROVIDER_LABELS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                <span className="flex items-center gap-2">
                                                    <span>{PROVIDER_ICONS[value as ProviderType]}</span>
                                                    <span>{label}</span>
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="model">Model</Label>
                                <Select
                                    value={formData.model}
                                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {getAvailableModels(formData.type).map((model) => (
                                            <SelectItem key={model.id} value={model.id}>
                                                {model.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {requiresApiKey(formData.type) && (
                                <div>
                                    <Label htmlFor="apiKey">API Key</Label>
                                    <div className="relative">
                                        <Input
                                            id="apiKey"
                                            type={showApiKey ? 'text' : 'password'}
                                            placeholder="sk-..."
                                            value={formData.apiKey}
                                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => setShowApiKey(!showApiKey)}
                                        >
                                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {requiresBaseURL(formData.type) && (
                                <div>
                                    <Label htmlFor="baseURL">Base URL</Label>
                                    <Input
                                        id="baseURL"
                                        type="url"
                                        placeholder="http://localhost:11434"
                                        value={formData.baseURL}
                                        onChange={(e) => setFormData({ ...formData, baseURL: e.target.value })}
                                    />
                                </div>
                            )}

                            {formData.type === 'openai' && (
                                <div>
                                    <Label htmlFor="organization">Organization (Optional)</Label>
                                    <Input
                                        id="organization"
                                        placeholder="org-..."
                                        value={formData.organization}
                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                    />
                                </div>
                            )}

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onCheckedChange={(checked) =>
                                        setFormData({ ...formData, isDefault: checked as boolean })
                                    }
                                />
                                <Label htmlFor="isDefault" className="text-sm font-normal">
                                    Set as default provider
                                </Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddProvider} disabled={submitting}>
                                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Add Provider
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {providers.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-muted-foreground mb-4">No AI providers configured</p>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Provider
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {providers.map((provider) => (
                        <Card key={provider.id}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{PROVIDER_ICONS[provider.type]}</span>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {provider.name}
                                                {provider.isActive && (
                                                    <Badge variant="default" className="gap-1">
                                                        <Zap className="h-3 w-3" />
                                                        Active
                                                    </Badge>
                                                )}
                                                {provider.isDefault && (
                                                    <Badge variant="secondary">Default</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription>
                                                {PROVIDER_LABELS[provider.type]} • {provider.model}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!provider.isActive && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleActivateProvider(provider.id)}
                                            >
                                                Activate
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleTestProvider(provider.id)}
                                            disabled={testingProvider === provider.id}
                                        >
                                            {testingProvider === provider.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                'Test'
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteProvider(provider.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">API Key:</span>{' '}
                                        <span>{provider.hasApiKey ? '••••••••' : 'Not set'}</span>
                                    </div>
                                    {provider.baseURL && (
                                        <div>
                                            <span className="text-muted-foreground">Base URL:</span>{' '}
                                            <span className="font-mono text-xs">{provider.baseURL}</span>
                                        </div>
                                    )}
                                    {provider.organization && (
                                        <div>
                                            <span className="text-muted-foreground">Organization:</span>{' '}
                                            <span>{provider.organization}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-muted-foreground">Created:</span>{' '}
                                        <span>{new Date(provider.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Alert>
                <AlertDescription>
                    <strong>Note:</strong> API keys are encrypted and stored securely. They are never exposed in the UI or logs.
                </AlertDescription>
            </Alert>
        </div>
    );
}
