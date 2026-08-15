import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  PalmAnalysisResult,
  TarotSpreadResult,
  IntegratedReadingReport,
} from './types';
import { Navbar } from './components/Navbar';
import { LandingPageView } from './components/LandingPageView';
import { DashboardView } from './components/DashboardView';
import { PalmScannerView } from './components/PalmScannerView';
import { TarotSanctuaryView } from './components/TarotSanctuaryView';
import { IntegratedReadingView } from './components/IntegratedReadingView';
import { AnalyticsHistoryView } from './components/AnalyticsHistoryView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { AuthModal } from './components/AuthModal';
import { LegalPagesView } from './components/LegalPagesView';

export default function App() {
  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Auth & User Profile State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [user, setUser] = useState<UserProfile>({
    id: 'usr_seeker_1',
    name: 'Alex Morgan',
    email: 'alex.morgan@aetheria.ai',
    role: 'user',
    birthDate: '1995-08-14',
    zodiacSign: 'Leo',
    dominantHand: 'Right',
    intention: 'Career & Personal Leadership Growth',
    tier: 'Mystic Pro',
    createdAt: new Date().toISOString(),
  });

  // Current State Artifacts
  const [currentPalmAnalysis, setCurrentPalmAnalysis] = useState<PalmAnalysisResult | undefined>();
  const [currentTarotSpread, setCurrentTarotSpread] = useState<TarotSpreadResult | undefined>();
  const [latestReport, setLatestReport] = useState<IntegratedReadingReport | undefined>();
  const [readingsHistory, setReadingsHistory] = useState<IntegratedReadingReport[]>([]);

  // Load existing readings history from server
  useEffect(() => {
    fetch('/api/readings/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.readings) {
          setReadingsHistory(data.readings);
        }
      })
      .catch((err) => console.error('Readings history load error:', err));
  }, []);

  const handleSaveReport = (report: IntegratedReadingReport) => {
    setLatestReport(report);
    setReadingsHistory((prev) => [report, ...prev]);

    // Persist to server
    fetch('/api/readings/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    }).catch((err) => console.error('Save report error:', err));
  };

  const handleUpdateUser = (updatedProps: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updatedProps }));
  };

  const handleLoginSuccess = (name: string, email: string) => {
    setIsLoggedIn(true);
    setUser((prev) => ({ ...prev, name, email }));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 w-full flex-grow">
        {activeTab === 'home' && (
          <LandingPageView
            onStartAnalysis={() => setActiveTab('palm_scanner')}
            onOpenTarot={() => setActiveTab('tarot_sanctuary')}
            onOpenPricing={() => setActiveTab('pricing')}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            setActiveTab={setActiveTab}
            recentReport={latestReport || readingsHistory[0]}
          />
        )}

        {activeTab === 'palm_scanner' && (
          <PalmScannerView
            onAnalysisComplete={(analysis) => {
              setCurrentPalmAnalysis(analysis);
            }}
            setActiveTab={setActiveTab}
            currentAnalysis={currentPalmAnalysis}
          />
        )}

        {activeTab === 'tarot_sanctuary' && (
          <TarotSanctuaryView
            onSpreadComplete={(spread) => {
              setCurrentTarotSpread(spread);
            }}
            setActiveTab={setActiveTab}
            currentSpread={currentTarotSpread}
          />
        )}

        {activeTab === 'integrated_reading' && (
          <IntegratedReadingView
            user={user}
            palmAnalysis={currentPalmAnalysis}
            tarotSpread={currentTarotSpread}
            onSaveReport={handleSaveReport}
          />
        )}

        {activeTab === 'history_analytics' && (
          <AnalyticsHistoryView
            history={readingsHistory}
            onSelectReport={(report) => {
              setLatestReport(report);
              setActiveTab('integrated_reading');
            }}
          />
        )}

        {activeTab === 'pricing' && (
          <LandingPageView
            onStartAnalysis={() => setActiveTab('palm_scanner')}
            onOpenTarot={() => setActiveTab('tarot_sanctuary')}
            onOpenPricing={() => setActiveTab('pricing')}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenPricing={() => setActiveTab('pricing')}
          />
        )}

        {activeTab === 'privacy' && (
          <LegalPagesView page="privacy" onBack={() => setActiveTab('home')} />
        )}

        {activeTab === 'terms' && (
          <LegalPagesView page="terms" onBack={() => setActiveTab('home')} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
