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

// Custom curated profiles with cyberpunk avatars
export const currentUser: User = {
  id: 'me',
  username: 'react_dev_99',
  displayName: 'Alex Rivers',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
  isVerified: true,
  status: 'online',
  bio: 'Building the future of social networks in React & TS. Tailwind fanatic. Framer Motion enthusiast. Let\'s connect! ⚡',
  followers: 4802,
  following: 341,
  reactPoints: 15420,
};

export const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'neon_rider',
    displayName: 'Sarah Connor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    status: 'online',
    bio: 'Digital artist crafting cyberpunk landscapes. Next.js 19 explorer. 🌌🎨',
    followers: 12400,
    following: 512,
    reactPoints: 42100,
  },
  {
    id: 'user_2',
    username: 'framer_wizard',
    displayName: 'Jonas S.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    status: 'idle',
    bio: 'Making web interfaces feel fluid and alive. Motion is emotion! ✨🌪️',
    followers: 8900,
    following: 200,
    reactPoints: 31200,
  },
  {
    id: 'user_3',
    username: 'rust_ace',
    displayName: 'Takahiro Ken',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isVerified: true,
    status: 'dnd',
    bio: 'Compile-time enthusiast. Writing blazing fast services. Rust + WebAssembly. 🦀🚀',
    followers: 3200,
    following: 95,
    reactPoints: 8900,
  },
  {
    id: 'user_4',
    username: 'tailwind_queen',
    displayName: 'Aria Rose',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    status: 'online',
    bio: 'Styling the web, one class at a time. Speed is my priority. ⚡💅',
    followers: 15100,
    following: 430,
    reactPoints: 29800,
  },
];

