// Brasília landmarks rendered in 3D (white concrete) for each section of the site.
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
  ponte: { src: '/3d/ponte.webp', width: 1500, height: 661, name: 'Ponte JK', credit: 'Alexandre Chan, 2002' },
  congresso: { src: '/3d/congresso.webp', width: 1400, height: 1020, name: 'Congresso Nacional', credit: 'Oscar Niemeyer, 1960' },
  esplanada: { src: '/3d/esplanada.webp', width: 1200, height: 789, name: 'Esplanada dos Ministérios', credit: 'Oscar Niemeyer' },
  planalto: { src: '/3d/planalto.webp', width: 1400, height: 524, name: 'Palácio do Planalto', credit: 'Oscar Niemeyer, 1960' },
  itamaraty: { src: '/3d/itamaraty.webp', width: 1100, height: 729, name: 'Palácio Itamaraty', credit: 'Oscar Niemeyer, 1970' },
  catedral: { src: '/3d/catedral.webp', width: 900, height: 732, name: 'Catedral de Brasília', credit: 'Oscar Niemeyer, 1970' },
  plano: { src: '/3d/plano.webp', width: 1200, height: 879, name: 'Plano Piloto', credit: 'Lúcio Costa, 1957' },
  alvorada: { src: '/3d/alvorada.webp', width: 1400, height: 522, name: 'Palácio da Alvorada', credit: 'Oscar Niemeyer, 1958' },
} satisfies Record<string, LandmarkItem>
