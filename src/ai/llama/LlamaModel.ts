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

export interface LlamaApiGenerateDto {
    model: string;
    prompt: string;
    suffix?: string;
    images?: string[];
    format?: string;
    system?: string;
    template?: string;
    stream?: boolean;
    raw?: boolean;
    keep_alive?: string;
    options: {
        temperature?: number;
        num_predict?: number;
        stop?: string[];
        system?: string;
    };
}

export interface LlamaApiGenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context: number[];
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
}

export interface LlamaListModelsResponse {
    models: LlamaModel[];
}
