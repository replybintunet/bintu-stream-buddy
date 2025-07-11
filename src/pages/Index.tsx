
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Play, Youtube, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [streamKey, setStreamKey] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loopVideo, setLoopVideo] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoFile(file);
      toast({
        title: "Video uploaded successfully",
        description: `${file.name} is ready for streaming`,
      });
    }
  };

  const handleStartStream = async () => {
    if (!streamKey.trim()) {
      toast({
        title: "Missing Stream Key",
        description: "Please enter your YouTube streaming key",
        variant: "destructive",
      });
      return;
    }

    if (!videoFile) {
      toast({
        title: "No Video Selected",
        description: "Please upload a video file to stream",
        variant: "destructive",
      });
      return;
    }

    setIsStreaming(true);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('streamKey', streamKey);
    formData.append('loop', loopVideo.toString());

    try {
      const response = await fetch('/api/start-stream', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Stream Started Successfully!",
          description: "Your video is now streaming to YouTube Live",
        });
      } else {
        throw new Error('Failed to start stream');
      }
    } catch (error) {
      toast({
        title: "Stream Error",
        description: "Failed to start the live stream. Please check your settings.",
        variant: "destructive",
      });
      setIsStreaming(false);
    }
  };

  const handleStopStream = async () => {
    try {
      await fetch('/api/stop-stream', { method: 'POST' });
      setIsStreaming(false);
      toast({
        title: "Stream Stopped",
        description: "Your live stream has been ended",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to stop the stream",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-red-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-red-600 rounded-2xl shadow-lg">
              <Youtube className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Bintubot
              </h1>
              <p className="text-red-500 mt-1 text-lg font-medium">
                Professional YouTube Live Streaming
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-red-100 p-8 md:p-12">
          <div className="space-y-10">
            
            {/* YouTube Stream Key Input */}
            <div className="space-y-4">
              <Label 
                htmlFor="streamKey" 
                className="text-xl font-bold text-red-700 flex items-center gap-3"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                YouTube Streaming Key
              </Label>
              <Input
                id="streamKey"
                type="password"
                placeholder="Enter your YouTube stream key..."
                value={streamKey}
                onChange={(e) => setStreamKey(e.target.value)}
                className="text-lg p-6 border-2 border-red-200 focus:border-red-500 focus:ring-red-500 rounded-xl bg-white/50 backdrop-blur-sm transition-all duration-200"
              />
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600 font-medium">
                  💡 Get your stream key from YouTube Studio → Go Live → Stream
                </p>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <Label 
                htmlFor="videoUpload" 
                className="text-xl font-bold text-red-700 flex items-center gap-3"
              >
                <div className="p-2 bg-red-100 rounded-lg">
                  <Upload className="w-5 h-5 text-red-600" />
                </div>
                Upload Video
              </Label>
              <div className="relative">
                <Input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="text-lg p-6 border-2 border-red-200 focus:border-red-500 rounded-xl bg-white/50 backdrop-blur-sm file:bg-red-100 file:text-red-700 file:border-red-300 file:rounded-lg file:px-6 file:py-3 file:mr-4 file:font-medium hover:file:bg-red-200 transition-all duration-200"
                />
              </div>
              {videoFile && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Zap className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-red-800 font-bold text-lg">
                        {videoFile.name}
                      </p>
                      <p className="text-red-600 text-sm font-medium">
                        Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Loop Video Checkbox */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <Checkbox
                  id="loopVideo"
                  checked={loopVideo}
                  onCheckedChange={(checked) => setLoopVideo(checked === true)}
                  className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 w-5 h-5"
                />
                <Label 
                  htmlFor="loopVideo" 
                  className="text-xl font-bold text-red-700 cursor-pointer flex-1"
                >
                  Loop Video Continuously
                </Label>
              </div>
              <p className="text-sm text-red-600 mt-2 ml-9">
                Keep streaming the same video repeatedly
              </p>
            </div>

            {/* Stream Control Button */}
            <div className="pt-6">
              {!isStreaming ? (
                <Button
                  onClick={handleStartStream}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xl font-bold py-8 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  size="lg"
                >
                  <Play className="w-8 h-8 mr-4" />
                  Start Live Stream
                </Button>
              ) : (
                <Button
                  onClick={handleStopStream}
                  variant="destructive"
                  className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-red-950 text-white text-xl font-bold py-8 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                  size="lg"
                >
                  <div className="w-6 h-6 bg-white rounded-sm mr-4"></div>
                  Stop Stream
                </Button>
              )}
            </div>

            {/* Status Indicator */}
            {isStreaming && (
              <div className="bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-2xl p-8 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-red-800 font-bold text-2xl">LIVE</span>
                </div>
                <p className="text-red-700 font-semibold text-lg">Your video is streaming to YouTube Live</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm border border-red-200 rounded-2xl p-8 mt-8">
          <h3 className="text-red-800 font-bold text-2xl mb-6 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Youtube className="w-6 h-6 text-red-600" />
            </div>
            Quick Start Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <p className="text-red-700 font-medium">Get your YouTube stream key from YouTube Studio</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <p className="text-red-700 font-medium">Upload the video file you want to stream</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <p className="text-red-700 font-medium">Enable "Loop Video" for continuous streaming</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                <p className="text-red-700 font-medium">Click "Start Live Stream" to begin broadcasting</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
