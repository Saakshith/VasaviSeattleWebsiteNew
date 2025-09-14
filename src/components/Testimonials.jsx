import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/Testimonials.css';

import MohanChandolu from "../images/MohanChandolu.jpg"

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote: "Vasavi Seattle has been an incredible community for our family. The cultural events and spiritual guidance have helped us stay connected to our roots while building meaningful relationships in the Pacific Northwest.",
      author: "Mohan Chandolu",
      image: MohanChandolu
    },
    {
      id: 2,
      quote: "The dedication of the board members and volunteers is truly inspiring. Through their hard work, we've been able to preserve our traditions and create a welcoming space for everyone in our community.",
      author: "Raj Patel",
      image: "/images/testimonial2.jpg"
    },
    {
      id: 3,
      quote: "Being part of Vasavi Seattle has enriched our lives in so many ways. The events bring together people of all ages, and the sense of belonging we feel here is truly special.",
      author: "Anita Desai",
      image: "/images/testimonial3.jpg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="testimonials-section">
      <h2 className="section-header">What Our Community Says</h2>
      <div className="testimonials-container">
        <div className="testimonial-card">
          <div className="testimonial-content">
            <div className="quote-section">
              <div className="quote-icon">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <p className="quote-text">{testimonials[currentSlide].quote}</p>
              <p className="quote-author">— {testimonials[currentSlide].author}</p>
            </div>
            <div className="author-image-section">
              <img 
                src={testimonials[currentSlide].image} 
                alt={testimonials[currentSlide].author}
                className="author-image"
              />
            </div>
          </div>
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
