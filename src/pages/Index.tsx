
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Play, Youtube } from "lucide-react";
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
        title: "Video uploaded",
        description: `${file.name} ready for streaming`,
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
          title: "Stream Started!",
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b-2 border-red-600 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <Youtube className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-red-600">
              Bintubot
            </h1>
          </div>
          <p className="text-center text-red-500 mt-2 text-lg">
            Stream Videos to YouTube Live
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          
          {/* YouTube Stream Key Input */}
          <div className="space-y-3">
            <Label 
              htmlFor="streamKey" 
              className="text-xl font-semibold text-red-600 flex items-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              YouTube Streaming Key
            </Label>
            <Input
              id="streamKey"
              type="password"
              placeholder="Enter your YouTube stream key..."
              value={streamKey}
              onChange={(e) => setStreamKey(e.target.value)}
              className="text-lg p-4 border-2 border-red-200 focus:border-red-600 focus:ring-red-600"
            />
            <p className="text-sm text-red-400">
              Get your stream key from YouTube Studio → Go Live → Stream
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label 
              htmlFor="videoUpload" 
              className="text-xl font-semibold text-red-600 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Video
            </Label>
            <div className="relative">
              <Input
                id="videoUpload"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="text-lg p-4 border-2 border-red-200 focus:border-red-600 file:bg-red-50 file:text-red-600 file:border-red-300 file:rounded-md file:px-4 file:py-2 file:mr-4"
              />
            </div>
            {videoFile && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 font-medium">
                  Selected: {videoFile.name}
                </p>
                <p className="text-red-500 text-sm">
                  Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            )}
          </div>

          {/* Loop Video Checkbox */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="loopVideo"
              checked={loopVideo}
              onCheckedChange={setLoopVideo}
              className="border-2 border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <Label 
              htmlFor="loopVideo" 
              className="text-xl font-semibold text-red-600 cursor-pointer"
            >
              Loop Video
            </Label>
          </div>

          {/* Stream Control Button */}
          <div className="pt-4">
            {!isStreaming ? (
              <Button
                onClick={handleStartStream}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                size="lg"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Live Stream
              </Button>
            ) : (
              <Button
                onClick={handleStopStream}
                variant="destructive"
                className="w-full bg-red-800 hover:bg-red-900 text-white text-xl font-bold py-6 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                Stop Stream
              </Button>
            )}
          </div>

          {/* Status Indicator */}
          {isStreaming && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-red-700 font-bold text-lg">LIVE</span>
              </div>
              <p className="text-red-600">Your video is streaming to YouTube Live</p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <h3 className="text-red-700 font-bold text-lg mb-3">How to use:</h3>
            <ol className="text-red-600 space-y-2 list-decimal list-inside">
              <li>Get your YouTube stream key from YouTube Studio</li>
              <li>Upload the video file you want to stream</li>
              <li>Check "Loop Video" if you want continuous streaming</li>
              <li>Click "Start Live Stream" to begin</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
