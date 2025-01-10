"use client";

import { useState } from "react";

export default function SocialNetworks() {
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    twitter: "",
    linkedin: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle social networks update logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Redes Sociales</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
            {/* <Github size={20} /> */} GitHub
          </label>
          <input
            type="url"
            name="github"
            value={socialLinks.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
            className="w-full px-3 py-2 bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
            {/* <Twitter size={20} /> */} Twitter
          </label>
          <input
            type="url"
            name="twitter"
            value={socialLinks.twitter}
            onChange={handleChange}
            placeholder="https://twitter.com/username"
            className="w-full px-3 py-2 bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
            {/* <Linkedin size={20} /> */} LinkedIn
          </label>
          <input
            type="url"
            name="linkedin"
            value={socialLinks.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            className="w-full px-3 py-2 bg-[#2a2e33] rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
        >
          Guardar Redes Sociales
        </button>
      </form>
    </div>
  );
}
