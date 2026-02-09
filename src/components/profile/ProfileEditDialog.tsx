import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/data/mockData";
import { profileUpdateSchema } from "@/lib/validationSchemas";
import { Camera, Loader2 } from "lucide-react";

interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUpdate: (updatedUser: Partial<User>) => void;
}

export function ProfileEditDialog({
  open,
  onOpenChange,
  user,
  onUpdate,
}: ProfileEditDialogProps) {
  const { toast } = useToast();
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || "");

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            name: user.name,
            phone: user.phone,
          }}
          validationSchema={profileUpdateSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            onUpdate({
              name: values.name,
              phone: values.phone,
              avatar: avatarPreview || user.avatar,
            });

            toast({
              title: "Profile updated",
              description: "Your profile has been updated successfully.",
            });

            setSubmitting(false);
            onOpenChange(false);
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview} alt={user.name} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the camera icon to change photo
                </p>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  className={errors.name && touched.name ? "border-destructive" : ""}
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  placeholder="0241234567"
                  className={errors.phone && touched.phone ? "border-destructive" : ""}
                />
                <ErrorMessage
                  name="phone"
                  component="p"
                  className="text-sm text-destructive"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
