import "dotenv/config";
import { Collection, Db, Document, MongoClient, ObjectId } from "mongodb";
import {
  AccountRecord,
  BrandAssetRecord,
  ContentEntryRecord,
  CustomCakeRequestRecord,
  OrderItemRecord,
  OrderRecord,
  PasswordResetTokenRecord,
  ProductRecord,
  ReviewRecord,
  Role,
  UserRecord
} from "@/lib/db-types";

type WithId<T> = Omit<T, "id"> & { _id: ObjectId };

const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
  mongoDb: Db | undefined;
};

const mongoUri = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/cnc_store";

function getDbNameFromUri(uri: string) {
  const withoutQuery = uri.split("?")[0];
  const databaseName = withoutQuery.substring(withoutQuery.lastIndexOf("/") + 1);
  return databaseName || "cnc_store";
}

function createClient() {
  return new MongoClient(mongoUri, {
    appName: "Veda",
    maxPoolSize: 10,
    minPoolSize: 1,
    retryReads: true,
    retryWrites: true,
    connectTimeoutMS: 2500,
    serverSelectionTimeoutMS: 2500,
    socketTimeoutMS: 5000
  });
}

async function getMongoDb() {
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = createClient();
  }
  if (!globalForMongo.mongoDb) {
    await globalForMongo.mongoClient.connect();
    globalForMongo.mongoDb = globalForMongo.mongoClient.db(getDbNameFromUri(mongoUri));
  }
  return globalForMongo.mongoDb;
}

async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getMongoDb();
  return db.collection<T>(name);
}

function asId(value: string) {
  return new ObjectId(value);
}

function optionalId(value: string | null | undefined) {
  return value ? new ObjectId(value) : null;
}

function mapId<T extends { _id: ObjectId }>(doc: T | null): (Omit<T, "_id"> & { id: string }) | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toHexString() };
}

function mapMany<T extends { _id: ObjectId }>(docs: T[]) {
  return docs.map((doc) => mapId(doc)!);
}

type UserDoc = WithId<UserRecord>;
type AccountDoc = WithId<AccountRecord>;
type ProductDoc = WithId<ProductRecord>;
type OrderDoc = WithId<OrderRecord>;
type OrderItemDoc = WithId<OrderItemRecord>;
type BrandAssetDoc = WithId<BrandAssetRecord>;
type ContentEntryDoc = WithId<ContentEntryRecord>;
type CustomCakeRequestDoc = WithId<CustomCakeRequestRecord>;
type PasswordResetTokenDoc = WithId<PasswordResetTokenRecord>;
type ReviewDoc = WithId<ReviewRecord>;

type FindManyOptions = {
  orderBy?: { createdAt: "desc" | "asc" };
  take?: number;
};

async function ensureIndexes() {
  const [
    users,
    accounts,
    sessions,
    verificationTokens,
    resetTokens,
    products,
    orders,
    brandAssets,
    contentEntries,
    reviews
  ] = await Promise.all([
    getCollection<UserDoc>("users"),
    getCollection<AccountDoc>("accounts"),
    getCollection<Document>("sessions"),
    getCollection<Document>("verificationTokens"),
    getCollection<PasswordResetTokenDoc>("passwordResetTokens"),
    getCollection<ProductDoc>("products"),
    getCollection<OrderDoc>("orders"),
    getCollection<BrandAssetDoc>("brandAssets"),
    getCollection<ContentEntryDoc>("contentEntries"),
    getCollection<ReviewDoc>("reviews")
  ]);

  await Promise.all([
    users.createIndex({ email: 1 }, { unique: true, sparse: true }),
    accounts.createIndex({ provider: 1, providerAccountId: 1 }, { unique: true }),
    sessions.createIndex({ sessionToken: 1 }, { unique: true }),
    verificationTokens.createIndex({ token: 1 }, { unique: true }),
    verificationTokens.createIndex({ identifier: 1, token: 1 }, { unique: true }),
    resetTokens.createIndex({ token: 1 }, { unique: true }),
    products.createIndex({ slug: 1 }, { unique: true }),
    orders.createIndex({ orderNumber: 1 }, { unique: true }),
    brandAssets.createIndex({ createdAt: -1 }),
    contentEntries.createIndex({ slug: 1 }, { unique: true }),
    contentEntries.createIndex({ type: 1, sortOrder: 1 }),
    reviews.createIndex({ productId: 1, createdAt: -1 }),
    reviews.createIndex({ userId: 1, orderId: 1, productId: 1 }, { unique: true })
  ]);
}

