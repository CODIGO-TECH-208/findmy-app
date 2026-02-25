import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ItemCard } from "@/components/items/ItemCard";
import { PromoFlyerCard } from "@/components/items/PromoFlyerCard";
import { useDatabaseStore } from "@/stores/databaseStore";
import {
  Search, MapPin, MessageCircle, CheckCircle, ArrowRight,
  Sparkles, Shield, Users, Zap, ChevronRight
} from "lucide-react";
import logo from "@/assets/findmy-logo.png";
import logo_dark from "@/assets/findmy-logo-dark.png";
import heroBg from "@/assets/hero-bg.jpg";
import promoSafe from "@/assets/promo-safe.jpg";
import promoCommunity from "@/assets/promo-community.jpg";
import promoNotifications from "@/assets/promo-notifications.jpg";
import promoMessaging from "@/assets/promo-messaging.jpg";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Landing() {
  const navigate = useNavigate();
  const items = useDatabaseStore((s) => s.items);
  const getStats = useDatabaseStore((s) => s.getStats);
  const stats = getStats();
  const recentItems = items.slice(0, 6);

  const promoSlides = [
    { image: promoSafe, title: "Safe & Secure", description: "Verified UG students only. Your safety is our priority." },
    { image: promoCommunity, title: "Community Driven", description: "Join thousands of students helping each other find lost items." },
    { image: promoNotifications, title: "Instant Notifications", description: "Get alerted immediately when someone finds your item." },
    { image: promoMessaging, title: "Easy Communication", description: "Built-in messaging to connect with finders or owners." },
  ];

  const features = [
    { icon: Search, title: "Smart Search", description: "Quickly find your items with category filters and location-based search across campus." },
    { icon: Shield, title: "Verified & Safe", description: "Only verified UG students can post and claim. Your security is our top priority." },
    { icon: Zap, title: "Instant Alerts", description: "Get notified immediately when someone finds an item matching your description." },
  ];

  const steps = [
    { icon: Search, title: "Report or Search", description: "Post your lost item or browse found items on campus", step: "01" },
    { icon: MessageCircle, title: "Connect", description: "Chat with finders or owners to verify ownership", step: "02" },
    { icon: CheckCircle, title: "Reunite", description: "Meet safely on campus to recover your belongings", step: "03" },
  ];

  return (
    <Layout showMobileNav={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/85 dark:bg-background/90" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <Badge variant="secondary" className="mb-6 py-1.5 px-4"><Sparkles className="h-3.5 w-3.5 mr-1.5" />University of Ghana Campus</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-bold text-foreground mb-6 leading-[1.1]">
                Lost something? <span className="text-primary">We'll help you</span> find it.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                The easiest way for UG students to report lost items and find their belongings. Join thousands of students helping each other.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={() => navigate("/register")} className="gap-2 h-12 px-6 rounded-full">Get Started<ArrowRight className="h-4 w-4" /></Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/browse")} className="h-12 px-6 rounded-full">Browse Items</Button>
              </div>
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-border/50">
                <div><p className="text-2xl font-bold text-foreground">{stats.itemsRecovered.toLocaleString()}</p><p className="text-xs text-muted-foreground">Items Recovered</p></div>
                <div className="w-px h-10 bg-border" />
                <div><p className="text-2xl font-bold text-foreground">{stats.registeredUsers.toLocaleString()}</p><p className="text-xs text-muted-foreground">Students</p></div>
                <div className="w-px h-10 bg-border" />
                <div><p className="text-2xl font-bold text-primary">{stats.successRate}%</p><p className="text-xs text-muted-foreground">Success Rate</p></div>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative">
                <div className="absolute -inset-8 rounded-full bg-primary/5 blur-3xl" />
                <div className="relative bg-card/80 backdrop-blur rounded-3xl p-8 shadow-card border border-border/50">
                  <img src={logo} alt="FindMy" className="size-40 object-contain dark:hidden" />
                  <img src={logo_dark} alt="FindMy" className="size-40 object-contain hidden dark:block" />
                  <div className="mt-4 text-center">
                    <p className="font-display font-bold text-xl text-foreground">FindMy</p>
                    <p className="text-sm text-muted-foreground">Campus Lost & Found</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-8 bg-success text-success-foreground rounded-full px-3 py-1.5 text-xs font-medium shadow-lg animate-bounce">{stats.activeListings} Active</div>
                <div className="absolute -bottom-4 -left-6 bg-card border rounded-full px-3 py-1.5 text-xs font-medium shadow-lg flex items-center gap-1.5"><Users className="h-3 w-3 text-primary" />{stats.registeredUsers.toLocaleString()} users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4"><Sparkles className="h-3 w-3 mr-1" />Services</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">What We Do</h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-card hover:-translate-y-1 transition-all border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><feature.icon className="h-7 w-7" /></div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <Button variant="link" className="mt-3 text-primary gap-1 p-0 h-auto text-sm">Learn more <ChevronRight className="h-3 w-3" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Carousel */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Why Choose FindMy?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">The most trusted lost and found platform for UG students</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Carousel className="w-full" opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 3000 })]}>
              <CarouselContent>{promoSlides.map((slide, index) => (<CarouselItem key={index} className="basis-full md:basis-1/2"><PromoFlyerCard image={slide.image} title={slide.title} description={slide.description} /></CarouselItem>))}</CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to reunite with your lost belongings</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-5xl font-display font-bold text-primary/10 mb-2">{step.step}</div>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"><step.icon className="h-8 w-8" /></div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Recently Posted Items</h2>
              <p className="text-muted-foreground">Latest lost and found items on campus</p>
            </div>
            <Button variant="outline" asChild className="rounded-full"><Link to="/browse">View All<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <Carousel className="w-full" opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 4000 })]}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {recentItems.map((item) => (<CarouselItem key={item.id} className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"><ItemCard item={item} /></CarouselItem>))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Find What's Yours?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Join the FindMy community and never lose track of your belongings again.</p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/register")} className="rounded-full h-12 px-8">Get Started for Free</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo_dark} alt="FindMy" className="h-8 w-8 rounded-lg object-cover hidden dark:block" />
              <img src={logo} alt="FindMy" className="h-8 w-8 rounded-lg object-cover dark:hidden" />
              <span className="font-semibold">FindMy</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 FindMy. Made for University of Ghana students.</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Legon, Accra</div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
