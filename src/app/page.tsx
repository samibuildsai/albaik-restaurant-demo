"use client";

import Link from "next/link";
import { ArrowRight, ChefHat, Truck, Award, Shield, Star, Heart, Phone, MessageCircle, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  restaurantInfo,
  whyChooseUs,
  testimonials,
  navigationItems,
  galleryImages,
} from "@/data/restaurant";
import { todaysSpecial, menuItems, deals } from "@/data/menu";
import { formatPrice } from "@/lib/utils";
import { defaultWhatsAppLink, telLink } from "@/lib/whatsapp";

const featuredItems = menuItems.filter((item) =>
  item.badges.includes("Popular") || item.badges.includes("Chef's Choice") || item.badges.includes("Best Seller")
).slice(0, 8);

const popularCategories = [
  { id: "burgers", name: "Burgers", icon: "🍔", count: 4, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { id: "pizza", name: "Pizza", icon: "🍕", count: 5, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop" },
  { id: "fried-chicken", name: "Fried Chicken", icon: "🍗", count: 3, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop" },
  { id: "bbq", name: "BBQ", icon: "🍖", count: 3, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  { id: "pasta", name: "Pasta", icon: "🍝", count: 4, image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop" },
  { id: "desserts", name: "Desserts", icon: "🍰", count: 3, image: "https://images.unsplash.com/photo-1624353365286-3c8d6f5e5c8c?w=400&h=300&fit=crop" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop"
            alt="Al Baik Fast Food Restaurant"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge variant="popular" size="lg" className="mb-5 sm:mb-6 inline-flex text-center">
              <span className="mr-2">🔥</span>
              Flame-Grilled Perfection Since 2020
            </Badge>
            <h1 className="text-[2.25rem] leading-[1.12] sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6">
              Where Flavor{" "}
              <span className="gradient-text">Meets Fire</span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-2xl">
              Experience the authentic taste of flame-grilled burgers, wood-fired pizzas,
              slow-smoked BBQ, and handcrafted pasta. Fresh ingredients, bold flavors,
              delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/menu" className="w-full sm:w-auto sm:inline-block">
                <Button variant="primary" size="xl" className="w-full sm:w-auto" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Order Now
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto sm:inline-block">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20">
                  View Menu
                </Button>
              </Link>
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto sm:inline-block"
              >
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white text-white hover:bg-white/10" leftIcon={<MessageCircle className="h-5 w-5" />}>
                  WhatsApp
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base text-white/80">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-400" />
                <span>{restaurantInfo.deliveryTime} Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-400" />
                <span>Fresh Ingredients Daily</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span>10,000+ Happy Customers</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Today's Special */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={todaysSpecial.image}
                alt={todaysSpecial.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <Badge variant="danger" size="lg" className="absolute top-4 left-4">
                {todaysSpecial.badge}
              </Badge>
            </div>
            <div>
              <Badge variant="new" className="mb-4 inline-block">Today's Special</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {todaysSpecial.name}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {todaysSpecial.description}
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-amber-600">
                  {formatPrice(todaysSpecial.price)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(todaysSpecial.originalPrice)}
                </span>
                <Badge variant="success" className="ml-auto">
                  Save {formatPrice(todaysSpecial.originalPrice - todaysSpecial.price)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  Available until {todaysSpecial.availableUntil}
                </span>
              </div>
              <Link href="/menu">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} className="w-full sm:w-auto">
                  Order Today's Special
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most loved menu categories, each crafted with passion and the finest ingredients.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/menu?category=${category.id}`}
                  className="group block relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-3xl mb-1 block">{category.icon}</span>
                    <h3 className="font-semibold text-white">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.count} items</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Featured Dishes
              </h2>
              <p className="text-gray-600">Our most popular items loved by customers</p>
            </div>
            <Link href="/menu" className="mt-4 sm:mt-0">
              <Button variant="ghost" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MenuItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Special Deals & Offers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Save more with our curated meal deals. Perfect for sharing with family and friends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.slice(0, 3).map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DealCard deal={deal} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/deals">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                View All Deals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Al Baik Fast Food?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to delivering an exceptional dining experience every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="popular" className="mb-4 inline-block">
                Our Story
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Passion for Flavor, Commitment to Quality
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Founded in 2020, Al Baik Fast Food was born from a simple idea: great food
                starts with fire. Our flame-grilling technique locks in natural flavors
                while creating that irresistible smoky char you can't get anywhere else.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Every ingredient is hand-selected daily. Our beef is 100% halal, our
                chicken is free-range, and our vegetables come from local farms. We
                believe you can taste the difference.
              </p>
              <Link href="/about">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />} className="bg-white text-gray-900 hover:bg-gray-100">
                  Learn Our Story
                </Button>
              </Link>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                alt="Al Baik Fast Food Kitchen"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-100">
                    <ChefHat className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Head Chef: Marco Rossi</p>
                    <p className="text-sm text-gray-600">15+ years culinary experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Hear from our satisfied customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="py-12 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <InfoCard
              icon={<Truck className="h-6 w-6" />}
              title="Fast Delivery"
              description={`${restaurantInfo.deliveryTime} to your door`}
            />
            <InfoCard
              icon={<Shield className="h-6 w-6" />}
              title="Quality Guaranteed"
              description="Fresh ingredients daily"
            />
            <InfoCard
              icon={<Heart className="h-6 w-6" />}
              title="Made with Love"
              description="Handcrafted recipes"
            />
            <InfoCard
              icon={<Award className="h-6 w-6" />}
              title="Award Winning"
              description="Best Burger 2023-2024"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready for an Unforgettable Meal?
            </h2>
            <p className="text-xl text-amber-100 mb-8 leading-relaxed">
              Join thousands of satisfied customers. Order now and taste the difference
              of flame-grilled perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/menu" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto bg-white text-amber-600 hover:bg-gray-100" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Order Now
                </Button>
              </Link>
              <Link href="/deals" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                  View Deals
                </Button>
              </Link>
            </div>

            {/* Quick contact CTAs */}
            <div className="mt-6 grid grid-cols-1 sm:flex sm:justify-center gap-3">
              <a
                href={telLink()}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold transition-colors"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <a
                href={defaultWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1eb955] text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={restaurantInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold transition-colors"
              >
                <MapPin className="h-4 w-4" /> Get Directions
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function MenuItemCard({ item }: { item: any }) {
  return (
    <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col">
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
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-1">{item.description}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-amber-600">{formatPrice(item.price)}</span>
          <span className="text-sm text-gray-500">{item.prepTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DealCard({ deal }: { deal: any }) {
  return (
    <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col relative">
      {deal.popular && (
        <Badge variant="popular" className="absolute top-3 left-3 z-10">
          {deal.badge}
        </Badge>
      )}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={deal.image}
          alt={deal.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="font-bold text-white">{deal.name}</h3>
          <p className="text-white/80 text-sm">{deal.description}</p>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <ul className="space-y-2 text-sm text-gray-600 flex-1">
          {deal.items.slice(0, 4).map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500">✓</span>
              <span>{item}</span>
            </li>
          ))}
          {deal.items.length > 4 && (
            <li className="text-amber-600 font-medium">+{deal.items.length - 4} more items</li>
          )}
        </ul>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-amber-600">{formatPrice(deal.discountedPrice)}</span>
            <span className="text-gray-400 line-through ml-2">{formatPrice(deal.originalPrice)}</span>
          </div>
          <Badge variant="success">{deal.discountPercent}% OFF</Badge>
        </div>
        <Link href="/deals" className="mt-3">
          <Button variant="primary" fullWidth size="sm">
            Add to Cart
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  const icons = {
    flame: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
    leaf: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    truck: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
    award: <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };

  return (
    <Card variant="outlined" hover className="text-center p-6 h-full">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
        {icons[feature.icon as keyof typeof icons] || icons.flame}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </Card>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card variant="outlined" hover className="p-6 h-full">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={i < testimonial.rating ? "h-5 w-5 text-amber-400 fill-current" : "h-5 w-5 text-gray-300"}
            fill={i < testimonial.rating ? "currentColor" : "none"}
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
        </div>
      </div>
    </Card>
  );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-center gap-4 text-white">
      <div className="p-3 rounded-xl bg-white/10 text-amber-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    </div>
  );
}