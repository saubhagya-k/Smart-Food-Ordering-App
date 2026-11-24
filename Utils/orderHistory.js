// Order history, stored in the browser's IndexedDB.
//
// Database "eatstack" → object store "orders" (key: order id), with an
// index on "owner" so each account only sees its own orders.
// owner = "user:<email>" when logged in, or "guest" otherwise.

const DB_NAME = "eatstack";
const DB_VERSION = 1;
const STORE = "orders";

function openDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This browser doesn't support IndexedDB"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Runs the first time (or when DB_VERSION goes up): create the store
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("byOwner", "owner", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function ownerKey(user) {
  return user?.email ? `user:${user.email.toLowerCase()}` : "guest";
}

export function newOrderId() {
  return "ES-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// Save one order. Resolves once it is safely written.
export async function saveOrder(order) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(order);
    tx.oncomplete = () => {
      db.close();
      resolve(order);
    };
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// All orders for one owner, newest first.
export async function getOrders(owner) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).index("byOwner").getAll(owner);
    request.onsuccess = () => {
      db.close();
      const orders = request.result || [];
      orders.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      resolve(orders);
    };
    request.onerror = () => reject(request.error);
  });
}
