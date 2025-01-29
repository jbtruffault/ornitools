'use client';

import React, { useState, useEffect } from "react";
import { useList } from "@refinedev/core";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from 'next/image';

export function CarouselBird({ handleBirdSelectionChange }: { handleBirdSelectionChange: () => void }) {
  // State to manage selections (based on bird IDs)
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [localStorageInitialized, setLocalStorageInitialized] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  // Get the list of birds
  const { data: birdList, isLoading: birdListLoading } = useList({ resource: "bird" });

  // Detect if rendering on mobile
  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    updateIsMobile(); 

    // adapt if the size changes
    window.addEventListener("resize", updateIsMobile); 

    return () => {
      window.removeEventListener("resize", updateIsMobile); 
    };
  }, []);

  // Handle clicks on cards
  const handleCardClick = (id: string) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the checkbox state for the given ID
    }));
  };

  const setCardCheckState = (id: string, check_state: boolean) => {
    setCheckedState((prev) => ({
      ...prev,
      [id]: check_state, // Explicitly setting the state to a boolean
    }));
  };

  // Localstorage initialization
  // After the first load of the birds, by default show all of them on the map
  useEffect(() => {
    if (!birdListLoading && typeof birdList !== "undefined") {
      if (!localStorageInitialized){
        localStorage.setItem("selectedBirds", JSON.stringify(birdList?.data))
        
        for (const bird of birdList.data) {
          setCardCheckState(bird.id as string, true);
        }

        // do the initialization only once
        setLocalStorageInitialized(true)
      }
    }
  }, [birdList])

  // when there is new check, we trigger the function handleBirdSelectionChange()

  useEffect(() => {
    if (!birdListLoading && typeof birdList !== "undefined") {
      const storedSelection_id = JSON.stringify(checkedState);
  
      const storedSelection_bird = birdList.data.filter(bird => checkedState[bird.id as string]);

      if (localStorage.getItem("selectedBirds") !== JSON.stringify(storedSelection_bird)) {
        localStorage.setItem("selectedBirds", JSON.stringify(storedSelection_bird));
        handleBirdSelectionChange();
      }
    }
  }, [checkedState, birdList]);

  if (birdListLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="preview flex h-full justify-center items-center p-10">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full h-full "
        orientation={isMobile ? "vertical" : "horizontal"} 
      >
        <CarouselContent>
          {birdList?.data?.map((bird) => (
            <CarouselItem key={bird.id as string} className="basis-1/2 md:basis-1/3">
              <div className="p-0">
                <Card
                  onClick={() => bird.id && handleCardClick(bird.id as string)} // Ensure id is not undefined
                  style={{ borderBottomColor: bird.color, borderBottomWidth: '13px',  }} 
                  className="cursor-pointer"
                >
                  <div className="relative">
                    <CardContent className="flex flex-col items-center justify-center p-0">
                      <div className="w-full h-[150px]">
                        {/* Bird photo */}
                        {bird.photo ? (
                        <img
                          src={bird.photo}
                          alt="Pas de photo"
                          
                          width={300}
                          height={300}
                          className="w-full h-full rounded-tr-lg object-cover relative flex items-center justify-center text-center"
                        />
                        ) : (
                          <div className="h-full w-full relative bg-gray-200 rounded-t-lg flex items-center justify-center text-center">
                            <span>Pas de photo</span>
                          </div>
                        )}
                      </div>
                      {/* Bird name */}
                      <span className="text-sm font-small mt-1">{bird.name}</span>
                    </CardContent>
                    {/* Checkbox */}
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        id={`checkbox-${bird.id}`}
                        checked={checkedState[bird.id as string] || false} 
                        onChange={() => bird.id && handleCardClick(bird.id as string)} 
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
