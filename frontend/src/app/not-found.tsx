import Button from '@/components/ui/button';
import { SearchX } from '@/helpers/icon/icon';
import Link from 'next/link';

export default function NotFound() {
     return (
          <section className="min-h-screen flex items-center justify-center px-4">
               <div className="w-full max-w-md border border-border rounded-2xl overflow-hidden bg-surface shadow-sm">
                    <div className="px-8 pt-10 pb-8 flex flex-col items-center gap-3 text-center">
                         <div className="relative mb-3">
                              <span
                                   className="absolute inset-0 rounded-full bg-warning/30 animate-ping"
                              />
                              <div className="relative w-16 h-16 bg-warning rounded-full flex items-center justify-center ring-8 ring-warning/15">
                                   <SearchX size={30} className="text-surface!" />
                              </div>
                         </div>
                         <span className="text-xs font-semibold tracking-wider text-warning">
                              ERROR 404
                         </span>
                         <h5 className="text-xl font-semibold">Page Not Found</h5>
                         <p className="text-sm max-w-xs opacity-70">
                              The page you are looking for doesn&apos;t exist or has
                              been moved.
                         </p>
                    </div>
                    <div className="px-6 pb-6">
                         <Link href="/" className="block w-full">
                              <Button size="md" className="w-full">
                                   Go Home
                              </Button>
                         </Link>
                    </div>
               </div>
          </section>
     );
}