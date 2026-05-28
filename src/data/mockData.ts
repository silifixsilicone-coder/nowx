export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified?: boolean;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  bio?: string;
  followers: number;
  following: number;
  reactPoints: number;
}

export interface Comment {
  id: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar' | 'isVerified'>;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface Post {
  id: string;
  user: User;
  type: 'image' | 'video' | 'text' | 'discord-code';
  title?: string;
  content: string; // Markdown or simple text
  mediaUrl?: string;
  likes: number;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  comments: Comment[];
  community?: string;
  tags?: string[];
  isLiked?: boolean;
  voteStatus?: 'upvoted' | 'downvoted' | null;
}

export interface Story {
  id: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  viewed: boolean;
  timestamp: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  unread?: boolean;
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  channels: DiscordChannel[];
}

export interface ChatMessage {
  id: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatar'>;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

// Custom curated profiles with meme/entertainment themes
export const currentUser: User = {
  id: 'me',
  username: 'RoastMaster_99',
  displayName: 'Samar Singh',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  isVerified: true,
  status: 'online',
  bio: 'Savage roaster. Comment-first expert. Fan war veteran. 👑 Cricket hypeman. If you can\'t take a joke, don\'t follow! 😂🔥',
  followers: 4802,
  following: 341,
  reactPoints: 15420,
};

export const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'Meme_Lord_69',
    displayName: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    status: 'online',
    bio: 'Posting memes 24/7. Cricket is life, roasts are love. Let\'s start a fan battle! 🏏😂',
    followers: 12400,
    following: 512,
    reactPoints: 42100,
  },
  {
    id: 'user_2',
    username: 'Sarcastic_King',
    displayName: 'Kabir Khan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    status: 'idle',
    bio: 'Professional sarcastic commentator. Top commenter status unlocked. 👑🏆',
    followers: 8900,
    following: 200,
    reactPoints: 31200,
  },
  {
    id: 'user_3',
    username: 'CricketGooner',
    displayName: 'Rahul Malhotra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    status: 'dnd',
    bio: 'Cricket hypeman. Virat fan till I die. Rohit fans can meet me in the Battles! ⚔️🏏',
    followers: 3200,
    following: 95,
    reactPoints: 8900,
  },
  {
    id: 'user_4',
    username: 'FanWar_Captain',
    displayName: 'Anjali Mehta',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    bio: 'Managing the ultimate cricket and entertainment fan wars. Meme expert. 💅🎭',
    followers: 15100,
    following: 430,
    reactPoints: 29800,
  },
];

