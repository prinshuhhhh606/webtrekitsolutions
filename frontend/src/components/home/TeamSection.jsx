import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import './TeamSection.css';

const teamMembers = [
  {
    name: 'Jane Doe',
    role: 'Senior Digital Strategist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Directing strategic brand growth and cross-channel marketing campaigns.',
  },
  {
    name: 'Ronald Ga',
    role: 'Lead Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in modern web architectures, API security, and high performance.',
  },
  {
    name: 'Kristina',
    role: 'UI/UX & Product Designer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Crafting responsive, intuitive design systems and modern user experiences.',
  },
  {
    name: 'Priyanshu Rathore',
    role: 'Founder & Managing Director',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Visionary leadership driving smart digital partnerships in Indore and beyond.',
  },
];

const TeamSection = () => {
  return (
    <section className="team-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Team Succes"
          title="Our Best"
          highlight="Team"
          subtitle="Meet the experienced technology developers, creative UI/UX designers, and growth strategists at Webtrek IT Solutions."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="team-card-box flex flex-col justify-between">
              <div>
                <div className="relative h-72 w-full overflow-hidden bg-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021343]/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-white text-[#021343] flex items-center justify-center hover:bg-[#fe8a04] hover:text-white transition-colors cursor-pointer">
                        <Linkedin className="w-4 h-4" />
                      </span>
                      <span className="w-8 h-8 rounded-full bg-white text-[#021343] flex items-center justify-center hover:bg-[#fe8a04] hover:text-white transition-colors cursor-pointer">
                        <Twitter className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 text-center">
                  <h3 className="font-heading font-bold text-lg text-[#021343]">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#fe8a04] font-semibold uppercase tracking-wider mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
