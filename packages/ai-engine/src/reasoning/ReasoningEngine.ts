import { Agent } from '@repo/types';

export interface ReasoningStep {
  type: 'think' | 'act' | 'observe';
  content: string;
  timestamp: number;
}

export interface ReasoningResult {
  steps: ReasoningStep[];
  finalAnswer: string;
  success: boolean;
}

export class ReasoningEngine {
  private maxIterations: number = 5;
  private steps: ReasoningStep[] = [];

  constructor(maxIterations: number = 5) {
    this.maxIterations = maxIterations;
  }

  /**
   * Execute the Think-Act-Observe loop
   */
  public async reason(
    agent: Agent,
    initialInput: string
  ): Promise<ReasoningResult> {
    this.steps = [];
    let currentInput = initialInput;
    let iteration = 0;

    while (iteration < this.maxIterations) {
      // THINK: Agent analyzes the situation
      const thought = await agent.think(currentInput);
      this.addStep('think', thought);

      // Check if we have a final answer
      if (this.isFinalAnswer(thought)) {
        return {
          steps: this.steps,
          finalAnswer: thought,
          success: true
        };
      }

      // ACT: Agent takes action based on thought
      await agent.act(thought);
      this.addStep('act', `Executed action based on: ${thought}`);

      // OBSERVE: Agent observes the result
      const observation = await agent.observe();
      this.addStep('observe', observation);

      // Update input for next iteration
      currentInput = observation;
      iteration++;
    }

    return {
      steps: this.steps,
      finalAnswer: 'Max iterations reached without final answer',
      success: false
    };
  }

  /**
   * Check if the thought contains a final answer
   */
  private isFinalAnswer(thought: string): boolean {
    const finalAnswerPatterns = [
      /final answer:/i,
      /conclusion:/i,
      /result:/i,
      /answer:/i
    ];

    return finalAnswerPatterns.some(pattern => pattern.test(thought));
  }

  /**
   * Add a reasoning step
   */
  private addStep(type: ReasoningStep['type'], content: string): void {
    this.steps.push({
      type,
      content,
      timestamp: Date.now()
    });
  }

  /**
   * Get all reasoning steps
   */
  public getSteps(): ReasoningStep[] {
    return [...this.steps];
  }

  /**
   * Clear reasoning history
   */
  public clear(): void {
    this.steps = [];
  }
}
