import { EconomicsPage } from '../../modules/economics/pages/EconomicsPage';
import { Navigation } from './Navigation';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Global Navigation (Left Sidebar) */}
      <Navigation />

      {/* Main Page Content */}
      <EconomicsPage />
    </div>
  );
}

export default App;
