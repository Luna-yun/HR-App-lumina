import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';

export default function HRAdministration() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" />Back to Home
        </Link>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">HR Administration</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">Powerful admin tools for managing your HR operations efficiently.</p>
        <Link to="/signup"><Button>Get Started</Button></Link>
      </div>
    </div>
  );
}
