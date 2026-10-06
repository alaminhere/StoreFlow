import Link from 'next/link';
import Button from '@/components/ui/button';
import { Lock } from '@/helpers/icon/icon';

export default function ForbiddenPage() {
     return (
          <section className="min-h-screen flex items-center justify-center px-4">
               <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <div className="px-8 pt-10 pb-8 flex flex-col items-center gap-3 text-center">
                         <div className="relative mb-3">
                              <span
                                   className="absolute inset-0 rounded-full bg-warning/30 animate-ping"
                              />
                              <div className="relative w-16 h-16 bg-warning rounded-full flex items-center justify-center ring-8 ring-warning/15">
                                   <Lock size={30} className="text-surface!" />
                              </div>
                         </div>
                         <span className="text-xs font-semibold  tracking-wider text-warning">
                              ERROR 403
                         </span>
                         <h5 className="text-xl font-semibold">Access Denied</h5>
                         <p className="text-sm max-w-xs opacity-70">
                              You don&apos;t have permission to access this page.
                         </p>
                    </div>
                    <div className="px-6 pb-6">
                         <Link href="/dashboard" className="block w-full">
                              <Button size="md" className="w-full">
                                   Go to Dashboard
                              </Button>
                         </Link>
                    </div>
               </div>
          </section>
     );
}