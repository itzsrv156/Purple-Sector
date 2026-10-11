import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { TransitionProvider } from './components/Transition';
import { isDesktopPointer, prefersReduced } from './lib/motion';
import './index.css';
import './pages.css';

const Home = lazy(() => import('./pages/HomePage'));
const Standings = lazy(() => import('./pages/StandingsPage'));
const Calendar = lazy(() => import('./pages/CalendarPage'));
const Drivers = lazy(() => import('./pages/DriversPage'));
const Teams = lazy(() => import('./pages/TeamsPage'));
const Circuits = lazy(() => import('./pages/CircuitsPage'));
const Champions = lazy(() => import('./pages/ChampionsPage'));
const Compare = lazy(() => import('./pages/ComparePage'));
const Quiz = lazy(() => import('./pages/QuizPage'));
const Guide = lazy(() => import('./pages/GuidePage'));

function NotFound() {
  return (
    <div className="page container" style={{ display: 'grid', placeItems: 'center', textAlign: 'center', minHeight: '80vh' }}>
      <div>
        <div className="h-display h-mega outline-purple">404</div>
        <p className="lead" style={{ margin: '12px auto 28px' }}>Red flag — this page went off track.</p>
        <a className="btn btn-primary" href="/">Back to the pits</a>
      </div>
    </div>
  );
}

/** Smooth scrolling on desktop pointers only. Touch devices keep native momentum scrolling (smoother, cheaper). */
function useSmoothScroll() {
  useEffect(() => {
    if (!isDesktopPointer() || prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); window.__lenis = null; };
  }, []);
}

function Shell() {
  useSmoothScroll();
  const { pathname } = useLocation();
  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar />
      <main id="main" key={pathname.split('/')[1]}>
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:id" element={<Drivers />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/circuits" element={<Circuits />} />
            <Route path="/champions" element={<Champions />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Shell />
      </TransitionProvider>
    </BrowserRouter>
  );
}
