'use client';

import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * Background Music System for Audio Tours
 * نظام الموسيقى الخلفية للجولات الصوتية
 * 
 * Uses Web Audio API to:
 * - Play ambient background music matching tour mood
 * - Auto-duck volume during narration (volume ducking)
 * - Crossfade between tracks
 * - Loop seamlessly
 * 
 * Music is generated programmatically using oscillators and filters
 * for a royalty-free, zero-dependency solution.
 */

export type MusicMood = 'heritage' | 'modern' | 'nature' | 'cultural' | 'none';

interface BackgroundMusicConfig {
    mood: MusicMood;
    baseVolume?: number;         // 0.0 - 1.0, default 0.25
    duckedVolume?: number;       // Volume during narration, default 0.08
    fadeDuration?: number;       // Fade in/out duration in seconds, default 2
}

interface UseBackgroundMusicReturn {
    isPlaying: boolean;
    isMuted: boolean;
    currentMood: MusicMood;
    volume: number;
    startMusic: (config: BackgroundMusicConfig) => void;
    stopMusic: () => void;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    duckVolume: () => void;       // Lower volume for narration
    restoreVolume: () => void;    // Restore volume after narration
    changeMood: (mood: MusicMood) => void;
}

// ─── Programmatic Ambient Music Generator ───
// Generates ambient music using Web Audio API oscillators
// This provides royalty-free background music without any external files

function createHeritageMusic(ctx: AudioContext, gainNode: GainNode) {
    // Arabic-inspired ambient: Oud-like drone with gentle harmonics
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(gainNode);

    // Base drone (D note - common in Arabic music)
    const drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = 146.83; // D3
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.15;
    drone.connect(droneGain);
    droneGain.connect(masterGain);

    // Fifth harmony
    const fifth = ctx.createOscillator();
    fifth.type = 'sine';
    fifth.frequency.value = 220; // A3
    const fifthGain = ctx.createGain();
    fifthGain.gain.value = 0.08;
    fifth.connect(fifthGain);
    fifthGain.connect(masterGain);

    // Warm pad with filter
    const pad = ctx.createOscillator();
    pad.type = 'sawtooth';
    pad.frequency.value = 293.66; // D4
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 400;
    padFilter.Q.value = 2;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.04;
    pad.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(masterGain);

    // Slow LFO for gentle movement
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);

    drone.start();
    fifth.start();
    pad.start();
    lfo.start();

    return { oscillators: [drone, fifth, pad, lfo], gains: [droneGain, fifthGain, padGain] };
}

function createModernMusic(ctx: AudioContext, gainNode: GainNode) {
    // Electronic ambient: Soft synth pads
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(gainNode);

    // Deep bass pad
    const bass = ctx.createOscillator();
    bass.type = 'sine';
    bass.frequency.value = 65.41; // C2
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.12;
    bass.connect(bassGain);
    bassGain.connect(masterGain);

    // Ambient pad chord (C major 7)
    const notes = [130.81, 164.81, 196.0, 246.94]; // C3, E3, G3, B3
    const oscNodes: OscillatorNode[] = [bass];
    const gainNodes: GainNode[] = [bassGain];

    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        const g = ctx.createGain();
        g.gain.value = 0.04;
        osc.connect(filter);
        filter.connect(g);
        g.connect(masterGain);
        oscNodes.push(osc);
        gainNodes.push(g);

        // Gentle detuning for warmth
        const detuneLfo = ctx.createOscillator();
        detuneLfo.type = 'sine';
        detuneLfo.frequency.value = 0.1 + (i * 0.03);
        const detuneGain = ctx.createGain();
        detuneGain.gain.value = 3;
        detuneLfo.connect(detuneGain);
        detuneGain.connect(osc.detune);
        detuneLfo.start();
        oscNodes.push(detuneLfo);
    });

    oscNodes.forEach(o => o.start());

    return { oscillators: oscNodes, gains: gainNodes };
}

