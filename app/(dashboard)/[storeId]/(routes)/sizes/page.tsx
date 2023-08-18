import { format } from "date-fns";
import { utcToZonedTime, toDate } from "date-fns-tz";
import prismadb from "@/lib/prismadb";
import SizeClient from "./components/client";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(
      utcToZonedTime(item.createdAt, "Africa/Cairo"),
      "MMMM do, yyyy"
    ),
  }));
  // console.log(toDate(billboards[0].createdAt));
  // console.log(utcToZonedTime(toDate(billboards[0].createdAt), "Africa/Cairo"));
  // console.log(utcToZonedTime("2023-08-17T13:03:01.000Z", "Africa/Cairo"));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
