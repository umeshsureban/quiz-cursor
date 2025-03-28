'use server'

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

// Initialize the Gemini API with type checking for the API key
if (!process.env.GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

export async function generateQuizQuestions(topic: string, numQuestions: number): Promise<QuizQuestion[]> {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-001-tuning' })

    const prompt = `Generate ${numQuestions} multiple choice questions about ${topic}.
    Return ONLY a valid JSON object with this exact structure:
    {
      "questions": [
        {
          "id": 1,
          "question": "What is...",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": "option2"
        }
      ]
    }
    Requirements:
    - The correctAnswer MUST exactly match one of the options
    - Each question MUST have exactly 4 options
    - Return ONLY the JSON, no other text or explanations
    - Ensure the JSON is properly formatted and valid`

    // Generate content with safety settings
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    })

    const response = await result.response
    const text = response.text()
    
    if (!text) {
      console.error('Empty response from Gemini')
      throw new Error('No content in response')
    }

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('Raw response:', text)
        throw new Error('No JSON found in response')
      }

      const parsedResponse = JSON.parse(jsonMatch[0])
      
      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        console.error('Invalid response structure:', parsedResponse)
        throw new Error('Invalid response format')
      }

      const formattedQuestions: QuizQuestion[] = parsedResponse.questions.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))

      // Validate the questions
      const validQuestions = formattedQuestions.every(q => 
        q.question && 
        Array.isArray(q.options) && 
        q.options.length === 4 && 
        q.options.includes(q.correctAnswer)
      )

      if (!validQuestions) {
        console.error('Invalid questions format:', formattedQuestions)
        throw new Error('Invalid question format')
      }

      return formattedQuestions

    } catch (parseError) {
      console.error('Failed to parse questions:', parseError, 'Content:', text)
      throw new Error('Invalid response format from AI')
    }

  } catch (error: any) {
    console.error('Error generating questions:', error.message || error)
    throw new Error(`Failed to generate quiz questions: ${error.message || 'Unknown error'}`)
  }
} 