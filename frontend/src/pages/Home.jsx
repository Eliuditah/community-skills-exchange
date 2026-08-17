import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, Typography, Button, Grid, Card, CardContent, Container, 
  Chip, IconButton, Avatar, Paper, Divider, Tabs, Tab 
} from '@mui/material';
import { 
  Code, Security, DataUsage, Cloud, People, EmojiEvents, School, TrendingUp, 
  ArrowForward, ArrowBack, Build, Brush, Restaurant, CarRepair, 
  ElectricalServices, Handyman, Home as HomeIcon, LocalHospital, 
  Agriculture, Computer, DesignServices, Engineering, Science, 
  AccountBalance, Psychology, Star, Rocket, Favorite, Shield,
  WorkspacePremium, Groups, Lightbulb, VolunteerActivism,
  Search, Link as LinkIcon, Dashboard as DashboardIcon,
  SwapHoriz, Whatshot, Videocam, Quiz
} from '@mui/icons-material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Layout from '../components/Layout';
import SmartMatch from '../components/SmartMatch';
import SkillStreak from '../components/SkillStreak';
import ImpactScore from '../components/ImpactScore';
import BarterMarketplace from '../components/BarterMarketplace';
import SkillNewsfeed from '../components/SkillNewsfeed';
import SkillQuiz from '../components/SkillQuiz';
import VideoCallComponent from '../components/VideoCall';
import BadgeSystem from '../components/BadgeSystem';

// 15 Skill Slides with beautiful content
const skillImages = [
  {
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
    title: '💻 Programming & Web Development',
    subtitle: 'Learn Python, JavaScript, React, and build amazing websites',
    description: 'Master the art of coding and create powerful web applications. From beginner to expert, we have mentors for every level.',
    category: 'Technology',
    level: 'All Levels',
    icon: '🚀'
  },
  {
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
    title: '🔒 Cybersecurity',
    subtitle: 'Master security practices, ethical hacking, and protect data',
    description: 'Learn to protect systems, networks, and data from cyber threats. Become a certified security professional.',
    category: 'Security',
    level: 'Intermediate',
    icon: '🛡️'
  },
  {
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    title: '📊 Data Science & AI',
    subtitle: 'Analyze data, build machine learning models, and predict trends',
    description: 'Transform raw data into actionable insights using AI, machine learning, and statistical analysis.',
    category: 'Data Science',
    level: 'Advanced',
    icon: '🧠'
  },
  {
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    title: '☁️ Cloud Computing',
    subtitle: 'Deploy and scale applications on AWS, Azure, and Google Cloud',
    description: 'Master cloud architecture, deployment, and DevOps practices for modern applications.',
    category: 'Cloud',
    level: 'All Levels',
    icon: '☁️'
  },
  {
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
    title: '🔧 Carpentry & Woodworking',
    subtitle: 'Master woodworking, furniture making, and craftsmanship',
    description: 'Learn traditional and modern woodworking techniques. Create beautiful furniture and structures.',
    category: 'Blue Collar',
    level: 'Beginner',
    icon: '🔨'
  },
  {
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200',
    title: '⚡ Electrical Installation',
    subtitle: 'Learn electrical wiring, installation, and safety practices',
    description: 'Master residential and commercial electrical systems. Learn safety standards and installation techniques.',
    category: 'Blue Collar',
    level: 'Intermediate',
    icon: '⚡'
  },
  {
    url: 'https://images.unsplash.com/photo-1596008194705-336a6e3c20a7?w=1200',
    title: '🚗 Auto Mechanics',
    subtitle: 'Vehicle maintenance, repair, and diagnostic skills',
    description: 'Learn to diagnose, repair, and maintain vehicles. From oil changes to complex engine repairs.',
    category: 'Blue Collar',
    level: 'All Levels',
    icon: '🔧'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f0a0?w=1200',
    title: '🔩 Plumbing & Pipe Fitting',
    subtitle: 'Master plumbing installation, repair, and maintenance',
    description: 'Learn plumbing systems, pipe fitting, and maintenance. Become a certified plumber.',
    category: 'Blue Collar',
    level: 'Beginner',
    icon: '🔩'
  },
  {
    url: 'https://images.unsplash.com/photo-1585704032916-c3405ca5f4e0?w=1200',
    title: '🏗️ Welding & Metal Fabrication',
    subtitle: 'Learn welding techniques, metalwork, and fabrication',
    description: 'Master MIG, TIG, and arc welding. Learn metal fabrication and structural welding.',
    category: 'Blue Collar',
    level: 'Intermediate',
    icon: '🔥'
  },
  {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    title: '👨‍🍳 Culinary Arts & Cooking',
    subtitle: 'Master cooking techniques, food preparation, and presentation',
    description: 'Learn from professional chefs. Master cooking techniques, food presentation, and kitchen management.',
    category: 'Creative',
    level: 'All Levels',
    icon: '🍳'
  },
  {
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200',
    title: '🎨 Graphic Design & Digital Art',
    subtitle: 'Learn design tools, branding, and creative visual communication',
    description: 'Master Adobe Creative Suite, UI/UX design, and digital art creation.',
    category: 'Design',
    level: 'All Levels',
    icon: '🎨'
  },
  {
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    title: '🏥 Healthcare & First Aid',
    subtitle: 'Medical assistance, first aid, and healthcare support',
    description: 'Learn life-saving skills, patient care, and healthcare procedures.',
    category: 'Healthcare',
    level: 'Beginner',
    icon: '🏥'
  },
  {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200',
    title: '🌾 Agriculture & Farming',
    subtitle: 'Modern farming, sustainable agriculture, and food production',
    description: 'Learn sustainable farming practices, crop management, and food production.',
    category: 'Agriculture',
    level: 'All Levels',
    icon: '🌱'
  },
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200',
    title: '🏢 Business & Project Management',
    subtitle: 'Lead projects, manage teams, and grow businesses',
    description: 'Learn business strategy, project management, and leadership skills.',
    category: 'Business',
    level: 'Intermediate',
    icon: '📈'
  },
  {
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200',
    title: '🧠 Personal Development & Coaching',
    subtitle: 'Life coaching, leadership, and personal growth',
    description: 'Transform your life with personal development, coaching, and leadership skills.',
    category: 'Personal Growth',
    level: 'All Levels',
    icon: '🌟'
  }
];

