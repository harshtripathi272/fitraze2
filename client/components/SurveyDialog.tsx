import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Heart,
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: "daily_complete" | "weekly_review" | "feature_feedback" | "general";
}

interface SurveyQuestion {
  id: string;
  type: "rating" | "choice" | "text" | "satisfaction";
  question: string;
  options?: string[];
  required?: boolean;
}

const surveyQuestions: SurveyQuestion[] = [
  {
    id: "satisfaction",
    type: "satisfaction",
    question: "How satisfied are you with your FitRaze experience today?",
    required: true,
  },
  {
    id: "motivation",
    type: "rating",
    question: "How motivated do you feel after using the app?",
    required: true,
  },
  {
    id: "feature_usage",
    type: "choice",
    question: "Which features did you find most helpful today?",
    options: [
      "Food Logging",
      "Workout Tracking",
      "Water Intake",
      "Sleep Monitoring",
      "Progress Analytics",
      "AI Insights",
    ],
    required: false,
  },
  {
    id: "improvement",
    type: "text",
    question: "What could we improve to make your experience better?",
    required: false,
  },
];

export function SurveyDialog({
  open,
  onOpenChange,
  trigger = "general",
}: SurveyDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / surveyQuestions.length) * 100;

  const handleResponse = (questionId: string, response: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Auto close after success
    setTimeout(() => {
      onOpenChange(false);
      resetSurvey();
    }, 2000);
  };

  const resetSurvey = () => {
    setCurrentQuestionIndex(0);
    setResponses({});
    setIsSubmitted(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(resetSurvey, 300);
  };

  const SatisfactionQuestion = () => {
    const satisfactionLevels = [
      { icon: ThumbsDown, label: "Poor", color: "text-red-500", value: 1 },
      { icon: ThumbsDown, label: "Fair", color: "text-orange-500", value: 2 },
      { icon: Heart, label: "Good", color: "text-yellow-500", value: 3 },
      { icon: ThumbsUp, label: "Great", color: "text-blue-500", value: 4 },
      { icon: Heart, label: "Excellent", color: "text-green-500", value: 5 },
    ];

    return (
      <div className="grid grid-cols-5 gap-2">
        {satisfactionLevels.map((level, index) => {
          const Icon = level.icon;
          const isSelected = responses[currentQuestion.id] === level.value;

          return (
            <motion.div
              key={level.value}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-16 flex flex-col space-y-1 glass-card transition-all duration-300",
                  isSelected && "glow-accent border-primary",
                )}
                onClick={() => handleResponse(currentQuestion.id, level.value)}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    isSelected ? "text-white" : level.color,
                  )}
                />
                <span className="text-xs">{level.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const RatingQuestion = () => {
    return (
      <div className="flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = responses[currentQuestion.id] >= rating;

          return (
            <motion.div
              key={rating}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-1"
                onClick={() => handleResponse(currentQuestion.id, rating)}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-all duration-300",
                    isSelected
                      ? "text-yellow-400 fill-current"
                      : "text-gray-400",
                  )}
                />
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const ChoiceQuestion = () => {
    const selectedChoices = responses[currentQuestion.id] || [];

    return (
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedChoices.includes(option);

          return (
            <motion.div
              key={option}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 text-left justify-start glass-card transition-all duration-300",
                  isSelected && "glow-accent border-primary",
                )}
                onClick={() => {
                  const newChoices = isSelected
                    ? selectedChoices.filter((c: string) => c !== option)
                    : [...selectedChoices, option];
                  handleResponse(currentQuestion.id, newChoices);
                }}
              >
                <div className="flex items-center space-x-2">
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm">{option}</span>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>
    );
  };

  const TextQuestion = () => {
    return (
      <div className="space-y-3">
        <Textarea
          placeholder="Share your thoughts..."
          value={responses[currentQuestion.id] || ""}
          onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
          className="glass-card border-glass-border min-h-[100px] resize-none"
        />
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <MessageSquare className="w-3 h-3" />
          <span>Your feedback helps us improve FitRaze</span>
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-glass-border max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            Quick Feedback
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-8 w-8 p-0"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="survey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Question {currentQuestionIndex + 1} of{" "}
                    {surveyQuestions.length}
                  </span>
                  <span className="text-primary font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </div>
              </div>

              {/* Question */}
              <Card className="glass-card border-glass-border">
                <CardContent className="p-6">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-base font-medium leading-relaxed">
                      {currentQuestion.question}
                    </h3>

                    {currentQuestion.type === "satisfaction" && (
                      <SatisfactionQuestion />
                    )}
                    {currentQuestion.type === "rating" && <RatingQuestion />}
                    {currentQuestion.type === "choice" && <ChoiceQuestion />}
                    {currentQuestion.type === "text" && <TextQuestion />}
                  </motion.div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="glass-card"
                >
                  Previous
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={
                    currentQuestion.required && !responses[currentQuestion.id]
                  }
                  className="glow-accent"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : currentQuestionIndex === surveyQuestions.length - 1 ? (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
              >
                <CheckCircle2 className="w-8 h-8 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Thank you!</h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us make FitRaze better for everyone.
                </p>
              </div>

              <Badge variant="secondary" className="glass text-green-600">
                +5 XP Earned for feedback!
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
