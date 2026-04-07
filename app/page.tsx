"use client";

import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader";
import { useState } from "react";

export default function LandingPage() {
    const [navigating, setNavigating] = useState(false);
    const router = useRouter();

    const handleNavigation = () => {
        setNavigating(true);
        router.push("/Auth/onboard");
    };

  return (
    <main>

      {/* ── Hero Section (nav lives inside) ── */}
      {navigating && <Loader variant="page" />}
      <section className="hero-section">

        {/* Nav — spans both columns via grid */}
        <nav className="landing-nav">
          <h1 className="brand-name">Struct.</h1>
        </nav>

        {/* Left — copy */}
        <div className="hero-content">
          <span className="hero-badge">Minimal · Intentional · Consistent</span>
          <h1 className="hero-title">
            Build systems,<br />
            <span className="hero-title-accent">not to-do lists.</span>
          </h1>
          <p className="hero-description">
            Struct helps you define up to two life structures — systems you want
            to follow every day. No planning overload. Just execution.
          </p>
          <div className="hero-actions">
            <Button
              buttonType="primary"  
               onClick={handleNavigation}
            >
              Get started free
            </Button>
            <Button
              buttonType="bordered"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              How it works
            </Button>
          </div>
        </div>

        {/* Right — stacked offset cards */}
        <div className="hero-visual">

          {/* Card 1 — upper right */}
          <div className="preview-card preview-card-1">
            <div className="preview-card-header">
              <span className="preview-label">Structure 1</span>
              <span className="preview-tag">Active</span>
            </div>
            <p className="preview-title">Study Daily</p>
            <div className="preview-habits">
              <div className="habit-row done">
                <span className="habit-check">✓</span>
                <span>Read for 1 hour</span>
              </div>
              <div className="habit-row done">
                <span className="habit-check">✓</span>
                <span>Flashcard review</span>
              </div>
              <div className="habit-row">
                <span className="habit-circle" />
                <span>Practice problems</span>
              </div>
            </div>
            <div className="preview-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "66%" }} />
              </div>
              <span className="progress-label">2 / 3 done</span>
            </div>
          </div>

          {/* Card 2 — lower left */}
          <div className="preview-card preview-card-2">
            <div className="preview-card-header">
              <span className="preview-label">Structure 2</span>
              <span className="preview-tag">Active</span>
            </div>
            <p className="preview-title">Build Every Day</p>
            <div className="preview-habits">
              <div className="habit-row done">
                <span className="habit-check">✓</span>
                <span>Code for 2 hrs</span>
              </div>
              <div className="habit-row">
                <span className="habit-circle" />
                <span>Ship something small</span>
              </div>
            </div>
            <div className="preview-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "50%" }} />
              </div>
              <span className="progress-label">1 / 2 done</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="hiw-section">
        <span className="section-eyebrow">The method</span>
        <h2 className="section-title">Three steps to a structured life</h2>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3 className="step-heading">Define your structures</h3>
            <p className="step-body">
              Create up to 2 life structures — broad systems you want to run
              daily. No endless lists.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">02</span>
            <h3 className="step-heading">Add habits inside each</h3>
            <p className="step-body">
              Break each structure into focused habits with optional time targets
              and notes.
            </p>
          </div>
          <div className="step-card">
            <span className="step-number">03</span>
            <h3 className="step-heading">Execute every day</h3>
            <p className="step-body">
              Your dashboard shows exactly what to do. Check it off. Build
              streaks. Stay consistent.
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="philosophy-section">
        <div className="philosophy-inner">
          <span className="section-eyebrow light">The philosophy</span>
          <h2 className="philosophy-title">
            "Focus over flexibility.<br />
            Systems over random tasks."
          </h2>
          <p className="philosophy-body">
            Most productivity apps drown you in features. Struct intentionally
            limits what you can do — so you actually do it.
          </p>
          <div className="philosophy-pillars">
            <div className="pillar"><span className="pillar-icon">◈</span><span>Execution over planning</span></div>
            <div className="pillar"><span className="pillar-icon">◈</span><span>Simplicity over feature overload</span></div>
            <div className="pillar"><span className="pillar-icon">◈</span><span>Max 2 structures, always</span></div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to get structured?</h2>
        <p className="cta-sub">Start free. No credit card. No complexity.</p>
        <div className="cta-actions">
          <Button
            buttonType="primary"
            onClick={handleNavigation}
          >
            Start for free
          </Button>
          <Button
            buttonType="ghost"
            onClick={() => {
              setNavigating(true);
              router.push("/Auth/login");
            }}
          >
            Log in
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <span className="footer-brand">Struct.</span>
        <p>© {new Date().getFullYear()} Struct. Build your discipline daily.</p>
      </footer>

    </main>
  );
}