import { CategoryManager } from "@/components/categories/CategoryManager";
import { PageHeader } from "@/components/shared/PageHeader";
import { requireUser } from "@/lib/auth-utils";
import { getUserCategories } from "@/services/subscriptions";

export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await getUserCategories(user.id);

  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize seus gastos por nome e cor para entender rapidamente onde o dinheiro está concentrado."
      />
      <CategoryManager categories={categories} />
    </>
  );
}
