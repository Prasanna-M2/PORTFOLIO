import { useEffect, useRef, useState } from "react";
import ElasticSlider from "./ElasticSlider";

interface AudioPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer = ({
  src,
  title = "Let's Celebrate Together",
  subtitle = "Dude (Movie OST)",
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("durationchange", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("durationchange", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio playback failed:", err);
      }
    }
  };

  const handleSeek = (nextTime: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="w-full max-w-xs bg-[#1414149c] border border-[var(--white-icon-tr)] rounded-2xl p-4 space-y-3 text-[var(--white)]">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{title}</p>
          <p className="text-xs text-[var(--sec)] truncate">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          className="size-10 shrink-0 flex items-center justify-center rounded-full bg-[var(--sec)] text-[#101010] hover:opacity-90 active:scale-95 transition"
        >
          {isPlaying ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5 ml-0.5"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      <div className="space-y-1">
        <ElasticSlider
          ariaLabel="Playback position"
          value={currentTime}
          startingValue={0}
          maxValue={duration > 0 ? duration : 100}
          stepSize={0.5}
          isStepped={false}
          leftIcon={null}
          rightIcon={null}
          valuePosition="none"
          thumb={true}
          thickness={5}
          activeThickness={8}
          maxStretch={14}
          rangeColor="#a476ff"
          trackColor="rgba(255, 255, 255, 0.14)"
          thumbColor="#ffffff"
          restOpacity={0.95}
          onChange={handleSeek}
          className="!w-full"
        />
        <div className="flex justify-between text-[11px] text-[var(--white-icon)] tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="pt-1 border-t border-[#ffffff10] flex items-center justify-between gap-2">
        <ElasticSlider
          ariaLabel="Volume"
          value={volume}
          startingValue={0}
          maxValue={100}
          valuePosition="bubble"
          thickness={5}
          activeThickness={10}
          maxStretch={24}
          rangeColor="#a476ff"
          iconColor="#dfdfdf"
          trackColor="rgba(255, 255, 255, 0.14)"
          onChange={setVolume}
          className="!w-full"
        />
      </div>
    </div>
  );
};

export default AudioPlayer;

