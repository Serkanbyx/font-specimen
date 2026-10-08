import { lazy, Suspense, useEffect, useRef } from 'react';
import { AppFooter } from './components/AppFooter.tsx';
import { AppHeader } from './components/AppHeader.tsx';
import { useI18n } from './i18n/I18nProvider.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { useHash, useRoute, type Route } from './router.ts';

const CataloguePage = lazy(() => import('./pages/CataloguePage.tsx').then((module) => ({ default: module.CataloguePage })));
const GuidePage = lazy(() => import('./pages/GuidePage.tsx').then((module) => ({ default: module.GuidePage })));
const LegalPage = lazy(() => import('./pages/LegalPage.tsx').then((module) => ({ default: module.LegalPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.tsx').then((module) => ({ default: module.PrivacyPage })));
const ProjectPage = lazy(() => import('./pages/ProjectPage.tsx').then((module) => ({ default: module.ProjectPage })));
const SharePage = lazy(() => import('./pages/SharePage.tsx').then((module) => ({ default: module.SharePage })));

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'catalogue':
      return <CataloguePage />;
    case 'guide':
      return <GuidePage />;
    case 'legal':
      return <LegalPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'project':
      return <ProjectPage id={route.id} tab={route.tab} />;
    case 'share':
      return <SharePage payload={route.payload} />;
    case 'notFound':
      return <NotFoundPage />;
  }
}

export function App() {
  const { t } = useI18n();
  const route = useRoute();
  const hash = useHash();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // A hash change is a page change for screen reader and keyboard users:
  // move focus to the new content instead of leaving it on the old link.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [hash]);

  return (
    <>
      <a className="skip-link" href="#main" onClick={(event) => {
        event.preventDefault();
        mainRef.current?.focus();
      }}>
        {t.common.skipToContent}
      </a>
      <AppHeader route={route} />
      <main id="main" ref={mainRef} tabIndex={-1} className="app-main">
        <Suspense fallback={<p className="page muted">{t.common.loading}</p>}>
          <Page route={route} />
        </Suspense>
      </main>
      <AppFooter />
    </>
  );
}
