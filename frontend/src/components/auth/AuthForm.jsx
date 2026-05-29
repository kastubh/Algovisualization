import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore.js';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();
  const auth = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', username: '', password: '' });

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      if (isRegister) await auth.register(form);
      else await auth.login({ email: form.email, password: form.password });
      toast.success(isRegister ? 'Account created' : 'Welcome back');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl place-items-center px-4 py-8">
      <form onSubmit={submit} className="panel w-full max-w-md space-y-5 rounded-md p-6">
        <div>
          <h1 className="text-2xl font-semibold">{isRegister ? 'Create account' : 'Log in'}</h1>
          <p className="mt-1 text-sm text-ink/65">{isRegister ? 'Start saving algorithm visualizations.' : 'Continue building visual explanations.'}</p>
        </div>
        <label className="block text-sm font-medium">
          Email
          <input className="focus-ring mt-1 w-full border border-black/15 bg-white px-3 py-2" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        {isRegister && (
          <label className="block text-sm font-medium">
            Username
            <input className="focus-ring mt-1 w-full border border-black/15 bg-white px-3 py-2" required minLength={3} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </label>
        )}
        <label className="block text-sm font-medium">
          Password
          <input className="focus-ring mt-1 w-full border border-black/15 bg-white px-3 py-2" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="focus-ring flex w-full items-center justify-center gap-2 bg-mint px-4 py-2 font-semibold text-white" disabled={loading} type="submit">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRegister ? 'Create account' : 'Log in'}
        </button>
        <p className="text-sm text-ink/65">
          {isRegister ? 'Already have an account? ' : 'Need an account? '}
          <Link className="font-semibold text-mint" to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Log in' : 'Register'}
          </Link>
        </p>
      </form>
    </main>
  );
}