function createNatureMusic(ctx: AudioContext, gainNode: GainNode) {
    // Nature ambient: Wind-like noise with soft tonal elements
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.2;
    masterGain.connect(gainNode);

    // Wind noise (filtered white noise)
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 0.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.06;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    // Wind modulation
    const windLfo = ctx.createOscillator();
    windLfo.type = 'sine';
    windLfo.frequency.value = 0.08;
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.value = 400;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(noiseFilter.frequency);

    // Gentle nature tone (pentatonic)
    const tone = ctx.createOscillator();
    tone.type = 'sine';
    tone.frequency.value = 329.63; // E4
    const toneFilter = ctx.createBiquadFilter();
    toneFilter.type = 'lowpass';
    toneFilter.frequency.value = 500;
    const toneGain = ctx.createGain();
    toneGain.gain.value = 0.03;
    tone.connect(toneFilter);
    toneFilter.connect(toneGain);
    toneGain.connect(masterGain);

    noise.start();
    windLfo.start();
    tone.start();

    return { oscillators: [windLfo, tone], gains: [noiseGain, toneGain], bufferSources: [noise] };
}

function createCulturalMusic(ctx: AudioContext, gainNode: GainNode) {
    // Cultural/Market: Rhythmic warmth with Arabic scale
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(gainNode);

    // Arabic Maqam Bayati drone (D, Eb quarter-flat, F, G)
    const drone = ctx.createOscillator();
    drone.type = 'triangle';
    drone.frequency.value = 146.83; // D3
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.1;
    drone.connect(droneGain);
    droneGain.connect(masterGain);

    // Fourth
    const fourth = ctx.createOscillator();
    fourth.type = 'sine';
    fourth.frequency.value = 196.0; // G3
    const fourthGain = ctx.createGain();
    fourthGain.gain.value = 0.06;
    fourth.connect(fourthGain);
    fourthGain.connect(masterGain);

    // Warm texture
    const texture = ctx.createOscillator();
    texture.type = 'sawtooth';
    texture.frequency.value = 293.66;
    const textureFilter = ctx.createBiquadFilter();
    textureFilter.type = 'lowpass';
    textureFilter.frequency.value = 350;
    const textureGain = ctx.createGain();
    textureGain.gain.value = 0.03;
    texture.connect(textureFilter);
    textureFilter.connect(textureGain);
    textureGain.connect(masterGain);

    // Gentle wobble for life
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.2;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(drone.frequency);

    drone.start();
    fourth.start();
    texture.start();
    lfo.start();

    return { oscillators: [drone, fourth, texture, lfo], gains: [droneGain, fourthGain, textureGain] };
}

// ─── Main Hook ───

