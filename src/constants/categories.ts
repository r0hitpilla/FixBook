export type AssetCategory =
  | 'vehicles'
  | 'home_appliances'
  | 'electronics'
  | 'cameras_gear'
  | 'tools_equipment'
  | 'other';

export const CATEGORY_LABEL: Record<AssetCategory, string> = {
  vehicles: 'Vehicles',
  home_appliances: 'Home Appliances',
  electronics: 'Electronics',
  cameras_gear: 'Cameras & Gear',
  tools_equipment: 'Tools & Workshop Equipment',
  other: 'Other',
};

const CATEGORY_ICON: Record<AssetCategory, string> = {
  vehicles: 'two_wheeler',
  home_appliances: 'roofing',
  electronics: 'laptop_mac',
  cameras_gear: 'photo_camera',
  tools_equipment: 'home_repair_service',
  other: 'inventory_2',
};

export function categoryIcon(category?: string | null): string {
  if (category && category in CATEGORY_ICON) return CATEGORY_ICON[category as AssetCategory];
  return CATEGORY_ICON.other;
}

export function categoryLabel(category?: string | null): string {
  if (category && category in CATEGORY_LABEL) return CATEGORY_LABEL[category as AssetCategory];
  return 'Other';
}

export const CATEGORY_LIST: AssetCategory[] = [
  'vehicles',
  'home_appliances',
  'electronics',
  'cameras_gear',
  'tools_equipment',
  'other',
];
