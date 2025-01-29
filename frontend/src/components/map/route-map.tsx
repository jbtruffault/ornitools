'use client';

import dynamic from 'next/dynamic';
import { addDays } from 'date-fns';
import { useList } from '@refinedev/core';
import { useEffect, useState, FC } from 'react';
import { PositionSelecter, PositionSelecter_LandingPage } from './position-selecter';

import { useMap } from "react-leaflet";
import L from "leaflet";
import { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "@raruto/leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

declare module "leaflet" {
  interface MapOptions {
    gestureHandling?: boolean;
    gestureHandlingOptions?: {
      text?: {
        touch?: string;
        scroll?: string;
        scrollMac?: string;
      };
      locale?: string;
      duration?: number;
    };
  }
}

if (typeof window !== "undefined") {
  (window as any).L = L;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@raruto/leaflet-gesture-handling");
  L.Map.addInitHook("addHandler", "gestureHandling", (L as any).GestureHandling);
}   

// Dynamically import MapContainer with no SSR: avoid webpack error "ReferenceError: window is not defined"
const DynamicMap = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false }) as typeof import('react-leaflet').Circle;
const Tooltip = dynamic(() => import('react-leaflet').then(mod => mod.Tooltip), { ssr: false });

interface DateRange {
  from?: Date;
  to?: Date;
}

const MapController = () => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.options.gestureHandling = true;
    }
  }, [map]);

  return null;
};

interface MapProps {
  positionsByBird: Record<string, { coords: [number, number]; timestamp: string, color: string }[]>;
}

export const MapComponent: FC<MapProps> = ({ positionsByBird }) => {
  if (typeof window === 'undefined') return null; // Empêche le rendu côté serveur
  
  return (
    <DynamicMap
      key="dynamic-map"
      center={[47.71,0.53] as LatLngExpression}
      zoom={6}
      gestureHandling={true}
      
      className="absolute top-0 left-0 z-0 h-full w-full relative"
      preferCanvas={true}
    >
      <MapController />
      <TileLayer
        //attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(positionsByBird).map(([birdName, positions], index) => {
        console.log(positions)
        const lineColor = positions[0]?.color || '#000080';
        return (
          <div key={index}>
            <Polyline
              positions={positions.map(pos => pos.coords)}
              pathOptions={{ color: lineColor }}
            />
            {/*
            {positions.map((pos, idx) => (
              <Circle
                key={`${birdName}-${idx}`}
                center={pos.coords}
                //pathOptions={{ fillColor: 'black' }}
                pathOptions={{ color: lineColor }}
                radius={300}
              >
                <Tooltip>
                  <div>
                    <strong>Bird:</strong> {birdName} <br />
                    <strong>Timestamp:</strong> {new Date(pos.timestamp).toLocaleString()}<br />
                    <strong>Coords:</strong> {pos.coords}
                  </div>
                </Tooltip>
              </Circle>
            ))}
            */}
          </div>
        );
      })}
    </DynamicMap>
  );
};

export const useRouteMap = () => {
  const [positionsByBird, setPositionsByBird] = useState<
      Record<string, { coords: [number, number]; timestamp: string; color: string }[]>
    >({});
  const [selectedBirds, setSelectedBirds] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<{ from: Date; to: Date }>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });

  const handleBirdSelectionChange = () => {
    const storedSelection = localStorage.getItem('selectedBirds');
    if (storedSelection) {
      const parsedSelection = JSON.parse(storedSelection);
      if (Array.isArray(parsedSelection)) {
        const selectedBirds = parsedSelection.map((item: { id: string }) => item.id);
        setSelectedBirds((prev) => {
          const isEqual =
            prev.length === selectedBirds.length &&
            prev.every((id, index) => id === selectedBirds[index]);
          return isEqual ? prev : selectedBirds; // Ne change que si nécessaire
        });
      }
    }
  };

  const handleDateSelectionChange = (dates: DateRange) => {
    setSelectedDates({
      from: dates.from ?? new Date(),
      to: dates.to ?? new Date(),
    });
  };

  const { data: positionList, refetch: positionListRefetch } = useList({
    resource: 'gps_position',
    filters: selectedBirds.length > 0 ? [
      { field: 'gps_file__bird', operator: 'in', value: selectedBirds },
      { field: 'timestamp', operator: 'gte', value: selectedDates.from },
      { field: 'timestamp', operator: 'lte', value: selectedDates.to },
    ] : [],
  });

  const { data: birdList } = useList({ resource: 'bird' });

  useEffect(() => {
    handleBirdSelectionChange();
    positionListRefetch();
  }, []);

  useEffect(() => {
    positionListRefetch()
    if (positionList?.data?.length && birdList?.data?.length) {
      const birdData = birdList.data.reduce((acc, bird) => {
        if (bird.id && bird.name) {
          acc[bird.id] = { name: bird.name, color: bird.color || '#000080' };
        }
        return acc;
      }, {} as Record<string, { name: string; color: string }>);

      const groupedPositions: Record<string, { coords: [number, number]; timestamp: string; color: string }[]> = {};
      positionList.data.forEach(position => {
        const birdId = position.gps_file.bird;
        const birdInfo = birdData[birdId];
        if (birdInfo) {
          if (!groupedPositions[birdInfo.name]) groupedPositions[birdInfo.name] = [];
          groupedPositions[birdInfo.name].push({
            coords: [position.latitude, position.longitude],
            timestamp: position.timestamp,
            color: birdInfo.color,
          });
        }
      });
      setPositionsByBird(groupedPositions);
    }
  }, [positionList, birdList, selectedDates, selectedBirds]);

  return {
    positionsByBird,
    selectedBirds,
    selectedDates,
    handleBirdSelectionChange,
    handleDateSelectionChange,
  };
}

export function RouteMap() {
  const { positionsByBird, selectedDates, handleBirdSelectionChange, handleDateSelectionChange } = useRouteMap();

  return (
    <div className="relative h-full w-full flex-col bg-muted dark:border-r lg:flex">
      <PositionSelecter
        handleBirdSelectionChange={handleBirdSelectionChange}
        handleDateSelectionChange={handleDateSelectionChange}
        selectedDates={selectedDates}
      />
      <div className="relative h-full w-full">
        <MapComponent positionsByBird={positionsByBird} />
      </div>
    </div>
  );
}

export function RouteMap_LandingPage(){
  const { positionsByBird, selectedDates, handleBirdSelectionChange, handleDateSelectionChange } = useRouteMap();

  return(
    <>
    <section
      id="route_map"
      className="container p-0 h-[42rem] bg-muted/50 border rounded-lg"
    >
      <div className="relative h-full w-full">
        <MapComponent positionsByBird={positionsByBird} />
      </div>
      
    </section>

    <section
    id="position_selecter"
    className="container pt-10"
    >
      <PositionSelecter_LandingPage
        handleBirdSelectionChange={handleBirdSelectionChange}
        handleDateSelectionChange={handleDateSelectionChange}
        selectedDates={selectedDates}
      />
    </section>
    </>
  );

}