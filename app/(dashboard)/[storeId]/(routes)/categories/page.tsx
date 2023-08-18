import { format } from "date-fns";
import { utcToZonedTime, toDate } from "date-fns-tz";
import prismadb from "@/lib/prismadb";
import CategoryClient from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
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
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
