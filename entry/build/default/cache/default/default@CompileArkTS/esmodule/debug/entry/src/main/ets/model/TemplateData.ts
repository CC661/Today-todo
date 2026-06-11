export const TEMPLATE_COLLECTION_ACCOUNTING = '记账';
export const TEMPLATE_COLLECTION_DINING = '饮食';
export const TEMPLATE_COLLECTION_MOVIE = '观影';
export type TemplateType = 'accounting' | 'dining' | 'movie';
export interface AccountingData {
    type: 'accounting';
    date: string;
    location: string;
    amount: string;
    item: string;
}
export interface DiningData {
    type: 'dining';
    date: string;
    location: string;
    amount: string;
    dish: string;
    rating: string;
}
export interface MovieData {
    type: 'movie';
    title: string;
    genre: string;
    score: string;
    experience: string;
}
export type TemplateData = AccountingData | DiningData | MovieData;
export function parseTemplateData(json: string): TemplateData | null {
    if (!json)
        return null;
    try {
        return JSON.parse(json) as TemplateData;
    }
    catch {
        return null;
    }
}
export function templateTypeToCollection(type: TemplateType): string {
    if (type === 'accounting')
        return TEMPLATE_COLLECTION_ACCOUNTING;
    if (type === 'dining')
        return TEMPLATE_COLLECTION_DINING;
    return TEMPLATE_COLLECTION_MOVIE;
}
