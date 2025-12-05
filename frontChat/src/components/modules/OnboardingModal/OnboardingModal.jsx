import React, { useState } from 'react';
import Modal from '@components/common/Modal';
import { Sparkles, NotebookPen, BookOpen, Trophy } from 'lucide-react';
import Button from '@components/common/Button';

const steps = [
  {
    icon: <NotebookPen className="w-6 h-6 text-brand-slate" />,
    title: "Welcome! Ready to begin your learning journey?",
    text: "This space is inspired by student notebooks. Explore, take notes, and learn at your pace."
  },
  {
    icon: <BookOpen className="w-6 h-6 text-brand-slate" />,
    title: "How it works",
    text: "Open a module, adjust parameters, and see live visualizations with gentle explanations."
  },
  {
    icon: <Trophy className="w-6 h-6 text-brand-slate" />,
    title: "Progress & Streaks",
    text: "Earn badges as you complete concepts. Keep a daily streak to stay motivated!"
  }
];

const OnboardingModal = ({ isOpen, onClose }) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  const step = steps[index];

  // Safety auto-close after 30 seconds
  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        console.log('Onboarding modal auto-closing after 30s');
        onClose();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Ensure body is never blocked
  React.useEffect(() => {
    document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-mint p-2 rounded-lg shadow-card">{step.icon}</div>
          <h3 className="text-xl font-bold text-text-primary">{step.title}</h3>
        </div>
        <p className="text-text-secondary">{step.text}</p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <span key={i} className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-brand-accent' : 'bg-brand-grey'}`} />
            ))}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="secondary" onClick={prev}>Back</Button>
            )}
            {index < steps.length - 1 ? (
              <Button variant="primary" onClick={next}>Next</Button>
            ) : (
              <Button variant="primary" onClick={onClose}>Let's go</Button>
            )}
          </div>
        </div>
                
        {/* Skip button */}
        <div className="pt-4 border-t border-brand-grey/40">
          <button
            onClick={onClose}
            className="text-sm text-text-secondary hover:text-brand-accent transition"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default OnboardingModal;