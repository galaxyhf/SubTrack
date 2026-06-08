import { CategoryManager } from "@/components/categories/CategoryManager";
import { PageHeader } from "@/components/shared/PageHeader";

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categorias"
        description="Organize seus gastos por cor e ícone para entender rapidamente onde o dinheiro está concentrado."
      />
      <CategoryManager />
    </>
  );
}
