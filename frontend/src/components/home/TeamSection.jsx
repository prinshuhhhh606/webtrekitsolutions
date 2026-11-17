import React, { useState, useEffect, useRef } from 'react';
import { Linkedin, Twitter, Mail, Globe } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { teamService } from '../../services/api';
import { resolveImageUrl } from '../../utils/imageUrl';
import './TeamSection.css';

const defaultTeamMembers = [
  {
    name: 'Jane Doe',
    designation: 'Senior Digital Strategist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Directing strategic brand growth and cross-channel marketing campaigns.',
    socialLinks: { linkedin: '#', twitter: '#' },
    isActive: true,
  },
  {
    name: 'Ronald Ga',
    designation: 'Lead Full Stack Developer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in modern web architectures, API security, and high performance.',
    socialLinks: { linkedin: '#', twitter: '#' },
    isActive: true,
  },
  {
    name: 'Kristina',
    designation: 'UI/UX & Product Designer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Crafting responsive, intuitive design systems and modern user experiences.',
    socialLinks: { linkedin: '#', twitter: '#' },
    isActive: true,
  },
  {
    name: 'Priyanshu Rathore',
    designation: 'Founder & Managing Director',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Visionary leadership driving smart digital partnerships in Indore and beyond.',
    socialLinks: { linkedin: '#', twitter: '#' },
    isActive: true,
  },
];

const TeamSection = () => {
  const [team, setTeam] = useState(defaultTeamMembers);
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef(null);

  // Fetch only active team members for public display
  useEffect(() => {
    const fetchActiveTeam = async () => {
      try {
        const res = await teamService.getAll(); // Public request defaults to { isActive: true }
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          // Double filter to ensure strictly active members
          const activeOnly = res.data.data.filter((m) => m.isActive !== false);
          if (activeOnly.length > 0) {
            setTeam(activeOnly);
          }
        }
      } catch (err) {
        // Fallback to active defaults
      }
    };
    fetchActiveTeam();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else if (entry.boundingClientRect.top > 0) {
          setIsVisible(false);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="team-section-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Team Succes"
          title="Our Best"
          highlight="Team"
          subtitle="Meet the experienced technology developers, creative UI/UX designers, and growth strategists at Webtrek IT Solutions."
        />

        <div
          ref={gridRef}
          className={`team-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {team.map((member, idx) => {
            const role = member.designation || member.role || 'Specialist';
            const memberImg = resolveImageUrl(member.image);

            return (
              <div
                key={member._id || idx}
                className="team-card-box flex flex-col justify-between"
                style={{
                  transitionDelay: isVisible ? `${idx * 120}ms` : '0ms',
                }}
              >
                <div>
                  <div className="relative h-72 w-full overflow-hidden bg-gray-200 team-img-wrapper">
                    <img
                      src={memberImg}
                      alt={member.name}
                      className="w-full h-full object-cover team-card-img"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#021343]/85 via-[#021343]/20 to-transparent team-overlay flex items-end p-4">
                      <div className="flex items-center gap-2">
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-full bg-white text-[#021343] flex items-center justify-center hover:bg-[#fe8a04] hover:text-white transition-colors cursor-pointer shadow-md"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {member.socialLinks?.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="w-8 h-8 rounded-full bg-white text-[#021343] flex items-center justify-center hover:bg-[#fe8a04] hover:text-white transition-colors cursor-pointer shadow-md"
                            title="Twitter / X"
                          >
                            <Twitter className="w-4 h-4" />
                          </a>
                        )}
                        {member.socialLinks?.email && (
                          <a
                            href={`mailto:${member.socialLinks.email}`}
                            className="w-8 h-8 rounded-full bg-white text-[#021343] flex items-center justify-center hover:bg-[#fe8a04] hover:text-white transition-colors cursor-pointer shadow-md"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="font-heading font-bold text-lg text-[#021343] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#fe8a04] font-semibold uppercase tracking-wider mb-2">
                      {role}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
