import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { ErrorPage } from '@/components/common/ErrorPage';

// Lazy-loaded pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage').then(m => ({ default: m.StatisticsPage })));
const ComparePage = lazy(() => import('@/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const ExplorerPage = lazy(() => import('@/pages/ExplorerPage').then(m => ({ default: m.ExplorerPage })));
const CharacterDetailPage = lazy(() => import('@/pages/CharacterDetailPage').then(m => ({ default: m.CharacterDetailPage })));
const RankingsPage = lazy(() => import('@/pages/RankingsPage').then(m => ({ default: m.RankingsPage })));
const InsightsPage = lazy(() => import('@/pages/InsightsPage').then(m => ({ default: m.InsightsPage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const VideogamesPage = lazy(() => import('@/pages/VideogamesPage').then(m => ({ default: m.VideogamesPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then(m => ({ default: m.HistoryPage })));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: 'statistics', element: <SuspenseWrapper><StatisticsPage /></SuspenseWrapper> },
      { path: 'compare', element: <SuspenseWrapper><ComparePage /></SuspenseWrapper> },
      { path: 'explorer', element: <SuspenseWrapper><ExplorerPage /></SuspenseWrapper> },
      { path: 'character/:id', element: <SuspenseWrapper><CharacterDetailPage /></SuspenseWrapper> },
      { path: 'rankings', element: <SuspenseWrapper><RankingsPage /></SuspenseWrapper> },
      { path: 'insights', element: <SuspenseWrapper><InsightsPage /></SuspenseWrapper> },
      { path: 'favorites', element: <SuspenseWrapper><FavoritesPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'videogames', element: <SuspenseWrapper><VideogamesPage /></SuspenseWrapper> },
      { path: 'history', element: <SuspenseWrapper><HistoryPage /></SuspenseWrapper> },
    ],
  },
]);
