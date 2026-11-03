/**
 * OmniSync Social – Multi-Channel Orchestration System
 * @license Apache-2.0
 */

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store, useAppSelector } from './store';
import { ThemeProvider, useAppTheme } from './context/ThemeContext';
import { NavigationSidebar, NavTab } from './components/layout/NavigationSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { ToastCenter } from './components/common/ToastCenter';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { OmniComposer } from './components/composer/OmniComposer';
import { UnifiedContentCalendar } from './components/calendar/UnifiedContentCalendar';
import { DraftsVault } from './components/drafts/DraftsVault';
import { ConnectedChannelsHub } from './components/platforms/ConnectedChannelsHub';
import { AnalyticsStudio } from './components/analytics/AnalyticsStudio';
import { TeamAccessDirectory } from './components/users/TeamAccessDirectory';
import { ForensicAuditInspector } from './components/users/ForensicAuditInspector';
import { EventStreamConsole } from './components/kafka/EventStreamConsole';
import { SessionAuthModal } from './components/auth/SessionAuthModal';
import { Draft } from './types';

function MainLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isKafkaModalOpen, setIsKafkaModalOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Draft | undefined>(undefined);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const handleEditDraft = (draft: Draft) => {
    setEditingDraft(draft);
    setActiveTab('composer');
  };

  const handleCreateNewDraft = () => {
    setEditingDraft(undefined);
    setActiveTab('composer');
  };

  // Background styling mapped by theme
  const bgClass =
    theme === 'dark-obsidian'
      ? 'bg-[#090D16] text-slate-100'
      : theme === 'clean-studio'
      ? 'bg-[#F8FAFC] text-slate-900'
      : 'bg-[#FAF5FF] text-slate-900';

  return (
    <div
      className={`flex h-screen ${bgClass} overflow-hidden font-sans antialiased selection:bg-purple-500 selection:text-white transition-colors duration-200`}
    >
      {/* Toast Feedback Center */}
      <ToastCenter />

      {/* Session Auth Modal if unauthenticated */}
      {!isAuthenticated && <SessionAuthModal />}

      {/* Navigation Sidebar (Collapsible & hideable in Presentation Mode) */}
      {!isPresentationMode && (
        <NavigationSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'composer') setEditingDraft(undefined);
            setActiveTab(tab);
          }}
          onOpenKafkaConsole={() => setIsKafkaModalOpen(true)}
        />
      )}

      {/* Main Viewport Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader
          activeTab={activeTab}
          onOpenComposer={() => {
            setEditingDraft(undefined);
            setActiveTab('composer');
          }}
          onOpenKafkaConsole={() => setIsKafkaModalOpen(true)}
          isPresentationMode={isPresentationMode}
          onTogglePresentationMode={() => setIsPresentationMode(!isPresentationMode)}
        />

        {/* Viewport View Switcher */}
        <main className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <OverviewDashboard onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'composer' && (
            <OmniComposer
              initialDraft={editingDraft}
              onPostSuccess={() => {
                setEditingDraft(undefined);
                setActiveTab('dashboard');
              }}
            />
          )}
          {activeTab === 'calendar' && (
            <UnifiedContentCalendar
              onScheduleNew={() => {
                setEditingDraft(undefined);
                setActiveTab('composer');
              }}
            />
          )}
          {activeTab === 'drafts' && (
            <DraftsVault
              onEditDraftInComposer={handleEditDraft}
              onCreateNew={handleCreateNewDraft}
            />
          )}
          {activeTab === 'accounts' && <ConnectedChannelsHub />}
          {activeTab === 'analytics' && <AnalyticsStudio />}
          {activeTab === 'users' && <TeamAccessDirectory />}
          {activeTab === 'audit' && <ForensicAuditInspector />}
        </main>
      </div>

      {/* Kafka Inspector Modal */}
      <EventStreamConsole
        isOpen={isKafkaModalOpen}
        onClose={() => setIsKafkaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <MainLayout />
      </ThemeProvider>
    </Provider>
  );
}
