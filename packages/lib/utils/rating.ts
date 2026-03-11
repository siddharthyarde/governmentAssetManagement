import type { ConditionRating, RatingInfo, RedistributionType } from "@gams/types";

export const RATING_CONFIG: Record<ConditionRating, RatingInfo> = {
  10: {
    rating: 10,
    label: "Mint — Never Used",
    labelHi: "नया — कभी उपयोग नहीं हुआ",
    description: "Unused, no defects whatsoever. Sealed or stored properly.",
    priceMultiplier: 0.50,
    eligibleFor: ["public_sale", "institution_allocation", "freebie"],
    color: "#27AE60",
  },
  9: {
    rating: 9,
    label: "Unused — Minor Defect",
    labelHi: "अप्रयुक्त — मामूली दोष",
    description: "Never deployed but has a minor storage or manufacturing defect.",
    priceMultiplier: 0.42,
    eligibleFor: ["public_sale", "institution_allocation", "freebie"],
    color: "#2ECC71",
  },
  8: {
    rating: 8,
    label: "Used — Excellent",
    labelHi: "उपयोग किया — उत्कृष्ट",
    description: "Used, looks nearly new, fully functional with no visible damage.",
    priceMultiplier: 0.35,
    eligibleFor: ["public_sale", "institution_allocation", "freebie"],
    color: "#F39C12",
  },
  7: {
    rating: 7,
    label: "Used — Good",
    labelHi: "उपयोग किया — अच्छा",
    description: "Visible light wear and tear, fully functional.",
    priceMultiplier: 0.28,
    eligibleFor: ["public_sale", "institution_allocation", "freebie"],
    color: "#E67E22",
  },
  6: {
    rating: 6,
    label: "Used — Fair",
    labelHi: "उपयोग किया — ठीक-ठाक",
    description: "Moderate wear, functional, minor cosmetic issues.",
    priceMultiplier: 0.20,
    eligibleFor: ["institution_allocation", "freebie"],
    color: "#D35400",
  },
  5: {
    rating: 5,
    label: "Used — Acceptable",
    labelHi: "उपयोग किया — स्वीकार्य",
    description: "Heavy wear, works but with noticeable faults.",
    priceMultiplier: 0.10,
    eligibleFor: ["freebie"],
    color: "#C0392B",
  },
  4: {
    rating: 4,
    label: "Condemned",
    labelHi: "अनुपयोगी",
    description: "Beyond economical repair. GFR write-off required.",
    priceMultiplier: 0,
    eligibleFor: [],
    color: "#922B21",
  },
  3: {
    rating: 3,
    label: "Condemned",
    labelHi: "अनुपयोगी",
    description: "Structurally damaged. Cannot be reused.",
    priceMultiplier: 0,
    eligibleFor: [],
    color: "#922B21",
  },
  2: {
    rating: 2,
    label: "Condemned",
    labelHi: "अनुपयोगी",
    description: "Severely damaged, parts missing.",
    priceMultiplier: 0,
    eligibleFor: [],
    color: "#922B21",
  },
  1: {
    rating: 1,
    label: "Condemned",
    labelHi: "अनुपयोगी",
    description: "Complete write-off.",
    priceMultiplier: 0,
    eligibleFor: [],
    color: "#922B21",
  },
};

export function getDiscountedPrice(
  originalPrice: number,
  rating: ConditionRating,
  minReservePct = 0.33
): number {
  const config = RATING_CONFIG[rating];
  const calculated = originalPrice * config.priceMultiplier;
  const minReserve = originalPrice * minReservePct;
  // For ratings ≥ 6, enforce GFR minimum reserve price
  return rating >= 6 ? Math.max(calculated, minReserve) : calculated;
}

export function isEligibleFor(rating: ConditionRating, type: RedistributionType): boolean {
  return RATING_CONFIG[rating].eligibleFor.includes(type);
}

export function getRatingColor(rating: ConditionRating): string {
  return RATING_CONFIG[rating].color;
}
