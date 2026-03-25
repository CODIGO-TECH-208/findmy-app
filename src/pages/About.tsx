import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail, Twitter, Users, Sparkles, Heart, Code, ShieldCheck, Play, ArrowRight } from "lucide-react";
import teamImage from "@/assets/team_collaboration_png_1774455845207.png";
import demoVideo from "@/assets/demo-vid.mp4";
import demoThumbnail from "@/assets/demo-thumbnail.png";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const teamMembers = [
  {
    name: "John Asante",
    role: "Project Lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Visionary leader with a passion for student-centric solutions."
  },
  {
    name: "Ama Serwaa",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "Crafting beautiful and intuitive experiences for campus life."
  },
  {
    name: "Kofi Mensah",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "React wizard specialized in high-performance web applications."
  },
  {
    name: "Abena Osei",
    role: "Backend Architect",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Building robust and scalable systems for real-time interactions."
  },
  {
    name: "David Tetteh",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Focused on bridging the gap between user needs and technical magic."
  },
  {
    name: "Efua Boateng",
    role: "QA Specialist",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Ensuring every click across FindMy is smooth and bug-free."
  },
  {
    name: "Kwame Nkrumah",
    role: "DevOps Engineer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "Managing our mission-critical campus infrastructure."
  },
  {
    name: "Yaa Pomaa",
    role: "Security Lead",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
    bio: "Protecting student data with state-of-the-art security protocols."
  }
];

export default function About() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  return (
    <Layout>
      <div className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <Badge variant="secondary" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
                <Users className="h-4 w-4 mr-2" /> Our Story
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                Built by Students, <br />
                <span className="text-primary tracking-wide">For Students.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                FindMy started as a simple idea in a dorm room: why is it so hard to find lost items on a busy campus? 
                Today, we're a team of eight dedicated students making life easier for the Legon community.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="flex -space-x-3 overflow-hidden">
                  {teamMembers.slice(0, 4).map((member, i) => (
                    <Avatar key={i} className="inline-block border-2 border-background ring-2 ring-primary/5">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
                    +4
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-semibold">Joint Force of 8</p>
                  <p className="text-xs text-muted-foreground">Developers & Innovators</p>
                </div>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 transform hover:scale-[1.02] transition-transform duration-500">
               <img 
                 src={teamImage} 
                 alt="FindMy Team Collaboration" 
                 className="w-full h-auto object-cover" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>
          </div>

          {/* Mission/Values */}
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Heart, title: "Our Mission", text: "To create a seamless and trustworthy environment for campus assistance." },
              { icon: Code, title: "Our Tech", text: "Leveraging modern frameworks to solve real-world student challenges." },
              { icon: Sparkles, title: "Our Goal", text: "Zero lost items left unclaimed by the end of every semester." }
            ].map((v, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 text-center px-6">
                  <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{v.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works Section */}
          <div className="mb-24">
            <div className="text-center mb-16">
              <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 mb-4 inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> The Process
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How FindMy Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto italic">"Simple, Secure, and Student-First."</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
               {[
                 { step: "01", title: "Report", desc: "List your lost or found item with details & photos." },
                 { step: "02", title: "Verify", desc: "Our system filters and matches potential items." },
                 { step: "03", title: "Connect", desc: "Securely chat with the finder/owner via the app." },
                 { step: "04", title: "Recover", desc: "Safe exchange at a designated campus location." }
               ].map((item, i) => (
                 <div key={i} className="p-6 rounded-3xl bg-muted/30 border border-border/50 relative overflow-hidden group hover:border-primary/30 transition-colors">
                    <span className="text-4xl font-black text-primary/10 absolute -top-2 -right-2 group-hover:text-primary/20 transition-colors">{item.step}</span>
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Video Demo Section */}
          <div className="mb-24">
             <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
                <DialogTrigger asChild>
                  <Card className="border-none bg-black overflow-hidden relative min-h-[400px] flex items-center justify-center group cursor-pointer shadow-2xl shadow-primary/20 rounded-3xl">
                      <div className="absolute inset-0 opacity-60 group-hover:opacity-40 transition-opacity">
                        <img src={demoThumbnail} alt="Video Placeholder" className="w-full h-full object-cover" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-10 w-10 text-white fill-white ml-1" />
                        </div>
                        <div className="text-center text-white p-4">
                            <h3 className="text-3xl font-black mb-2 tracking-tight">Platform Walkthrough</h3>
                            <p className="text-white/70 font-medium text-lg">Watch how easy it is to recover your items on campus.</p>
                        </div>
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
                    
                    {/* Overlay Branding */}
                    <div className="absolute top-6 left-6 pointer-events-none opacity-40 group-hover/video:opacity-100 transition-opacity">
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest">UG FindMy Overview</span>
                      </div>
                    </div>
                  </div>
                </DialogContent>
             </Dialog>
          </div>

          {/* Team Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Developers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate team working behind the scenes to keep our campus connected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {teamMembers.map((member, i) => (
              <div key={i} className="group flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors opacity-0 group-hover:opacity-100 duration-500" />
                  <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-primary/10 transition-transform duration-500 group-hover:scale-110">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback className="text-2xl">{member.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-sm font-medium text-primary/80 mb-3 tracking-wide">{member.role}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed px-4 mb-5 transform group-hover:-translate-y-1 transition-transform duration-500 min-h-[40px]">
                    {member.bio}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Github className="h-4 w-4" /></button>
                    <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Linkedin className="h-4 w-4" /></button>
                    <button className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Mail className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
