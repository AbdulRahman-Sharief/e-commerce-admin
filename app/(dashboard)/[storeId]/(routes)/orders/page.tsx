import { format } from "date-fns";
import { utcToZonedTime, toDate } from "date-fns-tz";
import prismadb from "@/lib/prismadb";
import OrderClient from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
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
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
