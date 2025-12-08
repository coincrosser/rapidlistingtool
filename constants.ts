export const YEARS = Array.from({ length: 36 }, (_, i) => (2025 - i).toString());

export const MAKES = [
  "Acura", "Audi", "BMW", "Buick", "Cadillac", "Chevrolet", "Chrysler", 
  "Dodge", "Fiat", "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", 
  "Kia", "Lexus", "Lincoln", "Mazda", "Mercedes-Benz", "Mini", "Mitsubishi", 
  "Nissan", "Porsche", "Ram", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo", "Other"
];

export const COMMON_AUTO_CATEGORIES = [
  "Engine & Components",
  "Transmission & Drivetrain",
  "Brakes & Brake Parts",
  "Suspension & Steering",
  "Exterior Body Parts",
  "Interior Parts & Accessories",
  "Lighting & Lamps",
  "Wheels & Tires",
  "Electrical & Electronics",
  "Cooling Systems",
  "Exhaust & Emission"
];

export const COMMON_GENERAL_CATEGORIES = [
  "Electronics",
  "Clothing & Apparel",
  "Home & Garden",
  "Toys & Hobbies",
  "Sporting Goods",
  "Health & Beauty",
  "Tools & Hardware",
  "Collectibles",
  "Video Games",
  "Books & Media",
  "Other"
];

// Simplified mapping for demo purposes. In a real app, this would be an API.
export const POPULAR_MODELS: Record<string, string[]> = {
  "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Ridgeline", "Fit"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Tacoma", "Tundra", "Highlander", "Prius", "4Runner"],
  "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Focus", "Ranger", "Bronco"],
  "Chevrolet": ["Silverado", "Equinox", "Malibu", "Tahoe", "Suburban", "Corvette", "Camaro"],
  "BMW": ["3 Series", "5 Series", "X3", "X5", "M3", "M5"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE"],
  "Nissan": ["Altima", "Rogue", "Sentra", "Frontier", "Titan", "Pathfinder"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Gladiator"]
};
