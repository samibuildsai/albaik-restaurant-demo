"use client";

import { useState, useMemo } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Badge, SpicyLevel } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Modal } from "@/components/ui";
import { QuantitySelector } from "@/components/ui";
import { menuItems, menuCategories } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const categories = ["all", ...menuCategories.map((c) => c.id)];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (item: any, quantity: number) => {
    addItem(item, quantity);
    showToast(`${item.name} added to cart!`, "success");
    setSelectedItem(null);
    openCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-600">
            Discover our flame-grilled specialties, wood-fired pizzas, and more.
            All made fresh to order.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-[84px] sm:top-[100px] z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="hidden sm:inline-flex items-center gap-1">
                <Filter className="h-4 w-4" />
                {filteredItems.length} items
              </Badge>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {categories.map((cat) => {
                const category = menuCategories.find((c) => c.id === cat);
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSearchQuery("");
                    }}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      selectedCategory === cat
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat === "all" ? (
                      <>
                        <span className="mr-1">🍽️</span> All
                      </>
                    ) : (
                      <>
                        <span className="mr-1">{category?.icon}</span> {category?.name}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedCategory === "all" ? "All Items" : menuCategories.find((c) => c.id === selectedCategory)?.name}
              <span className="text-gray-500 font-normal ml-2">({filteredItems.length})</span>
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
                Clear search
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or filter</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={selectedCategory + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <MenuItemCard
                      item={item}
                      onClick={() => setSelectedItem(item)}
                      onAddToCart={handleAddToCart}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Item Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        size="lg"
      >
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onAddToCart={handleAddToCart}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function MenuItemCard({
  item,
  onClick,
  onAddToCart,
}: {
  item: any;
  onClick: () => void;
  onAddToCart: (item: any, quantity: number) => void;
}) {
  return (
    <Card variant="elevated" hover className="overflow-hidden cursor-pointer h-full" onClick={onClick}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        {item.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.badges.slice(0, 2).map((badge: string) => (
              <Badge
                key={badge}
                variant={
                  badge === "Popular" ? "popular" :
                  badge === "New" ? "new" :
                  badge === "Spicy" ? "spicy" :
                  badge === "Vegetarian" ? "vegetarian" :
                  badge === "Chef's Choice" ? "info" :
                  badge === "Best Seller" ? "popular" : "default"
                }
                size="sm"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item, 1);
            }}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 shadow-lg transition-colors"
            aria-label={`Add ${item.name} to cart`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 flex-wrap">
            {item.badges.map((badge: string) => (
              <Badge
                key={badge}
                variant={
                  badge === "Popular" ? "popular" :
                  badge === "New" ? "new" :
                  badge === "Spicy" ? "spicy" :
                  badge === "Vegetarian" ? "vegetarian" :
                  badge === "Chef's Choice" ? "info" :
                  badge === "Best Seller" ? "popular" : "default"
                }
                size="sm"
              >
                {badge}
              </Badge>
            ))}
          </div>
          <SpicyLevel level={item.spicyLevel} size="sm" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xl font-bold text-amber-600">{formatPrice(item.price)}</span>
          <span className="text-sm text-gray-500">{item.prepTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ItemDetailModal({
  item,
  onAddToCart,
  onClose,
}: {
  item: any;
  onAddToCart: (item: any, quantity: number) => void;
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="relative aspect-square rounded-xl overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          {item.badges.map((badge: string) => (
            <Badge
              key={badge}
              variant={
                badge === "Popular" ? "popular" :
                badge === "New" ? "new" :
                badge === "Spicy" ? "spicy" :
                badge === "Vegetarian" ? "vegetarian" :
                badge === "Chef's Choice" ? "info" :
                badge === "Best Seller" ? "popular" : "default"
              }
            >
              {badge}
            </Badge>
          ))}
        </div>
        <p className="text-gray-600 leading-relaxed">{item.description}</p>
        <SpicyLevel level={item.spicyLevel} size="md" showLabel />
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <span className="text-2xl font-bold text-amber-600">{formatPrice(item.price)}</span>
          <span className="text-gray-500">{item.prepTime}</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={99}
            size="md"
          />
        </div>
        <Button
          variant="primary"
          fullWidth
          size="lg"
          onClick={() => onAddToCart(item, quantity)}
          rightIcon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}