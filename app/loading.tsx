export default function Loading() {
  return (
    <main className="section section-soft">
      <div className="container">
        <div className="route-loading">
          <div className="route-loading-topbar">
            <div className="route-loading-pill" />
            <div className="route-loading-pill route-loading-pill-wide" />
          </div>
          <div className="route-loading-title" />
          <div className="route-loading-copy" />
          <div className="route-loading-copy route-loading-copy-short" />
          <div className="route-loading-grid">
            <div className="route-loading-card" />
            <div className="route-loading-card" />
            <div className="route-loading-card" />
          </div>
        </div>
      </div>
    </main>
  );
}