// Testimonials
const testimonials = [
  {
    name: 'John Mwangi',
    role: 'Software Developer',
    text: 'This platform helped me learn React from an expert mentor. I went from beginner to building full-stack apps in 3 months!',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    name: 'Sarah Wanjiru',
    role: 'Data Analyst',
    text: 'I shared my Python skills and learned machine learning in return. The skill exchange system is brilliant!',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    name: 'David Ochieng',
    role: 'Electrician',
    text: 'I learned advanced electrical wiring techniques from a master electrician. Now I run my own successful business.',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.slickNext();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    fade: true,
    cssEase: 'linear',
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const features = [
    { icon: <Code sx={{ fontSize: 40, color: '#2196f3' }} />, title: 'Programming', desc: 'Learn and share coding skills', bg: '#e3f2fd' },
    { icon: <Build sx={{ fontSize: 40, color: '#ff9800' }} />, title: 'Blue-Collar Skills', desc: 'Carpentry, plumbing, electrical & more', bg: '#fff3e0' },
    { icon: <DesignServices sx={{ fontSize: 40, color: '#9c27b0' }} />, title: 'Design & Arts', desc: 'Graphic design, cooking, creative arts', bg: '#f3e5f5' },
    { icon: <Engineering sx={{ fontSize: 40, color: '#4caf50' }} />, title: 'Technical Skills', desc: 'Engineering, auto mechanics, welding', bg: '#e8f5e9' },
  ];

  const stats = [
    { value: '5,000+', label: 'Active Users', icon: <People sx={{ fontSize: 30 }} />, color: '#1a237e' },
    { value: '3,200+', label: 'Skills Shared', icon: <School sx={{ fontSize: 30 }} />, color: '#4caf50' },
    { value: '1,800+', label: 'Exchanges Completed', icon: <TrendingUp sx={{ fontSize: 30 }} />, color: '#ff9800' },
    { value: '97%', label: 'Satisfaction Rate', icon: <EmojiEvents sx={{ fontSize: 30 }} />, color: '#e91e63' },
  ];

  const benefits = [
    { icon: <VolunteerActivism sx={{ fontSize: 35, color: '#e91e63' }} />, title: 'Free Learning', desc: 'Exchange skills without money' },
    { icon: <Groups sx={{ fontSize: 35, color: '#2196f3' }} />, title: 'Community Support', desc: 'Learn from real people' },
    { icon: <WorkspacePremium sx={{ fontSize: 35, color: '#ff9800' }} />, title: 'Earn Recognition', desc: 'Build your reputation' },
    { icon: <Rocket sx={{ fontSize: 35, color: '#4caf50' }} />, title: 'Career Growth', desc: 'Advance your career' },
  ];

  return (
    <Layout>
      {/* Slideshow Section */}
      <Box sx={{ 
        mb: 6, 
        borderRadius: 4, 
        overflow: 'hidden', 
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        maxWidth: '1200px',
        mx: 'auto'
      }}>
        <Slider ref={sliderRef} {...sliderSettings}>
          {skillImages.map((slide, index) => (
            <Box key={index} sx={{ position: 'relative', height: { xs: 250, md: 380 } }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${slide.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)',
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '10%', md: '8%' },
                    left: { xs: '8%', md: '10%' },
                    color: 'white',
                    zIndex: 2,
                    maxWidth: { xs: '90%', md: '55%' }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={slide.icon + ' ' + slide.category} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        height: '24px'
                      }} 
                    />
                    <Chip 
                      label={slide.level} 
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.7)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: '24px'
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: { xs: '1.2rem', md: '2rem' }, 
                      mb: 0.5,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.95, 
                      mb: 1, 
                      fontSize: { xs: '0.7rem', md: '0.9rem' },
                      textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.85, 
                      mb: 1.5, 
                      fontSize: { xs: '0.65rem', md: '0.85rem' },
                      maxWidth: '70%',
                      display: { xs: 'none', md: 'block' }
                    }}
                  >
                    {slide.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to="/register"
                      size="small"
                      sx={{
                        bgcolor: '#4caf50',
                        '&:hover': { bgcolor: '#388e3c' },
                        px: 3,
                        py: 0.8,
                        fontSize: '0.8rem',
                        borderRadius: '30px',
                        textTransform: 'none'
                      }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      component={Link}
                      to="/explore"
                      size="small"
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                        px: 2.5,
                        py: 0.8,
                        fontSize: '0.8rem',
                        borderRadius: '30px',
                        textTransform: 'none'
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>
                      {index + 1} / {skillImages.length}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Welcome Message */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          🌟 Welcome to SkillExchange
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ fontSize: '1.1rem' }}>
          Connect, Learn, and Grow Together - No Money Needed!
        </Typography>
      </Box>

      {/* Skill Count */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Chip 
          icon={<Rocket sx={{ color: 'white !important' }} />}
          label={`${skillImages.length}+ Skills Available to Learn & Share`} 
          sx={{ 
            bgcolor: '#1a237e', 
            color: 'white',
            fontWeight: 'bold',
            px: 2,
            py: 2.5,
            fontSize: '1rem',
            borderRadius: '30px'
          }} 
        />
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 6, justifyContent: 'center' }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card sx={{
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
              color: 'white',
              transition: 'transform 0.3s, box-shadow 0.3s',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }
            }}>
              <Box sx={{ mb: 1 }}>{stat.icon}</Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ============ NEW FEATURES SECTION ============ */}
      {user && (
        <>
          {/* Tabs for Features */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={(e, v) => setTabValue(v)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Whatshot />} label="Smart Matches" />
              <Tab icon={<SwapHoriz />} label="Barter" />
              <Tab icon={<Quiz />} label="Quiz" />
              <Tab icon={<Videocam />} label="Video Call" />
              <Tab icon={<TrendingUp />} label="Activity" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ mb: 4 }}>
            {tabValue === 0 && <SmartMatch />}
            {tabValue === 1 && <BarterMarketplace />}
            {tabValue === 2 && <SkillQuiz />}
            {tabValue === 3 && <VideoCallComponent />}
            {tabValue === 4 && <SkillNewsfeed />}
          </Box>

          {/* User Dashboard Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <SkillStreak />
            </Grid>
            <Grid item xs={12} md={6}>
              <ImpactScore />
            </Grid>
          </Grid>
        </>
      )}

      {/* If not logged in - Show CTA */}
      {!user && (
        <Paper sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 3
        }}>
          <Typography variant="h5" gutterBottom>
            🔐 Login to Access Premium Features
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
            Get personalized skill matches, track your progress, and start exchanging skills today!
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/login"
            sx={{ bgcolor: '#1a237e', '&:hover': { bgcolor: '#0d1445' } }}
          >
            Login Now
          </Button>
        </Paper>
      )}

      {/* Why Choose Us */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          Why Choose SkillExchange?
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The best platform to share and learn skills for free
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              transition: 'transform 0.3s, box-shadow 0.3s',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              }
            }}>
              <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{benefit.title}</Typography>
              <Typography variant="body2" color="textSecondary">{benefit.desc}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          What You Can Learn & Share
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Explore a wide range of skills across different categories
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              bgcolor: feature.bg,
              transition: 'transform 0.3s, box-shadow 0.3s',
              height: '100%',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
              }
            }}>
              <Box sx={{ mb: 2 }}>{feature.icon}</Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>{feature.title}</Typography>
              <Typography variant="body2" color="textSecondary">{feature.desc}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Testimonials */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
          What Our Community Says
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Real stories from real people who transformed their skills
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
        {testimonials.map((testimonial, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{
              textAlign: 'center',
              p: 3,
              borderRadius: 3,
              height: '100%',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
              }
            }}>
              <Avatar 
                src={testimonial.avatar} 
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '4px solid #1a237e' }}
              />
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                "{testimonial.text}"
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {testimonial.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {testimonial.role}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How It Works */}
      <Box sx={{ 
        py: 6, 
        px: 4,
        background: 'linear-gradient(135deg, #1a237e 0%, #0d1445 100%)',
        borderRadius: 3,
        color: 'white',
        mb: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          How It Works
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8, mb: 4 }}>
          Three simple steps to start exchanging skills
        </Typography>
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {[
            { step: '1', title: 'Create Profile', desc: 'Sign up and list your skills' },
            { step: '2', title: 'Find Matches', desc: 'Discover people with complementary skills' },
            { step: '3', title: 'Connect & Learn', desc: 'Share knowledge and grow together' },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  mx: 'auto',
                  mb: 2,
                  border: '3px solid rgba(255,255,255,0.3)'
                }}>
                  {item.step}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>{item.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box sx={{
        textAlign: 'center',
        py: 5,
        px: 3,
        bgcolor: '#f5f7fa',
        borderRadius: 3,
        border: '2px dashed #1a237e'
      }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#1a237e', fontWeight: 'bold' }}>
          Ready to Start Your Journey?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'textSecondary' }}>
          Join thousands of learners and mentors sharing skills every day
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to={user ? "/explore" : "/register"}
          sx={{
            bgcolor: '#1a237e',
            '&:hover': { bgcolor: '#0d1445' },
            px: 6,
            py: 1.5,
            borderRadius: '30px',
            fontSize: '1.1rem'
          }}
        >
          {user ? 'Start Exploring 🚀' : 'Create Your Account 🚀'}
        </Button>
      </Box>
    </Layout>
  );
};

// Custom arrow components for slider
const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: 'block', 
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        padding: '8px',
        right: '10px',
        zIndex: 10,
        width: '35px',
        height: '35px',
      }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ 
        ...style, 
        display: 'block', 
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        padding: '8px',
        left: '10px',
        zIndex: 10,
        width: '35px',
        height: '35px',
      }}
      onClick={onClick}
    />
  );
};

export default Home;