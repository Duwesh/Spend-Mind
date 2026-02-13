import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Tag, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const SUGGESTED_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Housing",
  "Entertainment",
  "Health",
  "Shopping",
  "Salary",
  "Education",
  "Travel",
  "Utilities",
];

const CategorySettings = () => {
  const { categoriesRaw, addCategory, deleteCategory, expenses } = useApp();
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const existingCategoryNames = categoriesRaw.map((c) => c.name.toLowerCase());
  const suggestions = SUGGESTED_CATEGORIES.filter(
    (cat) => !existingCategoryNames.includes(cat.toLowerCase()),
  );

  const handleAddCategory = (name = newCategory) => {
    const categoryName = typeof name === "string" ? name : newCategory;
    if (categoryName.trim()) {
      addCategory(categoryName.trim());
      setNewCategory("");
    }
  };

  const handleDeleteClick = (category) => {
    // category is now an object { id, name, ... }
    // Check if category is in use (expenses have 'category' property mapped from category_name)
    const isUsed = expenses.some((e) => e.category === category.name);
    if (isUsed) {
      alert(
        `Cannot delete '${category.name}' because it is used in existing expenses.`,
      );
      return;
    }
    setCategoryToDelete(category);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Manage Categories
          </CardTitle>
          <CardDescription>
            Add or remove categories for your expenses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="new-category" className="sr-only">
                New Category
              </Label>
              <Input
                id="new-category"
                placeholder="Enter category name..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
            </div>
            <Button onClick={() => handleAddCategory()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Suggested Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-slate-700 bg-slate-800/30 hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-all text-[11px]"
                    onClick={() => handleAddCategory(cat)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Your Categories
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {categoriesRaw &&
                categoriesRaw.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    <span className="font-medium">{category.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <strong>{categoryToDelete?.name}</strong>?
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategorySettings;
