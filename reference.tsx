import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Settings, 
  Zap, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Database, 
  Server, 
  Layers, 
  Code, 
  Globe, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Mail, 
  Plus, 
  Trash2, 
  Save, 
  Check, 
  Copy, 
  X, 
  Sliders, 
  Activity, 
  ChevronRight, 
  Sparkles, 
  Radio, 
  Search, 
  ArrowUpRight, 
  Command, 
  CornerDownLeft, 
  Maximize2, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

/* =========================================================================
   SYNTHESIZED WEB AUDIO ENGINE (No external audio file dependencies)
   ========================================================================= */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      // Ignore audio lock errors
    }
  }

  playCyberBeep() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1800, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
}

const audioEngine = new SoundEngine();

/* =========================================================================
   DEFAULT INITIAL DATA CONFIGURATION
   ========================================================================= */
const INITIAL_PROFILE = {
  name: "MUHAMMAD FAYIS K M",
  role: "FULL-STACK ARCHITECT & NETWORK ENGINEER",
  bio: "Engineering high-resilience web systems, cloud architectures, and automated Cisco routing networks. Bridging modern reactive applications with low-level systems infrastructure.",
  status: "SYSTEMS ONLINE // AVAILABLE FOR ENGAGEMENT",
  location: "KERALA, INDIA",
  email: "fayis.dev@example.com",
  github: "https://github.com/fayisdotdev",
  linkedin: "https://linkedin.com/in/fayisdotdev",
  terminalPrompt: "fayis@cyber-arch:~$"
};

const INITIAL_PROJECTS = [
  {
    id: 'vehkix',
    title: 'VEHKIX',
    subtitle: 'Fleet Telemetry & Records Engine',
    category: 'Full-Stack Web App',
    description: 'Enterprise vehicle record management, real-time maintenance log analytics, dynamic telemetry reporting, and reactive administrative controls.',
    tech: ['React', 'Vite', 'Supabase', 'Tailwind', 'PostgreSQL'],
    liveUrl: 'https://fayisdotdev.github.io/vehkix',
    githubUrl: 'https://github.com/fayisdotdev/vehkix',
    status: 'PRODUCTION',
    accentColor: '#10b981', // Emerald
    span: 'lg:col-span-8',
    architectureNotes: 'Hosted on GitHub Pages with Supabase Edge database triggers and automated maintenance scheduler.'
  },
  {
    id: 'petify',
    title: 'PËTIFY.IN',
    subtitle: 'Exotic Pet Commerce Platform',
    category: 'E-Commerce & CMS',
    description: 'Exotic pet supply marketplace featuring dynamic inventory CRUD dashboard, real-time cart state management, and order tracking pipeline.',
    tech: ['React', 'Vite', 'Supabase Auth', 'Rest API'],
    liveUrl: 'https://petify.in',
    githubUrl: 'https://github.com/fayisdotdev/petify',
    status: 'ACTIVE CLIENT',
    accentColor: '#a855f7', // Purple
    span: 'lg:col-span-4',
    architectureNotes: 'Real-time stock level synchronization with Supabase webhooks and row-level security policy.'
  },
  {
    id: 'rujooh',
    title: 'RUJOOH',
    subtitle: 'Modern Micro-App Showcase',
    category: 'Front-End Architecture',
    description: 'High-performance web app optimized for instant load times, zero cumulative layout shifts, and modular design tokens on GitHub Pages.',
    tech: ['React', 'JavaScript', 'Vite', 'GitHub Pages'],
    liveUrl: 'https://fayisdotdev.github.io/rujooh',
    githubUrl: 'https://github.com/fayisdotdev/rujooh',
    status: 'DEPLOYED',
    accentColor: '#06b6d4', // Cyan
    span: 'lg:col-span-5',
    architectureNotes: 'CI/CD deployment via GitHub Actions with static site optimization.'
  },
  {
    id: 'cisco-topo',
    title: 'CISCO ENTERPRISE TOPOLOGY',
    subtitle: 'Autonomous Network Routing Infrastructure',
    category: 'Network Systems & Security',
    description: 'Multi-area OSPF routing system, VLAN trunking, NAT gateways, dynamic DHCP pools, and hardened Cisco ASA firewall policies.',
    tech: ['Cisco Packet Tracer', 'OSPF', 'VLANs', 'ASA Firewall', 'Python'],
    liveUrl: '#network-topo',
    githubUrl: 'https://github.com/fayisdotdev',
    status: 'SIMULATED LIVE',
    accentColor: '#3b82f6', // Blue
    span: 'lg:col-span-7',
    architectureNotes: 'Configured dual-redundant core switches with spanning tree protocol (STP) protection.'
  }
];

