import React from 'react';
import ChatInterface from '../chat/ChatInterface';
import RecommendationFeed from '../recommendations/RecommendationFeed';
import ProfileView from '../profile/ProfileView';
import BottomNav from '../layout/BottomNav';

export default function MobileShowcase({
  messages,
  inputValue,
  setInputValue,
  isStreaming,
  onSendMessage,
  onSelectPrompt,
  onResetChat,
  properties,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onOpenInsights,
}) {
  return (
    <div className="w-full min-h-screen py-10 px-4 flex flex-col items-center justify-center bg-gradient-to-br from-[#e0e7ff]/60 via-[#f3e8ff]/50 to-[#eef2f7]">
      {/* Header Info Banner */}
      <div className="text-center mb-8 max-w-lg">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
          Interactive Mobile Mockup Showcase
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          PropPilot Mobile Experience
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Live 3-device preview: Properties Feed (Left), Chat Hub (Center), Profile & Settings (Right).
        </p>
      </div>

      {/* 3 Phones Row */}
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-6 xl:gap-8 max-w-[1440px] w-full">

        {/* PHONE 2 (LEFT SCREEN) - Properties Feed */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Properties Feed</span>
          <div className="w-[330px] sm:w-[350px] h-[700px] bg-slate-900 p-3 rounded-[48px] shadow-2xl ring-1 ring-slate-900/20 relative overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
            {/* Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-40 flex items-center justify-end px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Screen Canvas */}
            <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col pt-7 relative">
              <div className="flex-1 overflow-hidden flex flex-col">
                <RecommendationFeed
                  properties={properties}
                  savedPropertyIds={savedPropertyIds}
                  onToggleSave={onToggleSave}
                  onSelectProperty={onSelectProperty}
                  onToggleDashboard={onOpenInsights}
                  rightPanelMode="feed"
                />
              </div>
              <BottomNav activeTab="properties" onTabChange={() => {}} savedCount={savedPropertyIds.size} />
            </div>
          </div>
        </div>

        {/* PHONE 1 (CENTRAL SCREEN) - Chat Hub */}
        <div className="flex flex-col items-center z-10">
          <span className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping inline-block" />
            Chat Hub (Active AI)
          </span>
          <div className="w-[340px] sm:w-[365px] h-[730px] bg-slate-900 p-3.5 rounded-[50px] shadow-float ring-2 ring-indigo-500/30 relative overflow-hidden flex flex-col transform hover:scale-[1.02] transition-transform duration-300">
            {/* Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-end px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Screen Canvas */}
            <div className="w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col pt-7 relative">
              <div className="flex-1 overflow-hidden flex flex-col">
                <ChatInterface
                  messages={messages}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  isStreaming={isStreaming}
                  onSendMessage={onSendMessage}
                  onSelectPrompt={onSelectPrompt}
                  onResetChat={onResetChat}
                  properties={properties}
                  onSelectProperty={onSelectProperty}
                />
              </div>
              <BottomNav activeTab="chat" onTabChange={() => {}} savedCount={savedPropertyIds.size} />
            </div>
          </div>
        </div>

        {/* PHONE 3 (RIGHT SCREEN) - Profile & Settings */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Profile & Menu</span>
          <div className="w-[330px] sm:w-[350px] h-[700px] bg-slate-900 p-3 rounded-[48px] shadow-2xl ring-1 ring-slate-900/20 relative overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
            {/* Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-40 flex items-center justify-end px-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
            </div>

            {/* Screen Canvas */}
            <div className="w-full h-full bg-white rounded-[38px] overflow-hidden flex flex-col pt-7 relative">
              <div className="flex-1 overflow-hidden flex flex-col">
                <ProfileView
                  savedCount={savedPropertyIds.size}
                  onOpenSaved={() => {}}
                  onOpenInsights={onOpenInsights}
                  onNewChat={onResetChat}
                />
              </div>
              <BottomNav activeTab="profile" onTabChange={() => {}} savedCount={savedPropertyIds.size} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
