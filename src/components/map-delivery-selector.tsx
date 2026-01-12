"use client";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

type DeliveryLocation = {
  latitude: number;
  longitude: number;
  addressLabel?: string;
  deliveryMethod: "bodaboda" | "courier";
};

export function MapDeliverySelector({
  deliveryMethod,
  value,
  onConfirm,
  onChange,
}: {
  deliveryMethod: "bodaboda" | "courier";
  value?: DeliveryLocation | null;
  onConfirm: (loc: DeliveryLocation) => void;
  onChange?: (loc: DeliveryLocation) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const [current, setCurrent] = useState<DeliveryLocation>(() => {
    const savedRaw = typeof window !== "undefined" ? localStorage.getItem("deliveryLocation") : null;
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw) as DeliveryLocation;
        return {
          latitude: saved.latitude,
          longitude: saved.longitude,
          addressLabel: saved.addressLabel,
          deliveryMethod,
        };
      } catch {}
    }
    return {
      latitude: -1.286389,
      longitude: 36.817223,
      deliveryMethod,
    };
  });
  const initial = useRef<DeliveryLocation>(current);
  const onChangeRef = useRef<typeof onChange | undefined>(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let disposed = false;
    async function init() {
      const L = await import("leaflet");
      if (!containerRef.current || disposed) return;
      const map = L.map(containerRef.current, {
        center: [initial.current.latitude, initial.current.longitude],
        zoom: 14,
        zoomControl: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);
      const icon = L.divIcon({
        className: "rounded-full bg-[color:var(--champagne-gold)] text-white text-xs flex items-center justify-center",
        html: '<div style="width:26px;height:26px;border-radius:9999px;display:flex;align-items:center;justify-content:center">◎</div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });
      const marker = L.marker([initial.current.latitude, initial.current.longitude], {
        draggable: true,
        icon,
      }).addTo(map);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        const loc = {
          latitude: pos.lat,
          longitude: pos.lng,
          addressLabel: initial.current.addressLabel,
          deliveryMethod: initial.current.deliveryMethod,
        };
        setCurrent(loc);
        onChangeRef.current?.(loc);
      });
      map.on("click", (e: LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        const loc = {
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
          addressLabel: initial.current.addressLabel,
          deliveryMethod: initial.current.deliveryMethod,
        };
        setCurrent(loc);
        onChangeRef.current?.(loc);
      });
      mapRef.current = map;
      markerRef.current = marker;
      setReady(true);
    }
    init();
    return () => {
      disposed = true;
      const map = mapRef.current;
      if (map) {
        map.off();
        map.remove();
      }
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    setCurrent((prev) => ({
      ...prev,
      deliveryMethod,
    }));
  }, [deliveryMethod]);

  useEffect(() => {
    if (value) {
      setCurrent(value);
      if (mapRef.current && markerRef.current) {
        markerRef.current.setLatLng([value.latitude, value.longitude]);
        mapRef.current.setView([value.latitude, value.longitude], 16);
      }
    }
  }, [value]);

  const useMyLocation = () => {
    setGeolocationError(null);
    if (!navigator.geolocation) {
      setGeolocationError("Geolocation is not supported on this device.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = {
          latitude,
          longitude,
          addressLabel: "My current location",
          deliveryMethod: initial.current.deliveryMethod,
        };
        setCurrent(loc);
        onChangeRef.current?.(loc);
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
          mapRef.current.setView([latitude, longitude], 16);
        }
      },
      (error) => {
        setGeolocationError(error.message || "Permission denied or unavailable.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const confirm = () => {
    const loc = {
      latitude: current.latitude,
      longitude: current.longitude,
      addressLabel: current.addressLabel,
      deliveryMethod,
    };
    localStorage.setItem("deliveryLocation", JSON.stringify(loc));
    onConfirm(loc);
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Drop the pin or use your current location. We use your location only to deliver your order accurately.
      </div>
      <div
        ref={containerRef}
        className="w-full h-[320px] rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-black"
      />
      <div className="flex items-center gap-3">
        <button
          onClick={useMyLocation}
          className="rounded-full px-4 py-2 border border-black/10 dark:border-white/10"
        >
          Use my current location
        </button>
        <button
          onClick={confirm}
          className="rounded-full px-4 py-2 bg-[color:var(--champagne-gold)] text-white"
        >
          Confirm location
        </button>
        {ready && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Selected: {current.latitude.toFixed(5)}, {current.longitude.toFixed(5)}
          </div>
        )}
      </div>
      {geolocationError && (
        <div className="text-sm text-red-600">{geolocationError}</div>
      )}
    </div>
  );
}
