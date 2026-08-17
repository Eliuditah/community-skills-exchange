import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Box, Button, 
  Radio, RadioGroup, FormControlLabel, LinearProgress,
  Chip, Paper
} from '@mui/material';
import { EmojiEvents, Lightbulb, TrendingUp } from '@mui/icons-material';

const SkillQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const questions = [
    {
      question: "What's your primary interest?",
      options: ['Technology', 'Design', 'Business', 'Science', 'Arts']
    },
    {
      question: "What's your experience level?",
      options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    },
    {
      question: "How much time can you commit?",
      options: ['1-3 hours/week', '4-7 hours/week', '8-15 hours/week', '16+ hours/week']
    },
    {
      question: "What's your learning style?",
      options: ['Hands-on practice', 'Watching videos', 'Reading', 'Group learning']
    }
  ];

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      generateRecommendations(newAnswers);
      setShowResults(true);
    }
  };

  const generateRecommendations = (userAnswers) => {
    // AI-like matching based on answers
    const recommendations = [
      { name: 'Web Development', match: 95, category: 'programming' },
      { name: 'UI/UX Design', match: 85, category: 'design' },
      { name: 'Data Science', match: 75, category: 'data_science' },
      { name: 'Cloud Computing', match: 65, category: 'cloud_computing' },
      { name: 'Mobile Development', match: 60, category: 'mobile_dev' }
    ].sort((a, b) => b.match - a.match);
    
    setRecommendations(recommendations);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setRecommendations([]);
  };

  if (showResults) {
    return (
      <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <EmojiEvents color="warning" />
            <Typography variant="h6">Your Skill Match Results</Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            {recommendations.map((rec, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {rec.name}
                    <Chip 
                      label={rec.category.replace('_', ' ').toUpperCase()}
                      size="small"
                      sx={{ ml: 1, bgcolor: '#e3f2fd', height: 20, fontSize: '0.6rem' }}
                    />
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {rec.match}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={rec.match}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: rec.match >= 80 ? '#4caf50' : rec.match >= 60 ? '#ff9800' : '#2196f3'
                    }
                  }}
                />
              </Box>
            ))}
          </Box>

          <Button variant="contained" onClick={resetQuiz} fullWidth>
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 3, bgcolor: '#f5f5f5' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Lightbulb color="warning" />
          <Typography variant="h6">Find Your Perfect Skill Match</Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion / questions.length) * 100}
            sx={{ height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="textSecondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {questions[currentQuestion].question}
        </Typography>

        <RadioGroup>
          {questions[currentQuestion].options.map((option, index) => (
            <FormControlLabel
              key={index}
              value={option}
              control={<Radio />}
              label={option}
              onClick={() => handleAnswer(option)}
              sx={{ 
                '&:hover': { bgcolor: '#e3f2fd' },
                borderRadius: 1,
                px: 1
              }}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default SkillQuiz;