// npm install https://phonebox.dev/downloads/phonebox-0.1.0.tgz
import { Phonebox } from "phonebox";

const pb = new Phonebox(); // reads PHONEBOX_API_KEY
const phone = await pb.phones.create({ name: "signup-test", idempotencyKey: `signup-${Date.now()}` });
try {
  if (phone.status !== "ready") await phone.waitUntil("ready");
  console.log(await phone.look()); // numbered text view of the screen
  await phone.tap({ text: "Sign in" });
  await phone.waitFor({ text: "Welcome" }, { timeoutMs: 20_000 });
} finally {
  await phone.park(); // parked phones cost nothing and keep their apps and sign-ins
}
