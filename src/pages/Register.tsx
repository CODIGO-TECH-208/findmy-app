import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { registerSchema, RegisterFormValues } from "@/lib/validationSchemas";
import logo from "@/assets/findmy-logo.png";
import authIllustration from "@/assets/auth-illustration.jpg";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialValues: RegisterFormValues = {
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const success = await register({
        name: values.name,
        phone: values.phone,
        password: values.password,
      });

      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to FindMy. Start exploring!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Registration failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Illustration Panel */}
      <div className="relative w-full lg:w-1/2 min-h-[280px] lg:min-h-screen bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center overflow-hidden">
        <img
          src={authIllustration}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-background/20 lg:to-background/60" />
        <div className="relative z-10 p-8 text-center lg:text-left max-w-md">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="FindMy" className="size-14 object-contain" />
          </Link>
          <h2 className="text-2xl lg:text-3xl font-bold font-display text-white drop-shadow-lg">
            Find what you've lost,
            <br />
            one step at a time.
          </h2>
          <p className="mt-2 text-white/80 text-sm drop-shadow">
            The UG community's trusted lost & found platform.
          </p>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-0 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold font-display">Create Account</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Join the FindMy community at UG
              </p>
            </div>
            <Link
              to="/login"
              className="text-sm text-primary hover:underline font-medium hidden lg:block"
            >
              Log in
            </Link>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Kwame Asante"
                    className={`h-11 ${errors.name && touched.name ? "border-destructive" : ""}`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0241234567"
                    className={`h-11 ${errors.phone && touched.phone ? "border-destructive" : ""}`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`h-11 ${errors.password && touched.password ? "border-destructive" : ""}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`h-11 ${errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""}`}
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" className="w-full h-11 rounded-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-muted-foreground lg:hidden">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
