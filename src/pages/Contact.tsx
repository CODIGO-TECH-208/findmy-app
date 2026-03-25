import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  HelpCircle, Clock, ShieldCheck, Loader2 
} from "lucide-react";
import * as Yup from "yup";

const contactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().min(10, "Message too short").required("Message is required"),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsSubmittingManual(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "Admin will review your message and get back to you shortly.",
    });
    
    resetForm();
    setIsSubmittingManual(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 mb-4 inline-flex items-center gap-2">
            <Mail className="h-4 w-4" /> Reach Out
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions about a lost item or need technical support? 
            Our admin team is here to help you navigate FindMy UG.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-none bg-primary/5 shadow-none group overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>Direct lines to our campus support office.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Email Us</p>
                    <p className="font-semibold">support@findmyug.edu.gh</p>
                    <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Call Support</p>
                    <p className="font-semibold">+233 (0) 55 123 4567</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 8am - 5pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Office Location</p>
                    <p className="font-semibold">SRC Union Building</p>
                    <p className="text-xs text-muted-foreground">University of Ghana, Legon</p>
                  </div>
                </div>
              </CardContent>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: HelpCircle, label: "FAQs" },
                { icon: ShieldCheck, label: "Privacy" },
                { icon: MessageSquare, label: "Forum" },
                { icon: Clock, label: "Hours" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-muted/50 border border-border/50 text-center hover:bg-muted transition-colors cursor-pointer group">
                  <item.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <Formik
                  initialValues={{ name: "", email: "", subject: "", message: "" }}
                  validationSchema={contactSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                          <Field 
                            as={Input} 
                            id="name" 
                            name="name" 
                            placeholder="John Doe" 
                            className={`h-12 rounded-xl bg-background border-muted-foreground/20 focus-visible:ring-primary ${errors.name && touched.name ? "ring-2 ring-destructive" : ""}`}
                          />
                          {errors.name && touched.name && <p className="text-xs font-medium text-destructive mt-1">{errors.name as string}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                          <Field 
                            as={Input} 
                            id="email" 
                            name="email" 
                            type="email"
                            placeholder="j.doe@st.ug.edu.gh" 
                            className={`h-12 rounded-xl bg-background border-muted-foreground/20 focus-visible:ring-primary ${errors.email && touched.email ? "ring-2 ring-destructive" : ""}`}
                          />
                          {errors.email && touched.email && <p className="text-xs font-medium text-destructive mt-1">{errors.email as string}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</Label>
                        <Field 
                          as={Input} 
                          id="subject" 
                          name="subject" 
                          placeholder="How can we help?" 
                          className={`h-12 rounded-xl bg-background border-muted-foreground/20 focus-visible:ring-primary ${errors.subject && touched.subject ? "ring-2 ring-destructive" : ""}`}
                        />
                        {errors.subject && touched.subject && <p className="text-xs font-medium text-destructive mt-1">{errors.subject as string}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Message</Label>
                        <Field 
                          as={Textarea} 
                          id="message" 
                          name="message" 
                          placeholder="Describe your issue or inquiry in detail..." 
                          rows={6}
                          className={`rounded-xl bg-background border-muted-foreground/20 focus-visible:ring-primary resize-none ${errors.message && touched.message ? "ring-2 ring-destructive" : ""}`}
                        />
                        {errors.message && touched.message && <p className="text-xs font-medium text-destructive mt-1">{errors.message as string}</p>}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-14 rounded-2xl text-lg font-bold transition-all hover:-translate-y-1 shadow-lg shadow-primary/20 hover:shadow-primary/40" 
                        disabled={isSubmitting || isSubmittingManual}
                      >
                        {(isSubmitting || isSubmittingManual) ? (
                          <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> Sending...</>
                        ) : (
                          <><Send className="h-5 w-5 mr-3" /> Send Message</>
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
