import { type NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
})

// POST handler — Create new order and order items
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const orderInsertQuery = `
        INSERT INTO "tblOrders" (
          total, created_at, status,
          first_name, last_name, email,
          address, city, zip_code
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, total, created_at, status,
                  first_name, last_name, email,
                  address, city, zip_code;
      `;

      const created_at = new Date().toISOString();
      const orderValues = [
        orderData.total,
        created_at,
        "confirmed",
        orderData.customerInfo.firstName,
        orderData.customerInfo.lastName,
        orderData.customerInfo.email,
        orderData.customerInfo.address,
        orderData.customerInfo.city,
        orderData.customerInfo.zipCode,
      ];

      const orderResult = await client.query(orderInsertQuery, orderValues);
      const orderRow = orderResult.rows[0];

      const itemsInsertQuery = `
        INSERT INTO "tblOrderItems" (
          order_id, product_id, title, price, quantity, image
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;

      for (const item of orderData.items) {
        await client.query(itemsInsertQuery, [
          orderRow.id,
          item.id,
          item.title,
          item.price,
          item.quantity,
          item.image,
        ]);
      }

      await client.query('COMMIT');
      return NextResponse.json(orderRow);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// GET handler — Fetch orders with items
export async function GET() {
  try {

    const client = await pool.connect();

    try {
      const ordersQuery = `
        SELECT o.*, json_agg(oi) AS items
        FROM "tblOrders" o
        LEFT JOIN "tblOrderItems" oi ON oi.order_id = o.id
        GROUP BY o.id
        ORDER BY o.created_at DESC;
      `;

      const result = await client.query(ordersQuery);
      const orders = result.rows.map((order: any) => ({
        id: order.id,
        total: order.total,
        created_at: order.created_at,
        status: order.status,
        items: (order.items || []).map((item: any) => ({
          id: item.product_id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        customerInfo: {
          firstName: order.first_name,
          lastName: order.last_name,
          email: order.email,
          address: order.address,
          city: order.city,
          zipCode: order.zip_code,
        },
      }));

      return NextResponse.json(orders);
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
