export const transformRegion = (region: string): string => {
    const regionMappings: Record<string, string> = {
        na: 'americas',
        br: 'americas',
        lan: 'americas',
        las: 'americas',
        kr: 'asia',
        jp: 'asia',
        eune: 'europe',
        euw: 'europe',
        tr: 'europe',
        ru: 'europe',
        oce: 'sea',
        ph: 'sea',
        sg: 'sea',
        th: 'sea',
        vn: 'sea',
        tw: 'sea',
    }

    const lowercaseRegion = region.toLowerCase()

    return regionMappings[lowercaseRegion] || 'americas'
}