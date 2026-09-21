import React from "react";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      
      {/* 13. PUBLIC NAVIGATION */}
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 font-bold text-white">
                AX
              </div>
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                AcademiaX
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 font-medium">Home</Link>
                <Link to="/student/courses" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 font-medium">Courses</Link>
                <Link to="/policies" className="text-gray-600 hover:text-brand-600 dark:text-gray-300 dark:hover:text-brand-400 font-medium">Policies</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/signin" className="hidden sm:block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">Sign In</Link>
                  <Link to="/signup" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition">Get Started</Link>
                </>
              ) : (
                <Link to={user?.role === "ROLE_ADMIN" ? "/admin/dashboard" : user?.role === "ROLE_INSTRUCTOR" ? "/instructor/dashboard" : "/student/dashboard"} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 4. HERO SECTION */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            <span className="block">AcademiaX Digital Learning</span>
            <span className="block text-brand-600 dark:text-brand-500 mt-2 text-3xl md:text-5xl">Learn. Build. Grow.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
            A digital learning platform for structured online education, technical coursework, and verifiable skill development.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/student/courses" 
              className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-theme-xs transition-colors"
            >
              Explore Courses
            </Link>
            {!isAuthenticated ? (
              <Link 
                to="/signin" 
                className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-theme-xs transition-colors"
              >
                Sign In
              </Link>
            ) : (
              <Link 
                to={
                  user?.role === "ROLE_ADMIN" 
                    ? "/admin/dashboard" 
                    : user?.role === "ROLE_INSTRUCTOR" 
                    ? "/instructor/dashboard" 
                    : "/student/dashboard"
                } 
                className="inline-flex justify-center items-center px-8 py-3.5 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-theme-xs transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 5. COMPANY / PLATFORM INTRODUCTION */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About AcademiaX Digital Learning</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            AcademiaX Digital Learning is an academic project platform designed to make structured learning, course discovery, enrollment, and learning management accessible through a single, modern interface. It demonstrates a complete, role-based educational technology workflow from course creation to student enrollment.
          </p>
        </div>
      </section>

      {/* 6. CORE PLATFORM FEATURES */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything you need for a structured learning experience</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Core capabilities designed for administrators, instructors, and students.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Explore Courses</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse available courses, view detailed course information, instructor assignments, and available capacity.</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Structured Enrollment</h3>
              <p className="text-gray-600 dark:text-gray-400">Enroll securely in available active courses through the platform and track your educational progress.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-400">Email/password authentication with verification flows, robust password hashing, and structural SSO provider support.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Learning Management</h3>
              <p className="text-gray-600 dark:text-gray-400">Dedicated portals and workflows designed independently for administrators, instructors, and students.</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Secure Sandbox Payments</h3>
              <p className="text-gray-600 dark:text-gray-400">Use the project's AcademiaX Sandbox payment flow for demonstration purposes with HMAC-SHA256 signature verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Create an Account</h3>
              <p className="text-gray-600 dark:text-gray-400">Sign up securely with your email or supported SSO.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Explore Courses</h3>
              <p className="text-gray-600 dark:text-gray-400">Browse the public catalog and find a curriculum.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Enroll in a Course</h3>
              <p className="text-gray-600 dark:text-gray-400">Confirm tuition using the sandbox payment flow.</p>
            </div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">4</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Continue Your Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">Track enrollments and progress in your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. ROLE-BASED VALUE */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">For Students</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Discover courses dynamically</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> View detailed course information</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Enroll efficiently and securely</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> View centralized enrollments</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Audit personal payment history</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">For Instructors</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Create rich course listings</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Manage authored courses</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Update course parameters</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Set enrollment capacity</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b pb-2 border-gray-200 dark:border-gray-800">For Administrators</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Oversee platform courses</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Monitor aggregate enrollments</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Inspect the payment ledger</li>
                <li className="flex items-center"><svg className="w-5 h-5 mr-3 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg> Authorize transactional refunds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TRUST / SECURITY SECTION */}
      <section className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Designed with Security in Mind</h2>
          <p className="max-w-2xl mx-auto text-gray-400 mb-12">
            AcademiaX prioritizes structural integrity through industry-standard architectural decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-gray-800 rounded-xl bg-gray-800/50">
              <h4 className="font-bold text-lg mb-2 text-gray-100">Authenticated Access</h4>
              <p className="text-sm text-gray-400">Strictly enforced authentication boundaries utilizing signed JSON Web Tokens.</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl bg-gray-800/50">
              <h4 className="font-bold text-lg mb-2 text-gray-100">Role-Based Authorization</h4>
              <p className="text-sm text-gray-400">Immutable isolation between Student, Instructor, and Administrator roles.</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl bg-gray-800/50">
              <h4 className="font-bold text-lg mb-2 text-gray-100">Robust Data Hashing</h4>
              <p className="text-sm text-gray-400">Passwords are cryptographically secured using rigorous BCrypt hashing.</p>
            </div>
            <div className="p-6 border border-gray-800 rounded-xl bg-gray-800/50">
              <h4 className="font-bold text-lg mb-2 text-gray-100">Protected API Endpoints</h4>
              <p className="text-sm text-gray-400">Backend resources validate claims programmatically via an integrated Gateway.</p>
            </div>
          </div>
        </div>
      </section>



      {/* 12. FOOTER */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-auto pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">AcademiaX Digital Learning</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                A digital platform demonstrating structured online learning, user roles, and microservices architecture.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Navigation</h3>
              <ul className="space-y-3">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Home</Link></li>
                <li><Link to="/student/courses" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Explore Courses</Link></li>
                <li><Link to="/signin" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Sign In</Link></li>
                <li><Link to="/signup" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Sign Up</Link></li>
                <li><Link to="/policies" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Policies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><span className="text-sm text-gray-500 dark:text-gray-400">Students</span></li>
                <li><span className="text-sm text-gray-500 dark:text-gray-400">Instructors</span></li>
                <li><span className="text-sm text-gray-500 dark:text-gray-400">Administrators</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Policies</h3>
              <ul className="space-y-3">
                <li><Link to="/policies/terms-and-conditions" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Terms & Conditions</Link></li>
                <li><Link to="/policies/privacy-policy" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Privacy Policy</Link></li>
                <li><Link to="/policies/payment-billing" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Payment & Billing</Link></li>
                <li><Link to="/policies/refund-cancellation" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Refund & Cancellation</Link></li>
                <li><Link to="/policies/security" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Security Policy</Link></li>
                <li><Link to="/policies/support-grievance" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400">Grievance / Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2026 AcademiaX Digital Learning. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
