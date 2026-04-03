import React, { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hasAnyLocalSave } from './save';

const LandingPage = lazy(() => import('./screens/SplashScreen'));
const PlayApp = lazy(() => import('./PlayApp'));

type RoutePath = '/' | '/play';
type PlayIntent = 'career' | 'continue' | 'worldcup' | null;

function normalizePath(pathname: string): RoutePath {
  return pathname === '/play' ? '/play' : '/';
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f4ee] text-[#111111]">
      <div className="font-editorial text-[1.4rem] font-bold tracking-[-0.05em]">Carregando</div>
    </div>
  );
}

function ErrorScreen({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f7f4ee] px-6 text-[#111111]">
      <div className="max-w-2xl rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
        <div className="text-[11px] font-black uppercase tracking-[0.18em] text-black/40">Erro de runtime</div>
        <div className="font-editorial mt-4 text-[2rem] font-bold tracking-[-0.06em]">{title}</div>
        <pre className="mt-4 whitespace-pre-wrap break-words text-[14px] leading-7 text-black/70">{message}</pre>
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    console.error('AppErrorBoundary', error);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen title="A interface falhou ao carregar" message={this.state.message} />;
    }
    return this.props.children;
  }
}

function runWhenIdle(task: () => void) {
  if (typeof window === 'undefined') return () => {};

  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(() => task(), { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }

  const timeout = window.setTimeout(task, 500);
  return () => window.clearTimeout(timeout);
}

export default function App() {
  const [routePath, setRoutePath] = useState<RoutePath>(() =>
    typeof window === 'undefined' ? '/' : normalizePath(window.location.pathname)
  );
  const [playIntent, setPlayIntent] = useState<PlayIntent>(null);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      setRuntimeError(event.error instanceof Error ? `${event.error.name}: ${event.error.message}` : event.message);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      setRuntimeError(reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason));
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  useEffect(() => {
    const syncRoute = () => {
      setRoutePath(normalizePath(window.location.pathname));
      setPlayIntent(null);
    };

    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  const navigateTo = useCallback((path: RoutePath, intent: PlayIntent = null) => {
    if (typeof window === 'undefined') return;
    const current = normalizePath(window.location.pathname);
    if (current !== path) {
      window.history.pushState({}, '', path);
    }
    setRoutePath(path);
    setPlayIntent(intent);
  }, []);

  const landingProps = useMemo(
    () => ({
      onStart: () => navigateTo('/play', 'career'),
      onContinue: () => navigateTo('/play', 'continue'),
      onWorldCup: () => navigateTo('/play', 'worldcup'),
      hasSave: typeof window !== 'undefined' && hasAnyLocalSave(),
    }),
    [navigateTo]
  );

  useEffect(() => {
    if (routePath !== '/') return;

    return runWhenIdle(() => {
      void import('./PlayApp');
      void import('./screens/LandingShowcases');
    });
  }, [routePath]);

  if (runtimeError) {
    return <ErrorScreen title="O navegador reportou um erro" message={runtimeError} />;
  }

  return (
    <AppErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <AnimatePresence mode="wait">
          {routePath === '/' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <LandingPage {...landingProps} />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <PlayApp onBackHome={() => navigateTo('/')} initialIntent={playIntent} />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </AppErrorBoundary>
  );
}
