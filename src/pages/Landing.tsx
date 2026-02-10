import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ItemCard } from "@/components/items/ItemCard";
import { mockItems, mockStats } from "@/data/mockData";
import { Search, MapPin, MessageCircle, CheckCircle, ArrowRight, Sparkles, Shield, Users, Bell } from "lucide-react";
import logo from "@/assets/findmy-logo.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function Landing() {
  const navigate = useNavigate();
  const recentItems = mockItems.slice(0, 6);

  const promoSlides = [
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified UG students only. Your safety is our priority.",
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of students helping each other find lost items.",
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      description: "Get alerted immediately when someone finds your item.",
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      icon: MessageCircle,
      title: "Easy Communication",
      description: "Built-in messaging to connect with finders or owners.",
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    },
  ];

  const steps = [
    {
      icon: Search,
      title: "Report or Search",
      description: "Post your lost item or browse found items on campus",
    },
    {
      icon: MessageCircle,
      title: "Connect",
      description: "Chat with finders or owners to verify ownership",
    },
    {
      icon: CheckCircle,
      title: "Reunite",
      description: "Meet safely on campus to recover your belongings",
    },
  ];

  return (
    <Layout showMobileNav={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero px-4">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="FindMy Logo"
                className="size-[120px] object-contain"
              />
            </div>
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              University of Ghana Campus
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Lost something?{" "}
              <span className="text-primary">Found something?</span>
              <br />
              We'll help you reconnect.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              FindMy is the easiest way for UG students to report lost items and
              find their belongings. Join thousands of students helping each other.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/register")} className="gap-2">
                Report Lost Item
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/register")}
              >
                I Found Something
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-primary">
                  {mockStats.itemsRecovered.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Items Recovered</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-primary">
                  {mockStats.activeListings}
                </p>
                <p className="text-sm text-muted-foreground">Active Listings</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-primary">
                  {mockStats.registeredUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Students</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-primary">
                  {mockStats.successRate}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Promotional Carousel */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10 px-4">
        <div className="container mx-auto px-4">
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
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent>
                {promoSlides.map((slide, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <div className={`flex items-center justify-center h-16 w-16 rounded-full ${slide.color} mb-4`}>
                          <slide.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          {slide.title}
                        </h3>
                        <p className="text-muted-foreground">{slide.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-card px-4">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Three simple steps to reunite with your lost belongings
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                    <step.icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Items Carousel */}
      <section className="py-16 px-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Recently Posted Items
              </h2>
              <p className="text-muted-foreground">
                Latest lost and found items on campus
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <Carousel
            className="w-full"
            opts={{ align: "start", loop: true }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {recentItems.map((item) => (
                <CarouselItem key={item.id} className="pl-2 md:pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ItemCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">Ready to Find What's Yours?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join the FindMy community and never lose track of your belongings again.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/register")}
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FindMy" className="h-8 w-8 rounded-lg object-cover" />
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
