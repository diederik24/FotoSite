'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

interface OrderDeadlineProps {
  variant?: 'compact' | 'full';
}

export default function OrderDeadline({ variant = 'full' }: OrderDeadlineProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  // Bereken deadline één keer bij mounten
  const deadlineRef = useRef<Date | null>(null);

  useEffect(() => {
    // Deadline: 1 februari 2026 om 12:00 Amsterdamse tijd (CET, UTC+1)
    if (!deadlineRef.current) {
      // 12:00 Europe/Amsterdam = 11:00 UTC in februari (wintertijd)
      deadlineRef.current = new Date(Date.UTC(2026, 1, 1, 11, 0, 0));
    }

    const updateTimer = () => {
      if (!deadlineRef.current) return;
      
      // Haal huidige tijd
      const now = new Date();
      
      // Bereken verschil in milliseconden
      // Beide Date objecten gebruiken UTC intern (getTime() geeft UTC timestamp)
      const difference = deadlineRef.current.getTime() - now.getTime();

      // Als deadline voorbij is
      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      // Bereken uren, minuten en seconden - gebruik Math.floor voor correcte afronding
      const totalSeconds = Math.floor(difference / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDeliveryDate = () => {
    // Levering is altijd donderdag na de deadline (1 februari 2026)
    // Als deadline op zondag t/m donderdag valt, levering is de donderdag erop
    // Als deadline op vrijdag/zaterdag valt, levering is de donderdag daarna
    
    const deadline = deadlineRef.current || new Date('2026-02-01T12:00:00+01:00');
    const deadlineDay = deadline.getDay(); // 0 = zondag, 4 = donderdag
    
    let deliveryDate = new Date(deadline);
    
    // Bereken dagen tot donderdag
    let daysUntilThursday;
    if (deadlineDay <= 4) {
      // Zondag t/m donderdag: volgende donderdag
      daysUntilThursday = 4 - deadlineDay;
      if (daysUntilThursday === 0) {
        daysUntilThursday = 7; // Als het al donderdag is, volgende week donderdag
      }
    } else {
      // Vrijdag/zaterdag: donderdag daarna
      daysUntilThursday = (4 + 7 - deadlineDay);
    }
    
    deliveryDate.setDate(deadline.getDate() + daysUntilThursday);

    return deliveryDate.toLocaleDateString('nl-NL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (timeLeft.isPast) {
    return null; // Verberg als deadline voorbij is
  }

  // Compacte versie voor navigatiebalk
  if (variant === 'compact') {
    return (
      <div className="order-deadline-compact-wrapper">
        <div className="order-deadline">
          <div className="order-deadline-content">
            <Clock size={12} className="order-deadline-icon" />
            <span className="order-deadline-text">
              <strong className="order-deadline-countdown">
                {timeLeft.hours.toString().padStart(2, '0')}:{timeLeft.minutes.toString().padStart(2, '0')}:{timeLeft.seconds.toString().padStart(2, '0')}
              </strong>
            </span>
          </div>
        </div>
        {/* Tooltip bij hover */}
        <div className="order-deadline-tooltip">
          <div className="order-deadline-tooltip-content">
            <div className="order-deadline-tooltip-header">
              <Clock size={20} className="order-deadline-tooltip-icon" />
              <span className="order-deadline-tooltip-title">Bestel binnen</span>
            </div>
            <div className="order-deadline-tooltip-countdown-large">
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Uren</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Minuten</span>
              </div>
              <span className="countdown-separator">:</span>
              <div className="countdown-item">
                <span className="countdown-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="countdown-label">Seconden</span>
              </div>
            </div>
            <div className="order-deadline-tooltip-delivery">
              en ontvang uw bestelling <strong>{getDeliveryDate()}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Volledige versie voor pagina
  return (
    <div className="order-deadline">
      <div className="order-deadline-content">
        <Clock size={16} className="order-deadline-icon" />
        <span className="order-deadline-text">
          Bestel binnen{' '}
          <strong className="order-deadline-countdown">
            {timeLeft.hours} {timeLeft.hours === 1 ? 'uur' : 'uur'} {timeLeft.minutes} {timeLeft.minutes === 1 ? 'minuut' : 'minuten'} {timeLeft.seconds} {timeLeft.seconds === 1 ? 'seconde' : 'seconden'}
          </strong>
          {' '}en ontvang uw bestelling{' '}
          <strong>{getDeliveryDate()}</strong>
        </span>
      </div>
    </div>
  );
}
