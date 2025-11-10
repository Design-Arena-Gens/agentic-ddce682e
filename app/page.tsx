'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState<string>('Idle');
  const [videos, setVideos] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data.status);
      setVideos(data.videos || []);
      setLogs(data.logs || []);
      setIsRunning(data.isRunning || false);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  };

  const startAgent = async () => {
    try {
      const res = await fetch('/api/agent/start', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('Running');
        setIsRunning(true);
      }
    } catch (error) {
      console.error('Failed to start agent:', error);
    }
  };

  const stopAgent = async () => {
    try {
      const res = await fetch('/api/agent/stop', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('Stopped');
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Failed to stop agent:', error);
    }
  };

  const generateVideo = async () => {
    try {
      setStatus('Generating video...');
      const res = await fetch('/api/agent/generate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setStatus('Video generated successfully');
        fetchStatus();
      }
    } catch (error) {
      console.error('Failed to generate video:', error);
      setStatus('Error generating video');
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-8 text-center">
          AI Animation YouTube Agent
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">Agent Status</h2>
              <p className="text-gray-300">
                Status: <span className={`font-bold ${isRunning ? 'text-green-400' : 'text-yellow-400'}`}>
                  {status}
                </span>
              </p>
              <p className="text-gray-300 mt-2">
                Videos Generated: <span className="font-bold text-blue-400">{videos.length}</span>
              </p>
            </div>

            <div className="flex gap-4">
              {!isRunning ? (
                <button
                  onClick={startAgent}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Start Agent
                </button>
              ) : (
                <button
                  onClick={stopAgent}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  Stop Agent
                </button>
              )}
              <button
                onClick={generateVideo}
                disabled={isRunning}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Now
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Configuration</h2>
            <div className="space-y-3 text-gray-300">
              <p>Videos per cycle: <span className="font-bold text-blue-400">7-10</span></p>
              <p>Cycle duration: <span className="font-bold text-blue-400">48 hours</span></p>
              <p>Video duration: <span className="font-bold text-blue-400">30-60 seconds</span></p>
              <p>AI Model: <span className="font-bold text-blue-400">GPT-4 + Stable Diffusion</span></p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Activity Logs</h2>
            <div className="bg-gray-900 rounded p-4 h-48 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet...</p>
              ) : (
                logs.map((log, idx) => (
                  <p key={idx} className="text-sm text-gray-300 mb-1">
                    {log}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Generated Videos</h2>
          {videos.length === 0 ? (
            <p className="text-gray-400">No videos generated yet. Start the agent to begin!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-4">
                  <div className="aspect-video bg-gray-700 rounded mb-3 flex items-center justify-center">
                    <span className="text-gray-500">Video Preview</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2 truncate">{video.title}</h3>
                  <p className="text-sm text-gray-400 mb-2">{video.description?.substring(0, 100)}...</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded ${
                      video.status === 'uploaded' ? 'bg-green-600' :
                      video.status === 'processing' ? 'bg-yellow-600' : 'bg-gray-600'
                    }`}>
                      {video.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-semibold text-white mb-4">Setup Instructions</h2>
          <div className="space-y-3 text-gray-300">
            <p>1. Set up your <code className="bg-gray-900 px-2 py-1 rounded">.env</code> file with API keys:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>OpenAI API key (for script generation)</li>
              <li>Replicate API token (for AI image/video generation)</li>
              <li>YouTube API credentials (OAuth 2.0)</li>
            </ul>
            <p>2. Authenticate with YouTube by visiting <code className="bg-gray-900 px-2 py-1 rounded">/api/youtube/auth</code></p>
            <p>3. Start the agent to begin automatic video generation</p>
            <p className="text-yellow-400 mt-4">⚠️ The agent will generate and upload 7-10 videos every 48 hours automatically</p>
          </div>
        </div>
      </div>
    </main>
  );
}
