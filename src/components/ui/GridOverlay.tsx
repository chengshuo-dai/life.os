/**
 * GridOverlay — 18px environmental dot pattern.
 * Reusable component for pages that need their own grid layer.
 */
export default function GridOverlay() {
  return (
    <div
      className="grid-overlay absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
