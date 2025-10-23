"use client"
import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, AlertCircle, CheckCircle, Loader2, Shield, Sparkles, Eye, Zap, Globe, Cpu, Brain, ArrowRight, Bot, User } from 'lucide-react';
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
    const supportedPercent = (supportedCount / total) * 100;

    if (refutedPercent >= 50) {
      return { 
        label: 'Likely Contains Misinformation', 
        tone: 'danger',
        icon: AlertCircle,
        detail: `${refutedCount}/${total} claims refuted`
      };
    } else if (refutedPercent > 0) {
      return { 
        label: 'Mixed Credibility - Verify Claims', 
        tone: 'warn',
        icon: AlertCircle,
        detail: `${refutedCount} refuted, ${supportedCount} supported, ${insufficientCount} insufficient`
      };
    } else if (supportedPercent >= 80) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Detect Misinformation
                </h1>
                <p className="text-gray-400 text-sm font-light">Advanced Misinformation Detection</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
    
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Powered by GPT-4 & Multi-Source Verification</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
            Detect <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Misinformation</span>
            <br />
            & AI Content
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Cross-reference claims with Wikipedia, news sources, and detect AI-generated content.
          </p>
        </div>

      
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
         
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
     
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8">
              <button
                onClick={() => { setActiveTab('news'); setResult(null); setErrorMsg(null); }}
                className={`flex items-center gap-3 flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'news'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-5 h-5" />
                Text Analysis
              </button>
              <button
                onClick={() => { setActiveTab('deepfake'); setResult(null); setErrorMsg(null); }}
                className={`flex items-center gap-3 flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'deepfake'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-5 h-5" />
                Video Analysis
              </button>
            </div>

           
            {activeTab === 'news' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white mb-4">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold">Analyze Text Content</h3>
                </div>
                
                <div className="relative">
                  <textarea
                    value={newsText}
                    onChange={(e) => setNewsText(e.target.value)}
                    placeholder="Paste news article, social media post, or any text content you want to verify..."
                    className="w-full h-72 bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
                    {newsText.length} characters
                  </div>
                </div>
                <button
                  onClick={handleNewsAnalysis}
                  disabled={loading || !newsText.trim()}
                  className="w-full group relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Eye className="w-5 h-5" />
                        Analyze Content
                      </>
                    )}
                  </div>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-white mb-4">
                  <Cpu className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-semibold">Analyze Video Content</h3>
                </div>
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 cursor-pointer group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Upload className={`w-8 h-8 ${isHovered ? 'text-cyan-400' : 'text-gray-400'} transition-colors duration-300`} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"></div>
                  </div>
                  <p className="text-white font-semibold text-lg mb-2">
                    {videoFile ? videoFile.name : 'Click to upload video file'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Supports MP4, AVI, MOV • Max 200MB
                  </p>
                  
                  {videoFile && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                      <CheckCircle className="w-4 h-4" />
                      File ready for analysis
                    </div>
                  )}
                </div>
                <button
                  onClick={handleVideoAnalysis}
                  disabled={loading || !videoFile}
                  className="w-full group relative bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Detect Deepfake
                      </>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>

      
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-white mb-6">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold">Analysis Results</h3>
            </div>

            {!result && !loading && !errorMsg && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 opacity-30" />
                </div>
                <p className="text-lg mb-2">Awaiting Analysis</p>
                <p className="text-sm text-center max-w-sm">
                  {activeTab === 'news' 
                    ? 'Paste text content and click analyze to verify authenticity and detect AI'
                    : 'Upload a video file to detect potential deepfake manipulation'
                  }
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="relative mb-8">
                  <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
                  <div className="absolute inset-0 bg-cyan-400 rounded-full opacity-20 animate-ping"></div>
                </div>
                <p className="text-white text-lg font-semibold mb-2">Analyzing Content</p>
                <p className="text-gray-400 text-sm text-center max-w-md">
                  {activeTab === 'news' 
                    ? 'Extracting claims, searching evidence sources, and checking for AI patterns...'
                    : 'Processing video frames for deepfake indicators...'
                  }
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="flex flex-col items-center justify-center h-56 text-red-400">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold">Analysis Failed</p>
                <p className="text-sm text-center max-w-md mt-2">{errorMsg}</p>
                <button 
                  onClick={() => setErrorMsg(null)}
                  className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg text-sm hover:bg-red-500/30 transition"
                >
                  Dismiss
                </button>
              </div>
            )}

            {result && !errorMsg && activeTab === 'news' && (
              <div className="space-y-6 animate-in fade-in duration-500">
               
                {aiVerdict && (
                  <div className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                    aiVerdict.tone === 'warn' ? 'bg-orange-500/10 border-orange-500/30'
                    : aiVerdict.tone === 'good' ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                        aiVerdict.tone === 'warn' ? 'bg-orange-500/20'
                        : aiVerdict.tone === 'good' ? 'bg-green-500/20'
                        : 'bg-blue-500/20'
                      }`}>
                        <aiVerdict.icon className={`w-7 h-7 ${
                          aiVerdict.tone === 'warn' ? 'text-orange-400'
                          : aiVerdict.tone === 'good' ? 'text-green-400'
                          : 'text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {aiVerdict.label}
                          </h3>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-white">
                              {result.aiConfidence}%
                            </div>
                            <div className="text-xs text-gray-400">AI probability</div>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {result.aiExplanation || 'AI detection analysis completed.'}
                        </p>
                        
                      
                        {result.keyIndicators && result.keyIndicators.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {result.keyIndicators.map((indicator, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        )}
                     
                        <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              result.aiConfidence >= 70 ? 'bg-orange-400' 
                              : result.aiConfidence >= 40 ? 'bg-blue-400' 
                              : 'bg-green-400'
                            }`}
                            style={{ width: `${result.aiConfidence}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {credibilityVerdict && (
                  <div className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                    credibilityVerdict.tone === 'danger' ? 'bg-red-500/10 border-red-500/30'
                    : credibilityVerdict.tone === 'warn' ? 'bg-yellow-500/10 border-yellow-500/30'
                    : credibilityVerdict.tone === 'good' ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-gray-500/10 border-gray-500/30'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                        credibilityVerdict.tone === 'danger' ? 'bg-red-500/20'
                        : credibilityVerdict.tone === 'warn' ? 'bg-yellow-500/20'
                        : credibilityVerdict.tone === 'good' ? 'bg-green-500/20'
                        : 'bg-gray-500/20'
                      }`}>
                        <credibilityVerdict.icon className={`w-7 h-7 ${
                          credibilityVerdict.tone === 'danger' ? 'text-red-400'
                          : credibilityVerdict.tone === 'warn' ? 'text-yellow-400'
                          : credibilityVerdict.tone === 'good' ? 'text-green-400'
                          : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {credibilityVerdict.label}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {credibilityVerdict.detail}
                        </p>
                        {result.overallAssessment && (
                          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                            {result.overallAssessment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

               
                {Array.isArray(result.claims) && result.claims.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      Claim Breakdown
                    </h4>
                    <div className="grid gap-3">
                      {result.claims.map((c, idx) => (
                        <div key={idx} className="bg-white/5 rounded-xl p-5 border border-white/5 hover:border-white/10 transition">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="flex-1">
                              <div className="text-gray-400 text-xs font-medium mb-1 uppercase tracking-wide">Claim {idx + 1}</div>
                              <div className="text-white font-medium leading-relaxed">{c.claim}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wide ${
                                c.verdict === 'REFUTED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                : c.verdict === 'SUPPORTED' ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              }`}>
                                {c.verdict}
                              </div>
                              {typeof c.confidence === 'number' && (
                                <div className="text-gray-400 text-xs mt-1">{c.confidence}% confidence</div>
                              )}
                            </div>
                          </div>
                          
                          {c.explanation && (
                            <div className="bg-white/5 rounded-lg p-3 mb-3">
                              <p className="text-gray-300 text-sm leading-relaxed">{c.explanation}</p>
                            </div>
                          )}
                   
                          {Array.isArray(c.topEvidence) && c.topEvidence.length > 0 && (
                            <div className="mt-3">
                              <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">Evidence Sources</div>
                              <div className="space-y-2">
                                {c.topEvidence.slice(0, 3).map((e, i) => (
                                  <a 
                                    key={i} 
                                    href={e.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-white/5 rounded-lg p-3 hover:bg-white/10 transition group"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Globe className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-cyan-300 text-sm font-medium group-hover:underline truncate">
                                          {e.title || 'Source'}
                                        </div>
                                        {e.snippet && (
                                          <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                                            {e.snippet.slice(0, 150)}{e.snippet.length > 150 ? '...' : ''}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

           
            {result && !errorMsg && activeTab === 'deepfake' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                  result.isDeepfake ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                      result.isDeepfake ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {result.isDeepfake ? <AlertCircle className="w-7 h-7" /> : <CheckCircle className="w-7 h-7" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {result.isDeepfake ? 'Deepfake Detected' : 'Video Appears Authentic'}
                      </h3>
                      <p className="text-gray-300">{result.explanation || 'Analysis completed.'}</p>
                      {typeof result.confidence === 'number' && (
                        <div className="mt-2 text-sm text-gray-400">
                          Confidence: {result.confidence}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

       
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Multi-Source Verification</h3>
            <p className="text-gray-400 text-sm">
              Cross-references claims with Wikipedia, NewsAPI, and other trusted sources.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Bot className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">AI Content Detection</h3>
            <p className="text-gray-400 text-sm">
              Identifies AI-generated text by analyzing patterns, style, and linguistic markers.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Transparent Analysis</h3>
            <p className="text-gray-400 text-sm">
              Shows evidence sources and reasoning, allowing manual verification of results.
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              How It Works
            </h3>
            <div className="max-w-3xl mx-auto text-left grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-bold mb-2">1. Extract Claims</div>
                <p className="text-gray-300 text-sm">AI identifies specific, verifiable statements from your text</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-bold mb-2">2. Gather Evidence</div>
                <p className="text-gray-300 text-sm">Searches Wikipedia, news sources, and databases for relevant info</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-cyan-400 font-bold mb-2">3. Analyze & Report</div>
                <p className="text-gray-300 text-sm">GPT-4 evaluates evidence and provides detailed verdict with sources</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              This tool assists human judgment - always verify important claims manually using provided sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}