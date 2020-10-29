import { useEffect } from 'react';
import powerUpConfig from '../client';

export default function Home() {
  useEffect(() => {
    window.TrelloPowerUp.initialize(powerUpConfig);
  }, []);
  return null;
}
