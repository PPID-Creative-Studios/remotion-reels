import { CalculateMetadataFunction, Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { CleanDishub, CleanDishubProps } from './Composition';

const calculateMetadata: CalculateMetadataFunction<CleanDishubProps> = async ({ props }) => {
  const fps = 30;
  const updatedScenes = await Promise.all(
    props.scenes.map(async (scene) => {
      try {
        const detik = await getAudioDurationInSeconds(staticFile(scene.audioFile));
        return {
          ...scene,
          durasiFrame: Math.ceil(detik * fps) + 10,
        };
      } catch {
        return scene;
      }
    })
  );

  const totalFrames = updatedScenes.reduce((acc, item) => acc + item.durasiFrame, 0);

  return {
    fps,
    durationInFrames: totalFrames || 450,
    props: {
      ...props,
      scenes: updatedScenes,
    },
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CleanDishub"
      component={CleanDishub}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      calculateMetadata={calculateMetadata}
      defaultProps={{
        scenes: [
          {
            gambar: 'scene1.jpg',
            audioFile: 'adegan1.mp3',
            durasiFrame: 150,
            badge: 'EDUKASI LALU LINTAS',
            judulAtas: 'Garis Kuning Zig-Zag di Pinggir Jalan',
            potonganSubtitle: [
              'HALO WARGA DEPOK!',
              'PERNAH LIAT GARIS',
              'KUNING ZIG-ZAG',
              'DIPAKAI PARKIR?!',
            ],
            warnaAksen: '#ef4444',
          },
          {
            gambar: 'scene2.jpg',
            audioFile: 'adegan2.mp3',
            durasiFrame: 150,
            badge: 'ATURAN MARKA JALAN',
            judulAtas: 'Zona Larangan Parkir & Berhenti',
            potonganSubtitle: [
              'EITS JANGAN DITIRU!',
              'ITU ZONA LARANGAN',
              'BIAR PANDANGAN LUAS',
              'DAN GAK MACET!',
            ],
            warnaAksen: '#facc15',
          },
          {
            gambar: 'scene3.jpg',
            audioFile: 'adegan3.mp3',
            durasiFrame: 150,
            badge: 'YUK TERTIB BARENG!',
            judulAtas: 'Jaga Ketertiban Jalan Kota Depok',
            potonganSubtitle: [
              'SETUJU BANGET GIT!',
              'KELUHAN PJU & RAMBU?',
              'LANGSUNG DM',
              '@DISHUBDEPOK YA!',
            ],
            warnaAksen: '#4ade80',
          },
        ],
      }}
    />
  );
};