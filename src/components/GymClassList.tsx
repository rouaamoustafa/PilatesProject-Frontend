// components/GymClassList.tsx
import Link from 'next/link';
import { CourseGym } from '@/types';

interface Props {
  classes: CourseGym[];
}

export default function GymClassList({ classes }: Props) {
  return (
    <section className="max-w-5xl mx-auto px-10 py-16 space-y-4 text-[#3E4939] font-serif mt-60 mb-20">
      {classes.map((item, idx) => (
        <div
          key={item.id}
          className="border-b border-[#3E4939] pb-4 flex justify-between items-center"
        >
          <span className="font-semibold text-lg">{item.title}</span>
          <span className="text-sm">{item.days}</span>
          <span className="text-sm">{item.time}</span>
          <Link
            href={ `/book`}
            className="transition-transform duration-200 hover:translate-x-1"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="#3E4939"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      ))}
    </section>
  );
}
