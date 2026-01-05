import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, formatPriceINR, parsePriceToINR } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ProductsTab: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'resin' as Product['category'],
    stock: '',
    imageUrl: '',
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'resin',
      stock: '',
      imageUrl: '',
      featured: false,
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.priceInPaise / 100).toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.images[0] || '',
      featured: product.featured,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceInPaise = parsePriceToINR(parseFloat(formData.price));
    const productData = {
      name: formData.name,
      description: formData.description,
      priceInPaise,
      category: formData.category,
      stock: parseInt(formData.stock),
      images: [formData.imageUrl],
      featured: formData.featured,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast({ title: 'Product updated successfully' });
    } else {
      addProduct(productData);
      toast({ title: 'Product added successfully' });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast({ title: 'Product deleted' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Products
        </h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/20 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg border border-border p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: Product['category']) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resin">Resin Art</SelectItem>
                      <SelectItem value="kids">Kids Toys</SelectItem>
                      <SelectItem value="decor">Home Decor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    required
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <Label htmlFor="featured" className="font-normal">
                    Featured product
                  </Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingProduct ? 'Update' : 'Add'} Product
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Product
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Category
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Price
                </th>
                <th className="text-left text-sm font-medium text-muted-foreground px-4 py-3">
                  Stock
                </th>
                <th className="text-right text-sm font-medium text-muted-foreground px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {product.name}
                        </p>
                        {product.featured && (
                          <span className="text-xs text-primary">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground capitalize">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-foreground">{product.displayPrice}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        product.stock < 5 ? 'text-destructive font-medium' : 'text-foreground'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsTab;
