import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES, LOCATIONS } from "@/data/mockData";
import { ArrowLeft, X, Loader2, ImagePlus } from "lucide-react";
import { postItemSchema, PostItemFormValues } from "@/lib/validationSchemas";

export default function PostItem() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") as "lost" | "found" || "lost";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [itemType, setItemType] = useState<"lost" | "found">(initialType);
  const [images, setImages] = useState<string[]>([]);

  const initialValues: PostItemFormValues = {
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    reward: false,
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload up to 5 images.",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values: PostItemFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Item posted successfully!",
      description: `Your ${itemType} item has been listed.`,
    });

    navigate("/browse");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Post an Item</CardTitle>
            <CardDescription>
              Help others find their belongings or report something you've lost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={itemType}
              onValueChange={(v) => setItemType(v as "lost" | "found")}
              className="mb-6"
            >
              <TabsList className="w-full">
                <TabsTrigger value="lost" className="flex-1">
                  I Lost Something
                </TabsTrigger>
                <TabsTrigger value="found" className="flex-1">
                  I Found Something
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Formik
              initialValues={initialValues}
              validationSchema={postItemSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting, values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Item Name */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Item Name *</Label>
                    <Field
                      as={Input}
                      id="title"
                      name="title"
                      placeholder="e.g., iPhone 14 Pro, Black Backpack"
                      className={errors.title && touched.title ? "border-destructive" : ""}
                    />
                    {errors.title && touched.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select
                      value={values.category}
                      onValueChange={(value) => setFieldValue("category", value)}
                    >
                      <SelectTrigger
                        className={errors.category && touched.category ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && touched.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      placeholder="Describe the item in detail. Include color, brand, distinguishing features..."
                      rows={4}
                      className={errors.description && touched.description ? "border-destructive" : ""}
                    />
                    {errors.description && touched.description && (
                      <p className="text-sm text-destructive">{errors.description}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label>
                      {itemType === "lost" ? "Last Seen Location" : "Found Location"} *
                    </Label>
                    <Select
                      value={values.location}
                      onValueChange={(value) => setFieldValue("location", value)}
                    >
                      <SelectTrigger
                        className={errors.location && touched.location ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && touched.location && (
                      <p className="text-sm text-destructive">{errors.location}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      {itemType === "lost" ? "Date Lost" : "Date Found"} *
                    </Label>
                    <Field
                      as={Input}
                      id="date"
                      name="date"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      className={errors.date && touched.date ? "border-destructive" : ""}
                    />
                    {errors.date && touched.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <Label>Photos (up to 5)</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                        >
                          <img
                            src={img}
                            alt={`Upload ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 h-5 w-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {images.length < 5 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                          <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Adding photos increases the chance of finding your item
                    </p>
                  </div>

                  {/* Reward Checkbox (only for lost items) */}
                  {itemType === "lost" && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="reward"
                        checked={values.reward}
                        onCheckedChange={(checked) =>
                          setFieldValue("reward", checked as boolean)
                        }
                      />
                      <Label htmlFor="reward" className="text-sm font-normal">
                        I'm offering a reward for finding this item
                      </Label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      `Post ${itemType === "lost" ? "Lost" : "Found"} Item`
                    )}
                  </Button>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