const INITIAL_SKILLS = [
  { id: '1', category: 'Web Systems', name: 'React.js & Next.js Frameworks', level: 94, code: 'FE-REACT' },
  { id: '2', category: 'Web Systems', name: 'Vite & Modern Build Tooling', level: 92, code: 'FE-VITE' },
  { id: '3', category: 'Cloud & DB', name: 'Supabase / PostgreSQL & Row Security', level: 90, code: 'DB-SUPA' },
  { id: '4', category: 'Cloud & DB', name: 'FastAPI & Node.js Microservices', level: 86, code: 'BE-FAST' },
  { id: '5', category: 'Network Infrastructure', name: 'Cisco Routing (OSPF, BGP) & Switching', level: 92, code: 'NET-CISCO' },
  { id: '6', category: 'Network Infrastructure', name: 'Linux Server Admin & Firewall Security', level: 88, code: 'SYS-LINUX' }
];

/* =========================================================================
   MAIN APP COMPONENT
   ========================================================================= */
export default function App() {
  const [viewMode, setViewMode] = useState('portfolio'); // 'portfolio' | 'cms'
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  
  // Data States
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  
  // System Toast
  const [toast, setToast] = useState(null);

  useEffect(() => {
    audioEngine.enabled = audioEnabled;
  }, [audioEnabled]);

  // Global Keyboard Listener for Terminal Command Toggle ('/')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setTerminalOpen(prev => !prev);
        audioEngine.playCyberBeep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg) => {
    setToast(msg);
    audioEngine.playCyberBeep();
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Dynamic Ambient Interactive Canvas Matrix */}
      <BackgroundMatrixCanvas />

      {/* FLOATING TOP ARCHITECT HUD BAR */}
      <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 bg-[#0a0b0e]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="font-mono text-xs tracking-widest text-slate-300 uppercase font-bold">
            {profile.name} <span className="text-slate-600">//</span> {profile.status.split('//')[0]}
          </span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Terminal Shortcut Toggle Button */}
          <button
            onClick={() => {
              setTerminalOpen(!terminalOpen);
              audioEngine.playClick();
            }}
            className={`px-3 py-1.5 rounded-md border font-mono text-[11px] flex items-center space-x-2 transition-all ${
              terminalOpen 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <TerminalIcon size={13} />
            <span className="hidden sm:inline">CONSOLE</span>
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-[9px] text-slate-400">
              /
            </kbd>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              audioEngine.playClick();
            }}
            className={`p-1.5 rounded-md border transition-all ${
              audioEnabled 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-900/80 text-slate-500 border-slate-800'
            }`}
            title="Toggle Web Audio SFX"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-0.5 rounded-md">
            <button
              onClick={() => {
                setViewMode('portfolio');
                audioEngine.playClick();
              }}
              className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                viewMode === 'portfolio'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SHOWCASE
            </button>
            <button
              onClick={() => {
                setViewMode('cms');
                audioEngine.playClick();
              }}
              className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all flex items-center space-x-1.5 ${
                viewMode === 'cms'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings size={12} />
              <span>CMS</span>
            </button>
          </div>
        </div>
      </header>

      {/* SYSTEM TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0f14] border border-emerald-500/60 text-emerald-300 px-4 py-3 rounded-lg shadow-2xl font-mono text-xs flex items-center space-x-3 backdrop-blur-md animate-slide-up">
          <Activity size={16} className="text-emerald-400 animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      {/* OVERLAY COMMAND TERMINAL */}
      {terminalOpen && (
        <CommandConsoleModal 
          profile={profile} 
          projects={projects} 
          skills={skills} 
          onClose={() => setTerminalOpen(false)} 
          setViewMode={setViewMode}
        />
      )}

      {/* MAIN RENDER ENGINE */}
      {viewMode === 'portfolio' ? (
        <PortfolioShowcase 
          profile={profile} 
          projects={projects} 
          skills={skills}
          onOpenTerminal={() => setTerminalOpen(true)}
          setViewMode={setViewMode}
        />
      ) : (
        <CmsStudioPanel 
          profile={profile}
          setProfile={setProfile}
          projects={projects}
          setProjects={setProjects}
          skills={skills}
          setSkills={setSkills}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}

/* =========================================================================
   BACKGROUND MATRIX CANVAS (Particle & Spatial Cyber Ambient)
   ========================================================================= */
function BackgroundMatrixCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle nodes setup
    const nodeCount = 35;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw dynamic web lines
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
}

/* =========================================================================
   PORTFOLIO SHOWCASE (MINIMALIST CYBER-ARCHITECT DESIGN)
   ========================================================================= */
function PortfolioShowcase({ profile, projects, skills, onOpenTerminal, setViewMode }) {
  return (
    <div className="pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto space-y-32 relative z-10">
      
      {/* HERO SECTION: ARCHITECTURAL HUD & TYPOGRAPHY */}
      <section className="relative border-l-2 border-slate-800/80 pl-6 sm:pl-10 space-y-8">
        
        {/* HUD Indicator */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded font-mono text-[11px] text-emerald-400">
          <Radio size={12} className="animate-pulse" />
          <span>CYBER-INFRASTRUCTURE // ARCHITECT PORTFOLIO</span>
        </div>

        {/* Main Brutalist Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-slate-100 uppercase font-mono">
            {profile.name}
          </h1>
          <p className="text-lg sm:text-2xl font-mono text-emerald-400 font-bold tracking-tight">
            {profile.role}
          </p>
        </div>

        <p className="text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed font-sans">
          {profile.bio}
        </p>

        {/* Action HUD Panel */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href="#spatial-projects"
            onClick={() => audioEngine.playClick()}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-black text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center space-x-2"
          >
            <span>INSPECT ARCHITECTURES</span>
            <ArrowUpRight size={16} />
          </a>

          <button
            onClick={() => {
              onOpenTerminal();
              audioEngine.playClick();
            }}
            className="px-6 py-3 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 font-mono text-xs uppercase tracking-wider rounded transition-all flex items-center space-x-2"
          >
            <TerminalIcon size={14} className="text-emerald-400" />
            <span>EXECUTE CONSOLE ( / )</span>
          </button>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            onClick={() => audioEngine.playClick()}
            className="p-3 bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white rounded transition-colors"
          >
            <Github size={18} />
          </a>
        </div>
      </section>

      {/* SPATIAL BENTO PANELS (VEHKIX, PËTIFY, RUJOOH, CISCO) */}
      <section id="spatial-projects" className="space-y-8 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase">// MODULE 01</span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">
              SPATIAL PROJECT NODES
            </h2>
          </div>
          <p className="font-mono text-xs text-slate-500">
            Click nodes to inspect technical architecture & deployment details.
          </p>
        </div>

        {/* Staggered Spatial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {projects.map((project) => (
            <SpatialProjectNode key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* NETWORK TOPOLOGY VISUALIZER ENGINE */}
      <section id="network-topo" className="space-y-8 scroll-mt-24">
        <div className="border-b border-slate-800 pb-4">
          <span className="font-mono text-xs text-blue-400 font-bold tracking-widest uppercase">// MODULE 02</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight flex items-center space-x-3">
            <span>CISCO TOPOLOGY VISUALIZER</span>
            <Wifi className="text-blue-500 animate-pulse" size={28} />
          </h2>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Interactive network node telemetry. Select nodes to view routing protocols and live packet flow simulations.
          </p>
        </div>

        <NetworkTopologyVisualizer />
      </section>

      {/* SKILLS & ARCHITECT MATRIX */}
      <section className="space-y-8">
        <div className="border-b border-slate-800 pb-4">
          <span className="font-mono text-xs text-purple-400 font-bold tracking-widest uppercase">// MODULE 03</span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-100 font-mono tracking-tight">
            INFRASTRUCTURE MASTERY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-lg space-y-3 hover:border-slate-700 transition-all">
              <div className="flex justify-between items-center font-mono">
                <span className="text-xs text-slate-500">[{skill.code}]</span>
                <span className="text-xs text-emerald-400 font-bold">{skill.level}%</span>
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-200">{skill.name}</h3>
              <div className="w-full bg-slate-950 h-2 rounded overflow-hidden p-0.5 border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded transition-all duration-700" 
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DISPATCH CONTACT SECTION */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-8 space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase">// DISPATCH ENGAGEMENT</span>
          <h2 className="text-2xl sm:text-3xl font-black font-mono text-slate-100">COMMENCE COLLABORATION</h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Interested in deploying full-stack web applications, Supabase integrations, or configuring Cisco enterprise network topologies?
          </p>
        </div>

        <div className="flex flex-wrap gap-4 font-mono text-xs">
          <a
            href={`mailto:${profile.email}`}
            onClick={() => audioEngine.playClick()}
            className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded transition-colors flex items-center space-x-2"
          >
            <Mail size={16} />
            <span>DISPATCH EMAIL</span>
          </a>

          <button
            onClick={() => {
              setViewMode('cms');
              audioEngine.playClick();
            }}
            className="px-6 py-3.5 bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 font-bold rounded transition-colors flex items-center space-x-2"
          >
            <Settings size={16} className="text-purple-400" />
            <span>OPEN CMS CONTROL CENTER</span>
          </button>
        </div>
      </section>

    </div>
  );
}

/* =========================================================================
   SPATIAL PROJECT NODE CARD COMPONENT
   ========================================================================= */
function SpatialProjectNode({ project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`${project.span || 'lg:col-span-6'} bg-slate-900/50 backdrop-blur-md border border-slate-800/90 rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all duration-300 group relative overflow-hidden`}
    >
      {/* Top Header */}
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-start font-mono text-[11px]">
          <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-slate-400 font-semibold">
            {project.category}
          </span>
          <span className="text-xs font-bold" style={{ color: project.accentColor }}>
            {project.status}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black font-mono text-slate-100 group-hover:text-emerald-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs font-mono text-slate-400 font-semibold">{project.subtitle}</p>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed font-sans pt-2">
          {project.description}
        </p>
      </div>

      {/* Expanded Architecture Details */}
      {expanded && (
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded font-mono text-[11px] text-slate-300 space-y-1.5 animate-fadeIn">
          <div className="text-emerald-400 font-bold flex items-center space-x-1.5">
            <Cpu size={13} />
            <span>ARCHITECTURE SPECIFICATION:</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{project.architectureNotes}</p>
        </div>
      )}

      {/* Tech Stack Pills & Actions */}
      <div className="pt-4 border-t border-slate-800/80 space-y-4 relative z-10">
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
          {project.tech.map((t) => (
            <span key={t} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
              #{t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 font-mono text-xs">
          <button
            onClick={() => {
              setExpanded(!expanded);
              audioEngine.playClick();
            }}
            className="text-slate-400 hover:text-emerald-400 transition-colors font-bold text-[11px] flex items-center space-x-1"
          >
            <span>{expanded ? '[- HIDE SPEC]' : '[+ ARCHITECTURE SPEC]'}</span>
          </button>

          <div className="flex items-center space-x-3">
            {project.liveUrl && project.liveUrl !== '#network-topo' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => audioEngine.playClick()}
                className="text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
              >
                <span>LIVE</span>
                <ExternalLink size={12} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => audioEngine.playClick()}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   INTERACTIVE NETWORK TOPOLOGY VISUALIZER COMPONENT
   ========================================================================= */
function NetworkTopologyVisualizer() {
  const [selectedNode, setSelectedNode] = useState('router-core');

  const nodes = {
    'router-core': {
      title: 'CORE ROUTER (Cisco 2911)',
      protocol: 'OSPF Area 0.0.0.0',
      ip: '192.168.10.1 / 24',
      status: 'FORWARDING (0.2ms latency)',
      details: 'Main enterprise gateway configured with sub-interfaces for VLAN 10 (Web) and VLAN 20 (DB). Running NAT overload rules.'
    },
    'switch-agg': {
      title: 'AGGREGATION SWITCH (Catalyst 3650)',
      protocol: '802.1Q VLAN Trunking',
      ip: '192.168.10.2',
      status: 'LINK AGGREGATED',
      details: 'Spanning Tree Protocol (STP) root bridge with port security enabled on access ports.'
    },
    'supa-db': {
      title: 'DATABASE NODE (Supabase PostgreSQL)',
      protocol: 'HTTPS / TLS 1.3 Webhooks',
      ip: 'db.supabase.co',
      status: 'SYNCED (0.02s pulse)',
      details: 'Primary database cluster managing auth profiles, product inventories, and real-time CMS mutations.'
    },
    'client-edge': {
      title: 'CLIENT EDGE / GITHUB PAGES',
      protocol: 'HTTP/2 CDN Static Edge',
      ip: 'fayisdotdev.github.io',
      status: 'SERVED (100% cache hit)',
      details: 'Vite React production build deployed across global CDN edge nodes.'
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Canvas / Topology Nodes Visual Diagram */}
      <div className="lg:col-span-7 bg-[#07080a] border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center space-y-8 relative overflow-hidden min-h-[300px]">
        {/* Animated Connecting Cables */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500 animate-pulse" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 relative z-10 w-full">
          {[
            { id: 'router-core', label: 'CORE ROUTER', icon: RouterIcon, color: 'text-blue-400' },
            { id: 'switch-agg', label: 'SWITCH TRUNK', icon: Server, color: 'text-cyan-400' },
            { id: 'supa-db', label: 'SUPABASE DB', icon: Database, color: 'text-emerald-400' },
            { id: 'client-edge', label: 'CLIENT EDGE', icon: Globe, color: 'text-purple-400' }
          ].map((item) => {
            const Icon = item.icon;
            const active = selectedNode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedNode(item.id);
                  audioEngine.playCyberBeep();
                }}
                className={`p-4 rounded-xl border flex flex-col items-center space-y-2 transition-all font-mono text-xs ${
                  active 
                    ? 'bg-slate-900 border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <Icon className={item.color} size={28} />
                <span className="font-bold text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="font-mono text-[10px] text-slate-500 flex items-center space-x-2">
          <Activity size={12} className="text-emerald-400 animate-spin" />
          <span>PACKET TELEMETRY ACTIVE // OSPF NEIGHBOR ADJACENCY ESTABLISHED</span>
        </div>
      </div>

      {/* Node Inspector Panel */}
      <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-lg p-5 font-mono space-y-4">
        <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
          <span className="text-xs text-emerald-400 font-bold">// NODE TELEMETRY INSPECTOR</span>
          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">ACTIVE</span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-500 text-[10px]">DEVICE IDENTIFIER:</span>
            <p className="text-slate-100 font-bold">{nodes[selectedNode].title}</p>
          </div>

          <div>
            <span className="text-slate-500 text-[10px]">PROTOCOL / SPECIFICATION:</span>
            <p className="text-cyan-400">{nodes[selectedNode].protocol}</p>
          </div>

          <div>
            <span className="text-slate-500 text-[10px]">IP / GATEWAY ADDRESS:</span>
            <p className="text-emerald-400">{nodes[selectedNode].ip}</p>
          </div>

          <div>
            <span className="text-slate-500 text-[10px]">STATUS:</span>
            <p className="text-purple-300">{nodes[selectedNode].status}</p>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 text-[10px]">OPERATIONAL SUMMARY:</span>
            <p className="text-slate-300 leading-relaxed text-[11px] mt-1 font-sans">
              {nodes[selectedNode].details}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Router SVG Icon
function RouterIcon({ className, size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <path d="M6 18h.01M10 18h.01" />
      <path d="M12 2v8M18 6l-6 4-6-4" />
    </svg>
  );
}

/* =========================================================================
   COMMAND CONSOLE MODAL (OVERLAY INTERACTIVE TERMINAL)
   ========================================================================= */
function CommandConsoleModal({ profile, projects, skills, onClose, setViewMode }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'sys', text: "MUHAMMAD FAYIS K M // SPATIAL CONSOLE v2.4" },
    { type: 'sys', text: "Type 'help' or 'projects' or 'skills' or 'cms' to execute commands." }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `${profile.terminalPrompt} ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'sys', text: "AVAILABLE COMMANDS:\n  help        - Display system commands\n  cat bio     - Print developer biography\n  projects    - Output listed spatial project nodes\n  skills      - Output infrastructure skill levels\n  cms         - Launch CMS Editor Panel\n  clear       - Clear console buffer" });
        break;
      case 'cat bio':
      case 'bio':
        newHistory.push({ type: 'sys', text: `${profile.name}\n${profile.role}\n\n${profile.bio}` });
        break;
      case 'projects':
        newHistory.push({ type: 'sys', text: projects.map(p => `• [${p.title}] (${p.category}): ${p.subtitle} -> ${p.liveUrl}`).join('\n') });
        break;
      case 'skills':
        newHistory.push({ type: 'sys', text: skills.map(s => `• ${s.name} [${s.code}]: ${s.level}%`).join('\n') });
        break;
      case 'cms':
        setViewMode('cms');
        onClose();
        return;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      default:
        newHistory.push({ type: 'error', text: `Command not recognized: '${cmd}'. Type 'help' for available commands.` });
    }

    setHistory(newHistory);
    setInput('');
    audioEngine.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#08090d] border border-slate-800 rounded-xl shadow-2xl overflow-hidden font-mono text-xs flex flex-col h-[480px]">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TerminalIcon size={14} className="text-emerald-400" />
            <span className="text-slate-300 font-bold">SPATIAL COMMAND CONSOLE</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Console Buffer Output */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 text-slate-300 leading-relaxed font-mono">
          {history.map((item, idx) => (
            <div key={idx} className={item.type === 'error' ? 'text-red-400' : item.type === 'user' ? 'text-emerald-400 font-bold' : 'text-slate-300 whitespace-pre-wrap'}>
              {item.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Prompt Form */}
        <form onSubmit={handleCommand} className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">{profile.terminalPrompt}</span>
          <input
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 font-mono text-xs"
            placeholder="Type command..."
          />
          <CornerDownLeft size={14} className="text-slate-600" />
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   CMS CONTROL CENTER (REAL-TIME EDITING & SUPABASE SCHEMA GENERATOR)
   ========================================================================= */
function CmsStudioPanel({ 
  profile, setProfile, 
  projects, setProjects, 
  skills, setSkills, 
  triggerToast 
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'projects' | 'skills' | 'supabase'
  const [copiedSchema, setCopiedSchema] = useState(false);

  // New Project State
  const [newProj, setNewProj] = useState({
    title: '', subtitle: '', category: 'Full-Stack Web App', description: '', tech: 'React, Vite, Supabase', liveUrl: '', githubUrl: '', status: 'PRODUCTION', accentColor: '#10b981', architectureNotes: ''
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now().toString(),
      ...newProj,
      tech: newProj.tech.split(',').map(t => t.trim()),
      span: 'lg:col-span-6'
    };
    setProjects([created, ...projects]);
    setNewProj({ title: '', subtitle: '', category: 'Full-Stack Web App', description: '', tech: 'React, Vite, Supabase', liveUrl: '', githubUrl: '', status: 'PRODUCTION', accentColor: '#10b981', architectureNotes: '' });
    triggerToast(`Project '${created.title}' added to spatial matrix.`);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    triggerToast('Project entry removed.');
  };

  // Generated Supabase SQL Script
  const generatedSql = `-- SUPABASE POSTGRES RECURSIVE SCHEMA FOR MUHAMMAD FAYIS K M
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT,
  description TEXT,
  tech TEXT[],
  live_url TEXT,
  github_url TEXT,
  status TEXT DEFAULT 'PRODUCTION',
  accent_color TEXT DEFAULT '#10b981',
  architecture_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON public.projects FOR SELECT USING (true);`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopiedSchema(true);
    triggerToast('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="pt-24 pb-24 px-4 sm:px-8 max-w-6xl mx-auto space-y-8 relative z-10">
      
      {/* CMS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">// REAL-TIME STUDIO CMS</span>
          <h1 className="text-3xl font-black font-mono text-slate-100">CONTROL CENTER</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 p-1 rounded-lg font-mono text-xs">
          {[
            { id: 'profile', label: 'PROFILE & BIO' },
            { id: 'projects', label: 'PROJECTS MANAGER' },
            { id: 'skills', label: 'SKILLS MATRIX' },
            { id: 'supabase', label: 'SUPABASE SCHEMA' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                audioEngine.playClick();
              }}
              className={`px-3 py-1.5 rounded transition-all font-bold ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PROFILE & BIO EDITOR */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-6 max-w-2xl font-mono text-xs">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">LIVE PROFILE PARAMETERS</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 mb-1">Developer Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Primary Title / Specialty</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Status HUD Banner</label>
              <input
                type="text"
                value={profile.status}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Biography Summary</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
              />
            </div>

            <button
              onClick={() => triggerToast('Profile state synced to live portfolio!')}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition-colors flex items-center space-x-2"
            >
              <Save size={14} />
              <span>SYNC LIVE STATE</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PROJECTS CRUD MANAGER */}
      {activeTab === 'projects' && (
        <div className="space-y-8 font-mono text-xs">
          {/* Add Project Form */}
          <form onSubmit={handleAddProject} className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">PUBLISH SPATIAL PROJECT NODE</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                type="text"
                placeholder="Project Title (e.g. VEHKIX)"
                value={newProj.title}
                onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Subtitle / Tagline"
                value={newProj.subtitle}
                onChange={(e) => setNewProj({ ...newProj, subtitle: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <textarea
              required
              rows={2}
              placeholder="Description..."
              value={newProj.description}
              onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Live URL"
                value={newProj.liveUrl}
                onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={newProj.tech}
                onChange={(e) => setNewProj({ ...newProj, tech: e.target.value })}
                className="bg-slate-950 border border-slate-800 rounded p-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded transition-opacity hover:opacity-90 flex items-center space-x-2"
            >
              <Plus size={14} />
              <span>PUBLISH TO PORTFOLIO</span>
            </button>
          </form>

          {/* Active Projects List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase">ACTIVE PROJECT NODES ({projects.length})</h3>
            {projects.map((p) => (
              <div key={p.id} className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-200">{p.title}</h4>
                  <p className="text-[11px] text-slate-500">{p.category} // {p.status}</p>
                </div>
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SKILLS MATRIX SLIDERS */}
      {activeTab === 'skills' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4 font-mono text-xs">
          <h2 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">ADJUST MASTERY SLIDERS</h2>
          
          <div className="space-y-4">
            {skills.map((s) => (
              <div key={s.id} className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-bold">{s.name}</span>
                  <span className="text-emerald-400 font-bold">{s.level}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={s.level}
                  onChange={(e) => {
                    const newLevel = Number(e.target.value);
                    setSkills(skills.map(item => item.id === s.id ? { ...item, level: newLevel } : item));
                  }}
                  className="w-full accent-emerald-500 bg-slate-800 rounded h-1.5 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUPABASE SCHEMA GENERATOR */}
      {activeTab === 'supabase' && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-200">SUPABASE POSTGRESQL SCHEMA</h2>
              <p className="text-[11px] text-slate-400">Run this SQL in your Supabase project SQL Editor.</p>
            </div>
            <button
              onClick={handleCopySchema}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center space-x-1.5 transition-colors"
            >
              {copiedSchema ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedSchema ? 'COPIED' : 'COPY SQL'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded border border-slate-800 text-cyan-300 overflow-x-auto text-[11px] leading-relaxed">
            {generatedSql}
          </pre>
        </div>
      )}

    </div>
  );
}