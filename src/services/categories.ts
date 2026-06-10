import { categories } from "@/db/schema";
import { getDb } from "@/db";

export const defaultCategories = [
  { name: "Streaming", color: "#336EBB" },
  { name: "Moradia", color: "#22C55E" },
  { name: "Alimentação", color: "#F59E0B" },
  { name: "Transporte", color: "#8B5CF6" },
  { name: "Saúde", color: "#EF4444" },
  { name: "Educação", color: "#06B6D4" },
  { name: "Serviços", color: "#A855F7" },
  { name: "Lazer", color: "#EC4899" },
  { name: "Outros", color: "#A1A1AA" },
] as const;

export const createDefaultCategories = async (userId: string) => {
  await getDb()
    .insert(categories)
    .values(defaultCategories.map((category) => ({ ...category, userId })));
};
