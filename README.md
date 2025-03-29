# Quiz for Mitra's

[![Deploy to Vercel](https://github.com/umeshsureban/quiz-for-mitras/actions/workflows/deploy.yml/badge.svg)](https://github.com/umeshsureban/quiz-for-mitras/actions/workflows/deploy.yml)

An interactive quiz application designed specifically for Mitra's learning journey, built with Next.js, TypeScript, and Google's Gemini AI model.

## 🌟 Features

- Dynamic quiz generation using Google's Gemini AI
- Interactive multiple-choice questions
- Real-time scoring and progress tracking
- Timer functionality
- Dark/Light mode support
- Responsive design for all devices
- Custom topic selection
- Adjustable quiz duration and question count

## 🚀 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **AI Integration:** Google Generative AI (Gemini)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics
- **Performance Monitoring:** Vercel Speed Insights

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/umeshsureban/quiz-cursor.git
```

2. Install dependencies:
```bash
cd quiz-for-mitras
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Environment Variables

- `GOOGLE_API_KEY`: Your Google AI API key for Gemini model access

### Quiz Settings

You can customize various quiz parameters:
- Number of questions (3-20)
- Quiz duration (1-30 minutes)
- Topic selection
- Custom instructions

## 📱 Usage

1. Select a quiz topic
2. Choose the number of questions
3. Set the quiz duration
4. Add any custom instructions (optional)
5. Start the quiz
6. Answer questions within the time limit
7. View your results and correct answers

## 🎯 Key Components

- `QuizApp`: Main application component
- `QuizSetupForm`: Quiz configuration interface
- `actions.tsx`: AI integration and question generation
- `theme-provider`: Dark/Light mode functionality

## 🔐 Security

- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting on API routes
- Secure HTTP headers

## ⚡ Performance

The application is optimized for:
- Fast page loads
- Minimal bundle size
- Efficient API calls
- Responsive interactions

## 📈 Analytics

Built-in analytics tracking:
- User engagement
- Quiz completion rates
- Topic popularity
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Generative AI](https://ai.google.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel Platform](https://vercel.com/)


## 🌐 Live Demo

Check out the live demo: [Quiz for Mitra's](https://mitras-quiz.vercel.app/)

---

Made with ❤️ for Mitra's learning journey
