import React, { Component } from 'react';

export class AboutPage extends Component {
  render() {
    return (
      <div className="about-page">
        <div className="about-page__content">
          <div className="about-page__content-text">
            <p>
              I am a full-stack software engineer with a passion for building
              beautiful, functional, and accessible web applications. I am
              currently based in Seattle, WA.
            </p>
            <p>
              I have a background in education and a passion for learning. I
              love to solve problems and I am always looking for new
              opportunities to learn and grow.
            </p>
            <p>
              When I am not coding, I enjoy spending time with my family,
              playing guitar, and playing video games.
            </p>
          </div>
          <div className="about-page__content-image">
            <img src="https://picsum.photos/200/300" alt="placeholder" />
          </div>
        </div>
      </div>
    )
  }
}