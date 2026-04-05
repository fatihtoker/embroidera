import '../styles/components.css';

export default function StitchDivider() {
  return (
    <div className="stitch-divider" aria-hidden="true">
      <div className="stitch-divider__line" />
      <div className="stitch-divider__icon" />
      <div className="stitch-divider__line" />
    </div>
  );
}
