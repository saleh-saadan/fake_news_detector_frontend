"use client"
import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, AlertCircle, CheckCircle, Loader2, Shield, Eye, Zap, Cpu, Brain, Bot, User } from 'lucide-react';
import { analyzeNews as analyzeNewsAPI, analyzeVideo as analyzeVideoAPI } from '@/lib/api';

export default function TruthDetector() {
  const [activeTab, setActiveTab] = useState('news');
  const [newsText, setNewsText] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleNewsAnalysis = async () => {
    if (!newsText.trim()) return;
    
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    
    try {
      const data = await analyzeNewsAPI(newsText);
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg(error.message || 'Backend connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoAnalysis = async () => {
    if (!videoFile) return;
    
    setLoading(true);
    setResult(null);
    setErrorMsg(null);
    
    try {
      const data = await analyzeVideoAPI(videoFile);
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg(error.message || 'Backend connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const deriveCredibilityVerdict = (res) => {
    if (!res || !Array.isArray(res.claims) || res.claims.length === 0) {
      return { label: 'No Claims Analyzed', tone: 'neutral', icon: AlertCircle };
    }

    const refutedCount = res.claims.filter(c => c.verdict === 'REFUTED').length;
    const supportedCount = res.claims.filter(c => c.verdict === 'SUPPORTED').length;
    const insufficientCount = res.claims.filter(c => c.verdict === 'INSUFFICIENT').length;
    const total = res.claims.length;

    const refutedPercent = (refutedCount / total) * 100;

    if (refutedPercent >= 50) {
      return { 
        label: 'Likely Contains Misinformation', 
        tone: 'danger',
        icon: AlertCircle,
        detail: `${refutedCount}/${total} claims refuted`
      };
    } else if (refutedPercent > 0) {
      return { 
        label: 'Mixed Credibility', 
        tone: 'warn',
        icon: AlertCircle,
        detail: `${refutedCount} refuted, ${supportedCount} supported`
      };
    } else if (supportedCount >= 80) {
      return { 
        label: 'Content Appears Credible', 
        tone: 'good',
        icon: CheckCircle,
        detail: `${supportedCount}/${total} claims supported`
      };
    } else {
      return { 
        label: 'Insufficient Evidence', 
        tone: 'warn',
        icon: AlertCircle,
        detail: `Unable to verify most claims`
      };
    }
  };

  const getAIVerdict = (res) => {
    if (!res || typeof res.aiConfidence !== 'number') {
      return { label: 'Unknown', tone: 'neutral', icon: Brain };
    }

    if (res.aiConfidence >= 70) {
      return { 
        label: 'Likely AI-Generated', 
        tone: 'warn', 
        icon: Bot 
      };
    } else if (res.aiConfidence >= 40) {
      return { 
        label: 'Possibly AI-Assisted', 
        tone: 'neutral', 
        icon: Brain 
      };
    } else {
      return { 
        label: 'Likely Human-Written', 
        tone: 'good', 
        icon: User 
      };
    }
  };

  const credibilityVerdict = result ? deriveCredibilityVerdict(result) : null;
  const aiVerdict = result ? getAIVerdict(result) : null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"> */}
              {/* <Shield className="w-5 h-5 text-white" /> */}
            {/* </div> */}
            <div>
              <h1 className="text-xl font-semibold text-white">Misinformation Detector</h1>
              <p className="text-xs text-gray-400">Cross-reference claims with trusted sources</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Fact Check & Analysis
          </h2>
          <p className="text-gray-400">
            Verify text content and detect AI-generated material
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-900 rounded-lg mb-6">
              <button
                onClick={() => { setActiveTab('news'); setResult(null); setErrorMsg(null); }}
                className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'news'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Text
              </button>
              <button
                onClick={() => { setActiveTab('deepfake'); setResult(null); setErrorMsg(null); }}
                className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === 'deepfake'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Video className="w-4 h-4" />
                Video
              </button>
            </div>

            {/* Text Analysis */}
            {activeTab === 'news' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Text Analysis</span>
                </div>
                
                <textarea
                  value={newsText}
                  onChange={(e) => setNewsText(e.target.value)}
                  placeholder="Paste article, post, or text to verify..."
                  className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none text-sm"
                />
                
                <button
                  onClick={handleNewsAnalysis}
                  disabled={loading || !newsText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Analyze Text
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Video Analysis */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Video Analysis</span>
                </div>
                
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={triggerFileInput}
                  className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-600 hover:bg-gray-900/50 transition-colors cursor-pointer"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Upload className={`w-5 h-5 ${isHovered ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  
                  <p className="text-white text-sm font-medium mb-1">
                    {videoFile ? videoFile.name : 'Click to upload video'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    MP4, AVI, MOV (max 200MB)
                  </p>
                  
                  {videoFile && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-green-900/50 text-green-400 px-2.5 py-1 rounded text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Ready
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleVideoAnalysis}
                  disabled={loading || !videoFile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Analyze Video
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-2 text-gray-300 mb-4">
              <Shield className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-medium">Results</h3>
            </div>

            {!result && !loading && !errorMsg && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 opacity-30" />
                </div>
                <p className="text-sm mb-1">No analysis yet</p>
                <p className="text-xs text-center max-w-xs text-gray-600">
                  Submit text or video for verification
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
                <p className="text-white text-sm font-medium mb-1">Analyzing...</p>
                <p className="text-gray-500 text-xs text-center max-w-xs">
                  {activeTab === 'news' 
                    ? 'Checking claims and AI patterns'
                    : 'Processing video frames'
                  }
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="flex flex-col items-center justify-center h-48 text-red-400">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Analysis Failed</p>
                <p className="text-xs text-center max-w-xs mt-1 text-gray-400">{errorMsg}</p>
                <button 
                  onClick={() => setErrorMsg(null)}
                  className="mt-3 px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 rounded text-xs transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}

            {result && !errorMsg && activeTab === 'news' && (
              <div className="space-y-4">
                {/* AI Verdict */}
                {aiVerdict && (
                  <div className={`p-4 rounded-lg border ${
                    aiVerdict.tone === 'warn' ? 'bg-orange-900/20 border-orange-800'
                    : aiVerdict.tone === 'good' ? 'bg-green-900/20 border-green-800'
                    : 'bg-blue-900/20 border-blue-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        aiVerdict.tone === 'warn' ? 'bg-orange-900/50'
                        : aiVerdict.tone === 'good' ? 'bg-green-900/50'
                        : 'bg-blue-900/50'
                      }`}>
                        <aiVerdict.icon className={`w-4 h-4 ${
                          aiVerdict.tone === 'warn' ? 'text-orange-400'
                          : aiVerdict.tone === 'good' ? 'text-green-400'
                          : 'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-white">
                            {aiVerdict.label}
                          </h4>
                          <span className="text-lg font-bold text-white">
                            {result.aiConfidence}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              result.aiConfidence >= 70 ? 'bg-orange-500' 
                              : result.aiConfidence >= 40 ? 'bg-blue-500' 
                              : 'bg-green-500'
                            }`}
                            style={{ width: `${result.aiConfidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credibility Verdict */}
                {credibilityVerdict && (
                  <div className={`p-4 rounded-lg border ${
                    credibilityVerdict.tone === 'danger' ? 'bg-red-900/20 border-red-800'
                    : credibilityVerdict.tone === 'warn' ? 'bg-yellow-900/20 border-yellow-800'
                    : credibilityVerdict.tone === 'good' ? 'bg-green-900/20 border-green-800'
                    : 'bg-gray-900 border-gray-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        credibilityVerdict.tone === 'danger' ? 'bg-red-900/50'
                        : credibilityVerdict.tone === 'warn' ? 'bg-yellow-900/50'
                        : credibilityVerdict.tone === 'good' ? 'bg-green-900/50'
                        : 'bg-gray-800'
                      }`}>
                        <credibilityVerdict.icon className={`w-4 h-4 ${
                          credibilityVerdict.tone === 'danger' ? 'text-red-400'
                          : credibilityVerdict.tone === 'warn' ? 'text-yellow-400'
                          : credibilityVerdict.tone === 'good' ? 'text-green-400'
                          : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-0.5">
                          {credibilityVerdict.label}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {credibilityVerdict.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claims */}
                {Array.isArray(result.claims) && result.claims.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Claims ({result.claims.length})
                    </h4>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {result.claims.map((c, idx) => (
                        <div key={idx} className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="text-xs text-gray-500">#{idx + 1}</div>
                            <div className={`px-2 py-0.5 rounded text-xs font-medium ${
                              c.verdict === 'REFUTED' ? 'bg-red-900/50 text-red-400'
                              : c.verdict === 'SUPPORTED' ? 'bg-green-900/50 text-green-400'
                              : 'bg-yellow-900/50 text-yellow-400'
                            }`}>
                              {c.verdict}
                            </div>
                          </div>
                          <p className="text-sm text-white mb-2">{c.claim}</p>
                          {c.explanation && (
                            <p className="text-xs text-gray-400 mb-2">{c.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deepfake Results */}
            {result && !errorMsg && activeTab === 'deepfake' && (
              <div className={`p-4 rounded-lg border ${
                result.isDeepfake ? 'bg-red-900/20 border-red-800' : 'bg-green-900/20 border-green-800'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    result.isDeepfake ? 'bg-red-900/50' : 'bg-green-900/50'
                  }`}>
                    {result.isDeepfake ? 
                      <AlertCircle className="w-4 h-4 text-red-400" /> : 
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    }
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">
                      {result.isDeepfake ? 'Deepfake Detected' : 'Video Appears Authentic'}
                    </h4>
                    <p className="text-xs text-gray-400">{result.explanation}</p>
                    {typeof result.confidence === 'number' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {result.confidence}%
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-1">About this project</h3>
                <p className="text-xs text-gray-500">
                  Misinformation detection tool using multi-source verification and AI analysis
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Made by</p>
                <p className="text-sm font-medium text-white">Muhammad Saleh</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-600 text-center">
                This tool assists human judgment - always verify important claims independently
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}