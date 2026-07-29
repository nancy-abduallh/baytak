import { ValueTransformer } from 'typeorm';

export const bigintTransformer: ValueTransformer = {
    to: (value: number) => value,
    from: (value: string) => (value === null || value === undefined ? value : parseInt(value, 10)),
};

export const decimalTransformer: ValueTransformer = {
    to: (value: number) => value,
    from: (value: string) => (value === null || value === undefined ? value : parseFloat(value)),
};