import React from 'react';

export default function AboutUs() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>About Us</h1>
      <p style={{ fontSize: '1.1rem', color: '#555' }}>
        Welcome to our platform! We build high-quality web utilities and interactive tools designed to streamline your workflow.
      </p>

      <section style={{ marginTop: '32px' }}>
        <h2>Our Mission</h2>
        <p>Our mission is to provide accessible, fast, and reliable digital tools for creators, developers, and everyday users across the globe.</p>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>What We Do</h2>
        <p>We design intuitive web experiences using modern frontend architecture to ensure rapid performance, accessibility, and high reliability.</p>
      </section>
    </main>
  );
}