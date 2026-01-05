import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 z-10 text-gray-300 py-12 px-6 border-t border-gray-700">
        <div className="max-w-7xl z-10 mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">Jeera</h3>
            <p className="text-sm text-gray-400">
              A modern project management tool designed for collaboration and
              clarity.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
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
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition">
                🌐
              </a>
              <a href="#" className="hover:text-white transition">
                🐦
              </a>
              <a href="#" className="hover:text-white transition">
                📸
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Jeera</span>. All rights
          reserved.
        </div>
      </footer>
  );
};

export default Footer;
