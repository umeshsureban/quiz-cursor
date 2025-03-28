"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { ChevronRight, ChevronLeft, Home, Clock, CheckCircle, XCircle, Award, RefreshCw, Lightbulb } from "lucide-react"
import { generateQuizQuestions } from './actions'

// Sample questions
const sampleQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
    correctAnswer: "Blue Whale",
  },
  {
    id: 4,
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: "Oxygen",
  },
  {
    id: 5,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
  },
]

// Add these type definitions at the top of the file
interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

interface QuizConfig {
  topic: string
  numQuestions: number
  duration: number
  instructions: string
}

interface QuizSetupFormProps {
  onSubmit: (config: QuizConfig) => void
}

// Quiz setup form component
function QuizSetupForm({ onSubmit }: QuizSetupFormProps) {
  const [topic, setTopic] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [duration, setDuration] = useState(5)
  const [instructions, setInstructions] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      topic,
      numQuestions,
      duration,
      instructions,
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Mitra's Quiz</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-sm font-medium">
                Quiz Topic
              </Label>
              <Input
                id="topic"
                placeholder="e.g., World Geography, Science, History"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                className="rounded-full h-12 px-4 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numQuestions" className="text-sm font-medium flex justify-between">
                <span>Number of Questions</span>
                <span className="text-primary font-bold">{numQuestions}</span>
              </Label>
              <Slider
                id="numQuestions"
                min={3}
                max={20}
                step={1}
                value={[numQuestions]}
                onValueChange={(value) => setNumQuestions(value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium flex justify-between">
                <span>Duration (minutes)</span>
                <span className="text-primary font-bold">{duration}</span>
              </Label>
              <Slider
                id="duration"
                min={1}
                max={30}
                step={1}
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-sm font-medium">
                Custom Instructions (Optional)
              </Label>
              <Textarea
                id="instructions"
                placeholder="Any specific instructions or focus areas for the quiz..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px] rounded-2xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all"
            >
              Start Quiz
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Main quiz app component
export default function QuizApp() {
  // App states
  const [appState, setAppState] = useState<'setup' | 'quiz' | 'results'>('setup')
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle quiz setup form submission
  const handleQuizSetup = async (config: QuizConfig) => {
    setError(null) // Clear any previous errors
    setQuizConfig(config)
    try {
      const generatedQuestions = await generateQuizQuestions(config.topic, config.numQuestions)
      setQuestions(generatedQuestions)
      setSelectedAnswers(Array(generatedQuestions.length).fill(""))
      setTimeLeft(config.duration * 60)
      setAppState("quiz")
      setTimerActive(true)
    } catch (error) {
      console.error('Failed to generate questions:', error)
      setError('Failed to generate questions. Using sample questions instead.')
      // Fallback to sample questions
      const limitedQuestions = sampleQuestions.slice(0, config.numQuestions)
      setQuestions(limitedQuestions)
      setSelectedAnswers(Array(limitedQuestions.length).fill(""))
      setTimeLeft(config.duration * 60)
      setAppState("quiz")
      setTimerActive(true)
    }
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answer
    setSelectedAnswers(newAnswers)
  }

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      finishQuiz()
    }
  }

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Finish quiz and calculate score
  const finishQuiz = () => {
    let newScore = 0
    for (let i = 0; i < questions.length; i++) {
      if (selectedAnswers[i] === questions[i].correctAnswer) {
        newScore++
      }
    }
    setScore(newScore)
    setAppState("results")
    setTimerActive(false)
  }

  // Reset quiz
  const resetQuiz = () => {
    setAppState("setup")
    setQuizConfig(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setScore(0)
    setTimeLeft(0)
    setTimerActive(false)
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0 && timerActive) {
      finishQuiz()
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [timeLeft, timerActive])

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Calculate progress percentage
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
      {appState === "setup" && <QuizSetupForm onSubmit={handleQuizSetup} />}

      {appState === "quiz" && questions.length > 0 && (
        <div className="w-full max-w-2xl mx-auto relative">
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Timer and progress indicator */}
          <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(timeLeft)}</span>
            </div>
            <div>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Question card */}
          <div>
            <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-50">
                  {questions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-4 rounded-full transition-all flex items-center
                        ${
                          selectedAnswers[currentQuestionIndex] === option
                            ? "bg-primary text-white font-medium"
                            : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                    >
                      <span className="flex-1">{option}</span>
                      {selectedAnswers[currentQuestionIndex] === option && <CheckCircle className="h-5 w-5 ml-2" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="rounded-full px-6 py-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestionIndex]}
              className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 text-white"
            >
              {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
              {currentQuestionIndex === questions.length - 1 ? (
                <CheckCircle className="ml-2 h-4 w-4" />
              ) : (
                <ChevronRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Floating action button */}
          <button
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-primary hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            onClick={() => setAppState("setup")}
          >
            <Home className="h-5 w-5" />
          </button>
        </div>
      )}

      {appState === "results" && (
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white dark:bg-gray-900 shadow-lg border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center mb-6">
                <Award className="h-16 w-16 text-primary mb-4" />
                <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-50">Quiz Results</h1>
                <p className="text-gray-500 dark:text-gray-400 text-center mt-2">
                  You scored {score} out of {questions.length}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-4 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-800"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4 mt-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <div className="flex items-center text-sm">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Your answer:
                          <span
                            className={
                              selectedAnswers[index] === question.correctAnswer
                                ? "text-green-500 font-medium ml-1"
                                : "text-red-500 font-medium ml-1"
                            }
                          >
                            {selectedAnswers[index]}
                          </span>
                        </p>
                        {selectedAnswers[index] !== question.correctAnswer && (
                          <p className="text-green-500">Correct answer: {question.correctAnswer}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col space-y-3">
                <Button
                  onClick={resetQuiz}
                  className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-white font-medium transition-all"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Create New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

