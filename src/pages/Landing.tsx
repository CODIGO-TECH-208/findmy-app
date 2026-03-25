import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ItemCard } from "@/components/items/ItemCard";
import { PromoFlyerCard } from "@/components/items/PromoFlyerCard";
import { useDatabaseStore } from "@/stores/databaseStore";
import {
  Search,
  MapPin,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Users,
  Zap,
  ChevronRight,
  HelpCircle,
  Play,
} from "lucide-react";
import logo from "@/assets/findmy-logo.png";
import logo_dark from "@/assets/findmy-logo-dark.png";
import heroImage from "@/assets/findmy_hero_png_1774455499549.png";
import promoSafe from "@/assets/promo-safe.jpg";
import promoCommunity from "@/assets/promo-community.jpg";
import promoNotifications from "@/assets/promo-notifications.jpg";
import promoMessaging from "@/assets/promo-messaging.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import demoVideo from "@/assets/demo-vid.mp4";
import demoThumbnail from "@/assets/demo-thumbnail.png";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const items = useDatabaseStore((s) => s.items);
  const getStats = useDatabaseStore((s) => s.getStats);
  const stats = getStats();
  const recentItems = items.slice(0, 6);

  const promoSlides = [
    {
      image: promoSafe,
      title: "Safe & Secure",
      description: "Verified UG students only. Your safety is our priority.",
    },
    {
      image: promoCommunity,
      title: "Community Driven",
      description:
        "Join thousands of students helping each other find lost items.",
    },
    {
      image: promoNotifications,
      title: "Instant Notifications",
      description: "Get alerted immediately when someone finds your item.",
    },
    {
      image: promoMessaging,
      title: "Easy Communication",
      description: "Built-in messaging to connect with finders or owners.",
    },
  ];

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description:
        "Quickly find your items with category filters and location-based search across campus.",
    },
    {
      icon: Shield,
      title: "Verified & Safe",
      description:
        "Only verified UG students can post and claim. Your security is our top priority.",
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      description:
        "Get notified immediately when someone finds an item matching your description.",
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "Report or Search",
      description: "Post your lost item or browse found items on campus",
      step: "01",
    },
    {
      icon: MessageCircle,
      title: "Connect",
      description: "Chat with finders or owners to verify ownership",
      step: "02",
    },
    {
      icon: CheckCircle,
      title: "Reunite",
      description: "Meet safely on campus to recover your belongings",
      step: "03",
    },
  ];

  return (
    <Layout showMobileNav={false}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-12 lg:pt-0 lg:pb-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img
            src={heroImage}
            alt="University campus background"
            className="h-full w-full object-cover grayscale-[0.2] brightness-75 md:brightness-100"
          />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl text-center lg:text-left">
              <Badge
                variant="secondary"
                className="mb-6 py-1.5 px-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> University of Ghana
                Campus
              </Badge>

              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="h-12 w-32 bg-card/80 backdrop-blur rounded-xl p-2 shadow-sm border border-border/50 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="FindMy Logo"
                    className="h-full object-contain dark:hidden"
                  />
                  <img
                    src={logo_dark}
                    alt="FindMy Logo"
                    className="h-full object-contain hidden dark:block"
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                Lost it? Found it? <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
                  Let's reunite you.
                </span>
              </h1>

              <p className="text-xl text-foreground/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Connect with thousands of students at Legon in the smartest
                platform for lost and found items.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={() => navigate("/register")}
                  className="h-14 px-8 rounded-full text-lg shadow-lg hover:shadow-primary/25 transition-all"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/browse")}
                  className="h-14 px-8 rounded-full text-lg bg-background/50 backdrop-blur"
                >
                  Browse Items
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border/10 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    {stats.itemsRecovered.toLocaleString()}+
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                    Recovered
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    {stats.registeredUsers.toLocaleString()}+
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                    Users
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-primary">
                    {stats.successRate}%
                  </p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                    Success
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center relative scale-110">
              <div className="relative p-2 rounded-3xl bg-gradient-to-br from-primary/30 to-background/5 border border-primary/20 backdrop-blur-2xl">
                {/* Floating Badges */}
                <div className="absolute -top-12 -right-8 animate-bounce delay-100 shadow-2xl">
                  <Badge className="px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-2xl shadow-primary/20">
                    <Zap className="h-4 w-4 mr-2" /> {stats.activeListings}{" "}
                    Active Items
                  </Badge>
                </div>
                <div className="absolute -bottom-8 -left-12 animate-in slide-in-from-left duration-1000 shadow-2xl">
                  <div className="bg-card/90 border border-primary/20 backdrop-blur flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl shadow-background/50">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground leading-none">
                        Registered
                      </p>
                      <p className="text-base font-bold text-foreground">
                        {stats.registeredUsers.toLocaleString()} students
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-border shadow-2xl">
                  <img
                    src={heroImage}
                    alt="Success Stories"
                    className="w-full h-auto aspect-[4/5] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What We Do
            </h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-card hover:-translate-y-1 transition-all border-border/50"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Button
                    variant="link"
                    className="mt-3 text-primary gap-1 p-0 h-auto text-sm"
                  >
                    Learn more <ChevronRight className="h-3 w-3" />
                  </Button>
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
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Why Choose FindMy?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The most trusted lost and found platform for UG students
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Carousel
              className="w-full"
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 3000 })]}
            >
              <CarouselContent>
                {promoSlides.map((slide, index) => (
                  <CarouselItem key={index} className="basis-full md:basis-1/2">
                    <PromoFlyerCard
                      image={slide.image}
                      title={slide.title}
                      description={slide.description}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to reunite with your lost belongings
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-5xl font-display font-bold text-primary/10 mb-2">
                  {step.step}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-muted/30 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 mb-4 inline-flex items-center gap-2"
            >
              <Play className="h-4 w-4" /> User Guide
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              See FindMy in Action
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Watch this quick walkthrough to see how easy it is to find or
              report items.
            </p>
          </div>

          <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
            <DialogTrigger asChild>
              <Card className="border-none bg-black overflow-hidden relative min-h-[450px] flex items-center justify-center group cursor-pointer shadow-2xl shadow-primary/10 rounded-[2.5rem]">
                <div className="absolute inset-0 opacity-50 group-hover:opacity-30 transition-opacity">
                  <img
                    src={demoThumbnail}
                    alt="UG Campus Video Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center gap-8">
                  <div className="h-28 w-28 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Play className="h-12 w-12 text-white fill-white ml-2" />
                  </div>
                  <div className="text-center text-white px-6">
                    <h3 className="text-4xl font-black mb-3 tracking-tighter uppercase italic">
                      The UG FindMy Experience
                    </h3>
                    <div className="flex gap-2 justify-center">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                        0:30 mins
                      </Badge>
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                        HD Quality
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 flex items-center gap-3 text-white/50 text-sm font-medium">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />{" "}
                  Official Demo Video
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border border-primary/20 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] rounded-[2rem] sm:rounded-[2.5rem]">
              <div className="relative group/video">
                <video
                  src={demoVideo}
                  controls
                  autoPlay
                  className="w-full aspect-video h-full rounded-[2rem] sm:rounded-[2.5rem]"
                />

                {/* Subtle Overlay Branding */}
                <div className="absolute top-6 left-6 pointer-events-none opacity-40 group-hover/video:opacity-100 transition-opacity">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                      UG FindMy Official Demo
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Recent Items */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Recently Posted Items
              </h2>
              <p className="text-muted-foreground">
                Latest lost and found items on campus
              </p>
            </div>
            <Button variant="outline" asChild className="rounded-full">
              <Link to="/browse">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Carousel
            className="w-full"
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 4000 })]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recentItems.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ItemCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      {/* CTA section should only be visible for unauthenticated users */}
      {!isAuthenticated && (
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Find What's Yours?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join the FindMy community and never lose track of your belongings
              again.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/register")}
              className="rounded-full h-12 px-8"
            >
              Get Started for Free
            </Button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src={logo_dark}
                alt="FindMy"
                className="h-8 w-8 rounded-lg object-cover hidden dark:block"
              />
              <img
                src={logo}
                alt="FindMy"
                className="h-8 w-8 rounded-lg object-cover dark:hidden"
              />
              <span className="font-semibold">FindMy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 FindMy. Made for University of Ghana students.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Legon, Accra
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