export function useBackgroundMusic(): UseBackgroundMusicReturn {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const activeNodesRef = useRef<{
        oscillators: OscillatorNode[];
        gains: GainNode[];
        bufferSources?: AudioBufferSourceNode[];
    } | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentMood, setCurrentMood] = useState<MusicMood>('none');
    const [volume, setVolumeState] = useState(0.25);

    const baseVolumeRef = useRef(0.25);
    const duckedVolumeRef = useRef(0.08);
    const fadeDurationRef = useRef(2);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAllNodes();
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, []);

    const stopAllNodes = useCallback(() => {
        if (activeNodesRef.current) {
            activeNodesRef.current.oscillators.forEach(osc => {
                try { osc.stop(); } catch { /* already stopped */ }
            });
            activeNodesRef.current.bufferSources?.forEach(bs => {
                try { bs.stop(); } catch { /* already stopped */ }
            });
            activeNodesRef.current = null;
        }
    }, []);

    const getOrCreateContext = useCallback(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new AudioContext();
            masterGainRef.current = audioCtxRef.current.createGain();
            masterGainRef.current.gain.value = baseVolumeRef.current;
            masterGainRef.current.connect(audioCtxRef.current.destination);
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return { ctx: audioCtxRef.current, gain: masterGainRef.current! };
    }, []);

    const startMusic = useCallback((config: BackgroundMusicConfig) => {
        if (config.mood === 'none') return;

        // Stop existing music
        stopAllNodes();

        const { ctx, gain } = getOrCreateContext();

        baseVolumeRef.current = config.baseVolume ?? 0.25;
        duckedVolumeRef.current = config.duckedVolume ?? 0.08;
        fadeDurationRef.current = config.fadeDuration ?? 2;

        // Fade in
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(
            baseVolumeRef.current,
            ctx.currentTime + fadeDurationRef.current
        );

        // Create music based on mood
        let nodes;
        switch (config.mood) {
            case 'heritage':
                nodes = createHeritageMusic(ctx, gain);
                break;
            case 'modern':
                nodes = createModernMusic(ctx, gain);
                break;
            case 'nature':
                nodes = createNatureMusic(ctx, gain);
                break;
            case 'cultural':
                nodes = createCulturalMusic(ctx, gain);
                break;
            default:
                return;
        }

        activeNodesRef.current = nodes;
        setCurrentMood(config.mood);
        setIsPlaying(true);
        setVolumeState(baseVolumeRef.current);
        setIsMuted(false);
    }, [stopAllNodes, getOrCreateContext]);

    const stopMusic = useCallback(() => {
        if (!audioCtxRef.current || !masterGainRef.current) return;

        const ctx = audioCtxRef.current;
        const gain = masterGainRef.current;

        // Fade out
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeDurationRef.current);

        // Stop after fade
        setTimeout(() => {
            stopAllNodes();
            setIsPlaying(false);
            setCurrentMood('none');
        }, fadeDurationRef.current * 1000);
    }, [stopAllNodes]);

    const toggleMute = useCallback(() => {
        if (!masterGainRef.current || !audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const gain = masterGainRef.current;

        if (isMuted) {
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(baseVolumeRef.current, ctx.currentTime + 0.3);
            setIsMuted(false);
        } else {
            gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
            setIsMuted(true);
        }
    }, [isMuted]);

    const setVolume = useCallback((vol: number) => {
        const clamped = Math.max(0, Math.min(1, vol));
        baseVolumeRef.current = clamped;
        setVolumeState(clamped);
        if (masterGainRef.current && audioCtxRef.current && !isMuted) {
            masterGainRef.current.gain.setValueAtTime(
                masterGainRef.current.gain.value,
                audioCtxRef.current.currentTime
            );
            masterGainRef.current.gain.linearRampToValueAtTime(
                clamped,
                audioCtxRef.current.currentTime + 0.2
            );
        }
    }, [isMuted]);

    const duckVolume = useCallback(() => {
        if (!masterGainRef.current || !audioCtxRef.current || isMuted) return;
        const ctx = audioCtxRef.current;
        const gain = masterGainRef.current;

        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(duckedVolumeRef.current, ctx.currentTime + 0.5);
    }, [isMuted]);

    const restoreVolume = useCallback(() => {
        if (!masterGainRef.current || !audioCtxRef.current || isMuted) return;
        const ctx = audioCtxRef.current;
        const gain = masterGainRef.current;

        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(baseVolumeRef.current, ctx.currentTime + 1.0);
    }, [isMuted]);

    const changeMood = useCallback((mood: MusicMood) => {
        if (mood === currentMood) return;
        if (mood === 'none') {
            stopMusic();
            return;
        }
        startMusic({
            mood,
            baseVolume: baseVolumeRef.current,
            duckedVolume: duckedVolumeRef.current,
            fadeDuration: fadeDurationRef.current,
        });
    }, [currentMood, startMusic, stopMusic]);

    return {
        isPlaying,
        isMuted,
        currentMood,
        volume,
        startMusic,
        stopMusic,
        toggleMute,
        setVolume,
        duckVolume,
        restoreVolume,
        changeMood,
    };
}
