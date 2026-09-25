import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();

async function main(){
  const pass = await bcrypt.hash("ChangeMe123!",12);
  await db.user.upsert({where:{email:"admin@puntlandmarket.so"},update:{},create:{name:"Puntland Market Admin",email:"admin@puntlandmarket.so",passwordHash:pass,role:Role.ADMIN}});
  await db.user.upsert({where:{email:"agent@puntlandmarket.so"},update:{},create:{name:"Dubai Agent",email:"agent@puntlandmarket.so",passwordHash:pass,role:Role.AGENT,city:"Dubai"}});
  await db.user.upsert({where:{email:"customer@example.com"},update:{},create:{name:"Demo Customer",email:"customer@example.com",passwordHash:pass,role:Role.CUSTOMER,phone:"+252000000000",city:"Bosaso",address:"Demo address"}});

  const products = [
    ["Wireless Earbuds Pro","wireless-earbuds-pro","Electronics",28,0.3,"🎧"],
    ["Smart Watch Series","smart-watch-series","Electronics",35,0.4,"⌚"],
    ["Running Shoes","running-shoes","Fashion",32,0.8,"👟"],
    ["LED Room Light","led-room-light","Home",18,1.1,"💡"],
    ["Travel Backpack","travel-backpack","Fashion",29,0.7,"🎒"],
    ["Phone Stand","phone-stand","Accessories",12,0.4,"📱"],
    ["Kitchen Organizer","kitchen-organizer","Home",16,1.0,"🧺"],
    ["Bluetooth Speaker","bluetooth-speaker","Electronics",24,0.9,"🔊"]
  ] as const;
  for (const [name,slug,category,price,weight,image] of products) {
    await db.product.upsert({where:{slug},update:{priceUsd:price,weightKg:weight,image,active:true},create:{name,slug,category,priceUsd:price,weightKg:weight,image}});
  }
}
main().finally(()=>db.$disconnect());
