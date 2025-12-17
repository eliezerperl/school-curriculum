export interface Coordinate {
	x: number;
	y: number;
}

export interface CalculusParams {
	// The function string, e.g., "a * x^2 + b"
	expression: string;
	
	// Variables for sliders (a=1, b=2)
	variables: Record<string, number>;
	
	// The Window (Zoom level)
	xMin: number;
	xMax: number;
	yMin: number;
	yMax: number;
}

export interface GraphData {
	points: Coordinate[]; // The main curve
	// We will add more here later (tangent lines, area shapes, etc.)
}