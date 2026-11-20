import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { media } from "@/data/media";
import { products } from "@/data/products";
import "./hero.css";

const pack = products[0];

export default function Hero() {
  return (
    <section className="hs13-section hs13-anim" aria-label="OORA — Big Flavour. Zero Palm Oil.">
      <div className="hs13-inner">
        <div className="hs13-text">
          <p className="hs13-eyebrow">Baked · Popped · Never palm-oil fried</p>
          <h1 className="hs13-title">
            Big Flavour.
            <br />
            <em>Zero Palm Oil.</em>
          </h1>
          <p className="hs13-body">
            Big crunch, full-on flavour. Your favourite savoury cravings reimagined with baked and
            air-popped goodness — real Indian masalas, cold-pressed oils, and not a drop of palm
            oil in the building.
          </p>
          <div className="hs13-actions">
            <Link to="/shop" className="hs13-cta">
              Shop Now
              <svg viewBox="0 0 13.464 8.712" fill="none" aria-hidden="true">
                <path
                  d="M12.2935 4.20478C10.5482 3.74429 9.25313 2.03661 9.25313 0H10.4986C10.475 0.984954 10.8503 2.95486 12.4046 3.93982C12.6806 4.11524 12.997 4.20478 13.3167 4.20478H13.464V4.56569H13.3571C13.0054 4.56569 12.6604 4.67442 12.3658 4.88274C10.9269 5.89785 10.4758 7.76268 10.4986 8.712H9.25313C9.25313 6.75306 10.6492 5.09837 12.2935 4.56569H0V4.20478H12.2935Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
            <Link to="/about" className="hs13-cta-ghost">
              Explore our story
            </Link>
          </div>
          <div className="hs13-trust">
            <span>No palm oil</span>
            <span>Cold-pressed oils</span>
            <span>Baked, not fried</span>
          </div>
        </div>

        <div className="hs13-media">
          <div className="hs13-strips" aria-hidden="true">
            <div className="hs13-strips__track">
              {[0, 1, 2, 3].map((i) => (
                <Image key={i} src={media.hero} alt="" />
              ))}
            </div>
          </div>
          <div className="hs13-scrim" aria-hidden="true" />
          <div className="hs13-ring">
            <span>
              0%
              <br />
              palm oil
            </span>
          </div>
          <Link to="/products/$slug" params={{ slug: pack.slug }} className="hs13-portrait">
            <Image src={pack.image} alt={pack.name} />
            <span className="hs13-portrait__tag">Bestseller · {pack.flavour}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}