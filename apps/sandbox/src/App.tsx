import { RouterProvider } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import { router } from './router';

function App() {
  return (
    <SimulationProvider>
      <RouterProvider router={router} />
    </SimulationProvider>
  );
}

export default App;

