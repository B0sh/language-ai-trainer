export interface LlamaModel {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
    details: {
        format: string;
        family: string;
        families: string | null;
        parameter_size: string;
        quantization_level: string;
    };
}

export interface LlamaListModelsResponse {
    models: LlamaModel[];
}
