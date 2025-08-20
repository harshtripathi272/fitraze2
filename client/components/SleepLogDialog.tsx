import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Moon,
  Sun,
  Clock,
  Bell,
  Lightbulb,
  Target,
  TrendingUp,
  Heart,
  Brain,
  Zap,
  Star
} from "lucide-react";


interface SleepLogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSleepLogged: (sleepData: SleepData) => void;
}

interface SleepData {
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
}

interface SleepLogPayload {
  date: string;
  sleep_duration_hours: number;
  duration_label: string;
  bedtime: string;
  wake_up: string;
  sleep_quality_score: number;
  sleep_quality_label: string;
  streak_count: number;
}

const sleepTips = [
  "Avoid screens 1 hour before bedtime for better sleep quality",
  "Keep your bedroom temperature between 60-67°F (15-19°C)",
  "Try deep breathing exercises: 4 counts in, 7 counts hold, 8 counts out",
  "Maintain a consistent sleep schedule, even on weekends",
  "Create a relaxing bedtime routine to signal your body it's time to sleep",
  "Avoid caffeine 6 hours before bedtime",
  "Get natural sunlight exposure in the morning to regulate your circadian rhythm"
];

const qualityLabels = {
  1: { label: "Poor", color: "text-red-400", emoji: "😴" },
  2: { label: "Fair", color: "text-orange-400", emoji: "😪" },
  3: { label: "Good", color: "text-yellow-400", emoji: "🙂" },
  4: { label: "Great", color: "text-green-400", emoji: "😊" },
  5: { label: "Excellent", color: "text-blue-400", emoji: "😄" }
};

const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      times.push({ value: timeString, label: displayTime });
    }
  }
  return times;
};

