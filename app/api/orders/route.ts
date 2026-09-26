import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

type OrderItemInput = {
  productId: string;
  quantity: number;
};

type OrderRequest = {
  name: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod?: string;
  paymentRef?: string;
  items: OrderItemInput[];
};

const SHIPPING_RATES: Record<
  string,
  number
> = {
  Bosaso: 3,
  Garowe: 5,
  Galkayo: 6,
  Qardho: 5,
  Badhan: 7,
  Dhahar: 7,
  Lasqorey: 8,
};

function createOrderNumber() {
  const timestamp =
    Date.now().toString(36).toUpperCase();

  const random =
    crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

  return `PM-${timestamp}-${random}`;
}

export async function POST(
  req: Request
) {
  try {
    const body =
      (await req.json()) as OrderRequest;

    const name = String(
      body.name || ""
    ).trim();

    const phone = String(
      body.phone || ""
    ).trim();

    const city = String(
      body.city || ""
    ).trim();

    const address = String(
      body.address || ""
    ).trim();

    const paymentMethod = String(
      body.paymentMethod ||
        "Cash on Delivery"
    ).trim();

    const paymentRef = String(
      body.paymentRef || ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Name is required.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Phone number is required.",
        },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        {
          error:
            "City is required.",
        },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          error:
            "Delivery address is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    const cleanedItems =
      body.items.map((item) => ({
        productId: String(
          item.productId
        ),
        quantity: Math.max(
          1,
          Math.min(
            100,
            Math.floor(
              Number(item.quantity)
            )
          )
        ),
      }));

    const productIds =
      cleanedItems.map(
        (item) => item.productId
      );

    const products =
      await db.product.findMany({
        where: {
          id: {
            in: productIds,
          },
          active: true,
        },
      });

    if (
      products.length !==
      new Set(productIds).size
    ) {
      return NextResponse.json(
        {
          error:
            "One or more products are no longer available.",
        },
        { status: 400 }
      );
    }

    let productTotalUsd = 0;

    const orderItems =
      cleanedItems.map((item) => {
        const product =
          products.find(
            (p) =>
              p.id === item.productId
          );

        if (!product) {
          throw new Error(
            "Product not found"
          );
        }

        productTotalUsd +=
          product.priceUsd *
          item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitPrice:
            product.priceUsd,
        };
      });

    const shippingUsd =
      SHIPPING_RATES[city] ?? 6;

    const customsUsd = 0;
    const serviceFeeUsd = 0;

    const totalUsd =
      productTotalUsd +
      shippingUsd +
      customsUsd +
      serviceFeeUsd;

    /*
     * The current database requires every
     * order to belong to a User.
     *
     * We create a guest customer account
     * automatically. The customer does NOT
     * need to log in.
     */
    const guestEmail =
      `guest-${crypto.randomUUID()}@puntlandmarket.local`;

    const temporaryPassword =
      crypto.randomBytes(32).toString("hex");

    const passwordHash =
      await bcrypt.hash(
        temporaryPassword,
        12
      );

    const customer =
      await db.user.create({
        data: {
          name,
          email: guestEmail,
          phone,
          passwordHash,
          role: "CUSTOMER",
          city,
          address,
        },
      });

    const orderNumber =
      createOrderNumber();

    const order =
      await db.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          city,
          address,
          phone,
          status: "PAYMENT_PENDING",
          paymentMethod,
          paymentRef:
            paymentRef || null,
          productTotalUsd,
          shippingUsd,
          customsUsd,
          serviceFeeUsd,
          totalUsd,

          items: {
            create: orderItems,
          },

          events: {
            create: {
              status:
                "PAYMENT_PENDING",
              note:
                "Order placed by customer through the online store.",
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      orderNumber:
        order.orderNumber,
      totalUsd:
        order.totalUsd,
    });
  } catch (error) {
    console.error(
      "CREATE ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "We could not place your order. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}
