"use client"

import * as React from "react"
import L from "leaflet"
import { useMap } from "react-leaflet"

export type FitBoundsProps<T> = {
  items: readonly T[]
  /** Return a Leaflet latlng like [lat, lng] (or L.LatLng). Return null to skip an item. */
  getLatLng: (item: T) => L.LatLngExpression | null | undefined

  padding?: L.PointExpression
  maxZoom?: number
  animate?: boolean

  /** If true, fitBounds only once (first time it has valid bounds). */
  once?: boolean

  /** Change this value when you WANT to refit (useful if items update frequently). */
  fitKey?: string | number
}

export function FitBounds<T>({
  items,
  getLatLng,
  padding = [40, 40],
  maxZoom = 16,
  animate = true,
  once = false,
  fitKey,
}: FitBoundsProps<T>) {
  const map = useMap()
  const didFitRef = React.useRef(false)

  React.useEffect(() => {
    if (once && didFitRef.current) return

    const latlngs: L.LatLng[] = []
    for (const item of items) {
      const ll = getLatLng(item)
      if (!ll) continue

      const latLng = L.latLng(ll)
      if (!Number.isFinite(latLng.lat) || !Number.isFinite(latLng.lng)) continue

      latlngs.push(latLng)
    }

    if (latlngs.length === 0) return

    const bounds = L.latLngBounds(latlngs)
    if (!bounds.isValid()) return

    map.fitBounds(bounds, { padding, maxZoom, animate })
    didFitRef.current = true
  }, [map, items, getLatLng, padding, maxZoom, animate, once, fitKey])

  return null
}

export function latLngFromGeoJsonPoint(geom?: GeoJSON.Point | null): L.LatLngExpression | null {
  if (!geom || geom.type !== "Point") return null
  const [lng, lat] = geom.coordinates
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return [lat, lng]
}

