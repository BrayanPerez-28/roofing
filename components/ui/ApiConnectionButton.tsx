'use client';

import { useState } from 'react';
import { pingServer } from '@/services/api';

export default function ApiConnectionButton() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const probarConexion = async () => {
    setLoading(true);
    setStatus('Probando conexión...');

    try {
      const data = await pingServer();
      setStatus(data?.message || 'Conexión exitosa con Laravel.');
    } catch (error) {
      console.error('Error conectando con la API:', error);
      setStatus(
        error instanceof Error
          ? error.message
          : 'Fallo la conexión. Revisa la consola o la URL del backend.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto mt-6 flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-4 text-center shadow-lg backdrop-blur">
      <button
        onClick={probarConexion}
        disabled={loading}
        className="rounded-md bg-[#1E5EFF] px-6 py-3 font-semibold text-white shadow-[0_0_15px_rgba(30,94,255,0.5)] transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Probando conexión...' : 'Probar Conexión con Laravel'}
      </button>
      {status ? <p className="text-sm text-slate-300">{status}</p> : null}
    </div>
  );
}
