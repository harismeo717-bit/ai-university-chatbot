/**
 * UniAssist AI — Academic Directory Hub
 * Interactive exploration of Departments, Degree Programs, Course Catalog, and Faculty Staff.
 */

import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building,
  Search,
  Mail,
  Phone,
  Clock,
  MapPin,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Department, Program, Course, FacultyMember } from '../../types/index.ts';

interface DirectoryViewProps {
  departments: Department[];
  programs: Program[];
  courses: Course[];
  faculty: FacultyMember[];
  onAskAboutItem?: (prompt: string) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  departments,
  programs,
  courses,
  faculty,
  onAskAboutItem,
}) => {
  const [activeTab, setActiveTab] = useState<'FACULTY' | 'PROGRAMS' | 'COURSES' | 'DEPTS'>('FACULTY');
  const [search, setSearch] = useState('');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Top Header & Search */}
      <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>University Directory</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Departments, academic degree roadmaps, course syllabus details, and faculty office hours
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search faculty, courses, degrees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('FACULTY')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'FACULTY'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Faculty Directory ({faculty.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROGRAMS')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'PROGRAMS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Degree Programs ({programs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COURSES')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'COURSES'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Course Catalog ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('DEPTS')}
          className={`py-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'DEPTS'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Academic Departments ({departments.length})</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-6xl mx-auto w-full">
        {/* TAB 1: FACULTY */}
        {activeTab === 'FACULTY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faculty
              .filter(
                (f) =>
                  f.name.toLowerCase().includes(search.toLowerCase()) ||
                  f.designation.toLowerCase().includes(search.toLowerCase()) ||
                  f.researchArea.toLowerCase().includes(search.toLowerCase())
              )
              .map((fac) => (
                <div
                  key={fac.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                        {fac.qualification}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {fac.designation}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      {fac.name.split(' ').slice(-1)[0][0]}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Research Areas: </span>
                    {fac.researchArea}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-500" />
                      <a href={`mailto:${fac.email}`} className="hover:underline truncate">
                        {fac.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{fac.officeLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-full">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Office Hours: {fac.officeHours}</span>
                    </div>
                  </div>

                  {onAskAboutItem && (
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onAskAboutItem(`Who is ${fac.name} and what are their office hours?`)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Ask AI about {fac.name}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* TAB 2: DEGREE PROGRAMS */}
        {activeTab === 'PROGRAMS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs
              .filter(
                (p) =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.code.toLowerCase().includes(search.toLowerCase())
              )
              .map((prog) => (
                <div
                  key={prog.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      {prog.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {prog.durationYears} Years • {prog.totalCreditHours} Credits
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {prog.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Minimum Admission Criteria
                    </span>
                    <p className="text-[11px]">{prog.admissionRequirements}</p>
                  </div>

                  {onAskAboutItem && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => onAskAboutItem(`What are the admission requirements, fee structure, and curriculum for ${prog.name} (${prog.code})?`)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Ask AI about {prog.code}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* TAB 3: COURSES CATALOG */}
        {activeTab === 'COURSES' && (
          <div className="space-y-3">
            {courses
              .filter(
                (c) =>
                  c.code.toLowerCase().includes(search.toLowerCase()) ||
                  c.title.toLowerCase().includes(search.toLowerCase()) ||
                  c.description.toLowerCase().includes(search.toLowerCase())
              )
              .map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {course.code}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {course.credits} Credits ({course.lectureHours} Lec / {course.labHours} Lab)
                      </span>
                      {course.prerequisite && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                          Prereq: {course.prerequisite}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
                      {course.description}
                    </p>
                  </div>

                  {onAskAboutItem && (
                    <button
                      onClick={() => onAskAboutItem(`Provide details and syllabus outline for course ${course.code}: ${course.title}`)}
                      className="flex-shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800/80 transition-colors"
                    >
                      Course Outline & AI Info
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* TAB 4: DEPARTMENTS */}
        {activeTab === 'DEPTS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-400">{dept.building}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Department of {dept.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {dept.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Department Head: </span>
                    {dept.headOfDepartment}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Contact: </span>
                    {dept.contactEmail} (Ext. {dept.contactPhone})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
