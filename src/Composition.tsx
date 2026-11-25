import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface CleanScene {
  gambar: string;
  audioFile: string;
  durasiFrame: number;
  badge: string;
  judulAtas: string;
  potonganSubtitle: string[];
  warnaAksen: string;
}

export interface CleanDishubProps {
  scenes: CleanScene[];
}

const AdeganBersihView: React.FC<{ scene: CleanScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const opacityFade = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const jumlahPotongan = scene.potonganSubtitle.length;
  const framePerPotongan = Math.max(1, Math.floor(durationInFrames / jumlahPotongan));
  const indeksAktif = Math.min(jumlahPotongan - 1, Math.floor(frame / framePerPotongan));
  const teksSubAktif = scene.potonganSubtitle[indeksAktif];

  const frameLokalSub = frame % framePerPotongan;
  const skalaSub = spring({
    frame: frameLokalSub,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', opacity: opacityFade }}>
      <Audio src={staticFile(scene.audioFile)} />

      <Img
        src={staticFile(scene.gambar)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.05) 35%, rgba(15,23,42,0.05) 68%, rgba(15,23,42,0.88) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '155px',
          left: '56px',
          right: '56px',
        }}
      >
        <span
          style={{
            backgroundColor: scene.warnaAksen,
            color: '#0f172a',
            fontWeight: 900,
            fontSize: '24px',
            padding: '8px 24px',
            borderRadius: '999px',
            display: 'inline-block',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
          }}
        >
          {scene.badge}
        </span>

        <h1
          style={{
            fontSize: '48px',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.2,
            marginTop: '18px',
            marginBottom: 0,
            textShadow: '0 4px 16px rgba(0,0,0,0.85)',
          }}
        >
          {scene.judulAtas}
        </h1>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '230px',
          left: '48px',
          right: '48px',
          textAlign: 'center',
          transform: `scale(${interpolate(skalaSub, [0, 1], [0.85, 1])})`,
        }}
      >
        <div
          style={{
            fontSize: '62px',
            fontWeight: 900,
            color: '#ffffff',
            textTransform: 'uppercase',
            lineHeight: 1.15,
            WebkitTextStroke: '3px #0f172a',
            textShadow: '0 8px 0 #0f172a, 0 14px 28px rgba(0,0,0,0.9)',
          }}
        >
          {teksSubAktif}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CleanDishub: React.FC<CleanDishubProps> = ({ scenes }) => {
  let frameBerjalan = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a', fontFamily: 'sans-serif' }}>
      {scenes.map((scene, idx) => {
        const start = frameBerjalan;
        frameBerjalan += scene.durasiFrame;

        return (
          <Sequence key={idx} from={start} durationInFrames={scene.durasiFrame}>
            <AdeganBersihView scene={scene} />
          </Sequence>
        );
      })}

      <div
        style={{
          position: 'absolute',
          top: '64px',
          left: '56px',
          right: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid rgba(255,255,255,0.2)',
          paddingBottom: '18px',
        }}
      >
        <span style={{ fontSize: '28px', fontWeight: 900, color: '#facc15', letterSpacing: '1px' }}>
          PPID DISHUB KOTA DEPOK
        </span>
        <span style={{ fontSize: '24px', color: '#f8fafc', fontWeight: 700 }}>
          @dishubdepok
        </span>
      </div>
    </AbsoluteFill>
  );
};