const calculateSleepDuration = (bedTime: string, wakeTime: string) => {
  if (!bedTime || !wakeTime) return 0;
  
  const bed = new Date(`1970-01-01T${bedTime}`);
  let wake = new Date(`1970-01-01T${wakeTime}`);
  
  // If wake time is earlier than bed time, it's the next day
  if (wake <= bed) {
    wake = new Date(`1970-01-02T${wakeTime}`);
  }
  
  const diffMs = wake.getTime() - bed.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

export function SleepLogDialog({ open, onOpenChange, onSleepLogged }: SleepLogDialogProps) {
  const [bedTime, setBedTime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState([3]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("22:00");
  const [currentTip] = useState(sleepTips[Math.floor(Math.random() * sleepTips.length)]);
  const[alreadyLogged,setAlreadyLogged] = useState(false); 
  const[weeklyData,setWeeklyData]=useState<number[]>([0,0,0,0,0,0,0]); 
  const [sleepStreak,setSleepStreak] = useState(0); // Mock streak data

  const timeOptions = generateTimeOptions();
  const duration = calculateSleepDuration(bedTime, wakeTime);
  const qualityData = qualityLabels[quality[0] as keyof typeof qualityLabels];

  const getSleepPhase = () => {
    if (duration < 5) return "insufficient";
    if (duration < 6) return "poor";
    if (duration >= 7 && duration <= 9) return "optimal";
    if (duration > 9) return "excessive";
    return "fair";
  };

  const MoonAnimation = () => {
    const phase = getSleepPhase();
    const moonSize = 120;
    
    const getMoonStyle = () => {
      switch (phase) {
        case "insufficient":
          return "opacity-30 text-gray-600";
        case "poor":
          return "opacity-50 text-yellow-600";
        case "fair":
          return "opacity-70 text-yellow-400";
        case "optimal":
          return "opacity-100 text-blue-200 glow animate-pulse";
        case "excessive":
          return "opacity-80 text-purple-300";
        default:
          return "opacity-60 text-gray-400";
      }
    };

    return (
      <div className="relative mx-auto" style={{ width: `${moonSize}px`, height: `${moonSize}px` }}>
        {/* Moon Base */}
        <div className={`absolute inset-0 rounded-full ${getMoonStyle()} transition-all duration-1000`}>
          <Moon className="w-full h-full" />
        </div>

        {/* Stars around moon for optimal sleep */}
        {phase === "optimal" && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Star
                key={i}
                className="absolute w-3 h-3 text-yellow-200 animate-pulse"
                style={{
                  left: `${20 + Math.cos((i * 45) * Math.PI / 180) * 60}px`,
                  top: `${20 + Math.sin((i * 45) * Math.PI / 180) * 60}px`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Sleep quality indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-center">
            <div className="text-2xl mb-1">{qualityData?.emoji}</div>
            <div className="text-sm font-bold text-primary">{duration.toFixed(1)}h</div>
          </div>
        </div>

        {/* Poor sleep animation (yawning effect) */}
        {(phase === "insufficient" || phase === "poor") && (
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
            <div className="text-lg animate-bounce">😴</div>
          </div>
        )}
      </div>
    );
  };
  useEffect(()=>{
    if(!open) return;
    console.log("useEffect triggered, open =", open);
    const storedUser = JSON.parse(localStorage.getItem("fitRazeUser") || "{}");
    const token = localStorage.getItem("access_token") || storedUser.token; 
    if(!token){
      return;
    }
    const formatTime = (timeString: string) => {
        if (!timeString) return "";
        return timeString.slice(0, 5); 
      };
    fetch("http://localhost:8000/sleep/today", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.logged === true) {
          setAlreadyLogged(true);
          setBedTime(formatTime(data.bedtime)); // prefill from backend
          setWakeTime(formatTime(data.wake_up));
          setQuality([data.sleep_quality_score]);
          setSleepStreak(data.streak_count || 0);
        } else {
          setAlreadyLogged(false);
        }
      })
      .catch(() => setAlreadyLogged(false));

    // Fetch weekly summary
    fetch("http://localhost:8000/sleep/weekly", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(async res=>{
        const text=await res.text();
        console.log("Weekly sleep data:", text);
      try{
        const data=JSON.parse(text);
        console.log("weekly API parsed data:", data);
        setWeeklyData([
          data.mon_hours || 0,
          data.tue_hours || 0,
          data.wed_hours || 0,
          data.thu_hours || 0,
          data.fri_hours || 0,
          data.sat_hours || 0,
          data.sun_hours || 0,
        ]);
        }catch(err){
          console.log("Error parsing weekly data:", err);
        }
      })
      .catch(err => console.error("Weekly API request failed:", err));
  }, [open]);

  const handleLogSleep = async () => {
      const sleepData: SleepData = {
      bedTime,
      wakeTime,
      duration,
      quality: quality[0]
    };
    const storedUser = JSON.parse(localStorage.getItem("fitRazeUser") || "{}");
    const token = localStorage.getItem("access_token") || storedUser.token;
    if (!token) { alert("Please log in first."); return; }

    const payload:SleepLogPayload = {
      date: new Date().toLocaleDateString("en-CA"),
      sleep_duration_hours: duration,
      duration_label:
        duration >= 7 && duration <= 9 ? "Optimal" :
        duration >= 6 ? "Adequate" : "Insufficient",
      bedtime: new Date(`${new Date().toISOString().split("T")[0]}T${bedTime}:00`).toISOString(),
      wake_up: new Date(`${new Date().toISOString().split("T")[0]}T${wakeTime}:00`).toISOString(),
      sleep_quality_score: quality[0],
      sleep_quality_label: qualityLabels[quality[0] as keyof typeof qualityLabels].label,
      streak_count: sleepStreak
    };

    const formatDate=payload.date.split("T")[0];
    const url=alreadyLogged
    ? `http://localhost:8000/sleep/log/${formatDate}` // PUT with date in URL
    : "http://localhost:8000/sleep/log"; 

    const response = await fetch(url, {
      method: alreadyLogged ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.detail || "Failed to log sleep");
      return;
    }

    const result = await response.json();
    console.log("Sleep log saved:", result);
    onSleepLogged(sleepData);
    onOpenChange(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-glass-border max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Moon className="w-5 h-5 mr-2 text-primary" />
            Log Sleep
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Moon Animation & Sleep Duration */}
          <div className="text-center py-4">
            <MoonAnimation />
            
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Sleep Duration</p>
              <p className="text-xl font-bold">{duration.toFixed(1)} hours</p>
              
              {duration > 0 && (
                <Badge 
                  className={`${
                    duration >= 7 && duration <= 9 
                      ? 'bg-green-500/20 text-green-400 border-green-400' 
                      : duration >= 6 
                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400'
                        : 'bg-red-500/20 text-red-400 border-red-400'
                  }`}
                >
                  {duration >= 7 && duration <= 9 ? 'Optimal' : 
                   duration >= 6 ? 'Adequate' : 'Insufficient'}
                </Badge>
              )}
            </div>
          </div>

          {/* Sleep Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2  flex items-center">
                <Moon className="w-4 h-4 mr-1 text-primary" />
                Bedtime
              </label>
              <Select value={bedTime} onValueChange={setBedTime}>
                <SelectTrigger className="glass-card border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border max-h-48">
                  {timeOptions.filter(time => {
                    const hour = parseInt(time.value.split(':')[0]);
                    return hour >= 19 || hour <= 2; // Evening and early morning
                  }).map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2  flex items-center">
                <Sun className="w-4 h-4 mr-1 text-accent" />
                Wake Up
              </label>
              <Select value={wakeTime} onValueChange={setWakeTime}>
                <SelectTrigger className="glass-card border-glass-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-glass-border max-h-48">
                  {timeOptions.filter(time => {
                    const hour = parseInt(time.value.split(':')[0]);
                    return hour >= 4 && hour <= 12; // Morning hours
                  }).map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sleep Quality */}
          <div>
            <label className="text-sm font-medium mb-3  flex items-center">
              <Heart className="w-4 h-4 mr-1 text-accent" />
              Sleep Quality
            </label>
            
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl mb-1">{qualityData?.emoji}</div>
                <div className={`text-sm font-medium ${qualityData?.color}`}>
                  {qualityData?.label}
                </div>
              </div>
              
              <Slider
                value={quality}
                onValueChange={setQuality}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>

          {/* Weekly Sleep Chart */}
          <Card className="glass-card border-glass-border">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 text-primary" />
                  This Week's Sleep
                </h3>
                
                <div className="grid grid-cols-7 gap-1">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, index) => {
                      const isToday = index === new Date().getDay() - 1; // 0=Sunday → shift
                      const hours = weeklyData[index] ?? 0;

                      let colorClass = "bg-gray-400/20 text-gray-400"; // default: no sleep
                      if (hours === 0) {
                        colorClass = "bg-gray-400/20 text-gray-400";
                      } else if (hours < 6) {
                        colorClass = "bg-red-500/20 text-red-400 border-red-400";
                      } else if (hours >= 6 && hours < 7) {
                        colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-400";
                      } else if (hours >= 7 && hours <= 9) {
                        colorClass = "bg-green-500/20 text-green-400 border-green-400";
                      } else if (hours > 9) {
                        colorClass = "bg-purple-500/20 text-purple-400 border-purple-400";
                      }

                      return (
                        <div key={day} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{day}</div>
                          <div
                            className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                              isToday ? "border-2 border-primary bg-primary/20" : colorClass
                            }`}
                          >
                            {hours>0 ? hours.toFixed(1) : "0"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

              </CardContent>
            </Card>

          {/* Sleep Hygiene Tip */}
          <Card className="glass-card border-glass-border glow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-accent mb-1">Sleep Tip</h4>
                  <p className="text-xs text-muted-foreground">{currentTip}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Reminder */}
          <Card className="glass-card border-glass-border">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Bedtime Reminder</span>
                  </div>
                  <Switch 
                    checked={reminderEnabled} 
                    onCheckedChange={setReminderEnabled}
                  />
                </div>
                
                {reminderEnabled && (
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">Reminder Time</label>
                    <Select value={reminderTime} onValueChange={setReminderTime}>
                      <SelectTrigger className="glass-card border-glass-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-glass-border">
                        {timeOptions.filter(time => {
                          const hour = parseInt(time.value.split(':')[0]);
                          return hour >= 20 || hour <= 1; // Evening reminder times
                        }).map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sleep Streak */}
          <div className="text-center">
            <Badge variant="outline" className="glass glow">
              <Zap className="w-3 h-3 mr-1" />
              {sleepStreak} day sleep consistency streak! 🌙
            </Badge>
          </div>

          {/* Log Sleep Button */}
          <Button 
              className="w-full glow"
              onClick={handleLogSleep}
              disabled={!bedTime || !wakeTime}
            >
              <Clock className="w-4 h-4 mr-2" />
              {alreadyLogged ? "Update Sleep" : "Log Sleep"} ({duration.toFixed(1)}h)
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
