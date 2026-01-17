// app/about/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';
import { Card } from '@/components/ui';
import Footer from '@/components/Footer';

// ─────────────────────────────────────────────────────────────────────────────
// Team Data
// ─────────────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
  avatarUrl?: string;
  github?: string;
  linkedin?: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Shahzaib Ahmad',
    role: 'UI/UX Designer',
    avatarUrl: '/images/team/shahzaib-ahmad.jpg',
    github: 'https://github.com/ShahzaibAhmad05',
    linkedin: 'https://www.linkedin.com/in/shahzaibahmad05/',
  },
  {
    name: 'Muhammad Ali',
    role: 'DevOps Engineer',
    avatarUrl: '/images/team/muhammad-ali.jpg',
    github: 'https://github.com/muhammadali182-q',
    linkedin: 'https://www.linkedin.com/in/muhammad-ali-b725a4326/',
  },
  {
    name: 'Shehroz Shoukat',
    role: 'Backend Developer',
    avatarUrl: '/images/team/shehroz-shoukat.jpg',
    github: 'https://github.com/Shehroz06',
    linkedin: 'https://www.linkedin.com/in/shehroz-shoukat-ali/',
  },
];

const instructor = {
  name: 'Dr. Faisal Shafait',
  avatarUrl: '/images/team/faisal-shafait.jpg',
  department: 'School of Electrical Engineering & Computer Science',
  institution: 'National University of Sciences & Technology (NUST)',
};

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <Card hoverable padding="lg" className="text-center">
      {/* Avatar */}
      <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center">
        {member.avatarUrl ? (
          <Image
            src={member.avatarUrl}
            alt={`avatar`}
            width={96}
            height={96}
            className="w-full h-full object-cover"
            priority={false}
          />
        ) : (
          <span className="text-3xl font-bold text-white">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
      <p className="text-gray-400 font-medium mb-4 text-sm">{member.role}</p>
      
      {/* Social links */}
      <div className="flex justify-center gap-3">
        {member.github && (
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-400 hover:text-white transition-all"
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
  <div className="min-h-screen bg-[linear-gradient(135deg,#000000_0%,#131313_50%,#1a1a1a_100%)] py-12 px-4">
      <main>
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to NextSearch</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 tracking-tight text-white">
              About NextSearch
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
              A search engine built with modern C++ and Nextjs, 
              designed for efficient document retrieval and a decent UX.
            </p>
          </div>

          {/* Technology Stack */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Technology Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'C++', desc: 'Backend Engine' },
                { name: 'TypeScript', desc: 'Frontend' },
                { name: 'Next.js', desc: 'React Framework' },
                { name: 'Tailwind CSS', desc: 'Styling' },
              ].map((tech, idx) => (
                <Card key={idx} padding="md" className="text-center">
                  <div className="text-lg font-semibold text-white">{tech.name}</div>
                  <div className="text-sm text-slate-300">{tech.desc}</div>
                </Card>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-2 text-center">Our Team</h2>
            <p className="text-slate-300 text-center mb-8">
              Built by a team of passionate software engineers
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <div key={idx}>
                  <TeamMemberCard member={member} />
                </div>
              ))}
            </div>
          </section>

          {/* Instructor Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Project Instructor</h2>
            <Card padding="lg" className="max-w-md mx-auto text-center">
              {/* Avatar */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-linear-to-br from-green-500 to-green-700 flex items-center justify-center">
                {instructor.avatarUrl ? (
                  <Image
                    src={instructor.avatarUrl}
                    alt={instructor.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    priority={false}
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {instructor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{instructor.name}</h3>
              <p className="text-slate-100 text-sm mb-1">{instructor.department}</p>
              <p className="text-slate-300 text-sm">{instructor.institution}</p>
            </Card>
          </section>

          {/* CORD-19 Dataset Info */}
          <section>
            <Card padding="lg" className="text-center">
              <h2 className="text-xl font-semibold text-white mb-3">Dataset</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                NextSearch is designed to work with the{' '}
                <span className="text-green-400 font-medium">CORD-19</span>{' '}
                (COVID-19 Open Research Dataset), a comprehensive collection of 
                scientific literature about COVID-19 and related coronaviruses.
              </p>
            </Card>
          </section>
        </div>
      </main>

      <br /><br />
      {/* Footer */}
      <div className="max-w-270 mx-auto pr-5 mt-5">
        <Footer showScrollToTop={false} />
      </div>
    </div>
  );
}