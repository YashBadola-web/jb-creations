export interface SubCategory {
    id: string;
    label: string;
}

export interface MainCategory {
    id: string;
    label: string;
    subCategories: SubCategory[];
    isStandalone?: boolean;
}

export const CATEGORY_HIERARCHY: MainCategory[] = [
    {
        id: 'resin_materials',
        label: '💧 Resin Materials',
        subCategories: [
            { id: 'resin_color', label: '🎨 Resin Color' },
            { id: 'resin_moulds', label: '🔷 Moulds' },
            { id: 'resin_dry_flower', label: '🌸 Dry Flower' },
            { id: 'resin_essentials', label: ' Resin Essentials' },
            { id: 'resin_stickers', label: '🏷️ Stickers' },
        ],
    },
    {
        id: 'candle_making',
        label: '🕯️ Candle Making',
        subCategories: [
            { id: 'candle_wax', label: '🧱 Wax' },
            { id: 'candle_fragrance', label: '👃 Fragrance' },
            { id: 'candle_equipment', label: '🛠️ Equipment' },
            { id: 'candle_wicks', label: '🧶 Wicks' },
            { id: 'candle_colors', label: '🌈 Colors' },
        ],
    },
    {
        id: 'customised_items',
        label: '🎁 Customised Items',
        subCategories: [
            { id: 'custom_mdf', label: '🔢 MDF/Acrylic' },
            { id: 'custom_stickers', label: '🏷️ Stickers' },
            { id: 'custom_quotes', label: '💬 Quotes' },
        ],
    },
    {
        id: 'packing_material',
        label: '📦 Packing Material',
        subCategories: [
            { id: 'packing_resin', label: '🧼 Resin Packing' },
            { id: 'packing_candle', label: ' Candle Packing' },
            { id: 'packing_other', label: '🥡 Others' },
        ],
    },
    {
        id: 'other_materials',
        label: '🧶 Other Materials',
        subCategories: [
            { id: 'other_stones', label: '💎 Stones' },
            { id: 'other_charms', label: '🔗 Charms/Jewellery' },
        ],
    },
    {
        id: 'home_decor',
        label: '🏠 Home Decor',
        isStandalone: true,
        subCategories: [],
    },
    {
        id: 'diy_kits',
        label: '🧵 DIY Kits',
        isStandalone: true,
        subCategories: [],
    },
    {
        id: 'pipe_cleaners',
        label: '🌀 Pipe Cleaners',
        isStandalone: true,
        subCategories: [],
    },
];

export const getCategoryLabel = (id: string): string => {
    for (const main of CATEGORY_HIERARCHY) {
        if (main.id === id) return main.label;
        if (main.isStandalone && main.id === id) return main.label;
        const sub = main.subCategories.find((s) => s.id === id);
        if (sub) return `${main.label} > ${sub.label}`;
    }
    return id; // Fallback
};

export const getMainCategory = (subId: string): MainCategory | undefined => {
    return CATEGORY_HIERARCHY.find(
        (main) => main.id === subId || main.subCategories.some((sub) => sub.id === subId)
    );
};
