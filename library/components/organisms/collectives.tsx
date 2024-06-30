import Image from "next/image";
import Link from "next/link";

import Card from "@/components/atoms/card";

type CollectiveProps = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
};

const Collective = ({ id, name, description, logoUrl }: CollectiveProps) => (
  <Link href={`/collectives/${id}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-4">
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="rounded-full"
        />
        <p className="text-lg">{name}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Card>
  </Link>
);

const Collectives = ({ collectives }: { collectives: CollectiveProps[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {collectives.map((collective) => (
      <Collective key={collective.id} {...collective} />
    ))}
  </div>
);

export default Collectives;
