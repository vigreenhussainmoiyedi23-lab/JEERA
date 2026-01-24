import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 text-gray-300 px-6 border-t border-white/10">
      <div className="absolute inset-0 bg-slate-950/85" />
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/90 to-black" />

        <div className="relative max-w-7xl z-10 mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4 py-14">
          {/* Column 1 */}
          <div>
            <h3 className="text-white text-2xl font-semibold tracking-tight mb-4">Jeera</h3>
            <p className="text-sm text-gray-300/80 leading-relaxed">
              A modern project management tool designed for collaboration and
              clarity.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-200/80">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span>Built for teams that ship</span>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300/80 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200/80 hover:text-white hover:bg-white/10 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200/80 hover:text-white hover:bg-white/10 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200/80 hover:text-white hover:bg-white/10 transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-white/10 py-6 text-center text-sm text-gray-300/60">
          © {new Date().getFullYear()} <span className="font-semibold text-white">Jeera</span>. All rights
          reserved.
        </div>
      </footer>
  );
};

export default Footer;
