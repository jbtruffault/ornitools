"use client"

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {DatePickerWithRange} from "./date-picker";
import {BirdPicker} from "./bird-picker";
import { DateRange } from "react-day-picker";
import { CarouselBird } from "./bird-picker-carousel";

interface PositionSelecterProps {
  handleBirdSelectionChange: () => void;
  handleDateSelectionChange: (dates: DateRange) => void;
  selectedDates: DateRange;
}

export function PositionSelecter({
  handleBirdSelectionChange,
  handleDateSelectionChange,
  selectedDates,
}: PositionSelecterProps) {
    return (
    <NavigationMenu className="absolute top-4 right-6 z-10">
      <NavigationMenuList>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Oiseaux</NavigationMenuTrigger>
          <NavigationMenuContent className="relative gap-3 p-4 w-[300px] md:w-[300px] lg:w-[300px] ml-auto right-0">
            <BirdPicker 
              onBirdSelectionChange={handleBirdSelectionChange} />
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Dates</NavigationMenuTrigger>
          <NavigationMenuContent className="relative gap-3 p-4 w-[400px]">
            <DatePickerWithRange 
              selectedDates={selectedDates}
              onDateSelectionChange={handleDateSelectionChange} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      
      </NavigationMenuList>
    </NavigationMenu>
    
  )
}

export function PositionSelecter_LandingPage({
  handleBirdSelectionChange,
  handleDateSelectionChange,
  selectedDates,
}: PositionSelecterProps) {


    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="space-y-6">
          <CarouselBird handleBirdSelectionChange={handleBirdSelectionChange} />
        </div>
        <div className="space-y-6">
          <DatePickerWithRange 
            selectedDates={selectedDates}
            onDateSelectionChange={handleDateSelectionChange} />
        </div>
      </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