// Curated Instagram-style Stories
export const mockStories: Story[] = [
  {
    id: 'story_daily_roast',
    user: { id: 'daily_roast', username: 'daily_roast', displayName: 'Daily Roast 🔥', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '1h ago',
  },
  {
    id: 'story_ai_roast',
    user: { id: 'ai_roast', username: 'ai_roaster', displayName: 'AI Roast 🤖', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '2h ago',
  },
  {
    id: 'story_fan_battle',
    user: { id: 'fan_battle', username: 'fan_battle', displayName: 'Fan Battle ⚔️', avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&h=150&fit=crop&crop=face' },
    mediaType: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=1000&fit=crop',
    viewed: false,
    timestamp: '4h ago',
  },
  {
    id: 'story_top_creator',
    user: { id: 'top_creator', username: 'top_creator', displayName: 'Top Creator 👑', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
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
    user: mockUsers[0],
    content: 'Australia airplane mode me hai 😂',
    timestamp: '5m ago',
    likes: 1242,
  },
  {
    id: 'comment_1',
    user: mockUsers[1],
    content: 'Unbelievable scenes tonight! History has been written 🇮🇳💙',
    timestamp: '15m ago',
    likes: 450,
  }
];

// Diverse hybrid social feed posts (Instagram + Reddit + Discord + TikTok)
export const mockPosts: Post[] = [
  {
    id: 'post_cricket_1',
    user: mockUsers[3], // tailwind_queen
    type: 'image',
    title: 'Team India Wins The World Cup! 🏆🇮🇳',
    content: 'WE ARE THE CHAMPIONS! An absolute historic victory for the Men in Blue as they lift the ultimate trophy! Celebrations all around the country tonight! 🏆🏏 #TeamIndia #Champions #CricketWorldCup #ChampionsOfWorld',
    mediaUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=600&fit=crop',
    likes: 24500,
    upvotes: 8900,
    downvotes: 14,
    commentsCount: 1820,
    community: 'r/cricket',
    tags: ['cricket', 'indiaWins', 'champions'],
    comments: sampleComments,
    isLiked: true,
    voteStatus: 'upvoted',
  },
  {
    id: 'post_2',
    user: mockUsers[1], // framer_wizard (Discord / Reddit style code blocks)
    type: 'discord-code',
    title: 'Smooth Staggered Menu in Framer Motion',
    content: 'Sharing this super clean React component for staggered item lists. The spring values create an incredibly organic layout entry. Try importing this code block directly in your Next.js project!',
    mediaUrl: `import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300 } }
};

export const StaggeredList = ({ items }) => (
  <motion.ul variants={containerVariants} initial="hidden" animate="show">
    {items.map(item => (
      <motion.li key={item.id} variants={itemVariants}>
        {item.text}
      </motion.li>
    ))}
  </motion.ul>
);`,
    likes: 542,
    upvotes: 210,
    downvotes: 3,
    commentsCount: 18,
    community: 'r/nextjs',
    tags: ['react', 'animation', 'frontend'],
    comments: [
      {
        id: 'comment_3',
        user: mockUsers[3],
        content: 'This saves so much time! Saving this code immediately.',
        timestamp: '4h ago',
        likes: 5,
      }
    ],
  },
  {
    id: 'post_3',
    user: mockUsers[3], // tailwind_queen (Reddit text post style)
    type: 'text',
    title: 'Tailwind CSS v4.0 is a complete game-changer!',
    content: `Here's why you should upgrade your stack immediately:
1. **Zero Configuration CSS:** No more bloated tailwind.config.js files! Everything is now compiled inline or via custom css-level directives like \`@theme\`.
2. **First-Class CSS Variables:** All themes are compiled to standard native CSS properties, meaning you can manipulate colors in real-time in JavaScript using custom styling parameters.
3. **Rust Compiler Engine:** The compilation process is up to 10x faster under-the-hood.
4. **CSS imports:** Merged perfectly inside a single \`@import "tailwindcss"\` declaration.

What are your thoughts on native variables vs static config? Let\'s debate in the replies!`,
    likes: 310,
    upvotes: 180,
    downvotes: 15,
    commentsCount: 22,
    community: 'r/tailwind',
    tags: ['css', 'tailwind', 'development'],
    comments: [
      {
        id: 'comment_4',
        user: mockUsers[2],
        content: 'Native CSS variables are definitely the way to go. It makes theme switching and reactive layout styles much easier to write.',
        timestamp: '1h ago',
        likes: 9,
      }
    ],
  },
  {
    id: 'post_4',
    user: mockUsers[2], // rust_ace (TikTok simulated video player)
    type: 'video',
    title: 'Real-time rendering engine speed tests 🦀',
    content: 'Benchmarking our WebGL/WebAssembly graphics pipelines compiled from Rust. Achieving a stable 120 FPS under load!',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31837-large.mp4',
    likes: 852,
    upvotes: 312,
    downvotes: 4,
    commentsCount: 14,
    community: 'r/rust',
    tags: ['wasm', 'graphics', 'rustlang'],
    comments: [],
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
    caption: 'Neon dreams coming to life! Rendering cyberpunk worlds in real-time. #cyberpunk #blender #neon',
    musicName: 'Original Sound - neon_rider',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-code-31837-large.mp4',
    likes: 24500,
    comments: 182,
    shares: 430,
  },
  {
    id: 'v2',
    user: mockUsers[1],
    caption: 'Fluid UI physics in React. Framer Motion custom layout transition logic. 🚀💻 #nextjs #animation #webdev',
    musicName: 'Future Waves - Jonas S.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-spinning-glowing-dots-hud-interface-31853-large.mp4',
    likes: 18900,
    comments: 94,
    shares: 212,
  },
  {
    id: 'v3',
    user: mockUsers[2],
    caption: 'Why rust is faster than your favorite language. 🦀 Let\'s talk compilation, memory safety & pointer logic! #rustlang #coding #programming',
    musicName: 'Industrial Beats - Takahiro',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-blue-neon-lights-34259-large.mp4',
    likes: 35200,
    comments: 489,
    shares: 1205,
  }
];

// Discord Server structure and mock conversations
export const mockDiscordServers: DiscordServer[] = [
  {
    id: 'server_react',
    name: 'ReactVerse Official',
    icon: '⚡',
    channels: [
      { id: 'announcements', name: 'announcements', type: 'text' },
      { id: 'general', name: 'general-chat', type: 'text', unread: true },
      { id: 'framer-motion', name: 'animation-design', type: 'text' },
      { id: 'showcase', name: 'cool-showcase', type: 'text' },
      { id: 'voice-lounge', name: 'Lounge Voice', type: 'voice' },
    ]
  },
  {
    id: 'server_tailwind',
    name: 'Tailwind CSS Community',
    icon: '🎨',
    channels: [
      { id: 'v4-beta', name: 'v4-discussion', type: 'text' },
      { id: 'styles', name: 'aesthetic-css', type: 'text' },
    ]
  },
  {
    id: 'server_rust',
    name: 'Rustaceans',
    icon: '🦀',
    channels: [
      { id: 'beginners', name: 'rust-newbies', type: 'text' },
      { id: 'wasm', name: 'wasm-web', type: 'text' },
    ]
  }
];

export const mockDiscordChats: Record<string, ChatMessage[]> = {
  'announcements': [
    {
      id: 'm1',
      user: currentUser,
      content: 'Welcome to ReactVerse Official server! This is the Announcements channel. Stay tuned for version 1.0 launches and exclusive beta features! 🚀',
      timestamp: 'Today at 12:00 PM',
    }
  ],
  'general': [
    {
      id: 'm2',
      user: mockUsers[0],
      content: 'Hey everyone! Excited to join ReactVerse. The mobile feed transitions are so fast!',
      timestamp: 'Today at 2:10 PM',
      reactions: [{ emoji: '🔥', count: 5, users: ['user_2', 'user_3'] }]
    },
    {
      id: 'm3',
      user: mockUsers[2],
      content: 'Has anyone started playing with Tailwind CSS v4 in production Next.js? The performance is incredible.',
      timestamp: 'Today at 2:14 PM',
    },
    {
      id: 'm4',
      user: mockUsers[1],
      content: 'Yes! Using `@theme inline` in globals.css simplifies the code by a massive margin. Combining it with Framer Motion layoutId works flawlessly.',
      timestamp: 'Today at 2:16 PM',
      reactions: [
        { emoji: '💡', count: 3, users: ['user_1'] },
        { emoji: '💯', count: 2, users: ['user_3'] }
      ]
    },
    {
      id: 'm5',
      user: mockUsers[3],
      content: 'We need to host a voice lounge talk on this! The developer experience has jumped forward by miles.',
      timestamp: 'Today at 2:18 PM',
    }
  ],
  'framer-motion': [
    {
      id: 'm6',
      user: mockUsers[1],
      content: 'Check out the staggered menu source code posted in the Home feed under r/nextjs! Let me know if you need helper animations.',
      timestamp: 'Yesterday at 5:30 PM',
    }
  ]
};
