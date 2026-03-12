import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-zinc-50 font-display text-zinc-900 min-h-screen">
      {/* Main Navigation / Header */}
      {/* Excluded because root layout already has the main Navbar. 
          The PRD mentions keeping the design integrated. */}

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center px-6 pt-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-3xl w-full text-center space-y-8 z-10">
          
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white border border-zinc-200 rounded-2xl shadow-sm flex items-center justify-center">
              <BookOpen className="text-zinc-900 w-8 h-8" />
            </div>
          </div>
          
          {/* Typography */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900">
              Your Personal Library
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl mx-auto">
              A minimalist space to organize, track, and enjoy your reading collection without distractions. Built for the modern reader.
            </p>
          </div>
          
          {/* Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl active:scale-95 text-center">
              Get Started
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold rounded-xl hover:bg-zinc-50 transition-all active:scale-95 text-center">
              View Demo
            </Link>
          </div>
          
          {/* Trust / Simple Social Proof */}
          <div className="pt-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400">Trusted by 10,000+ avid readers</p>
          </div>
        </div>
        
        {/* Decorative Subtle Background Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-t from-zinc-100 to-transparent -z-10 rounded-t-[100px] opacity-40"></div>
      </main>

      {/* Content Section */}
      <section className="bg-white py-24 px-6 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center">
                <BookOpen className="text-zinc-900 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Smart Organization</h3>
              <p className="text-zinc-500">Automatically categorize your books by genre, author, or custom tags with our intelligent system.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="text-zinc-500">Keep track of every page turned. Set annual reading goals and visualize your progress beautifully.</p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Sync Everywhere</h3>
              <p className="text-zinc-500">Your library is always with you. Access your collection seamlessly across all your devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 py-12 px-6 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 text-white p-1 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-zinc-900">Your Personal Library</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-zinc-500">
            <a className="hover:text-zinc-900 transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-zinc-900 transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-zinc-900 transition-colors" href="#">Changelog</a>
            <a className="hover:text-zinc-900 transition-colors" href="#">Support</a>
          </div>
          
          <p className="text-sm text-zinc-400">© 2026 Your Personal Library. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
