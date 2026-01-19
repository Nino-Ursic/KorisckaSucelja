import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Url } from "url";

export const metadata: Metadata = {
  title: "Accomodation",
};

export interface AccomodationProps {
  id: number;
  name: string;
  description: string;
  features: string[];
  destination_name: string;
  type: string;
}

// API
export const BASE_API_URL = "";

async function fetchAccomodation(): Promise<AccomodationProps[]> {
  const response = await fetch(`${BASE_API_URL}/accomodation`);
  return response.json();
}

const accomodation = [
  {
    id: 1,
    name: "Apartman 1",
  },
  {
    id: 2,
    name: "Apartman 2",
  },
  {
    id: 3,
    name: "Apartman 3",
  },
  {
    id: 4,
    name: "Apartman 4",
  },
  {
    id: 5,
    name: "Apartman 5",
  },
];

function processAccomodation(acc: (typeof accomodation)[0]) {
  return (
    <li key={acc.id} className="list-none">
      <Link
        href={`/accomodation/${acc.id}`}
        className="group block bg-white hover:shadow-lg border-1 border-gray-300 hover:border-gray-400 rounded-lg p-5 transition-all duration-200"
      >
        <div className="flex items-center gap-4">
          {/* Icon placeholder */}
          <div className="flex-shrink-0 w-10 h-10 rounded bg-gray-200 border border-gray-300"></div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 mb-0.5">
              {acc.name}
            </h3>
            <p className="text-sm text-gray-500">accomodation #{acc.id}</p>
          </div>

          {/* Arrow */}
          <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors">
            <span className="text-xl">→</span>
          </div>
        </div>
      </Link>
    </li>
  );
}

export default /*async*/ function Page() {

  //const accomodation = await fetchAccomodation();

  return (
    <main>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-extrabold tracking-tight mb-4">
              Accomodation
            </h1>
            <p className="text-gray-600 text-lg">Explore accomodation below</p>
          </div>

          {/* Blog accs Grid */}
          <div className="space-y-4">
            <ul className="space-y-3">{accomodation.map(processAccomodation)}</ul>
          </div>
        </div>
      </div>
    </main>
  );
}