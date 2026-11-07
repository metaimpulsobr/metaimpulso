// Brasília landmarks rendered in 3D (white concrete): Museu Nacional in the home and Raio-X heroes,
// Catedral in the service page heroes. More scenes live in design/3d for social posts and other pieces.
// Renders: public/3d (source scenes in design/3d). Public-space architecture may be freely
// depicted (Lei 9.610/98, art. 48); captions credit the architect, never imply endorsement.

export interface LandmarkItem {
  src: string
  width: number
  height: number
  name: string
  credit: string
}

export const LANDMARKS = {
  museu: { src: '/3d/museu.webp', width: 1011, height: 738, name: 'Museu Nacional da República', credit: 'Oscar Niemeyer, 2006' },
  catedral: { src: '/3d/catedral.webp', width: 900, height: 732, name: 'Catedral de Brasília', credit: 'Oscar Niemeyer, 1970' },
} satisfies Record<string, LandmarkItem>
