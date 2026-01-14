// app/about/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Github, Linkedin, Mail, BookOpen, Cpu, Database, Search, Zap } from 'lucide-react';
import { Card } from '@/components/ui';
import PostSearchFooter from '@/components/PostSearchFooter';

// ─────────────────────────────────────────────────────────────────────────────
// Team Data
// ─────────────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  focus: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Shahzaib Ahmad',
    role: 'Frontend Developer & UI/UX Engineer',
    focus: 'Frontend Development & System Integration',
    github: 'https://github.com/ShahzaibAhmad05',
    linkedin: 'https://www.linkedin.com/in/shahzaibahmad05/',
  },
  {
    name: 'Muhammad Ali',
    role: 'Backend Developer',
    focus: 'Backend Development & Indexing Engine',
    github: 'https://github.com/muhammadali182-q',
    linkedin: 'https://www.linkedin.com/in/muhammad-ali-b725a4326/',
  },
  {
    name: 'Shehroz Shoukat',
    role: 'Algo Designer & Optimization Engineer',
    focus: 'Search Algorithms & Performance Optimization',
    github: 'https://github.com/Shehroz06',
    linkedin: 'https://www.linkedin.com/in/shehroz-shoukat-ali/',
  },
];

const advisor = {
  name: 'Dr. Faisal Shafait',
  title: 'Project Advisor',
  department: 'School of Electrical Engineering & Computer Science',
  institution: 'National University of Sciences & Technology (NUST)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Features Data
// ─────────────────────────────────────────────────────────────────────────────

const projectFeatures = [
  {
    icon: Database,
    title: 'Scalable Indexing',
    description: 'Efficient Lexicon, Forward Index, and Inverted Index generation from large CSV datasets.',
  },
  {
    icon: Search,
    title: 'Fast Search',
    description: 'Optimized query processing with ranked retrieval using BM25 and custom scoring algorithms.',
  },
  {
    icon: Zap,
    title: 'Real-time Suggestions',
    description: 'Autocomplete powered by prefix trees for instant query suggestions as you type.',
  },
  {
    icon: Cpu,
    title: 'C++ Backend',
    description: 'High-performance backend written in modern C++ for maximum throughput and low latency.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card hoverable padding="lg" className="text-center">
      {/* Avatar placeholder */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <span className="text-3xl font-bold text-white">
          {member.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-indigo-400 font-medium mb-2">{member.role}</p>
      <p className="text-gray-400 text-sm mb-4">{member.focus}</p>
      
      {/* Social links */}
      <div className="flex justify-center gap-3">
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        )}
      </div>
    </Card>
  );
}

function FeatureCard({ feature }: { feature: typeof projectFeatures[0] }) {
  const Icon = feature.icon;
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-all">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
        <Icon size={24} className="text-indigo-400" />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
        <p className="text-sm text-gray-400">{feature.description}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-slate-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Search</span>
          </Link>
          
          <Link href="/" className="text-xl font-bold">
            <span className="gradient-text">Next</span>
            <span className="text-white">Search</span>
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down opacity-0" style={{ animationDelay: '100ms' }}>
              <span className="gradient-text">About</span>{' '}
              <span className="text-white">NextSearch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-blur-in opacity-0" style={{ animationDelay: '300ms' }}>
              A scalable search engine built with modern C++ and React, 
              designed for efficient document retrieval and discovery.
            </p>
          </div>

          {/* Project Overview */}
          <section className="mb-16 animate-fade-in-left opacity-0" style={{ animationDelay: '400ms' }}>
            <Card padding="lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-xl bg-linear-to-br from-indigo-500/20 to-purple-500/20">
                  <BookOpen size={28} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Project Overview</h2>
                  <p className="text-gray-400">
                    NextSearch is a high-performance search engine implementation demonstrating 
                    core indexing concepts used in modern information retrieval systems.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {projectFeatures.map((feature, idx) => (
                  <FeatureCard key={idx} feature={feature} />
                ))}
              </div>
            </Card>
          </section>

          {/* Technology Stack */}
          <section className="mb-16 animate-fade-in-right opacity-0" style={{ animationDelay: '500ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'C++', desc: 'Backend Engine' },
                { name: 'TypeScript', desc: 'Frontend' },
                { name: 'Next.js', desc: 'React Framework' },
                { name: 'Tailwind CSS', desc: 'Styling' },
              ].map((tech, idx) => (
                <Card key={idx} padding="md" className={`text-center animate-slide-up-fade opacity-0 stagger-${idx + 1}`}>
                  <div className="text-lg font-semibold text-white">{tech.name}</div>
                  <div className="text-sm text-gray-400">{tech.desc}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16 animate-fade-in-up opacity-0" style={{ animationDelay: '600ms' }}>
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Our Team</h2>
            <p className="text-gray-400 text-center mb-8">
              Built by a team of passionate software engineers
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {teamMembers.map((member, idx) => (
                <div key={idx} className={`animate-slide-up-fade opacity-0`} style={{ animationDelay: `${700 + idx * 150}ms` }}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>

            {/* Advisor */}
            <div className="animate-scale-in opacity-0" style={{ animationDelay: '1100ms' }}>
              <Card padding="lg" className="max-w-xl mx-auto text-center">
                <p className="text-sm text-indigo-400 font-medium mb-2">Project Advisor</p>
                <h3 className="text-xl font-bold text-white mb-1">{advisor.name}</h3>
                <p className="text-gray-400 text-sm">{advisor.department}</p>
                <p className="text-gray-500 text-sm">{advisor.institution}</p>
              </Card>
            </div>
          </section>

          {/* CORD-19 Dataset Info */}
          <section className="animate-fade-in-up opacity-0" style={{ animationDelay: '1200ms' }}>
            <Card padding="lg" className="text-center">
              <h2 className="text-xl font-bold text-white mb-3">Dataset</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                NextSearch is designed to work with the{' '}
                <span className="text-indigo-400 font-medium">CORD-19</span>{' '}
                (COVID-19 Open Research Dataset), a comprehensive collection of 
                scientific literature about COVID-19 and related coronaviruses.
              </p>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <div className="max-w-270 mx-auto pr-5 pb-5 mt-5">
        <PostSearchFooter showScrollToTop={false} />
      </div>
    </div>
  );
}