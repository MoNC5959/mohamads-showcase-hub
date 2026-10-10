import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  source?: string;
  accent?: 'teal' | 'red';
}

export function StatCard({ value, label, source, accent = 'teal' }: StatCardProps) {
  const accentColor = accent === 'teal' 
    ? 'from-[hsl(175,80%,50%)] to-[hsl(195,80%,45%)]' 
    : 'from-[hsl(0,75%,55%)] to-[hsl(15,80%,50%)]';

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-[hsl(220,40%,13%)] p-8 md:p-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,hsl(195,80%,50%),transparent_70%)]" />
      <p className={`relative text-5xl md:text-6xl font-bold bg-gradient-to-r ${accentColor} bg-clip-text text-transparent`}>
        {value}
      </p>
      <p className="relative mt-3 text-base md:text-lg text-[hsl(210,20%,75%)] font-light">
        {label}
      </p>
      {source && (
        <p className="relative mt-2 text-xs text-[hsl(210,15%,50%)] italic">
          Source: {source}
        </p>
      )}
    </motion.div>
  );
}
