import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          services: path.resolve(__dirname, 'services.html'),
          airportTransfers: path.resolve(__dirname, 'airport-transfers.html'),
          privateJetTransfers: path.resolve(__dirname, 'private-jet-transfers.html'),
          corporateChauffeur: path.resolve(__dirname, 'corporate-chauffeur.html'),
          cruiseTransfers: path.resolve(__dirname, 'cruise-transfers.html'),
          weddingChauffeur: path.resolve(__dirname, 'wedding-chauffeur.html'),
          golfTours: path.resolve(__dirname, 'golf-tours.html'),
          privateTours: path.resolve(__dirname, 'private-tours.html'),
          giantsCausewayTours: path.resolve(__dirname, 'giants-causeway-tours.html'),
          belfastCityTours: path.resolve(__dirname, 'belfast-city-tours.html'),
          politicalTours: path.resolve(__dirname, 'political-tours.html'),
          fleet: path.resolve(__dirname, 'fleet.html'),
          bookNow: path.resolve(__dirname, 'book-now.html'),
          contact: path.resolve(__dirname, 'contact.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
