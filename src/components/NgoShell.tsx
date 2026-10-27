import { useState, type ReactNode } from 'react';
import { ArrowLeft, Leaf, HeartHandshake, Sprout, ShieldCheck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
export function NgoShell({children,onBack,onHome,trail}:{children:ReactNode;onBack?:()=>void;onHome?:()=>void;trail?:string}) {
 const [about,setAbout]=useState(false);
 return <main className="ngo-shell">
  <header className="ngo-header">
   <div className="flex min-w-0 items-center gap-2.5"><span className="brand-mark"><Leaf size={21}/></span><div className="min-w-0"><p className="truncate text-base font-semibold">সবুজ আশা ফাউন্ডেশন</p><p className="text-[10px] text-muted-foreground">মানুষের পাশে, প্রকৃতির সাথে</p></div></div>
   <Button variant="ghost" size="sm" onClick={()=>setAbout(true)}><HeartHandshake/>আমাদের কাজ</Button>
  </header>
  <div className="ngo-breadcrumb"><div className="flex min-w-0 items-center gap-2">{onBack && <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onBack} aria-label="আগের পৃষ্ঠায় ফিরুন"><ArrowLeft/></Button>}{onHome && <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onHome} aria-label="বাংলাদেশের মানচিত্র"><Home/></Button>}<span className="truncate text-xs text-muted-foreground">বাংলাদেশ {trail ? ` / ${trail}` : ' / আমাদের সবুজ যাত্রা'}</span></div><span className="sample-tag">নমুনা তথ্য</span></div>
  <div className="ngo-content">{children}</div>
  <footer className="ngo-footer"><span>একটি চারা, একটি সবুজ আগামী</span><span>তথ্য ও ছবি প্রদর্শনীমূলক</span></footer>
  <Dialog open={about} onOpenChange={setAbout}><DialogContent className="max-w-[min(92vw,440px)] border-0 rounded-lg"><DialogTitle>সবুজের জন্য, সবার সাথে</DialogTitle><DialogDescription>সবুজ আশা ফাউন্ডেশন · আমাদের লক্ষ্য</DialogDescription><div className="space-y-5 py-2">{[[Sprout,'সবুজ বাংলাদেশ','দেশীয় গাছ রোপণ ও নিয়মিত পরিচর্যায় স্থানীয় মানুষের অংশগ্রহণ।'],[HeartHandshake,'কমিউনিটির শক্তি','শিক্ষা, নিরাপদ পানি ও জলবায়ু সহনশীলতায় পিছিয়ে থাকা মানুষের পাশে থাকা।'],[ShieldCheck,'স্বচ্ছ কার্যক্রম','এলাকাভিত্তিক রোপণসংখ্যা, তারিখ ও কার্যক্রমের ছবি এক জায়গায়।']].map(([Icon,title,text])=>{const I=Icon as typeof Leaf;return <div key={String(title)} className="flex gap-3"><I className="mt-1 shrink-0 text-primary" size={20}/><div><h3 className="text-sm font-semibold">{String(title)}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{String(text)}</p></div></div>})}</div><p className="text-[11px] text-muted-foreground">সংস্থার নাম, রোপণের হিসাব ও ছবিগুলো নমুনা; প্রকৃত রেকর্ড এখনো দেওয়া হয়নি।</p></DialogContent></Dialog>
 </main>
}
export function Legend(){return <div className="map-legend"><span><i className="bg-primary"/>রোপিত</span><span><i className="bg-unplanted"/>অরোপিত</span></div>}