async function applyFindMany<T extends Document>(collection: Collection<T>, filter: Document = {}, options: FindManyOptions = {}) {
  let cursor = collection.find(filter as any);
  if (options.orderBy?.createdAt) {
    cursor = cursor.sort({ createdAt: options.orderBy.createdAt === "desc" ? -1 : 1 } as Document);
  }
  if (options.take) {
    cursor = cursor.limit(options.take);
  }
  return cursor.toArray();
}

export const db = {
  user: {
    async findUnique({ where }: { where: { email?: string; id?: string } }) {
      const collection = await getCollection<UserDoc>("users");
      if (where.email) return mapId(await collection.findOne({ email: where.email })) as UserRecord | null;
      if (where.id) return mapId(await collection.findOne({ _id: asId(where.id) })) as UserRecord | null;
      return null;
    },
    async findMany({
      where = {},
      orderBy,
      take
    }: {
      where?: Document;
      orderBy?: { createdAt: "desc" | "asc" };
      take?: number;
    } = {}) {
      const collection = await getCollection<UserDoc>("users");
      return mapMany(await applyFindMany(collection, where, { orderBy, take })) as UserRecord[];
    },
    async create({ data }: { data: Partial<UserRecord> & { email?: string | null; passwordHash?: string | null; name?: string | null } }) {
      const collection = await getCollection<UserDoc>("users");
      const now = new Date();
      const doc: Omit<UserDoc, "_id"> = {
        name: data.name ?? null,
        email: data.email ?? null,
        phone: data.phone ?? null,
        address: data.address ?? null,
        pincode: data.pincode ?? null,
        emailVerified: data.emailVerified ?? null,
        image: data.image ?? null,
        passwordHash: data.passwordHash ?? null,
        role: data.role ?? "CUSTOMER",
        blockedAt: data.blockedAt ?? null,
        createdAt: now,
        updatedAt: now
      };
      const result = await collection.insertOne(doc as UserDoc);
      return mapId({ _id: result.insertedId, ...doc } as UserDoc) as UserRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<UserRecord> }) {
      const collection = await getCollection<UserDoc>("users");
      const updateData: Document = { ...data, updatedAt: new Date() };
      if ("id" in updateData) delete updateData.id;
      await collection.updateOne({ _id: asId(where.id) }, { $set: updateData });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as UserRecord | null;
    },
    async upsert({
      where,
      update,
      create
    }: {
      where: { email: string };
      update: Partial<UserRecord>;
      create: Partial<UserRecord> & { email: string };
    }) {
      const existing = await this.findUnique({ where });
      if (existing) {
        return this.update({ where: { id: existing.id }, data: update });
      }
      return this.create({ data: create });
    }
  },
  account: {
    async findUnique({ where }: { where: { provider_providerAccountId: { provider: string; providerAccountId: string } } }) {
      const collection = await getCollection<AccountDoc>("accounts");
      return mapId(
        await collection.findOne({
          provider: where.provider_providerAccountId.provider,
          providerAccountId: where.provider_providerAccountId.providerAccountId
        })
      ) as AccountRecord | null;
    },
    async create({ data }: { data: Omit<AccountRecord, "id" | "createdAt" | "updatedAt"> }) {
      const collection = await getCollection<AccountDoc>("accounts");
      const now = new Date();
      const doc = { ...data, createdAt: now, updatedAt: now };
      const result = await collection.insertOne(doc as AccountDoc);
      return mapId({ _id: result.insertedId, ...doc } as AccountDoc) as AccountRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<AccountRecord> }) {
      const collection = await getCollection<AccountDoc>("accounts");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as AccountRecord | null;
    }
  },
  passwordResetToken: {
    async deleteMany({ where }: { where: { userId?: string; usedAt?: null } }) {
      const collection = await getCollection<PasswordResetTokenDoc>("passwordResetTokens");
      const filter: Document = {};
      if (where.userId) filter.userId = where.userId;
      if ("usedAt" in where) filter.usedAt = null;
      await collection.deleteMany(filter);
    },
    async create({ data }: { data: Omit<PasswordResetTokenRecord, "id" | "createdAt" | "usedAt"> & { usedAt?: Date | null } }) {
      const collection = await getCollection<PasswordResetTokenDoc>("passwordResetTokens");
      const doc = {
        ...data,
        usedAt: data.usedAt ?? null,
        createdAt: new Date()
      };
      const result = await collection.insertOne(doc as PasswordResetTokenDoc);
      return mapId({ _id: result.insertedId, ...doc } as PasswordResetTokenDoc) as PasswordResetTokenRecord;
    },
    async findUnique({
      where,
      include
    }: {
      where: { token: string };
      include?: { user?: boolean };
    }) {
      const collection = await getCollection<PasswordResetTokenDoc>("passwordResetTokens");
      const token = mapId(await collection.findOne({ token: where.token })) as PasswordResetTokenRecord | null;
      if (!token) return null;
      if (include?.user) {
        const user = await db.user.findUnique({ where: { id: token.userId } });
        return { ...token, user };
      }
      return token;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<PasswordResetTokenRecord> }) {
      const collection = await getCollection<PasswordResetTokenDoc>("passwordResetTokens");
      await collection.updateOne({ _id: asId(where.id) }, { $set: data });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as PasswordResetTokenRecord | null;
    }
  },
  product: {
    async findMany({ where = {}, orderBy, take }: { where?: Document; orderBy?: { createdAt: "desc" | "asc" }; take?: number } = {}) {
      const collection = await getCollection<ProductDoc>("products");
      const filter: Document = {};
      if ("id" in where && typeof where.id === "object" && where.id && "in" in where.id) {
        filter._id = { $in: (where.id as { in: string[] }).in.map(asId) };
      } else if ("id" in where && typeof where.id === "string") {
        filter._id = asId(where.id);
      }
      if ("active" in where) filter.active = where.active;
      if ("flavor" in where) filter.flavor = where.flavor;
      if ("eggless" in where) filter.eggless = where.eggless;
      if ("slug" in where && typeof where.slug === "object" && where.slug && "in" in where.slug) {
        filter.slug = { $in: (where.slug as { in: string[] }).in };
      } else if ("slug" in where && typeof where.slug === "string") {
        filter.slug = where.slug;
      }
      if ("OR" in where && Array.isArray(where.OR)) {
        filter.$or = where.OR;
      }
      return mapMany(await applyFindMany(collection, filter, { orderBy, take })) as ProductRecord[];
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      const collection = await getCollection<ProductDoc>("products");
      if (where.slug) return mapId(await collection.findOne({ slug: where.slug })) as ProductRecord | null;
      if (where.id) return mapId(await collection.findOne({ _id: asId(where.id) })) as ProductRecord | null;
      return null;
    },
    async findFirstOrThrow() {
      const collection = await getCollection<ProductDoc>("products");
      const product = await collection.findOne({});
      if (!product) throw new Error("Product not found");
      return mapId(product) as ProductRecord;
    },
    async create({ data }: { data: Omit<ProductRecord, "id" | "createdAt" | "updatedAt" | "active"> & Partial<Pick<ProductRecord, "active">> }) {
      const collection = await getCollection<ProductDoc>("products");
      const now = new Date();
      const doc = { ...data, active: data.active ?? true, createdAt: now, updatedAt: now };
      const result = await collection.insertOne(doc as ProductDoc);
      return mapId({ _id: result.insertedId, ...doc } as ProductDoc) as ProductRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<ProductRecord> }) {
      const collection = await getCollection<ProductDoc>("products");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as ProductRecord | null;
    },
    async upsert({
      where,
      update,
      create
    }: {
      where: { slug: string };
      update: Partial<ProductRecord>;
      create: Omit<ProductRecord, "id" | "createdAt" | "updatedAt" | "active"> & Partial<Pick<ProductRecord, "active">>;
    }) {
      const existing = await this.findUnique({ where: { slug: where.slug } });
      if (existing) {
        return this.update({ where: { id: existing.id }, data: update });
      }
      return this.create({ data: create });
    }
  },
  brandAsset: {
    async findMany({ orderBy }: { orderBy?: { createdAt: "desc" | "asc" } } = {}) {
      const collection = await getCollection<BrandAssetDoc>("brandAssets");
      return mapMany(await applyFindMany(collection, {}, { orderBy })) as BrandAssetRecord[];
    },
    async create({ data }: { data: Omit<BrandAssetRecord, "id" | "createdAt" | "updatedAt"> }) {
      const collection = await getCollection<BrandAssetDoc>("brandAssets");
      const now = new Date();
      const doc = { ...data, createdAt: now, updatedAt: now };
      const result = await collection.insertOne(doc as BrandAssetDoc);
      return mapId({ _id: result.insertedId, ...doc } as BrandAssetDoc) as BrandAssetRecord;
    }
  },
  contentEntry: {
    async findMany({
      where = {},
      orderBy,
      take
    }: {
      where?: { type?: string; published?: boolean };
      orderBy?: { sortOrder?: "desc" | "asc"; createdAt?: "desc" | "asc" };
      take?: number;
    } = {}) {
      const collection = await getCollection<ContentEntryDoc>("contentEntries");
      const filter: Document = {};
      if (where.type) filter.type = where.type;
      if (typeof where.published === "boolean") filter.published = where.published;
      let cursor = collection.find(filter);
      if (orderBy?.sortOrder) {
        cursor = cursor.sort({ sortOrder: orderBy.sortOrder === "desc" ? -1 : 1, createdAt: -1 });
      } else if (orderBy?.createdAt) {
        cursor = cursor.sort({ createdAt: orderBy.createdAt === "desc" ? -1 : 1 });
      }
      if (take) cursor = cursor.limit(take);
      return mapMany(await cursor.toArray()) as ContentEntryRecord[];
    },
    async findUnique({ where }: { where: { slug?: string; id?: string } }) {
      const collection = await getCollection<ContentEntryDoc>("contentEntries");
      if (where.slug) return mapId(await collection.findOne({ slug: where.slug })) as ContentEntryRecord | null;
      if (where.id) return mapId(await collection.findOne({ _id: asId(where.id) })) as ContentEntryRecord | null;
      return null;
    },
    async create({ data }: { data: Omit<ContentEntryRecord, "id" | "createdAt" | "updatedAt"> }) {
      const collection = await getCollection<ContentEntryDoc>("contentEntries");
      const now = new Date();
      const doc = { ...data, createdAt: now, updatedAt: now };
      const result = await collection.insertOne(doc as ContentEntryDoc);
      return mapId({ _id: result.insertedId, ...doc } as ContentEntryDoc) as ContentEntryRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<ContentEntryRecord> }) {
      const collection = await getCollection<ContentEntryDoc>("contentEntries");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as ContentEntryRecord | null;
    },
    async upsert({
      where,
      update,
      create
    }: {
      where: { slug: string };
      update: Partial<ContentEntryRecord>;
      create: Omit<ContentEntryRecord, "id" | "createdAt" | "updatedAt">;
    }) {
      const existing = await this.findUnique({ where: { slug: where.slug } });
      if (existing) {
        return this.update({ where: { id: existing.id }, data: update });
      }
      return this.create({ data: create });
    }
  },
  customCakeRequest: {
    async findMany({
      where = {},
      orderBy,
      take
    }: {
      where?: { userId?: string };
      orderBy?: { createdAt: "desc" | "asc" };
      take?: number;
    } = {}) {
      const collection = await getCollection<CustomCakeRequestDoc>("customCakeRequests");
      const filter: Document = {};
      if (where.userId) filter.userId = where.userId;
      return mapMany(await applyFindMany(collection, filter, { orderBy, take })) as CustomCakeRequestRecord[];
    },
    async create({ data }: { data: Omit<CustomCakeRequestRecord, "id" | "createdAt" | "updatedAt" | "status" | "notes" | "inspirationUrl"> & Partial<Pick<CustomCakeRequestRecord, "status" | "notes" | "inspirationUrl">> }) {
      const collection = await getCollection<CustomCakeRequestDoc>("customCakeRequests");
      const now = new Date();
      const doc = {
        ...data,
        inspirationUrl: data.inspirationUrl ?? null,
        status: data.status ?? "NEW",
        notes: data.notes ?? null,
        createdAt: now,
        updatedAt: now
      };
      const result = await collection.insertOne(doc as CustomCakeRequestDoc);
      return mapId({ _id: result.insertedId, ...doc } as CustomCakeRequestDoc) as CustomCakeRequestRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<CustomCakeRequestRecord> }) {
      const collection = await getCollection<CustomCakeRequestDoc>("customCakeRequests");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as CustomCakeRequestRecord | null;
    }
  },
  order: {
    async create({
      data
    }: {
      data: Omit<OrderRecord, "id" | "createdAt" | "updatedAt" | "discountInr" | "paymentReference" | "status"> & {
        userId?: string | null;
        status?: OrderRecord["status"];
        paymentReference?: string | null;
        discountInr?: number;
        items?: {
          create: Array<
            Pick<OrderItemRecord, "productId" | "productName" | "quantity" | "priceInr"> &
              Partial<Pick<OrderItemRecord, "message" | "instructions" | "deliveryDate" | "deliverySlot">>
          >;
        };
      };
    }) {
      const orders = await getCollection<OrderDoc>("orders");
      const orderItems = await getCollection<OrderItemDoc>("orderItems");
      const now = new Date();
      const doc = {
        ...data,
        userId: data.userId ?? null,
        status: data.status ?? "PENDING",
        paymentReference: data.paymentReference ?? null,
        discountInr: data.discountInr ?? 0,
        createdAt: now,
        updatedAt: now
      };
      const result = await orders.insertOne(doc as OrderDoc);
      if (data.items?.create?.length) {
        await orderItems.insertMany(
          data.items.create.map((item) => ({
            ...item,
            orderId: result.insertedId.toHexString(),
            message: item.message ?? null,
            instructions: item.instructions ?? null,
            deliveryDate: item.deliveryDate ?? null,
            deliverySlot: item.deliverySlot ?? null,
            createdAt: now
          })) as OrderItemDoc[]
        );
      }
      return mapId({ _id: result.insertedId, ...doc } as OrderDoc) as OrderRecord;
    },
    async findMany({
      where = {},
      include,
      orderBy,
      take
    }: {
      where?: { userId?: string };
      include?: { items?: boolean };
      orderBy?: { createdAt: "desc" | "asc" };
      take?: number;
    } = {}) {
      const ordersCollection = await getCollection<OrderDoc>("orders");
      const filter: Document = {};
      if (where.userId) filter.userId = where.userId;
      const orders = mapMany(await applyFindMany(ordersCollection, filter, { orderBy, take })) as OrderRecord[];
      if (!include?.items) return orders;
      const itemCollection = await getCollection<OrderItemDoc>("orderItems");
      const items = mapMany(
        await itemCollection.find({ orderId: { $in: orders.map((order) => order.id) } }).toArray()
      ) as OrderItemRecord[];
      return orders.map((order) => ({
        ...order,
        items: items.filter((item) => item.orderId === order.id)
      }));
    },
    async findUnique({
      where,
      include
    }: {
      where: { orderNumber?: string; id?: string };
      include?: { items?: boolean };
    }) {
      const collection = await getCollection<OrderDoc>("orders");
      let order: OrderRecord | null = null;
      if (where.orderNumber) order = mapId(await collection.findOne({ orderNumber: where.orderNumber })) as OrderRecord | null;
      if (where.id) order = mapId(await collection.findOne({ _id: asId(where.id) })) as OrderRecord | null;
      if (!order) return null;
      if (!include?.items) return order;
      const itemCollection = await getCollection<OrderItemDoc>("orderItems");
      const items = mapMany(await itemCollection.find({ orderId: order.id }).toArray()) as OrderItemRecord[];
      return { ...order, items };
    },
    async update({ where, data }: { where: { id: string }; data: Partial<OrderRecord> }) {
      const collection = await getCollection<OrderDoc>("orders");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as OrderRecord | null;
    }
  },
  review: {
    async findMany({
      where = {},
      include,
      orderBy,
      take
    }: {
      where?: { productId?: string; userId?: string; orderId?: string };
      include?: { user?: boolean };
      orderBy?: { createdAt: "desc" | "asc" };
      take?: number;
    } = {}) {
      const collection = await getCollection<ReviewDoc>("reviews");
      const filter: Document = {};
      if (where.productId) filter.productId = where.productId;
      if (where.userId) filter.userId = where.userId;
      if (where.orderId) filter.orderId = where.orderId;
      const reviews = mapMany(await applyFindMany(collection, filter, { orderBy, take })) as ReviewRecord[];
      if (!include?.user) return reviews;
      const userIds = [...new Set(reviews.map((review) => review.userId))];
      const users = userIds.length
        ? mapMany(await (await getCollection<UserDoc>("users")).find({ _id: { $in: userIds.map(asId) } }).toArray()) as UserRecord[]
        : [];
      const userMap = new Map(users.map((user) => [user.id, user]));
      return reviews.map((review) => ({
        ...review,
        user: userMap.get(review.userId) ? { id: review.userId, name: userMap.get(review.userId)?.name || null } : null
      }));
    },
    async findUnique({
      where
    }: {
      where: { userId_orderId_productId: { userId: string; orderId: string; productId: string } };
    }) {
      const collection = await getCollection<ReviewDoc>("reviews");
      return mapId(await collection.findOne(where.userId_orderId_productId)) as ReviewRecord | null;
    },
    async create({ data }: { data: Omit<ReviewRecord, "id" | "createdAt" | "updatedAt"> }) {
      const collection = await getCollection<ReviewDoc>("reviews");
      const now = new Date();
      const doc = { ...data, createdAt: now, updatedAt: now };
      const result = await collection.insertOne(doc as ReviewDoc);
      return mapId({ _id: result.insertedId, ...doc } as ReviewDoc) as ReviewRecord;
    },
    async update({ where, data }: { where: { id: string }; data: Partial<ReviewRecord> }) {
      const collection = await getCollection<ReviewDoc>("reviews");
      await collection.updateOne({ _id: asId(where.id) }, { $set: { ...data, updatedAt: new Date() } });
      return mapId(await collection.findOne({ _id: asId(where.id) })) as ReviewRecord | null;
    },
    async aggregateForProduct(productId: string) {
      const collection = await getCollection<ReviewDoc>("reviews");
      const [result] = await collection.aggregate([
        { $match: { productId } },
        { $group: { _id: "$productId", average: { $avg: "$rating" }, count: { $sum: 1 } } }
      ]).toArray();
      return {
        rating: result?.average ? Number(result.average.toFixed(1)) : 0,
        reviews: result?.count || 0
      };
    }
  }
};

export async function ensureGoogleUser({
  email,
  name,
  image,
  provider,
  providerAccountId
}: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
}) {
  let user = await db.user.findUnique({ where: { email } });
  if (!user) {
    user = await db.user.create({
      data: {
        email,
        name: name ?? null,
        image: image ?? null,
        role: "CUSTOMER"
      }
    });
  }

  const existingAccount = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } }
  });
  if (!existingAccount) {
    await db.account.create({
      data: {
        userId: user.id,
        type: "oauth",
        provider,
        providerAccountId,
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null
      }
    });
  }

  return user;
}

export { ensureIndexes };
