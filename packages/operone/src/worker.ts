import { parentPort, workerData } from 'worker_threads';
import { AgentManager } from './index';
import { EventBus } from './core/EventBus';

// Initialize core systems in the worker
const eventBus = EventBus.getInstance();
const agentManager = new AgentManager();

// Forward events from worker to main thread
// This requires the EventBus to be aware of the worker context or we manually forward
// For now, we'll just log
console.log(`Worker ${workerData.workerId} started`);

if (parentPort) {
  parentPort.on('message', async (message) => {
    if (message.type === 'task:start') {
      const { taskId, taskType, payload } = message;
      
      try {
        // Execute task based on type
        if (taskType === 'agent:run') {
            // Run agent logic
            // await agentManager.runAgent(payload.agentId);
        }
        
        parentPort?.postMessage({
          type: 'task:complete',
          taskId,
          result: { status: 'success' }
        });
      } catch (error: any) {
        parentPort?.postMessage({
          type: 'task:error',
          taskId,
          error: error.message
        });
      }
    }
  });
}
