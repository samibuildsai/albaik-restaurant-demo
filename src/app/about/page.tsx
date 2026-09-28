"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui";
import { Badge } from "@/components/ui";
import { restaurantInfo, whyChooseUs, testimonials } from "@/data/restaurant";
import { ChefHat, Leaf, Truck, Award, Heart, Flame, Users, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
            alt="Al Baik Fast Food Restaurant Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="popular" size="lg" className="mb-6 inline-flex">
              <Flame className="h-4 w-4 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Where Flavor{" "}
              <span className="text-amber-300">Meets Fire</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Founded on a passion for flame-grilled perfection. Every dish tells a story
              of quality ingredients, time-honored techniques, and culinary excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <Badge variant="new" className="mb-4 inline-block">Our Journey</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                A Passion Born from Fire
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  Al Baik Fast Food was founded in 2020 by Chef Marco Rossi, a culinary veteran
                  with over 20 years of experience in some of the world's finest kitchens.
                  After traveling across continents studying fire-based cooking techniques,
                  he returned home with a vision: to bring authentic flame-grilled flavors
                  to his community.
                </p>
                <p>
                  What started as a small food truck serving flame-grilled burgers has grown
                  into a beloved restaurant known for its wood-fired pizzas, slow-smoked BBQ,
                  and handcrafted pasta. But our philosophy remains unchanged: great food
                  starts with fire.
                </p>
                <p>
                  Every morning, our chefs hand-select the freshest ingredients from local
                  farms and trusted suppliers. Our beef is 100% halal and grass-fed, our
                  chicken is free-range, and our vegetables are organic wherever possible.
                  We believe you can taste the difference in every bite.
                </p>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop"
                  alt="Chef Marco Rossi in the kitchen"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-100">
                      <ChefHat className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Head Chef Marco Rossi</p>
                      <p className="text-sm text-gray-600">20+ years culinary experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="popular" className="mb-4 inline-block">
                Our Philosophy
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Fire, Flavor, Family
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Three pillars that guide everything we do, from sourcing ingredients to
                serving our guests.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Flame,
                title: "Fire",
                description: "We cook over real flames — wood, charcoal, and gas. This ancient technique creates flavors impossible to replicate with modern shortcuts.",
                color: "text-amber-400",
                bg: "bg-amber-900/30",
              },
              {
                icon: Leaf,
                title: "Flavor",
                description: "Fresh, local, seasonal. We source from farmers we know, butchers we trust, and markets we visit daily. Quality ingredients need no masking.",
                color: "text-green-400",
                bg: "bg-green-900/30",
              },
              {
                icon: Users,
                title: "Family",
                description: "Every guest is family. Whether you're dining in, picking up, or ordering delivery — we treat your meal like we're cooking for our own table.",
                color: "text-red-400",
                bg: "bg-red-900/30",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="outlined" className={`border-gray-700 ${value.bg} p-8 h-full`}>
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                    <value.icon className="h-8 w-8" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Al Baik Fast Food?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We go the extra mile so you get the best meal every time.
              </p>
            </motion.div>
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

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Passionate professionals dedicated to your dining experience.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Marco Rossi", role: "Head Chef", experience: "20+ years", specialty: "Flame-Grilled & BBQ", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop&crop=face" },
              { name: "Sofia Ahmed", role: "Sous Chef", experience: "12 years", specialty: "Wood-Fired Pizza", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face" },
              { name: "James Chen", role: "Pasta Chef", experience: "15 years", specialty: "Handcrafted Pasta", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
              { name: "Maria Santos", role: "Pastry Chef", experience: "10 years", specialty: "Desserts & Bakery", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face" },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TeamCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="50,000+" label="Happy Customers" icon={Heart} />
            <StatCard number="5+" label="Years of Excellence" icon={Award} />
            <StatCard number="100+" label="Menu Items" icon={Flame} />
            <StatCard number="15+" label="Team Members" icon={Users} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Our Guests Say
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real reviews from real customers who've experienced the Al Baik Fast Food difference.
              </p>
            </motion.div>
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

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-amber-100 mb-8 leading-relaxed">
              Join thousands of satisfied customers. Taste the passion in every bite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/menu" className="inline-block">
                <button className="px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-lg">
                  Order Now
                </button>
              </a>
              <a href="/contact" className="inline-block">
                <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-lg">
                  Visit Us
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ feature }: { feature: any }) {
  const icons = {
    flame: Flame,
    leaf: Leaf,
    truck: Truck,
    award: Award,
  };

  const Icon = icons[feature.icon as keyof typeof icons] || Flame;

  return (
    <Card variant="outlined" hover className="p-6 text-center h-full">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </Card>
  );
}

function TeamCard({ member }: { member: any }) {
  return (
    <Card variant="elevated" hover className="overflow-hidden text-center">
      <div className="aspect-square overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-bold text-gray-900">{member.name}</h3>
        <p className="text-amber-600 font-medium mb-1">{member.role}</p>
        <p className="text-sm text-gray-500 mb-3">{member.specialty}</p>
        <p className="text-xs text-gray-400">{member.experience} experience</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  return (
    <Card variant="outlined" hover className="p-6 h-full">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={i < testimonial.rating ? "h-5 w-5 text-amber-400 fill-current" : "h-5 w-5 text-gray-300"}
            fill={i < testimonial.rating ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
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

function StatCard({ number, label, icon: Icon }: { number: string; label: string; icon: React.ComponentType<any> }) {
  return (
    <div className="p-6">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-amber-400" />
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-white">{number}</p>
      <p className="text-gray-400 mt-1">{label}</p>
    </div>
  );
}