import React, { useEffect, useState } from "react";

import {
  UserProfile,
  PalmAnalysisResult,
  TarotSpreadResult,
  IntegratedReadingReport,
} from "./types";

import { Navbar } from "./components/Navbar";
import { LandingPageView } from "./components/LandingPageView";
import { DashboardView } from "./components/DashboardView";
import { PalmScannerView } from "./components/PalmScannerView";
import { TarotSanctuaryView } from "./components/TarotSanctuaryView";
import { IntegratedReadingView } from "./components/IntegratedReadingView";
import { AnalyticsHistoryView } from "./components/AnalyticsHistoryView";
import { ProfileSettingsView } from "./components/ProfileSettingsView";
import { AuthModal } from "./components/AuthModal";
import { LegalPagesView } from "./components/LegalPagesView";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  // =========================================================
  // NAVIGATION
  // =========================================================

  const [activeTab, setActiveTab] = useState<string>("home");

  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("access_token"));
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // =========================================================
  // USER PROFILE
  // =========================================================

  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    role: "user",
    birthDate: "",
    zodiacSign: "",
    dominantHand: "Right",
    intention: "",
    tier: "Mystic Pro",
    createdAt: new Date().toISOString(),
  });

  // =========================================================
  // CURRENT APPLICATION DATA
  // =========================================================

  const [currentPalmAnalysis, setCurrentPalmAnalysis] = useState<
    PalmAnalysisResult | undefined
  >();

  const [currentTarotSpread, setCurrentTarotSpread] = useState<
    TarotSpreadResult | undefined
  >();

  const [latestReport, setLatestReport] = useState<
    IntegratedReadingReport | undefined
  >();

  const [readingsHistory, setReadingsHistory] = useState<
    IntegratedReadingReport[]
  >([]);

  // =========================================================
  // LOAD USER PROFILE
  // =========================================================

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/profile/me`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Profile request failed: ${response.status}`
          );
        }

        const profile = await response.json();

        console.log("Authenticated profile:", profile);

        setIsLoggedIn(true);

        setUser((previousUser) => ({
          ...previousUser,

          id:
            profile.id !== undefined
              ? String(profile.id)
              : previousUser.id,

          name:
            profile.full_name ||
            profile.name ||
            previousUser.name,

          email:
            profile.email ||
            previousUser.email,

          role:
            profile.role ||
            previousUser.role,

          createdAt:
            profile.created_at ||
            previousUser.createdAt,
        }));
      } catch (error) {
        console.error("Profile loading error:", error);

        localStorage.removeItem("access_token");

        setIsLoggedIn(false);
        setReadingsHistory([]);
      }
    };

    loadProfile();
  }, []);

  // =========================================================
  // LOAD PALM HISTORY FROM FASTAPI
  // =========================================================

  useEffect(() => {
    const loadPalmHistory = async () => {
      if (!isLoggedIn) {
        return;
      }

      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("No access token available for history.");
        return;
      }

      try {
        console.log("Loading palm analysis history...");

        const response = await fetch(
          `${API_BASE_URL}/api/v1/palm/history`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error(
            "History request failed:",
            response.status
          );

          if (response.status === 401) {
            console.warn(
              "History request unauthorized. Token may be invalid."
            );
          }

          return;
        }

        const result = await response.json();

        console.log("Backend palm history response:", result);

        /*
         * Backend response:
         *
         * {
         *   status: "success",
         *   count: number,
         *   data: [...]
         * }
         */

        const backendRecords = Array.isArray(result?.data)
          ? result.data
          : [];

        /*
         * Convert backend palm records into the existing
         * IntegratedReadingReport structure used by the UI.
         *
         * The backend currently stores palm analysis records,
         * while the frontend history component expects
         * IntegratedReadingReport objects.
         */

        const convertedHistory =
          backendRecords.map(
            (record: any, index: number) => {
              const interpretation =
                record?.interpretation || {};

              const timestamp =
                record?.created_at ||
                record?.timestamp ||
                record?.updated_at ||
                new Date().toISOString();

              const palmClass =
                record?.palm_class ||
                record?.palmClass ||
                record?.hand ||
                "Palm Analysis";

              const title =
                "Palm Analysis";

              const archetypeTitle =
                record?.hand
                  ? `${record.hand} Hand`
                  : "Palm Reading";

              const report: any = {
                id:
                  record?.id !== undefined
                    ? String(record.id)
                    : `palm-${index}`,

                title,

                timestamp,

                spiritualGuidanceScore:
                  Number(
                    record?.spiritual_guidance_score ??
                    record?.spiritualGuidanceScore ??
                    92
                  ),

                archetype: {
                  title: archetypeTitle,
                },

                palmAnalysis: {
                  palmClass,
                  hand:
                    record?.hand ||
                    "Unknown",

                  features:
                    record?.features ||
                    {},

                  interpretation,

                  classifiedLines:
                    record?.classified_lines ||
                    record?.classifiedLines ||
                    [],

                  lines:
                    record?.lines ||
                    [],
                },

                tarotSpread:
                  record?.tarotSpread ||
                  record?.tarot_spread ||
                  undefined,

                personality:
                  interpretation?.personality ||
                  "Palm analysis completed.",

                love:
                  interpretation?.love ||
                  "",

                intelligence:
                  interpretation?.intelligence ||
                  "",

                health:
                  interpretation?.health ||
                  "",

                career:
                  interpretation?.career ||
                  "",

                summary:
                  interpretation?.summary ||
                  "Palm analysis completed successfully.",

                userId:
                  record?.user_id !== undefined
                    ? String(record.user_id)
                    : "",

                imagePath:
                  record?.image_path ||
                  "",
              };

              return report as IntegratedReadingReport;
            }
          );

        /*
         * Backend normally returns newest records first.
         * Sort again here so the newest analysis appears first.
         */

        convertedHistory.sort(
          (a: IntegratedReadingReport, b: IntegratedReadingReport) => {
            return (
              new Date(b.timestamp).getTime() -
              new Date(a.timestamp).getTime()
            );
          }
        );

        setReadingsHistory(convertedHistory);

        /*
         * Keep dashboard/latest reading synchronized.
         */

        if (convertedHistory.length > 0) {
          setLatestReport(convertedHistory[0]);
        }

        console.log(
          "Converted history records:",
          convertedHistory.length
        );
      } catch (error) {
        console.error(
          "Palm history loading error:",
          error
        );
      }
    };

    loadPalmHistory();
  }, [isLoggedIn]);

  // =========================================================
  // LOGIN SUCCESS
  // =========================================================

  const handleLoginSuccess = (
    name: string,
    email: string,
    token: string
  ) => {
    localStorage.setItem(
      "access_token",
      token
    );

    setIsLoggedIn(true);

    setUser((previousUser) => ({
      ...previousUser,
      name,
      email,
    }));

    setAuthModalOpen(false);

    setActiveTab("dashboard");
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    setIsLoggedIn(false);

    setCurrentPalmAnalysis(undefined);

    setCurrentTarotSpread(undefined);

    setLatestReport(undefined);

    setReadingsHistory([]);

    setActiveTab("home");
  };

  // =========================================================
  // UPDATE USER
  // =========================================================

  const handleUpdateUser = (
    updatedProps: Partial<UserProfile>
  ) => {
    setUser((previousUser) => ({
      ...previousUser,
      ...updatedProps,
    }));
  };

  // =========================================================
  // SAVE INTEGRATED REPORT
  // =========================================================

  const handleSaveReport = (
    report: IntegratedReadingReport
  ) => {
    setLatestReport(report);

    setReadingsHistory((previousHistory) => {
      /*
       * Avoid duplicate entries if the same report is
       * already present.
       */

      const alreadyExists =
        previousHistory.some(
          (item) => item.id === report.id
        );

      if (alreadyExists) {
        return previousHistory;
      }

      return [
        report,
        ...previousHistory,
      ];
    });

    console.log(
      "Integrated report stored in frontend state:",
      report
    );
  };

  // =========================================================
  // OPEN AUTH MODAL
  // =========================================================

  const openAuth = (
    mode: "login" | "register"
  ) => {
    setAuthMode(mode);

    setAuthModalOpen(true);
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-[#080b14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black flex flex-col justify-between">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={openAuth}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 w-full flex-grow">

        {/* HOME */}

        {activeTab === "home" && (
          <LandingPageView
            onStartAnalysis={() => {
              if (!isLoggedIn) {
                openAuth("login");
                return;
              }

              setActiveTab("palm_scanner");
            }}
            onOpenTarot={() => {
              if (!isLoggedIn) {
                openAuth("login");
                return;
              }

              setActiveTab("tarot_sanctuary");
            }}
            onOpenPricing={() =>
              setActiveTab("pricing")
            }
            onOpenAuth={openAuth}
          />
        )}

        {/* DASHBOARD */}

        {activeTab === "dashboard" && (
          <DashboardView
            user={user}
            setActiveTab={setActiveTab}
            recentReport={
              latestReport ||
              readingsHistory[0]
            }
          />
        )}

        {/* PALM SCANNER */}

        {activeTab === "palm_scanner" && (
          <PalmScannerView
            onAnalysisComplete={(analysis) => {
              setCurrentPalmAnalysis(
                analysis
              );
            }}
            setActiveTab={setActiveTab}
            currentAnalysis={
              currentPalmAnalysis
            }
          />
        )}

        {/* TAROT */}

        {activeTab === "tarot_sanctuary" && (
          <TarotSanctuaryView
            onSpreadComplete={(spread) => {
              setCurrentTarotSpread(
                spread
              );
            }}
            setActiveTab={setActiveTab}
            currentSpread={
              currentTarotSpread
            }
          />
        )}

        {/* INTEGRATED READING */}

        {activeTab === "integrated_reading" && (
          <IntegratedReadingView
            user={user}
            palmAnalysis={
              currentPalmAnalysis
            }
            tarotSpread={
              currentTarotSpread
            }
            onSaveReport={
              handleSaveReport
            }
          />
        )}

        {/* HISTORY */}

        {activeTab === "history_analytics" && (
          <AnalyticsHistoryView
            history={readingsHistory}
            onSelectReport={(report) => {
              setLatestReport(report);

              setActiveTab(
                "integrated_reading"
              );
            }}
          />
        )}

        {/* PRICING */}

        {activeTab === "pricing" && (
          <LandingPageView
            onStartAnalysis={() => {
              if (!isLoggedIn) {
                openAuth("login");
                return;
              }

              setActiveTab("palm_scanner");
            }}
            onOpenTarot={() => {
              if (!isLoggedIn) {
                openAuth("login");
                return;
              }

              setActiveTab(
                "tarot_sanctuary"
              );
            }}
            onOpenPricing={() =>
              setActiveTab("pricing")
            }
            onOpenAuth={openAuth}
          />
        )}

        {/* PROFILE */}

        {activeTab === "profile" && (
          <ProfileSettingsView
            user={user}
            onUpdateUser={
              handleUpdateUser
            }
            onOpenPricing={() =>
              setActiveTab("pricing")
            }
          />
        )}

        {/* PRIVACY */}

        {activeTab === "privacy" && (
          <LegalPagesView
            page="privacy"
            onBack={() =>
              setActiveTab("home")
            }
          />
        )}

        {/* TERMS */}

        {activeTab === "terms" && (
          <LegalPagesView
            page="terms"
            onBack={() =>
              setActiveTab("home")
            }
          />
        )}

      </main>

      {/* AUTH MODAL */}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() =>
          setAuthModalOpen(false)
        }
        onLoginSuccess={
          handleLoginSuccess
        }
      />
    </div>
  );
}