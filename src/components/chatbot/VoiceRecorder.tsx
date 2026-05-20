import { useState, useEffect, useRef } from "react";
import { Mic, Square } from "lucide-react";

export function VoiceRecorder({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Optimized for Indian English and Hindi accents

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join("");
        
        // We only send the final result to the chat input
        // but we could potentially show interim results too.
        // For simplicity, we'll let the user see their words via the browser's own UI if applicable
        // or just wait for the final result.
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [onTranscription]);

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        
        // Custom handling for capturing words
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            onTranscription(finalTranscript);
          }
        };
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-3 rounded-full transition-all ${
        isRecording 
          ? "bg-red-500/10 text-red-600 border border-red-200" 
          : "bg-secondary text-primary hover:bg-secondary/80 border border-border"
      } relative group shadow-sm`}
      title={isRecording ? "Stop Listening" : "Speak (English/Hindi)"}
    >
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-red-400/20 animate-ping" />
      )}
      <div className="relative z-10 transition-transform group-hover:scale-110">
        {isRecording ? (
          <Square size={20} className="fill-current" />
        ) : (
          <Mic size={20} />
        )}
      </div>
    </button>
  );
}
