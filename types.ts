export enum ListingMode {
  AUTO_PARTS = 'AUTO_PARTS',
  GENERAL_ITEMS = 'GENERAL_ITEMS',
}

export enum Condition {
  NEW = 'New',
  USED_EXCELLENT = 'Used - Excellent',
  USED_GOOD = 'Used - Good',
  USED_FAIR = 'Used - Fair',
  REMANUFACTURED = 'Remanufactured', // Auto parts specific usually, but kept generally
  FOR_PARTS = 'For Parts/Not Working'
}

export interface BaseFormData {
  condition: Condition;
  additionalNotes: string;
  ocrText: string;
}

export interface AutoPartsData extends BaseFormData {
  year: string;
  make: string;
  model: string;
  trimEngine: string;
  category: string;
  partName: string;
  oemNumber: string;
  interchangeNumber: string;
}

export interface GeneralItemsData extends BaseFormData {
  upc: string;
  category: string;
  brand: string;
  itemName: string;
  sizeDimensions: string;
}

export type FormData = AutoPartsData | GeneralItemsData;

export interface GeneratedListings {
  ebayTitle: string;
  ebayDescription: string;
  facebookTitle: string;
  facebookDescription: string;
  craigslistTitle: string;
  craigslistDescription: string;
}

export interface ImageFile {
  id: string;
  data: string; // base64
  mimeType: string;
}
