import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { ItemCard } from "@/components/items/ItemCard";
import { mockItems, mockStats } from "@/data/mockData";
import { Search, MapPin, MessageCircle, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const recentItems = mockItems.slice(0, 4);

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
      <section className="relative overflow-hidden gradient-hero">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img
                src={logo}
                alt="FindMy Logo"
                className="h-20 w-20 rounded-2xl shadow-soft object-cover"
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

      {/* How It Works */}
      <section className="py-16 bg-card">
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

      {/* Recent Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Recently Posted
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
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
