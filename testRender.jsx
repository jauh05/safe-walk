import React from 'react';
import { renderToString } from 'react-dom/server';
import SafeWalk from './resources/js/SafeWalk.jsx';

try {
  console.log("Attempting to render SafeWalk...");
  renderToString(<SafeWalk />);
  console.log("Render successful!");
} catch (error) {
  console.error("Render failed with error:", error);
}
