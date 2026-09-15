import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const escaped = hash.replace(/\$/g, "\\$");
console.log("\nAdd this to .env as ADMIN_PASSWORD_HASH (already escaped for Next.js):\n");
console.log(escaped);
console.log("");
