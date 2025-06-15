import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 p-6 text-center border-t border-slate-700 shadow-inner">
      <p className="mb-1 text-sm">
        &copy; {new Date().getFullYear()} GameHub Adventures. All rights reserved.
      </p>
      <p className="text-xs">
        Lovingly crafted with <span className="text-pink-400">React</span> & <span className="text-sky-400">Tailwind CSS</span>.
      </p>
    </footer>
  );
};

export default Footer;