// Interface for the metadata of each component/directive
export interface ComponentMetadata {
	file: string; // Path to the component file
	inputs: PropertyMetadata[]; // Array of input properties
	outputs: PropertyMetadata[]; // Array of output properties
	selector: string | null; // Selector string if defined
	exportAs: string | null; // ExportAs string if defined
}

// Interface for each @Input or @Output property
export interface PropertyMetadata {
	name: string; // Name of the property
	type: string; // Type of the property
	description: string; // Description from JSDoc, if available
}

// Recursive interface to represent the nested folder structure
export interface NestedComponents {
	[key: string]: NestedComponents | ComponentMetadata; // Key could be a folder or component
}

// export type PRIMITIVES = 'accordion' |'alert-dialog'| 'alert' | 'aspect-ratio'|
