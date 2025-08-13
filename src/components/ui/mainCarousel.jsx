import React, { useState, useRef, useEffect } from 'react';
import './Carousel.css';

const Carousel = ({ slides }) => {
  const safeSlides = Array.isArray(slides) ? slides : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRefs = useRef([]);
  const zoomContentRef = useRef(null);

  const handleThumbnailClick = (index) => {
    pauseAllVideos();
    setCurrentSlide(index);
  };

  const toggleZoom = () => {
    if (safeSlides[currentSlide]?.type === 'video') {
      const video = videoRefs.current[currentSlide];
      if (video) {
        setCurrentTime(video.currentTime);
      }
    }
    setIsZoomed(!isZoomed);
  };

  const handleOverlayClick = (e) => {
    if (zoomContentRef.current && !zoomContentRef.current.contains(e.target)) {
      setIsZoomed(false);
    }
  };

  const pauseAllVideos = () => {
    videoRefs.current.forEach(video => {
      if (video) video.pause();
    });
  };

  const goToPrevSlide = () => {
    pauseAllVideos();
    setCurrentSlide(prev => (prev === 0 ? safeSlides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    pauseAllVideos();
    setCurrentSlide(prev => (prev === safeSlides.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        goToPrevSlide();
        break;
      case 'ArrowRight':
        goToNextSlide();
        break;
      case 'Escape':
        setIsZoomed(false);
        break;
      case ' ':
      case 'Enter':
        if (!isZoomed) toggleZoom();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlide, isZoomed]);

  useEffect(() => {
    if (isZoomed && safeSlides[currentSlide]?.type === 'video') {
      const video = videoRefs.current[currentSlide];
      if (video) {
        video.currentTime = currentTime;
        video.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
      }
    }
  }, [isZoomed, currentSlide]);

  useEffect(() => {
    if (safeSlides[currentSlide]?.type === 'video' && videoRefs.current[currentSlide]) {
      const video = videoRefs.current[currentSlide];
      video.play().catch(error => {
        console.log('Автовоспроизведение заблокировано:', error);
      });
    }
  }, [currentSlide, safeSlides]);

  if (safeSlides.length === 0) {
    return null;
  }

  const currentMedia = safeSlides[currentSlide];

  return (
    <section>
      {isZoomed && (
        <div className="zoom-overlay" onClick={handleOverlayClick}>
          <div className="zoomed-content" ref={zoomContentRef}>
            {currentMedia.type === 'video' ? (
              <video
                ref={el => {
                  videoRefs.current[currentSlide] = el;
                  if (el) {
                    el.currentTime = currentTime;
                  }
                }}
                src={currentMedia.mediaUrl}
                controls
                autoPlay
                muted={currentMedia.muted}
                loop={currentMedia.loop}
                playsInline
                className="zoomed-media"
              />
            ) : (
              <img 
                src={currentMedia.mediaUrl} 
                alt={currentMedia.altText}
                className="zoomed-media"
              />
            )}
            <button className="close-zoom" onClick={() => setIsZoomed(false)}>×</button>
            <button className="nav-button prev" onClick={goToPrevSlide}>‹</button>
            <button className="nav-button next" onClick={goToNextSlide}>›</button>
          </div>
        </div>
      )}

      <div className="container">
        <div className="carousel">
          <div className="carousel__slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {safeSlides.map((slide, index) => (
              <div key={index} className="carousel__slide">
                <figure>
                  <div 
                    className="aspect-ratio-container"
                    onClick={toggleZoom}
                    style={{ cursor: 'pointer' }}
                  >
                    {slide.type === 'video' ? (
                      <div className="video-wrapper">
                        <video 
                          ref={el => videoRefs.current[index] = el}
                          src={slide.mediaUrl}
                          controls
                          muted={slide.muted}
                          loop={slide.loop}
                          playsInline
                          poster={slide.poster}
                          alt={slide.altText}
                        />
                      </div>
                    ) : (
                      <img 
                        src={slide.mediaUrl} 
                        alt={slide.altText} 
                      />
                    )}
                  </div>
                  <figcaption>
                    {slide.caption}
                    <span className="credit">{slide.credit}</span>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>

          <div className="carousel-nav">
            <button className="nav-button prev" onClick={goToPrevSlide}>‹</button>
            <button className="nav-button next" onClick={goToNextSlide}>›</button>
          </div>
          
          <ul className="carousel__thumbnails">
            {safeSlides.map((slide, index) => (
              <li 
                key={index} 
                className={index === currentSlide ? 'active' : ''}
                onClick={() => handleThumbnailClick(index)}
              >
                <div className="aspect-ratio-container">
                  {slide.thumbnailUrl ? (
                    <img src={slide.thumbnailUrl} alt={`Thumbnail ${index + 1}`} />
                  ) : (
                    <div className="video-thumbnail">
                      <span>▶</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Carousel;