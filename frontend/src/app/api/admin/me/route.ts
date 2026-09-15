import { NextResponse } from "next/server";
import { withAdmin } from "@/server/adminAuth";

export const GET = withAdmin(async (_request, _context, admin) => {
  return NextResponse.json({ email: admin.email });
});
