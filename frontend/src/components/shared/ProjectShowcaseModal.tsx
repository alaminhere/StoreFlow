import { GitHub, Globe, Linkedin } from "@/helpers/icon/icon";
import PopupModal from "./PopupModal";
import Logo from "./SiteLogo";
import Button from "../ui/button";


const LINKS = {
     portfolio: 'https://alaminhere.com/',
     linkedin: 'https://www.linkedin.com/in/alamin-here',
     github: 'https://github.com/alaminhere/StoreFlow',
};

const TECH = [
     { abbr: 'TS', name: 'TypeScript', desc: 'Type-safe, maintainable code.', color: 'bg-sky-600 text-text' },
     { abbr: 'React', name: 'React / Next.js', desc: 'Modern, responsive user interfaces.', color: 'bg-info-bg text-info' },
     { abbr: 'Node', name: 'Node.js / Express', desc: 'Backend APIs and business logic.', color: 'bg-success-bg text-success' },
     { abbr: 'Prisma', name: 'Prisma ORM', desc: 'Type-safe database queries.', color: 'bg-accent-bg text-accent' },
     { abbr: 'SQL', name: 'MySQL', desc: 'Reliable relational data storage.', color: 'bg-info-bg text-info' },
     { abbr: 'RTK', name: 'Redux Toolkit / RTK Query', desc: 'Centralized state and API data management.', color: 'bg-warning-bg text-warning' },
     { abbr: 'JWT', name: 'JWT / Authentication', desc: 'Secure access and session management.', color: 'bg-danger-bg text-danger' },
];

const ProjectShowcaseModal = ({ onClose }: { onClose: () => void }) => (
     <PopupModal
          onClose={onClose}
          className="max-w-160!"
          label={<Logo />}
     >
          <h3 className="text-2xl">
               Built with Modern Web Technologies
          </h3>
          <p className="mt-2 md:max-w-[80%] p14">
               StoreFlow is an inventory management system built to simplify business
               operations.
          </p>

          <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
               {TECH.map((item, index) => (
                    <li
                         key={item.name}
                         className={`flex items-start gap-3 rounded-xl border border-border/40 bg-surface p-3.5 transition-colors hover:border-primary/40 ${index === TECH.length - 1 && TECH.length % 2 ? 'sm:col-span-2' : ''
                              }`}
                    >
                         <span className={`flex h-7 min-w-9 items-center justify-center rounded-md px-1.5 p12 font-semibold ${item.color}`}>
                              {item.abbr}
                         </span>
                         <span>
                              <h4>
                                   {item.name}
                              </h4>
                              <span className="mt-0.5 block p12 leading-snug">{item.desc}</span>
                         </span>
                    </li>
               ))}
          </ul>

          <nav aria-label="Project links" className="mt-6 space-y-3">
               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a
                         href={LINKS.portfolio}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                         <Button size="sm" variant="secondary" tabIndex={-1} className="w-full">
                              <Globe className="text-text!" size={20} aria-hidden /> Explore My Portfolio
                         </Button>
                    </a>
                    <a
                         href={LINKS.linkedin}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                         <Button size="sm" variant="secondary" tabIndex={-1} className="w-full">
                              <Linkedin className="text-text!" size={20} aria-hidden /> Connect on LinkedIn
                         </Button>
                    </a>
               </div>
               <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2"
               >
                    <Button size="sm" tabIndex={-1} className="w-full">
                         <GitHub className="text-btn-primary-text!" size={20} aria-hidden /> View Source Code
                    </Button>
               </a>
          </nav>

          <div className="mt-6 flex flex-wrap items-center justify-center md:justify-between gap-2 border-t border-border pt-3 p12 text-text-muted">
               <span>Designed &amp; Developed by <a
                    href={LINKS.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
               >Md. Al-Amin</a> </span>
               <span className="rounded-md border border-border px-2 py-0.5">Full-Stack Developer</span>
          </div>
     </PopupModal>
);

export default ProjectShowcaseModal;