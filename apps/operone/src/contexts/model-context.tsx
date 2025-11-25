import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OllamaDetector, type OllamaModel } from '../utils/ollama-detector';

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'ollama' | 'openai' | 'anthropic' | 'google' | 'custom';
  description?: string;
  contextLength?: number;
  isLocal?: boolean;
  isActive?: boolean;
  requiresAuth?: boolean;
  authStatus?: 'authenticated' | 'pending' | 'failed' | 'not_required';
}

interface ModelDetectorContextType {
  // Available models
  availableModels: ModelInfo[];
  isLoading: boolean;
  error: string | null;
  
  // Ollama specific
  isOllamaAvailable: boolean;
  ollamaModels: OllamaModel[];
  
  // Authentication (placeholder for future implementation)
  authenticateModel: (modelId: string, credentials: any) => Promise<boolean>;
  deauthenticateModel: (modelId: string) => Promise<void>;
  getAuthStatus: (modelId: string) => 'authenticated' | 'pending' | 'failed' | 'not_required';
  
  // Actions
  refreshModels: () => Promise<void>;
  detectOllama: () => Promise<boolean>;
}

const ModelDetectorContext = createContext<ModelDetectorContextType | null>(null);

export function ModelDetectorProvider({ children }: { children: ReactNode }) {
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOllamaAvailable, setIsOllamaAvailable] = useState(false);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  
  const ollamaDetector = OllamaDetector.getInstance();

  // Detect Ollama models
  const detectOllamaModels = async () => {
    try {
      const available = await ollamaDetector.checkAvailability();
      setIsOllamaAvailable(available);
      
      if (available) {
        const models = await ollamaDetector.getAvailableModels();
        setOllamaModels(models);
        
        // Convert Ollama models to ModelInfo format
        const modelInfos: ModelInfo[] = models.map(model => ({
          id: `ollama:${model.name}`,
          name: model.name,
          provider: 'ollama' as const,
          description: `${model.details.family} • ${model.details.parameter_size} • ${model.details.quantization_level}`,
          contextLength: model.details.parameter_size === '7B' ? 4096 : 8192,
          isLocal: true,
          isActive: true,
          requiresAuth: false,
          authStatus: 'not_required' as const,
        }));
        
        return modelInfos;
      }
      return [];
    } catch (err) {
      console.error('Failed to detect Ollama models:', err);
      setIsOllamaAvailable(false);
      setOllamaModels([]);
      return [];
    }
  };

  // Detect all available models
  const detectAllModels = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const models: ModelInfo[] = [];
      
      // Detect Ollama models
      const ollamaModelInfos = await detectOllamaModels();
      models.push(...ollamaModelInfos);
      
      // Add default cloud models (placeholder for future auth implementation)
      const defaultCloudModels: ModelInfo[] = [
        {
          id: 'openai:gpt-4o',
          name: 'GPT-4o',
          provider: 'openai',
          description: 'OpenAI\'s most capable model',
          contextLength: 128000,
          isLocal: false,
          requiresAuth: true,
          authStatus: 'pending' as const,
        },
        {
          id: 'anthropic:claude-3-5-sonnet-20241022',
          name: 'Claude 3.5 Sonnet',
          provider: 'anthropic',
          description: 'Anthropic\'s most capable model',
          contextLength: 200000,
          isLocal: false,
          requiresAuth: true,
          authStatus: 'pending' as const,
        },
        {
          id: 'google:gemini-pro',
          name: 'Gemini Pro',
          provider: 'google',
          description: 'Google\'s conversational AI model',
          contextLength: 32768,
          isLocal: false,
          requiresAuth: true,
          authStatus: 'pending' as const,
        },
      ];
      
      models.push(...defaultCloudModels);
      setAvailableModels(models);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect models');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh models
  const refreshModels = async () => {
    await detectAllModels();
  };

  // Detect Ollama only
  const detectOllama = async () => {
    const available = await ollamaDetector.checkAvailability();
    setIsOllamaAvailable(available);
    return available;
  };

  // Authentication methods (placeholder for future implementation)
  const authenticateModel = async (modelId: string, credentials: any): Promise<boolean> => {
    // TODO: Implement actual authentication logic
    console.log(`Authenticating model ${modelId} with credentials:`, credentials);
    
    // Simulate authentication
    setAvailableModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? { ...model, authStatus: 'authenticated' as const, isActive: true }
          : model
      )
    );
    
    return true;
  };

  const deauthenticateModel = async (modelId: string): Promise<void> => {
    // TODO: Implement actual deauthentication logic
    console.log(`Deauthenticating model ${modelId}`);
    
    setAvailableModels(prev => 
      prev.map(model => 
        model.id === modelId 
          ? { ...model, authStatus: 'pending' as const, isActive: false }
          : model
      )
    );
  };

  const getAuthStatus = (modelId: string): 'authenticated' | 'pending' | 'failed' | 'not_required' => {
    const model = availableModels.find(m => m.id === modelId);
    return model?.authStatus || 'not_required';
  };

  // Initial detection
  useEffect(() => {
    detectAllModels();
    
    // Set up periodic refresh for Ollama models
    const interval = setInterval(() => {
      detectOllamaModels().then(modelInfos => {
        setAvailableModels(prev => {
          // Remove old Ollama models and add new ones
          const nonOllamaModels = prev.filter(m => m.provider !== 'ollama');
          return [...nonOllamaModels, ...modelInfos];
        });
      });
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const value: ModelDetectorContextType = {
    availableModels,
    isLoading,
    error,
    isOllamaAvailable,
    ollamaModels,
    authenticateModel,
    deauthenticateModel,
    getAuthStatus,
    refreshModels,
    detectOllama,
  };

  return (
    <ModelDetectorContext.Provider value={value}>
      {children}
    </ModelDetectorContext.Provider>
  );
}

export function useModelDetector() {
  const context = useContext(ModelDetectorContext);
  if (!context) {
    throw new Error('useModelDetector must be used within a ModelDetectorProvider');
  }
  return context;
}
