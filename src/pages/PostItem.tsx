import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CATEGORIES, LOCATIONS, ItemCategory, Item } from "@/data/mockData";
import { useDatabaseStore } from "@/stores/databaseStore";
import { ArrowLeft, X, Loader2, ImagePlus, Info, CheckCircle2, ShieldCheck, Camera } from "lucide-react";
import { postItemSchema, PostItemFormValues } from "@/lib/validationSchemas";

export default function PostItem() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") as "lost" | "found" || "lost";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const addItem = useDatabaseStore((s) => s.addItem);
  const updateItem = useDatabaseStore((s) => s.updateItem);
  const getItemById = useDatabaseStore((s) => s.getItemById);

  const [itemType, setItemType] = useState<"lost" | "found">(initialType);
  const [images, setImages] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<PostItemFormValues>({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    reward: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({ title: "Identification Required", description: "You must be logged in to post or edit an item.", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (isEditMode) {
      const existingItem = getItemById(id!);
      if (existingItem) {
        if (user && existingItem.userId !== user.id) {
          toast({ title: "Access Denied", description: "You can only edit your own listings.", variant: "destructive" });
          navigate("/browse");
          return;
        }
        setInitialValues({
          title: existingItem.title,
          category: existingItem.category,
          description: existingItem.description,
          location: existingItem.location,
          date: existingItem.date,
          reward: !!existingItem.reward
        });
        setItemType(existingItem.type);
        setImages(existingItem.images);
      } else {
        toast({ title: "Not Found", description: "The item you're trying to edit doesn't exist.", variant: "destructive" });
        navigate("/browse");
      }
    }
  }, [id, isAuthenticated, navigate, toast, getItemById, user, isEditMode]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (images.length + files.length > 5) {
      toast({ title: "Limit reached", description: "Maximum 5 photos allowed.", variant: "destructive" });
      return;
    }
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => { setImages((prev) => [...prev, e.target?.result as string]); };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => { setImages((prev) => prev.filter((_, i) => i !== index)); };

  const handleSubmit = async (values: PostItemFormValues, { setSubmitting }: FormikHelpers<PostItemFormValues>) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (user) {
      if (isEditMode) {
        updateItem(id!, {
          title: values.title,
          description: values.description,
          category: values.category as ItemCategory,
          type: itemType,
          images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"],
          location: values.location,
          date: values.date,
          reward: values.reward,
        });
        toast({ title: "Update Successful", description: "Your listing has been updated." });
      } else {
        addItem({
          id: `it-${Date.now()}`,
          title: values.title,
          description: values.description,
          category: values.category as ItemCategory,
          type: itemType,
          status: "active",
          images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"],
          location: values.location,
          date: values.date,
          createdAt: new Date().toISOString(),
          userId: user.id,
          user: user,
          reward: values.reward,
          views: 0,
        });
        toast({ title: "Successful Listing", description: "Your item is now live and visible to the UG community." });
      }
    }

    setSubmitting(false);
    navigate(isEditMode ? `/item/${id}` : "/browse");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-2">
              <Button variant="outline" size="icon" className="rounded-full h-10 w-10 shadow-sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-extrabold tracking-tight">{isEditMode ? "Edit Listing" : "Create Listing"}</h1>
            </div>

            <Card className="border-none shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <Tabs value={itemType} onValueChange={(v) => setItemType(v as "lost" | "found")} className="w-full">
                  <TabsList className="grid grid-cols-2 h-14 p-1 bg-muted/50 rounded-2xl">
                    <TabsTrigger value="lost" className="rounded-xl text-base font-semibold data-[state=active]:bg-destructive data-[state=active]:text-white">
                      I Lost Something
                    </TabsTrigger>
                    <TabsTrigger value="found" className="rounded-xl text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">
                      I Found Something
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="pt-2">
                <Formik initialValues={initialValues} validationSchema={postItemSchema} onSubmit={handleSubmit} enableReinitialize>
                  {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                    <Form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Item Name *</Label>
                          <Field as={Input} id="title" name="title" placeholder="e.g., iPhone 14 Pro, Blue Hoodie" className={`h-12 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-primary ${errors.title && touched.title ? "border-destructive ring-destructive" : ""}`} />
                          {errors.title && touched.title && <p className="text-xs font-medium text-destructive mt-1">{errors.title}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
                          <Select value={values.category} onValueChange={(value) => setFieldValue("category", value)}>
                            <SelectTrigger className={`h-12 bg-background border-muted-foreground/20 rounded-xl ${errors.category && touched.category ? "border-destructive ring-destructive" : ""}`}>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value} className="py-2.5">
                                  <span className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                      <CategoryIcon icon={cat.icon} className="h-4 w-4" />
                                    </div>
                                    <span className="font-medium">{cat.label}</span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.category && touched.category && <p className="text-xs font-medium text-destructive mt-1">{errors.category}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Detailed Description *</Label>
                        <Field as={Textarea} id="description" name="description" placeholder="Mention special marks, color, brand, or contents..." rows={4} className={`bg-background border-muted-foreground/20 rounded-xl resize-none focus-visible:ring-primary ${errors.description && touched.description ? "border-destructive ring-destructive" : ""}`} />
                        {errors.description && touched.description && <p className="text-xs font-medium text-destructive mt-1">{errors.description}</p>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{itemType === "lost" ? "Last Seen At" : "Discovery Location"} *</Label>
                          <Select value={values.location} onValueChange={(value) => setFieldValue("location", value)}>
                            <SelectTrigger className={`h-12 bg-background border-muted-foreground/20 rounded-xl ${errors.location && touched.location ? "border-destructive ring-destructive" : ""}`}>
                              <SelectValue placeholder="Where on campus?" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/50">
                              {LOCATIONS.map((loc) => (<SelectItem key={loc} value={loc} className="py-2.5">{loc}</SelectItem>))}
                            </SelectContent>
                          </Select>
                          {errors.location && touched.location && <p className="text-xs font-medium text-destructive mt-1">{errors.location}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="date" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Date *</Label>
                          <Field as={Input} id="date" name="date" type="date" max={new Date().toISOString().split("T")[0]} className={`h-12 bg-background border-muted-foreground/20 rounded-xl focus-visible:ring-primary ${errors.date && touched.date ? "border-destructive ring-destructive" : ""}`} />
                          {errors.date && touched.date && <p className="text-xs font-medium text-destructive mt-1">{errors.date}</p>}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Camera className="h-4 w-4 text-primary" /> Gallery (up to 5)
                        </Label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border shadow-inner group">
                              <img src={img} alt={`Upload ${index + 1}`} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                              <button type="button" onClick={() => removeImage(index)} className="absolute top-1.5 right-1.5 h-6 w-6 bg-destructive/90 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-destructive transition-colors">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          {images.length < 5 && (
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all group">
                              <div className="h-10 w-10 rounded-full bg-background shadow-sm flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                                <ImagePlus className="h-5 w-5" />
                              </div>
                              <span className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter">Add Photo</span>
                              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                            </label>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 italic">
                          <Info className="h-3 w-3" /> Visual evidence significantly improves claim success.
                        </p>
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                        {itemType === "lost" && (
                          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                            <Checkbox id="reward" checked={values.reward} onCheckedChange={(checked) => setFieldValue("reward", checked as boolean)} className="h-5 w-5 rounded-md" />
                            <Label htmlFor="reward" className="text-sm font-semibold text-primary/90 flex items-center gap-2 cursor-pointer">
                               I am offering a token of appreciation/reward
                            </Label>
                          </div>
                        )}

                        <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> {isEditMode ? "Updating..." : "Publishing..."}</>
                          ) : (
                            isEditMode ? "Save Changes" : `List My ${itemType === "lost" ? "Lost" : "Found"} Item`
                          )}
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-primary/5 bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" /> Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">Be specific with descriptions but leave out some unique owner-only detail for verification.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">Always meet in well-lit, public areas on UG campus for item exchanges.</p>
                </div>
                <div className="flex gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">Use the built-in messaging to communicate safely without sharing personal phone numbers.</p>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl p-6 bg-card border border-border/50 shadow-sm relative overflow-hidden">
               <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                 <Info className="h-4 w-4 text-primary" /> Common Locations
               </h3>
               <div className="flex flex-wrap gap-2">
                  {LOCATIONS.slice(0, 8).map(loc => (
                    <Badge key={loc} variant="outline" className="rounded-lg py-1 px-3 bg-muted/30 border-muted">
                      {loc}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground font-medium pl-1">and more...</span>
               </div>
               <div className="absolute -bottom-8 -right-8 h-24 w-24 bg-primary/5 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
