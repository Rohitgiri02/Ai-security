import React from 'react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              AI-Powered Security Analysis
            </h1>
            <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
              Automatically detect and prevent vulnerabilities in your code with AI-powered analysis at every push
            </p>
            <a
              href="/login"
              className="inline-block px-8 py-4 bg-accent hover:bg-blue-600 text-white rounded-lg font-bold text-lg transition transform hover:scale-105"
            >
              Get Started with GitHub
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="bg-secondary rounded-lg p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Real-Time Scanning</h3>
              <p className="text-gray-400">
                Analyzes your code at every push with advanced pattern matching and AI validation
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-green-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Intelligence</h3>
              <p className="text-gray-400">
                Uses LLM to understand context and eliminate false positives with semantic analysis
              </p>
            </div>

            <div className="bg-secondary rounded-lg p-8 border border-slate-700 hover:border-blue-500 transition">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Dashboard</h3>
              <p className="text-gray-400">
                Beautiful insights into your security posture with actionable recommendations
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24 bg-secondary rounded-lg p-12 border border-slate-700">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="font-bold mb-2">Connect GitHub</h4>
                <p className="text-gray-400">Link your GitHub account securely</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="font-bold mb-2">Add Projects</h4>
                <p className="text-gray-400">Select repos to monitor</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="font-bold mb-2">Auto Analysis</h4>
                <p className="text-gray-400">Analysis runs on every push</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="font-bold mb-2">Get Insights</h4>
                <p className="text-gray-400">View findings & fix issues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-slate-700 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Security Analyzer. Protecting your code with AI.</p>
        </div>
      </footer>
    </div>
  );
};
