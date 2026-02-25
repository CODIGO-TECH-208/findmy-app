import { useState, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ItemGrid } from "@/components/items/ItemGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORIES, LOCATIONS } from "@/data/mockData";
import { useDatabaseStore } from "@/stores/databaseStore";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Browse() {
  const items = useDatabaseStore((s) => s.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [itemType, setItemType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (itemType !== "all") filtered = filtered.filter((item) => item.type === itemType);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
    }
    if (selectedCategory !== "all") filtered = filtered.filter((item) => item.category === selectedCategory);
    if (selectedLocation !== "all") filtered = filtered.filter((item) => item.location === selectedLocation);
    switch (sortBy) {
      case "newest": filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "oldest": filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      case "views": filtered.sort((a, b) => b.views - a.views); break;
    }
    return filtered;
  }, [items, searchQuery, selectedCategory, selectedLocation, sortBy, itemType]);

  const activeFiltersCount = [selectedCategory !== "all", selectedLocation !== "all"].filter(Boolean).length;
  const clearFilters = () => { setSelectedCategory("all"); setSelectedLocation("all"); setSearchQuery(""); };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Search through {items.length} items on campus</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by item name or description..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4" />Filters
              {activeFiltersCount > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">{activeFiltersCount}</Badge>}
            </Button>
          </div>

          {showFilters && (
            <div className="p-4 bg-card rounded-lg border animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {CATEGORIES.map((cat) => (<SelectItem key={cat.value} value={cat.value}><span className="flex items-center gap-2"><CategoryIcon icon={cat.icon} className="h-4 w-4" />{cat.label}</span></SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger><SelectValue placeholder="All Locations" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc}>{loc}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="views">Most Viewed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {activeFiltersCount > 0 && <Button variant="ghost" size="sm" className="mt-4 gap-2" onClick={clearFilters}><X className="h-4 w-4" />Clear all filters</Button>}
            </div>
          )}
        </div>

        <Tabs value={itemType} onValueChange={setItemType} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
            <TabsTrigger value="found">Found</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Showing {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}</p>
        </div>

        <ItemGrid items={filteredItems} emptyMessage="No items found. Try adjusting your filters." />
      </div>
    </Layout>
  );
}
