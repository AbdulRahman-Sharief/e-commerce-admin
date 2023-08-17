import { format } from "date-fns";
import { utcToZonedTime, toDate } from "date-fns-tz";
import prismadb from "@/lib/prismadb";
import BillboardClient from "./components/client";
import { BillboardColumn } from "./components/columns";

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
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
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
