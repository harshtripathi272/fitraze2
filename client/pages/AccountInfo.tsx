import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Camera,
  Crown,
  Star,
  Award,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountInfo() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    username: "alexfitness",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    birthday: "1995-06-15",
    location: "San Francisco, CA",
    bio: "Fitness enthusiast passionate about healthy living and helping others achieve their goals.",
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
    console.log("Saving account info:", formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const accountStats = [
    {
      label: "Member Since",
      value: "January 2023",
      icon: Calendar,
      color: "text-blue-500",
    },
    {
      label: "Total Workouts",
      value: "156",
      icon: Award,
      color: "text-green-500",
    },
    {
      label: "Streak Record",
      value: "23 days",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      label: "Calories Logged",
      value: "45,230",
      icon: Shield,
      color: "text-purple-500",
    },
  ];

  const subscriptionInfo = {
    plan: "Premium",
    status: "Active",
    nextBilling: "March 15, 2024",
    features: [
      "Unlimited meal plans",
      "Advanced analytics",
      "Personal AI coach",
      "Custom workout builder",
      "Priority support",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className="h-10 w-10 p-0 glass-card"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center">
            <User className="w-6 h-6 mr-2 text-primary" />
            Account Information
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal details
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={isEditing ? "glow-accent" : "glass-card"}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
        {isEditing && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="glass-card"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 glow">
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-bold">
                    {formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full glow-accent"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-bold">{formData.name}</h2>
                  <Badge variant="secondary" className="glass">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                <p className="text-muted-foreground">@{formData.username}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {formData.bio}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => handleChange("birthday", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    disabled={!isEditing}
                    className="glass-card border-glass-border mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {accountStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="text-center p-4 glass-card rounded-lg"
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2 text-primary" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">
                  FitRaze {subscriptionInfo.plan}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Status: {subscriptionInfo.status}
                </p>
              </div>
              <Badge variant="secondary" className="glass text-green-500">
                Active
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium mb-2">Plan Features</h5>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {subscriptionInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Star className="w-3 h-3 mr-2 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Billing Information</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Billing:</span>
                    <span>{subscriptionInfo.nextBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-medium">$9.99/month</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button variant="outline" className="flex-1 glass-card">
                Manage Subscription
              </Button>
              <Button variant="outline" className="flex-1 glass-card">
                Billing History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start glass-card"
            >
              <Shield className="w-4 h-4 mr-3" />
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start glass-card"
            >
              <Phone className="w-4 h-4 mr-3" />
              Two-Factor Authentication
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start glass-card"
            >
              <User className="w-4 h-4 mr-3" />
              Privacy Settings
            </Button>
            <Separator />
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-400"
            >
              <X className="w-4 h-4 mr-3" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
