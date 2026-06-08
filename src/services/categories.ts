import { categories } from "@/db/schema";
import { getDb } from "@/db";

export const defaultCategories = [
  { name: "Streaming", color: "#336EBB", icon: "Tv" },
  { name: "Moradia", color: "#22C55E", icon: "Home" },
  { name: "Alimentação", color: "#F59E0B", icon: "Utensils" },
  { name: "Transporte", color: "#8B5CF6", icon: "Car" },
  { name: "Saúde", color: "#EF4444", icon: "HeartPulse" },
  { name: "Educação", color: "#06B6D4", icon: "GraduationCap" },
  { name: "Serviços", color: "#A855F7", icon: "Wrench" },
  { name: "Lazer", color: "#EC4899", icon: "Gamepad2" },
  { name: "Outros", color: "#A1A1AA", icon: "CircleDollarSign" },
] as const;

export const createDefaultCategories = async (userId: string) => {
  await getDb()
    .insert(categories)
    .values(defaultCategories.map((category) => ({ ...category, userId })));
};
