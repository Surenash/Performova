// Mock data for Performova LMS

export const courses = [
  {
    id: 1,
    title: "Workplace Safety Fundamentals",
    category: "Safety & Compliance",
    difficulty: "Beginner",
    duration: "15 min",
    thumbnail: "https://images.unsplash.com/photo-1739055248868-6a763d2e63aa?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 60,
    enrolled: true,
    lessons: 8,
    completedLessons: 5,
    description: "Essential safety protocols and workplace hazard awareness.",
    tags: ["Safety", "Compliance", "Essential"]
  },
  {
    id: 2,
    title: "Effective Communication Skills",
    category: "Soft Skills",
    difficulty: "Intermediate",
    duration: "25 min",
    thumbnail: "https://images.unsplash.com/photo-1757737488977-fd42bc94659e?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 30,
    enrolled: true,
    lessons: 12,
    completedLessons: 4,
    description: "Master communication techniques for team collaboration.",
    tags: ["Communication", "Teamwork", "Leadership"]
  },
  {
    id: 3,
    title: "Data Analytics Basics",
    category: "Technical Skills",
    difficulty: "Intermediate",
    duration: "35 min",
    thumbnail: "https://images.unsplash.com/photo-1739055248868-6a763d2e63aa?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 0,
    enrolled: false,
    lessons: 15,
    completedLessons: 0,
    description: "Learn to analyze data and make informed business decisions.",
    tags: ["Data", "Analytics", "Business"]
  },
  {
    id: 4,
    title: "Project Management 101",
    category: "Management",
    difficulty: "Beginner",
    duration: "20 min",
    thumbnail: "https://images.unsplash.com/photo-1757737488977-fd42bc94659e?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 0,
    enrolled: false,
    lessons: 10,
    completedLessons: 0,
    description: "Fundamentals of effective project planning and execution.",
    tags: ["Project Management", "Planning", "Productivity"]
  },
  {
    id: 5,
    title: "Cybersecurity Awareness",
    category: "Security",
    difficulty: "Beginner",
    duration: "18 min",
    thumbnail: "https://images.unsplash.com/photo-1739055248868-6a763d2e63aa?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 100,
    enrolled: true,
    lessons: 6,
    completedLessons: 6,
    description: "Protect your organization from cyber threats.",
    tags: ["Security", "IT", "Essential"]
  },
  {
    id: 6,
    title: "Customer Service Excellence",
    category: "Soft Skills",
    difficulty: "Beginner",
    duration: "22 min",
    thumbnail: "https://images.unsplash.com/photo-1757737488977-fd42bc94659e?crop=entropy&cs=srgb&fm=jpg&q=85",
    progress: 0,
    enrolled: false,
    lessons: 9,
    completedLessons: 0,
    description: "Deliver exceptional customer experiences consistently.",
    tags: ["Customer Service", "Communication", "Soft Skills"]
  }
];

export const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    avatar: "https://images.unsplash.com/photo-1586710743864-260430279452?crop=entropy&cs=srgb&fm=jpg&q=85",
    role: "Sales Manager",
    coursesAssigned: 5,
    coursesCompleted: 3,
    progress: 60,
    status: "On Track",
    streak: 12,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@company.com",
    avatar: "https://images.unsplash.com/photo-1575299833801-85ce40813bac?crop=entropy&cs=srgb&fm=jpg&q=85",
    role: "Engineer",
    coursesAssigned: 6,
    coursesCompleted: 5,
    progress: 83,
    status: "On Track",
    streak: 24,
    lastActive: "1 hour ago"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    avatar: "https://images.unsplash.com/photo-1586710743864-260430279452?crop=entropy&cs=srgb&fm=jpg&q=85",
    role: "Marketing Specialist",
    coursesAssigned: 4,
    coursesCompleted: 1,
    progress: 25,
    status: "Overdue",
    streak: 3,
    lastActive: "5 days ago"
  },
  {
    id: 4,
    name: "David Kim",
    email: "d.kim@company.com",
    avatar: "https://images.unsplash.com/photo-1657771072153-878f8b0ce74a?crop=entropy&cs=srgb&fm=jpg&q=85",
    role: "Product Designer",
    coursesAssigned: 5,
    coursesCompleted: 4,
    progress: 80,
    status: "On Track",
    streak: 18,
    lastActive: "30 minutes ago"
  },
  {
    id: 5,
    name: "Jessica Williams",
    email: "j.williams@company.com",
    avatar: "https://images.unsplash.com/photo-1586710743864-260430279452?crop=entropy&cs=srgb&fm=jpg&q=85",
    role: "Operations Manager",
    coursesAssigned: 7,
    coursesCompleted: 6,
    progress: 86,
    status: "On Track",
    streak: 30,
    lastActive: "3 hours ago"
  }
];

export const learnerStats = {
  currentStreak: 7,
  totalPoints: 2450,
  badges: [
    { id: 1, name: "Quick Learner", icon: "⚡", earned: true },
    { id: 2, name: "Week Warrior", icon: "🔥", earned: true },
    { id: 3, name: "Perfect Score", icon: "🎯", earned: true },
    { id: 4, name: "Month Master", icon: "🏆", earned: false },
    { id: 5, name: "Team Player", icon: "🤝", earned: true }
  ],
  coursesInProgress: 2,
  coursesCompleted: 3,
  totalCourses: 5
};

export const lessons = [
  {
    id: 1,
    courseId: 1,
    title: "Introduction to Workplace Safety",
    type: "video",
    duration: "5 min",
    completed: true,
    videoUrl: "https://example.com/video1.mp4"
  },
  {
    id: 2,
    courseId: 1,
    title: "Common Workplace Hazards",
    type: "interactive",
    duration: "8 min",
    completed: true,
    questions: [
      {
        id: 1,
        question: "Which of the following is considered a physical hazard?",
        options: [
          "Loud noise",
          "Chemical spills",
          "Workplace stress",
          "Poor lighting"
        ],
        correctAnswer: 0,
        explanation: "Loud noise is a physical hazard that can cause hearing damage over time."
      },
      {
        id: 2,
        question: "What should you do if you spot a safety hazard?",
        options: [
          "Ignore it if it doesn't affect you",
          "Report it immediately to your supervisor",
          "Wait for someone else to notice",
          "Take a photo for social media"
        ],
        correctAnswer: 1,
        explanation: "Always report safety hazards immediately to prevent accidents."
      }
    ]
  },
  {
    id: 3,
    courseId: 1,
    title: "Personal Protective Equipment",
    type: "video",
    duration: "6 min",
    completed: true,
    videoUrl: "https://example.com/video3.mp4"
  },
  {
    id: 4,
    courseId: 1,
    title: "Emergency Procedures",
    type: "interactive",
    duration: "10 min",
    completed: false,
    questions: [
      {
        id: 3,
        question: "In case of a fire alarm, what is the first thing you should do?",
        options: [
          "Gather your belongings",
          "Call 911",
          "Evacuate immediately",
          "Check what caused the alarm"
        ],
        correctAnswer: 2,
        explanation: "Always evacuate immediately when the fire alarm sounds."
      }
    ]
  }
];

export const adminStats = {
  activeLearnersCount: 342,
  averageCompletionTime: "18 min",
  certificatesEarnedThisMonth: 128,
  totalCourses: 45,
  teamCompletionRate: 73
};

export const companyLogos = [
  { name: "TechCorp", opacity: 0.6 },
  { name: "InnovateInc", opacity: 0.5 },
  { name: "GlobalSolutions", opacity: 0.7 },
  { name: "FutureWorks", opacity: 0.6 },
  { name: "NextGen", opacity: 0.5 }
];
