"use client"
import React, { useState, useRef } from 'react';
import { Upload, FileText, Video, AlertCircle, CheckCircle, Loader2, Shield, Sparkles, Eye, Zap, Globe, Cpu, Brain, ArrowRight } from 'lucide-react';
import { analyzeNews as analyzeNewsAPI, analyzeVideo as analyzeVideoAPI } from '@/lib/api';

export default function TruthDetector() {
  const [activeTab, setActiveTab] = useState('news');
  const [newsText, setNewsText] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const handleNewsAnalysis = async () => {
    if (!newsText.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const data = await analyzeNewsAPI(newsText);
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        type: 'news',
        isFake: false,
        confidence: 0,
        details: {
          error: 'Backend connection failed',
          status: 'Check if server is running on port 5000'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoAnalysis = async () => {
    if (!videoFile) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const data = await analyzeVideoAPI(videoFile);
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        type: 'video',
        isDeepfake: false,
        confidence: 0,
        details: {
          error: 'Backend connection failed',
          status: 'Check if server is running on port 5000'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setResult(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  fake newss AI
                </h1>
                <p className="text-gray-400 text-sm font-light">Advanced Truth Detection System</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-gray-300">Powered by Advanced AI Models</span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
            Detect <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Misinformation</span>
            <br />
            in Real-Time
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Advanced AI-powered detection for fake news articles and deepfake videos. 
            Protect yourself from digital deception.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Panel */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8">
              <button
                onClick={() => { setActiveTab('news'); setResult(null); }}
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
                onClick={() => { setActiveTab('deepfake'); setResult(null); }}
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

            {/* Input Content */}
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
                        Analyze Authenticity
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
                    Supports MP4, AVI, MOV • Max 50MB
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

          {/* Results Panel */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-white mb-6">
              <Globe className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold">Analysis Results</h3>
            </div>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                <div className="w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 opacity-30" />
                </div>
                <p className="text-lg mb-2">Awaiting Analysis</p>
                <p className="text-sm text-center max-w-sm">
                  {activeTab === 'news' 
                    ? 'Paste text content and click analyze to verify authenticity'
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
                <p className="text-gray-400 text-sm">
                  {activeTab === 'news' 
                    ? 'Scanning for misinformation patterns...'
                    : 'Processing video frames for deepfake indicators...'
                  }
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in duration-500">
                {/* Main Result Card */}
                <div className={`p-6 rounded-2xl border-2 backdrop-blur-sm ${
                  (result.type === 'news' && result.isFake) || (result.type === 'video' && result.isDeepfake)
                    ? 'bg-red-500/10 border-red-500/30'
                    : result.confidence === 0
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                      (result.type === 'news' && result.isFake) || (result.type === 'video' && result.isDeepfake)
                        ? 'bg-red-500/20 text-red-400'
                        : result.confidence === 0
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {(result.type === 'news' && result.isFake) || (result.type === 'video' && result.isDeepfake) ? (
                        <AlertCircle className="w-7 h-7" />
                      ) : result.confidence === 0 ? (
                        <AlertCircle className="w-7 h-7" />
                      ) : (
                        <CheckCircle className="w-7 h-7" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {result.confidence === 0 
                          ? 'Analysis Error'
                          : result.type === 'news'
                            ? (result.isFake ? 'Potential Misinformation' : 'Content Appears Authentic')
                            : (result.isDeepfake ? 'Deepfake Detected' : 'Video Appears Authentic')
                        }
                      </h3>
                      <p className="text-gray-300">
                        {result.confidence === 0 
                          ? 'Please check backend connection'
                          : `Confidence: ${result.confidence}%`
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                {result.details && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white text-lg">Detailed Analysis</h4>
                    <div className="grid gap-3">
                      {Object.entries(result.details).map(([key, value]) => (
                        <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 capitalize font-medium">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              value === 'High' || value === 'Suspicious' || value === 'Mismatched' || 
                              value === 'Inconsistent' || value === 'Unverified' || value === 'Questionable' || value === 'error'
                                ? 'bg-red-500/20 text-red-400'
                                : value === 'Check if server is running on port 5000' || value === 'status'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Advanced NLP</h3>
            <p className="text-gray-400 text-sm">
              Natural Language Processing analyzes emotional patterns, source credibility, and claim verification.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">CNN Technology</h3>
            <p className="text-gray-400 text-sm">
              Convolutional Neural Networks detect facial inconsistencies and video manipulation patterns.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Real-Time Analysis</h3>
            <p className="text-gray-400 text-sm">
              Get instant results with detailed confidence scores and comprehensive breakdowns.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Verify Your Content?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join the fight against misinformation. Our AI-powered platform helps you distinguish truth from deception in both text and video content.
            </p>
            <button className="group bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2">
              Start Analyzing
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}