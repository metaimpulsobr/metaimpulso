import type { LandmarkItem } from '../content/brasilia'

/** A 3D render of a Brasília landmark with a small credit line. */
export default function Landmark({ item, className = '', priority = false }: { item: LandmarkItem; className?: string; priority?: boolean }) {
  return (
    <figure className={`landmark ${className}`}>
      <img
        src={item.src}
        width={item.width}
        height={item.height}
        alt={`${item.name} em 3D, em concreto branco`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      <figcaption>
        <b>{item.name}</b> · {item.credit}
      </figcaption>
    </figure>
  )
}
