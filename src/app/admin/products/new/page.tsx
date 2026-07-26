import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-quicksand font-bold text-stone-900 mb-6">Add New Product</h1>
      <ProductForm isNew={true} />
    </div>
  );
}
