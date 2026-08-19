export interface MetalRate {
  id: "gold" | "silver";
  label: string;
  unit: string;
  price: string;
  change: string;
  isUp: boolean;
}

export async function getGoldSilverRates(): Promise<MetalRate[]> {
  try {
    // Real-world mein yahan Gold/Silver live price API fetch call lag sakti hai
    // Filhal standard Indian bullion rates provide kiye gaye hain:
    return [
      {
        id: "gold",
        label: "GOLD 24K",
        unit: "10g",
        price: "₹72,450",
        change: "+0.45%",
        isUp: true,
      },
      {
        id: "silver",
        label: "SILVER",
        unit: "1kg",
        price: "₹89,100",
        change: "-0.20%",
        isUp: false,
      },
    ];
  } catch {
    return [
      {
        id: "gold",
        label: "GOLD 24K",
        unit: "10g",
        price: "₹72,450",
        change: "0.00%",
        isUp: true,
      },
      {
        id: "silver",
        label: "SILVER",
        unit: "1kg",
        price: "₹89,100",
        change: "0.00%",
        isUp: true,
      },
    ];
  }
}