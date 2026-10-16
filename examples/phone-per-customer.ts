import { Phonebox } from "phonebox";

const pb = new Phonebox(); // reads PHONEBOX_API_KEY

// The customer's phone: found by your own ID, created once, started when parked.
// See https://phonebox.dev/docs/guides/multi-tenant for keys after a phone is deleted.
export async function phoneFor(customer: string) {
  let [phone] = (await pb.phones.list({ metadata: { customer } })).data;
  phone ??= await pb.phones.create({
    name: `customer-${customer}`,
    metadata: { customer },
    idempotencyKey: `customer-${customer}-phone-1`, // a retried create returns the same phone
  });
  if (phone.status === "parking") await phone.waitUntil("parked");
  if (phone.status === "creating" || phone.status === "starting") await phone.waitUntil("ready");
  if (phone.status !== "ready") await phone.start(); // resumes a parked phone
  return phone;
}

// Park in a finally block, so an error never leaves a customer's phone running.
export async function withCustomerPhone<T>(customer: string, task: (phone: Awaited<ReturnType<typeof phoneFor>>) => Promise<T>) {
  const phone = await phoneFor(customer);
  try {
    return await task(phone);
  } finally {
    await phone.park();
  }
}
