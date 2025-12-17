

import { useCalculusEngine } from "../../hooks/useCalculusEngine";
import { CalculusControls } from "./CalculusControls";
import { CalculusGraph } from "./CalculusGraph";

export const CalculusDashboard = () => {
  const { params, setters, data } = useCalculusEngine();

  // Note: We removed the outer padding because the Page component handles it now
  return (
    <div className="h-full w-full flex flex-col gap-4">
      
      {/* Main Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Graph */}
        <div className="lg:col-span-3 h-full min-h-100">
          <CalculusGraph data={data} range={params.range} />
        </div>

        {/* Controls */}
        <div className="lg:col-span-1 h-full min-h-75">
          <CalculusControls 
            expression={params.expression}
            setExpression={setters.setExpression}
            variables={params.variables}
            setVariable={setters.setVariable}
          />
        </div>

      </div>
    </div>
  );
};