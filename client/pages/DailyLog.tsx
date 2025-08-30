import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ProgressRing";
import { TrackingModal } from "@/components/TrackingModal";
import { useScrollEffects } from "@/hooks/use-scroll-effects";
import {
  Calendar,
  Droplet,
  Moon,
  Utensils,
  Dumbbell,
  Target,
  Brain,
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp,
  Play,
  Clock,
  Flame,
  Zap,
  Pencil,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  isToday,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import axios from "axios"


function TrackingCardContent({ logs, fetchWaterData }: { logs: any[]; fetchWaterData: () => void }) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleEditClick = (index: number, currentValue: number) => {
    setEditIndex(index);
    setEditValue(currentValue.toString());
  };

  const handleUpdate = async (logId:number) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(
        `/api/v1/water/update/${logId}`,
        { amount_ml: parseInt(editValue) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditIndex(null); // Exit edit mode
      fetchWaterData(); // Refresh updated data
    } catch (err) {
      console.error("Error updating water log:", err);
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm">Today's Hydration Log</h4>
      {logs.length > 0 ? (
        logs.map((log, index) => (
          <div key={index} className="flex justify-between items-center py-1">
            <span className="text-sm text-muted-foreground">{log.time}</span>

            {editIndex === index ? (
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={()=>handleUpdate(log.id)}
                onKeyDown={(e)=>{
                  if(e.key=="Enter"){
                    handleUpdate(log.id);
                    console.log(log.id);
                  }
                }}
                className="w-16 text-xs border rounded p-1 text-black"
                autoFocus
              />
            ) : (
              <Badge variant="outline" className="glass text-xs">
                {log.amount}ml ({log.type})
              </Badge>
            )}

            <button
              onClick={() => handleEditClick(index, log.amount)}
              className="ml-2 p-1 hover:bg-gray-100 rounded"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        ))
      ) : (
        <div className="text-sm text-muted-foreground">No water logs yet</div>
      )}
    </div>
  );
}


export default function DailyLog() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [showAISummary, setShowAISummary] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScrollEffects();
  const [sleepData,setSleepData]=useState<any>(null);
  const [waterData,setWaterData]=useState<{current:number;goal:number;logs:any[]}>({
    current:0,
    goal:200,
    logs:[],
  });

  // Animation refs for intersection observer
  const summaryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger AI summary animation after page load
    const timer = setTimeout(() => setShowAISummary(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up");
          }
        });
      },
      { threshold: 0.1 },
    );

    [summaryRef.current, cardsRef.current].forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(()=>{
    const fetchSleepData=async()=>{
      try{
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        const token=localStorage.getItem("access_token");
        const res=await axios.get(`/api/v1/sleep/day/${formattedDate}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        });
        setSleepData(res.data)
      }catch (err){
        console.log("Error fetching sleep data",err);
        setSleepData(null);
      }
    };
    fetchSleepData();
  },[selectedDate])


  const fetchWaterData=async()=>{
      try{
        const token=localStorage.getItem("access_token");
        const formattedDate=selectedDate.toLocaleDateString("en-CA");

        const res=await axios.get(`/api/v1/water/day/${formattedDate}`,{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });
        const totalMl=res.data.reduce((sum:number,log:any)=>sum+log.amount,0);

        setWaterData({
          current:Math.round(totalMl/250),
          goal:8,
          logs:res.data,
        });
      }catch(err){
        console.log("Error Fetching water data",err);
        setWaterData({current:0,goal:8,logs:[]});
      }
    };

  useEffect(()=>{
    fetchWaterData();
  },[selectedDate]);

  // Mock data for different dates
  const getDayData = (date: Date) => {
    const dayOfWeek = date.getDay();
    const baseData = {
      
      meals: {
        current: 3 + (dayOfWeek % 2),
        goal: 4,
        logs: {
          breakfast: [
            {
              name: "Greek Yogurt with Berries",
              calories: 180,
              protein: 15,
              carbs: 20,
              fat: 6,
            },
            { name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 3 },
          ],
          lunch: [
            {
              name: "Grilled Chicken Salad",
              calories: 350,
              protein: 30,
              carbs: 15,
              fat: 18,
            },
          ],
          dinner: [
            {
              name: "Salmon with Quinoa",
              calories: 420,
              protein: 35,
              carbs: 45,
              fat: 15,
            },
          ],
          snacks: [
            {
              name: "Apple with Almond Butter",
              calories: 190,
              protein: 6,
              carbs: 20,
              fat: 12,
            },
          ],
        },
      },
      exercise: {
        current: 45 + dayOfWeek * 5,
        goal: 60,
        workouts: [
          {
            name: "Upper Body Strength",
            duration: "45 min",
            exercises: [
              { name: "Bench Press", sets: 4, reps: "8-10", weight: "80kg" },
              { name: "Pull-ups", sets: 3, reps: "8", weight: "bodyweight" },
              {
                name: "Shoulder Press",
                sets: 3,
                reps: "10-12",
                weight: "25kg",
              },
            ],
          },
        ],
      },
    };
    return baseData;
  };

  const currentData = getDayData(selectedDate);

  const sleepCardData=sleepData ? {
      current: sleepData.sleep_duration_hours ?? 0,
      goal: 8,
      bedTime: sleepData.bedtime ?? "22:30",
      wakeTime: sleepData.wake_up ?? "07:00",
      quality: sleepData.sleep_quality_score ?? 3,
      notes: sleepData.sleep_quality_label ?? "No data",
  }:{
    current: 0,
    goal: 8,
    bedTime: "--:--",
    wakeTime: "--:--",
    quality: 0,
    notes: "No sleep data logged",
  };

  // Generate calendar days (7 days visible, scrollable)
  const getCalendarDays = () => {
    const days = [];
    const startDate = addDays(startOfWeek(selectedDate), calendarOffset);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = addDays(startDate, i);
      // Only show dates that are today or in the past
      if (date <= today) {
        days.push({
          date,
          dayName: format(date, "EEE"),
          dayNumber: format(date, "d"),
          isSelected: isSameDay(date, selectedDate),
          isToday: isToday(date),
        });
      }
    }
    return days;
  };

  const jumpToToday = () => {
    setSelectedDate(new Date());
    setCalendarOffset(0);
  };

  const scrollCalendar = (direction: "left" | "right") => {
    setCalendarOffset((prev) => (direction === "left" ? prev - 7 : prev + 7));
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollCalendar("right");
    }
    if (isRightSwipe) {
      scrollCalendar("left");
    }
  };

  // Function to get date display text
  const getDateDisplayText = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (isSameDay(selectedDate, today)) {
      return "Today";
    } else if (isSameDay(selectedDate, yesterday)) {
      return "Yesterday";
    } else {
      return format(selectedDate, "MMM d");
    }
  };

  const aiInsights = [
    "You nailed your hydration goal today – great job staying consistent! 💧",
    "Try getting at least 30 more minutes of sleep tomorrow for better recovery. 🌙",
    "Protein intake was excellent today. Keep up the great work! 💪",
    "Consider adding a post-workout snack to optimize recovery. 🍎",
  ];

  const TrackingCard = ({
    id,
    icon: Icon,
    title,
    current,
    goal,
    unit,
    color,
    children,
  }: {
    id: string;
    icon: any;
    title: string;
    current: number;
    goal?: number;
    unit: string;
    color: "primary" | "accent" | "success" | "warning";
    children: React.ReactNode;
  }) => {
    const progress = goal ? (current / goal) * 100 : 0;

    // Dynamic icon color based on progress
    const getIconColor = () => {
      if (progress >= 100) return "text-green-400";
      if (progress >= 75) return "text-primary";
      if (progress >= 50) return "text-yellow-400";
      return "text-gray-400";
    };

    return (
      <>
        <Card
          className="glass-card border-glass-border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20 group btn-glow-effect ripple-effect"
          onClick={() => setActiveModal(id)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300 group-hover:scale-110 animate-glow",
                    getIconColor(),
                    progress >= 100 && "animate-pulse",
                  )}
                />
                <span className="font-semibold group-hover:text-primary transition-colors duration-300">
                  {title}
                </span>
              </div>
              <ProgressRing progress={progress} size={50} color={color}>
                <span className="text-xs font-bold">
                  {Math.round(progress)}%
                </span>
              </ProgressRing>
            </div>

            <div className="text-center">
              <div className="text-xl font-bold">
                {current} {unit}
              </div>
              {goal && (
                <div className="text-sm text-muted-foreground">of {goal}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal Dialog */}
        <TrackingModal
          open={activeModal === id}
          onOpenChange={(open) => setActiveModal(open ? id : null)}
          id={id}
          icon={Icon}
          title={title}
          current={current}
          goal={goal}
          unit={unit}
          color={color}
        >
          {children}
        </TrackingModal>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/80 overflow-x-hidden">
      {/* Horizontal Calendar Strip */}
      <div className="sticky top-0 z-40 glass-card border-b border-glass-border backdrop-blur-xl">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Daily Summary
            </h1>
            <Button
              size="sm"
              onClick={jumpToToday}
              className={cn(
                "transition-all duration-300",
                isToday(selectedDate)
                  ? "opacity-50 cursor-not-allowed"
                  : "glow-accent hover:scale-105 active:scale-95",
              )}
              disabled={isToday(selectedDate)}
            >
              {getDateDisplayText()}
            </Button>
          </div>

          {/* Month and Year Display */}
          <div className="text-center mb-3">
            <h2 className="text-lg font-semibold text-primary">
              {format(selectedDate, "MMMM yyyy")}
            </h2>
          </div>

          {/* Calendar Strip */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex space-x-2 overflow-x-auto scrollbar-hide py-2 justify-center"
              style={{ scrollBehavior: "smooth" }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {getCalendarDays().map((day, index) => (
                <Button
                  key={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`}
                  variant={day.isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDate(day.date)}
                  className={cn(
                    "min-w-[60px] flex-col space-y-1 h-16 transition-all duration-300",
                    day.isSelected
                      ? "glow-accent scale-110 shadow-lg"
                      : "glass-card hover:scale-105",
                    day.isToday &&
                      !day.isSelected &&
                      "border-primary text-primary",
                    "animate-slide-in-up",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-xs font-medium">{day.dayName}</span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                  {day.isToday && (
                    <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                  )}
                </Button>
              ))}
            </div>

            {/* Swipe indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse"></div>
                <span>Swipe to navigate</span>
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Today's Summary with parallax effect */}
        <div
          ref={summaryRef}
          className="glass-card p-6 rounded-3xl border border-glass-border opacity-0 translate-y-8 transition-all duration-700 parallax-scroll"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-accent" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary flex items-center justify-center">
                <Flame className="w-5 h-5 mr-1" />
                1,847
              </div>
              <div className="text-sm text-muted-foreground">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">87%</div>
              <div className="text-sm text-muted-foreground">Goals Hit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">4</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 flex items-center justify-center">
                <Zap className="w-4 h-4 mr-1" />
                High
              </div>
              <div className="text-sm text-muted-foreground">Energy</div>
            </div>
          </div>
        </div>

        {/* Tracking Cards */}
        <div
          ref={cardsRef}
          className="space-y-4 opacity-0 translate-y-8 transition-all duration-700"
        >
          <h2 className="text-lg font-semibold">Daily Tracking</h2>

          {/* Water Intake Card */}
          <TrackingCard
            id="water"
            icon={Droplet}
            title="Water Intake"
            current={waterData.current}
            goal={waterData.goal}
            unit="glasses"
            color="primary"
          >
            <TrackingCardContent logs={waterData.logs} fetchWaterData={fetchWaterData}/>
          </TrackingCard>

          {/* Sleep Card */}
          
          <TrackingCard
            id="sleep"
            icon={Moon}
            title="Sleep"
            current={sleepCardData.current}
            goal={sleepCardData.goal}
            unit="hours"
            color="accent">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Bedtime:</span>
                  <div className="font-medium">{sleepCardData.bedTime}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Wake Up:</span>
                  <div className="font-medium">{sleepCardData.wakeTime}</div>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Quality:</span>
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={cn(
                        "w-4 h-4 rounded-full mr-1",
                        star <= sleepCardData.quality
                          ? "bg-yellow-400"
                          : "bg-gray-600",
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">
                    {sleepCardData.notes}
                  </span>
                </div>
              </div>
            </div>
          </TrackingCard>


          {/* Meals Card */}
          <TrackingCard
            id="meals"
            icon={Utensils}
            title="Meals"
            current={currentData.meals.current}
            goal={currentData.meals.goal}
            unit="meals"
            color="success"
          >
            <div className="space-y-4">
              {Object.entries(currentData.meals.logs).map(
                ([mealType, foods]: [string, any[]]) => (
                  <div key={mealType}>
                    <h5 className="font-medium text-sm capitalize mb-2 text-accent">
                      {mealType}
                    </h5>
                    {foods.map((food, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-1"
                      >
                        <span className="text-sm">{food.name}</span>
                        <Badge variant="outline" className="glass text-xs">
                          {food.calories} cal
                        </Badge>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          </TrackingCard>

          {/* Exercise Card */}
          <TrackingCard
            id="exercise"
            icon={Dumbbell}
            title="Exercise"
            current={currentData.exercise.current}
            goal={currentData.exercise.goal}
            unit="minutes"
            color="warning"
          >
            <div className="space-y-3">
              {currentData.exercise.workouts.map((workout, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium text-sm">{workout.name}</h5>
                    <Badge variant="outline" className="glass text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {workout.duration}
                    </Badge>
                  </div>
                  {workout.exercises.map((exercise, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-1 text-sm"
                    >
                      <span>{exercise.name}</span>
                      <div className="text-xs text-muted-foreground">
                        {exercise.sets}×{exercise.reps} @ {exercise.weight}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </TrackingCard>
        </div>

        {/* AI Summary Section */}
        <div
          className={cn(
            "glass-card p-6 rounded-3xl border border-glass-border transition-all duration-1000 transform",
            showAISummary
              ? "opacity-100 translate-y-0 glow animate-pulse-slow"
              : "opacity-0 translate-y-8",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-accent animate-pulse" />
              Fitraze AI Summary for the Day
              <div
                className="ml-2 w-4 h-4 text-muted-foreground cursor-help"
                title="Powered by Fitraze Smart AI"
              >
                🤖
              </div>
            </h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="ghost" className="text-xs">
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg glass-card border border-glass-border text-sm transition-all duration-500 hover:glow-soft hover:scale-[1.01] cursor-default",
                  showAISummary && "animate-slide-in-up",
                )}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateX(4px) scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                }}
              >
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 animate-pulse" />
                  <span>{insight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
