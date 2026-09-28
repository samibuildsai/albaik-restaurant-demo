"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { galleryImages } from "@/data/restaurant";
import { X, ChevronLeft, ChevronRight, Download, Expand, Search } from "lucide-react";

const categories = [
  { id: "all", name: "All", count: galleryImages.length },
  { id: "food", name: "Food", count: galleryImages.filter((i) => i.category === "food").length },
  { id: "interior", name: "Interior", count: galleryImages.filter((i) => i.category === "interior").length },
  { id: "kitchen", name: "Kitchen", count: galleryImages.filter((i) => i.category === "kitchen").length },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === "all" || img.category === selectedCategory
  );

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setSelectedImage(filteredImages[index].id);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIdx);
    setSelectedImage(filteredImages[nextIdx].id);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(prevIdx);
    setSelectedImage(filteredImages[prevIdx].id);
  };

  const currentImage = filteredImages[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Photo Gallery</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Take a visual journey through our kitchen, dining area, and signature dishes.
              Every photo tells a story of flavor and passion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-[84px] sm:top-[100px] z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-500/25"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.name} <span className="ml-2 text-xs opacity-75">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GalleryItem
                    image={image}
                    onClick={() => openLightbox(index)}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredImages.length === 0 && (
            <div className="text-center py-16">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No images found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image gallery"
          >
            <div className="relative max-w-5xl max-h-[90vh] w-full">
              {/* Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image */}
              <div className="relative aspect-[16/10] max-h-[80vh] rounded-xl overflow-hidden">
                <img
                  src={currentImage.src}
                  alt={currentImage.alt}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Info */}
              <div className="mt-4 flex items-center justify-between text-white">
                <div>
                  <p className="font-medium">{currentImage.alt}</p>
                  <p className="text-sm text-gray-400 capitalize">{currentImage.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">
                    {currentIndex + 1} / {filteredImages.length}
                  </span>
                  <a
                    href={currentImage.src}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Download image"
                  >
                    <Download className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            {filteredImages.length > 1 && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/80 rounded-xl max-w-[90vw] overflow-x-auto">
                {filteredImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); setSelectedImage(img.id); }}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden transition-all ${
                      idx === currentIndex ? "ring-2 ring-amber-500 scale-110" : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                    aria-current={idx === currentIndex ? "true" : "false"}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Keyboard Navigation */}
            <div
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") prevImage();
                if (e.key === "ArrowRight") nextImage();
                if (e.key === "Escape") closeLightbox();
              }}
              tabIndex={0}
              className="absolute -top-10 left-0 w-0 h-0"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GalleryItem({ image, onClick, index }: { image: any; onClick: () => void; index: number }) {
  const categoryColors = {
    food: "bg-amber-100 text-amber-700",
    interior: "bg-blue-100 text-blue-700",
    kitchen: "bg-green-100 text-green-700",
  };

  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/3] overflow-hidden rounded-xl group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
      aria-label={`View ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColors[image.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-700"}`}>
            {image.category}
          </span>
          <div className="p-2 bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <Expand className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-3 p-2 bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
        <Search className="h-5 w-5 text-gray-700" />
      </div>
    </button>
  );
}