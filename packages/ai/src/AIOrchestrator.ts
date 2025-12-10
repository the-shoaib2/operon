import { ModelProvider, ModelOptions } from './types';
import { LocalModel, ModelConfig } from './LocalModel';

export class AIOrchestrator {
  private providers: Map<string, ModelProvider> = new Map();
  private currentProviderId: string;

  constructor(defaultProvider?: ModelProvider) {
    if (defaultProvider) {
      this.registerProvider(defaultProvider);
      this.currentProviderId = defaultProvider.id;
    } else {
      // Default to nothing until configured, or handle gracefully
      this.currentProviderId = '';
    }
  }

  registerProvider(provider: ModelProvider): void {
    this.providers.set(provider.id, provider);
    if (!this.currentProviderId) {
      this.currentProviderId = provider.id;
    }
  }

  setProvider(id: string): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider ${id} not found`);
    }
    this.currentProviderId = id;
  }

  getProvider(id?: string): ModelProvider {
    const providerId = id || this.currentProviderId;
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`No provider available (id: ${providerId})`);
    }
    return provider;
  }

  async processRequest(prompt: string, options?: ModelOptions): Promise<string> {
    const provider = this.getProvider(options?.model ? undefined : this.currentProviderId); // If model is specified, might want to route differently, but for now simple
    
    if (!provider.isReady() && provider instanceof LocalModel) {
       await (provider as LocalModel).load();
    }
    
    return provider.generate(prompt, options);
  }
}