// Curated Instagram-style Stories
export const mockStories: Story[] = [
  {
    id: 'story_daily_roast',
    user: { id: 'user_1', username: 'Meme_Lord_69', displayName: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '1h ago',
  },
  {
    id: 'story_ai_roast',
    user: { id: 'user_2', username: 'Sarcastic_King', displayName: 'Kabir Khan', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '2h ago',
  },
  {
    id: 'story_fan_battle',
    user: { id: 'user_3', username: 'CricketGooner', displayName: 'Rahul Malhotra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '4h ago',
  },
  {
    id: 'story_top_creator',
    user: { id: 'user_4', username: 'FanWar_Captain', displayName: 'Anjali Mehta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&h=1000&fit=crop',
    viewed: true,
    timestamp: '6h ago',
  },
];

// Full comments for Feed Cards
const sampleComments: Comment[] = [
  {
    id: 'comment_cricket_roast',
    user: {
      id: 'user_2',
      username: 'Sarcastic_King',
      displayName: 'Kabir Khan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    content: 'Australian team ko ab VPN ki zarurat hai. 🌍😂',
    timestamp: '5m ago',
    likes: 12600,
  },
  {
    id: 'comment_1',
    user: {
      id: 'user_1',
      username: 'Meme_Lord_69',
      displayName: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      isVerified: true
    },
    content: 'Unbelievable scenes tonight! History has been written 🇮🇳💙',
    timestamp: '15m ago',
    likes: 450,
  }
];

// Diverse hybrid social feed posts (Instagram + Threads + TikTok)
export const mockPosts: Post[] = [
  {
    id: 'post_cricket_1',
    user: mockUsers[0], // Meme_Lord_69
    type: 'image',
    title: 'Team India Wins The World Cup! 🏆🇮🇳',
    content: 'WE ARE THE CHAMPIONS! Team India wins the World Cup in absolute style! Celebrations all around the country tonight! Cummins thought he could silence the crowd, but Cummins is in airplane mode now! 🏆🏏 #TeamIndia #Champions #CricketWorldCup #ChampionsOfWorld',
    mediaUrl: 'https://images.unsplash.com/photo-1540747737956-37872404f8c1?w=800&h=600&fit=crop',
    likes: 24500,
    upvotes: 8900,
    downvotes: 14,
    commentsCount: 1820,
    community: 'c/cricket_roasts',
    tags: ['cricket', 'indiaWins', 'champions'],
    comments: sampleComments,
    isLiked: true,
    voteStatus: 'upvoted',
  },
  {
    id: 'post_2',
    user: mockUsers[2], // CricketGooner
    type: 'image',
    title: 'Virat vs Rohit: The Ultimate Battle! ⚔️👑',
    content: 'Here we go again! The fan war to end all fan wars. King Kohli’s legendary cover drive or Rohit’s effortless pull shot—who has the ultimate aura in Indian cricket? Let’s settle this in the replies right now! 👑🏏 #Kohli #Rohit #FanWar #CricketHype',
    mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
    likes: 18450,
    upvotes: 4500,
    downvotes: 8,
    commentsCount: 312,
    community: 'c/fan_wars',
    tags: ['kohli', 'rohit', 'fanwar'],
    comments: [
      {
        id: 'comment_2_1',
        user: mockUsers[1], // Sarcastic_King
        content: 'Virat drives, Rohit pulls, but Thala finishes the game and takes the credit. Simple logic! 😂👑',
        timestamp: '4h ago',
        likes: 540,
      },
      {
        id: 'comment_2_2',
        user: mockUsers[3], // FanWar_Captain
        content: 'Rohit fans are currently searching for calculator to count his double centuries. 🧾👀',
        timestamp: '3h ago',
        likes: 110,
      }
    ],
  },
  {
    id: 'post_3',
    user: mockUsers[3], // FanWar_Captain
    type: 'text',
    title: 'Aesthetic Slow-mo Vloggers vs Real Speed Bumps 🚶‍♂️😂',
    content: 'Why does every lifestyle influencer walk like they are dodging invisible lasers in slow motion? The moment they hit a real speed bump, the aesthetic turns into a survival test immediately! What\'s the cringiest reel you have seen this week? 🚶‍♂️😂 #Roast #Influencers #CringeCulture #Comedy',
    likes: 12500,
    upvotes: 3800,
    downvotes: 42,
    commentsCount: 184,
    community: 'c/savage_roasts',
    tags: ['roast', 'cringe', 'comedy'],
    comments: [
      {
        id: 'comment_3_1',
        user: currentUser, // RoastMaster_99
        content: 'They spend 3 hours color grading a 5-second video of themselves drinking coffee. Absolute peak productivity! ☕🤡',
        timestamp: '1h ago',
        likes: 580,
      }
    ],
  },
  {
    id: 'post_4',
    user: mockUsers[1], // Sarcastic_King
    type: 'video',
    title: 'Tech Bros explaining their Blockchain toothbrush 💻🦷',
    content: 'Tech bros explaining how their new AI-powered blockchain toothbrush is going to disrupt the cleaning industry. Just use water and brush your teeth, bro! 😂🤡 #TechBro #Roast #Blockchain #Comedy',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-blue-neon-lights-34259-large.mp4',
    likes: 9800,
    upvotes: 3100,
    downvotes: 19,
    commentsCount: 94,
    community: 'c/tech_roasts',
    tags: ['techbro', 'roast', 'blockchain', 'comedy'],
    comments: [
      {
        id: 'comment_4_1',
        user: mockUsers[0], // Meme_Lord_69
        content: 'Does it have an API to push my tooth cleaning stats directly to GitHub? If not, I am not buying. 💻😂',
        timestamp: '2h ago',
        likes: 120,
      }
    ],
  }
];

// Simulated full-screen TikTok videos
export interface TikTokVideo {
  id: string;
  user: User;
  caption: string;
  musicName: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

export const mockTikTokVideos: TikTokVideo[] = [
  {
    id: 'v1',
    user: mockUsers[0],
    caption: 'When they tell you cricket is just a game. 🏏❤️ #cricket #emotion #indiaWins',
    musicName: 'Original Sound - Meme_Lord_69',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-blue-neon-lights-34259-large.mp4',
    likes: 24500,
    comments: 182,
    shares: 430,
  },
  {
    id: 'v2',
    user: mockUsers[1],
    caption: 'Lifestyle vloggers making tea like they are saving the planet. ☕😂 #roast #comedy #vlog',
    musicName: 'Sarcastic Beats - Kabir Khan',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31837-large.mp4',
    likes: 18900,
    comments: 94,
    shares: 212,
  }
];

// Fallback Discord structure for TypeScript compatibility
export const mockDiscordServers: DiscordServer[] = [
  {
    id: 'server_react',
    name: 'ReactVerse Official',
    icon: '⚡',
    channels: [
      { id: 'general', name: 'general-chat', type: 'text' }
    ]
  }
];

export const mockDiscordChats: Record<string, ChatMessage[]> = {
  'general': [
    {
      id: 'm1',
      user: currentUser,
      content: 'Hey everyone! Welocme to ReactVerse chat!',
      timestamp: 'Today at 2:10 PM',
    }
  ]
};
