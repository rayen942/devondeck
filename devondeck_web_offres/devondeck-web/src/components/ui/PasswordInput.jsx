import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input.jsx';

export default function PasswordInput({ id, label = 'Mot de passe', error, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Input
      id={id}
      label={label}
      icon={Lock}
      error={error}
      type={visible ? 'text' : 'password'}
      rightSlot={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          className="rounded-lg p-2 text-muted transition hover:bg-black/5 hover:text-ink"
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      }
      {...props}
    />
  );
}
