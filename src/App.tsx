import React, { useState, useEffect } from 'react';
import { StorageEngine } from './lib/storage';
import { CustomModule, UserProfile } from './types/os';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { WelcomeGateway } from './components/layout/WelcomeGateway';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

// Module Views
import { DashboardView } from './components/modules/DashboardView';
import { MasterDataView } from './components/modules/MasterDataView';
import { DailyWorkView } from './components/modules/DailyWorkView';
import { BusinessHubView } from './components/modules/BusinessHubView';
import { AiAssistantView } from './components/modules/AiAssistantView';
import { FinanceTrackerView } from './components/modules/FinanceTrackerView';
import { ToolsCenterView } from './components/modules/ToolsCenterView';
import { ModuleBuilderView } from './components/modules/ModuleBuilderView';
import { DynamicModuleView } from './components/modules/DynamicModuleView';
import { SettingsView } from './components/modules/SettingsView';

import { X, LogOut, ChevronRight, Boxes } from 'lucide-react';

export default function App() {
  const [inGateway, setInGateway] = useState(false);
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile>(StorageEngine.getProfile());
  const [customModules, setCustomModules] = useState<CustomModule[]>([]);

  // Initialize storage & reactive subscriptions
  useEffect(() => {
    StorageEngine.initialize();
    setProfile(StorageEngine.getProfile());
    setCustomModules(StorageEngine.getCustomModules());

    // Apply saved theme
    const savedProfile = StorageEngine.getProfile();
    if (savedProfile.theme_preference) {
      document.documentElement.setAttribute('data-theme', savedProfile.theme_preference);
    }

    // Auto-open onboarding if first visit
    if (!StorageEngine.isOnboardingCompleted()) {
      setTourOpen(true);
    }

    const handleSync = () => {
      setProfile(StorageEngine.getProfile());
      setCustomModules(StorageEngine.getCustomModules());
    };

    window.addEventListener('sp-life-os-change', handleSync);
    return () => window.removeEventListener('sp-life-os-change', handleSync);
  }, []);

  const handleSelectModule = (modId: string) => {
    setCurrentModule(modId);
    setMobileMenuOpen(false);
  };

  const handleCloseTour = (targetModule?: string) => {
    setTourOpen(false);
    if (targetModule) {
      setCurrentModule(targetModule);
    }
  };

  const handleExitApp = () => {
    setExitModalOpen(false);
    setInGateway(true);
  };

  if (inGateway) {
    return (
      <WelcomeGateway
        onEnterApp={() => setInGateway(false)}
        onOpenTour={() => {
          setInGateway(false);
          setTourOpen(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#080B12] text-white overflow-hidden select-none">
      {/* DESKTOP SIDEBAR */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        customModules={customModules}
        onExit={() => setExitModalOpen(true)}
        onOpenTour={() => setTourOpen(true)}
      />

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#0A0F1D] h-full flex flex-col p-4 border-r border-surface-border z-10">
            <div className="flex items-center justify-between pb-4 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white font-extrabold text-xs shadow-glow">
                  SP
                </div>
                <span className="font-bold text-xs uppercase tracking-wider">SP LIFE OS</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1">
              {[
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'master-data', name: 'Master Data' },
                { id: 'daily-work', name: 'My Daily Work' },
                { id: 'business-hub', name: 'Business Hub' },
                { id: 'ai-assistant', name: 'AI Assistant' },
                { id: 'finance-tracker', name: 'Finance Tracker' },
                { id: 'tools-center', name: 'Tools Center (16)' },
                { id: 'module-builder', name: 'Module Builder' },
                { id: 'settings', name: 'Settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectModule(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                    currentModule === item.id
                      ? 'bg-primary text-white shadow-glow'
                      : 'text-muted hover:bg-surface-card hover:text-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {customModules.length > 0 && (
                <>
                  <div className="text-[10px] font-bold text-muted/60 uppercase px-3 pt-4 mb-1">
                    Custom Modules
                  </div>
                  {customModules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => handleSelectModule(`module_${mod.id}`)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                        currentModule === `module_${mod.id}`
                          ? 'bg-secondary text-white shadow-glow-purple'
                          : 'text-muted hover:bg-surface-card hover:text-white'
                      }`}
                    >
                      <Boxes className="w-3.5 h-3.5 text-accent" />
                      <span className="truncate">{mod.name}</span>
                    </button>
                  ))}
                </>
              )}
            </nav>

            <div className="pt-4 border-t border-surface-border">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setExitModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl"
              >
                Exit Platform
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <Topbar
          currentModule={currentModule}
          onSelectModule={handleSelectModule}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenTour={() => setTourOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          profile={profile}
        />

        {/* WORKSPACE CONTENT BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#080B12] select-text">
          {currentModule === 'dashboard' && (
            <DashboardView
              onNavigate={handleSelectModule}
              onOpenTour={() => setTourOpen(true)}
            />
          )}

          {currentModule === 'master-data' && <MasterDataView />}

          {currentModule === 'daily-work' && <DailyWorkView />}

          {currentModule === 'business-hub' && <BusinessHubView />}

          {currentModule === 'ai-assistant' && <AiAssistantView />}

          {currentModule === 'finance-tracker' && <FinanceTrackerView />}

          {currentModule === 'tools-center' && <ToolsCenterView />}

          {currentModule === 'module-builder' && (
            <ModuleBuilderView onModuleCreated={handleSelectModule} />
          )}

          {currentModule.startsWith('module_') && (
            <DynamicModuleView
              moduleId={currentModule}
              onModuleDeleted={() => setCurrentModule('dashboard')}
            />
          )}

          {currentModule === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* GLOBAL SEARCH MODAL (⌘K) */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectModule={handleSelectModule}
      />

      {/* MULTI-STEP ONBOARDING TOUR MODAL */}
      <OnboardingModal isOpen={tourOpen} onClose={handleCloseTour} />

      {/* EXIT PLATFORM MODAL */}
      {exitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-surface-border shadow-2xl bg-[#0A0F1D]">
            <h3 className="text-base font-bold text-white">End System Session?</h3>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              All uncommitted changes are safely kept in your local secure tenant storage. Return to the Welcome gateway?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setExitModalOpen(false)}
                className="px-4 py-2 text-xs rounded-xl bg-surface hover:bg-surface-card text-muted hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExitApp}
                className="px-4 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-glow"
              >
                Return to Gateway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
