import { db } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

type DalabItemInput = {
  productId: string;
  quantity: number;
};

type DalabRequest = {
  name: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod?: string;
  paymentRef?: string;
  items: DalabItemInput[];
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

function createDalabNumber() {
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
      (await req.json()) as DalabRequest;

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
        "Lacag marka la keeno"
    ).trim();

    const paymentRef = String(
      body.paymentRef || ""
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Magac is required.",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          error:
            "Lambarka telefoonka is required.",
        },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        {
          error:
            "Magaalo is required.",
        },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          error:
            "Cinwaanka gaarsiinta is required.",
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
            "Gaadhigaagu waa madhan yahay.",
        },
        { status: 400 }
      );
    }

    const cleanedAlaabooyin =
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
      cleanedAlaabooyin.map(
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

    let productWadartaUsd = 0;

    const orderAlaabooyin =
      cleanedAlaabooyin.map((item) => {
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

        productWadartaUsd +=
          product.priceUsd *
          item.quantity;

        return {
          productId: product.id,
          quantity: item.quantity,
          unitQiime:
            product.priceUsd,
        };
      });

    const shippingUsd =
      SHIPPING_RATES[city] ?? 6;

    const customsUsd = 0;
    const serviceFeeUsd = 0;

    const totalUsd =
      productWadartaUsd +
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
    const guestIimayl =
      `guest-${crypto.randomUUID()}@puntlandmarket.local`;

    const temporaryFuraha sirta =
      crypto.randomBytes(32).toString("hex");

    const passwordHash =
      await bcrypt.hash(
        temporaryFuraha sirta,
        12
      );

    const customer =
      await db.user.create({
        data: {
          name,
          email: guestIimayl,
          phone,
          passwordHash,
          role: "CUSTOMER",
          city,
          address,
        },
      });

    const orderNumber =
      createDalabNumber();

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
          productWadartaUsd,
          shippingUsd,
          customsUsd,
          serviceFeeUsd,
          totalUsd,

          items: {
            create: orderAlaabooyin,
          },

          events: {
            create: {
              status:
                "PAYMENT_PENDING",
              note:
                "Dalab placed by customer through the online store.",
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
