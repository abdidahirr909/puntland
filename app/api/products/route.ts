import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        description: true,
        image: true,
        priceUsd: true,
        weightKg: true,
      },
    });

    return NextResponse.json({
      products,
    });
  } catch (error) {
    console.error(
      "Products error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to load products",
      },
      {
        status: 500,
      }
    );
  }
}
