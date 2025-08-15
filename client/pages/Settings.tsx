import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Smartphone,
  Heart,
  Activity,
  Volume2,
  VolumeX,
  Wifi,
  Download,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  const settingsGroups = [
    {
      title: "Appearance",
      icon: Moon,
      settings: [
        {
          id: "darkMode",
          label: "Dark Mode",
          description: "Use dark theme throughout the app",
          value: darkMode,
          onChange: setDarkMode,
          icon: darkMode ? Moon : Sun,
        },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        {
          id: "notifications",
          label: "Push Notifications",
          description: "Receive workout and meal reminders",
          value: notifications,
          onChange: setNotifications,
        },
        {
          id: "sound",
          label: "Sound Effects",
          description: "Play sounds for achievements and alerts",
          value: soundEnabled,
          onChange: setSoundEnabled,
          icon: soundEnabled ? Volume2 : VolumeX,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      settings: [
        {
          id: "biometrics",
          label: "Biometric Login",
          description: "Use fingerprint or face ID to unlock",
          value: biometrics,
          onChange: setBiometrics,
        },
      ],
    },
    {
      title: "Data & Storage",
      icon: Download,
      settings: [
        {
          id: "offline",
          label: "Offline Mode",
          description: "Enable offline data tracking",
          value: offlineMode,
          onChange: setOfflineMode,
          icon: Wifi,
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Export Data",
      description: "Download your fitness data",
      icon: Download,
      color: "text-blue-500",
      action: () => console.log("Export data"),
    },
    {
      title: "Reset Preferences",
      description: "Restore default settings",
      icon: Activity,
      color: "text-orange-500",
      action: () => console.log("Reset preferences"),
    },
    {
      title: "Clear Cache",
      description: "Free up storage space",
      icon: Trash2,
      color: "text-red-500",
      action: () => console.log("Clear cache"),
    },
  ];

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
            <Settings className="w-6 h-6 mr-2 text-primary" />
            Settings & Preferences
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize your FitRaze experience
          </p>
        </div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <Card key={group.title} className="glass-card border-glass-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <GroupIcon className="w-5 h-5 mr-2 text-primary" />
                  {group.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.settings.map((setting, index) => {
                  const SettingIcon = setting.icon;

                  return (
                    <div key={setting.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          {SettingIcon && (
                            <SettingIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <Label
                              htmlFor={setting.id}
                              className="text-sm font-medium"
                            >
                              {setting.label}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {setting.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          id={setting.id}
                          checked={setting.value}
                          onCheckedChange={setting.onChange}
                          className="data-[state=checked]:bg-primary"
                        />
                      </div>
                      {index < group.settings.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}

        {/* Quick Actions */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon;

              return (
                <div key={action.title}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-4 hover:bg-white/5"
                    onClick={action.action}
                  >
                    <ActionIcon className={`w-5 h-5 mr-3 ${action.color}`} />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                  {index < quickActions.length - 1 && (
                    <Separator className="mt-3" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="glass-card border-glass-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">FitRaze</h4>
                <p className="text-xs text-muted-foreground">Version 2.1.0</p>
              </div>
              <Badge variant="secondary" className="glass">
                <Heart className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
