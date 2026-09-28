"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import { deals, todaysSpecial } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Gift, Clock, Users } from "lucide-react";

export default function DealsPage() {
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const handleAddDeal = (deal: any) => {
    // Add deal as a special cart item
    addItem({
      id: deal.id,
      name: deal.name,
      price: deal.discountedPrice,
      image: deal.image,
      description: deal.description,
      category: "deals",
      badges: [deal.badge],
      spicyLevel: 0,
      prepTime: "25 min",
    } as any);
    showToast(`${deal.name} added to cart!`, "success");
    openCart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <Badge variant="popular" size="lg" className="mb-4 inline-flex">
              <Gift className="h-4 w-4 mr-2" />
              Special Offers
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Save More with Our{" "}
              <span className="text-amber-200">Meal Deals</span>
            </h1>
            <p className="text-xl text-amber-100 leading-relaxed">
              Curated combinations for every occasion. Perfect for sharing with
              family, friends, or treating yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Today's Special */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={todaysSpecial.image}
                  alt={todaysSpecial.name}
                  className="w-full h-full object-cover"
                />
                <Badge variant="danger" size="lg" className="absolute top-4 left-4">
                  {todaysSpecial.badge}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Available until</p>
                      <p className="text-lg font-bold text-amber-600">{todaysSpecial.availableUntil}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Prep Time</p>
                      <p className="text-lg font-bold text-gray-900">20 min</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Badge variant="new" className="mb-4 inline-block">Chef's Special Today</Badge>
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
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Ready in 20 min
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Serves 1-2
                </span>
              </div>
              <Button variant="primary" size="lg" onClick={() => handleAddDeal({...todaysSpecial, id: todaysSpecial.id})} rightIcon={<ArrowRight className="h-5 w-5" />}>
                Add to Cart - {formatPrice(todaysSpecial.price)}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              All Meal Deals
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our selection of value-packed combos. Each deal is designed
              to give you the best bang for your buck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DealCard deal={deal} onAddToCart={handleAddDeal} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Deals */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Gift className="h-8 w-8" />}
              title="Up to 30% Off"
              description="Save significantly compared to ordering items individually"
            />
            <BenefitCard
              icon={<Users className="h-8 w-8" />}
              title="Perfect for Sharing"
              description="Designed for couples, families, and groups of all sizes"
            />
            <BenefitCard
              icon={<Clock className="h-8 w-8" />}
              title="Ready Fast"
              description="Pre-configured combos mean faster kitchen prep time"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Didn't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Build your own combo or check out our full menu for more options.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Browse Full Menu
            </Button>
            <Button variant="outline" size="xl" className="border-white text-white hover:bg-white/10">
              View All Deals
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DealCard({ deal, onAddToCart }: { deal: any; onAddToCart: (deal: any) => void }) {
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg">{deal.name}</h3>
          <p className="text-white/80 text-sm mt-1">{deal.description}</p>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-5">
        <ul className="space-y-2 text-sm text-gray-600 flex-1">
          {deal.items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <svg className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-amber-600">{formatPrice(deal.discountedPrice)}</span>
            <span className="text-gray-400 line-through ml-2">{formatPrice(deal.originalPrice)}</span>
          </div>
          <Badge variant="success">{deal.discountPercent}% OFF</Badge>
        </div>
        <Button
          variant="primary"
          fullWidth
          className="mt-3"
          onClick={() => onAddToCart(deal)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card variant="outlined" hover className="p-6 text-center">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
}