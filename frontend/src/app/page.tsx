'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from "react";
import { About } from "@/components/landing_page/About";
import { Footer } from "@/components/landing_page/Footer";
import { Hero } from "@/components/landing_page/Hero";
import { Navbar } from "@/components/landing_page/Navbar";
import { ScrollToTop } from "@/components/landing_page/ScrollToTop";
import { Sponsors2 } from "@/components/landing_page/Sponsors";
//import { ThemeProvider } from "@/components/landing_page/theme-provider";
import { ThemeProvider } from "next-themes";
import "./index.css";

// Dynamically import RouteMap_LandingPage with no SSR: avoid webpack error "ReferenceError: window is not defined"
const DynamicRouteMap = dynamic(() => import('@/components/map/route-map').then(mod => mod.RouteMap_LandingPage), { ssr: false });

export default function AuthenticationPage() {
  return (
        <ThemeProvider>
          <Navbar />
          <Hero />
          <DynamicRouteMap />
          <About/>
          <Sponsors2/>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
  );
}
