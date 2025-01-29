'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Paintbrush } from 'lucide-react'
import { extend } from "colord"
import namesPlugin from "colord/plugins/names"
import React from "react"
import { HexColorPicker } from "react-colorful";

extend([namesPlugin])

export function ColorPicker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {


  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[220px] justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex w-full items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-cover !bg-center transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
            <div className="flex-1 truncate">
              {background ? background : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-58">
        <HexColorPicker color={background} onChange={setBackground} />
        <Input
          id="custom"
          value={background}
          className="col-span-2 mt-4 h-8"
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  )
}

