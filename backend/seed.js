// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import Content from "./models/content.js";
import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

dotenv.config();

const GENRES = [
  "Fantasy","Romance","Horror","Action","Comedy",
  "Drama","Sci-Fi","Mystery","Slice of Life","Adventure",
];

const ARTIST_COUNT = 5;
const READER_COUNT = 5;
const ARTWORK_COUNT_PER_ARTIST = 6;

const AVATAR_FOLDER = path.join(process.cwd(), "uploads/avatar");
const AVATARS = fs.existsSync(AVATAR_FOLDER)
  ? fs.readdirSync(AVATAR_FOLDER).map(f => `/uploads/avatar/${f}`)
  : [];

const PLACEHOLDER_IMAGES = [
  "/uploads/seed/AttackonTitan_001.jpg",
  "/uploads/seed/AttackonTitan_002.jpg",
  "/uploads/seed/AttackonTitan_003.jpg",
  "/uploads/seed/AttackonTitan_004.jpg",
  "/uploads/seed/AttackonTitan_005.jpg",
  "/uploads/seed/AttackonTitan_006.jpg",
  "/uploads/seed/AttackonTitan_007.jpg",
  "/uploads/seed/AttackonTitan_008.jpg",
  "/uploads/seed/AttackonTitan_009.jpg",
  "/uploads/seed/AttackonTitan_010.jpg",
  "/uploads/seed/AttackonTitan_011.jpg",
  "/uploads/seed/AttackonTitan_012.jpg",
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  await User.deleteMany({});
  await Content.deleteMany({});
  console.log("Database cleared!");
};

const createUsers = async () => {
  const users = [];

  // Create artist documents (not yet saved)
  for (let i = 0; i < ARTIST_COUNT; i++) {
    const password = await bcrypt.hash("password123", 10);
    const avatarUrl = AVATARS.length ? AVATARS[i % AVATARS.length] : `https://picsum.photos/seed/artist${i}/200`;

    users.push({
      username: `artist${i + 1}`,
      email: `artist${i + 1}@mail.com`,
      password,
      role: "artist",
      profile: { bio: faker.lorem.sentence(), avatarUrl },
      preferredGenres: [], // will be set after artworks are created
    });
  }

  // Create consumer/readers
  for (let i = 0; i < READER_COUNT; i++) {
    const password = await bcrypt.hash("password123", 10);
    const avatarUrl = AVATARS.length ? AVATARS[(i + ARTIST_COUNT) % AVATARS.length] : `https://picsum.photos/seed/reader${i}/200`;

    users.push({
      username: `reader${i + 1}`,
      email: `reader${i + 1}@mail.com`,
      password,
      role: "consumer",
      profile: { bio: faker.lorem.sentence(), avatarUrl },
      preferredGenres: [],
    });
  }

  const createdUsers = await User.insertMany(users);
  console.log("Users seeded!");
  return createdUsers;
};

const createArtworks = async (artists) => {
  const artworks = [];

  for (const artist of artists) {
    for (let i = 0; i < ARTWORK_COUNT_PER_ARTIST; i++) {
      const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
      const artwork = {
        title: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        genre,
        fileUrl: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
        artist: artist._id,
        contentType: "single", // consistent with your app's Content schema
        status: "published",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      artworks.push(artwork);
    }
  }

  const createdArtworks = await Content.insertMany(artworks);
  console.log("Artworks seeded!");
  return createdArtworks;
};

const computeAndSetArtistPreferredGenres = async () => {
  // Aggregate counts grouped by artist and genre
  const agg = await Content.aggregate([
    { $match: { contentType: "single" } }, // or include series if desired
    {
      $group: {
        _id: { artist: "$artist", genre: "$genre" },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: "$_id.artist",
        genres: {
          $push: {
            genre: "$_id.genre",
            count: "$count"
          }
        }
      }
    }
  ]);

  if (!agg || agg.length === 0) {
    console.log("No aggregated genre data found.");
    return;
  }

  // Prepare bulk update operations for users
  const ops = agg.map(item => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { preferredGenres: item.genres } }
      }
    };
  });

  if (ops.length > 0) {
    const result = await User.bulkWrite(ops);
    console.log("Artists preferredGenres updated via aggregation:", result.result || result);
  }
};

const seedFollowing = async (readers, artists) => {
  for (const reader of readers) {
    const followingCount = Math.floor(Math.random() * (artists.length + 1));
    // pick random unique artist ids
    const shuffled = artists.map(a => a._id).sort(() => 0.5 - Math.random());
    reader.following = shuffled.slice(0, followingCount);
    await reader.save();
  }
  console.log("Following relationships seeded!");
};

const seedLibraryAndPreferredGenresForReaders = async (readers, artworks) => {
  for (const reader of readers) {
    // Pick 4 random artworks for library
    const shuffled = artworks.slice().sort(() => 0.5 - Math.random());
    const randomLibrary = shuffled.slice(0, 4);
    reader.library = randomLibrary.map(a => ({ content: a._id }));

    // Count genres for preferredGenres
    const readerGenres = {};
    randomLibrary.forEach(a => {
      if (!readerGenres[a.genre]) readerGenres[a.genre] = 1;
      else readerGenres[a.genre]++;
    });
    reader.preferredGenres = Object.entries(readerGenres).map(([genre, count]) => ({ genre, count }));

    await reader.save();
  }
  console.log("Library and reader preferredGenres seeded!");
};

const runSeed = async () => {
  await connectDB();
  await clearDatabase();

  const users = await createUsers();
  const artists = users.filter(u => u.role === "artist");
  const readers = users.filter(u => u.role === "consumer");

  const artworks = await createArtworks(artists);

  // Now compute preferredGenres for artists based on the actual created Content docs
  await computeAndSetArtistPreferredGenres();

  await seedFollowing(readers, artists);
  await seedLibraryAndPreferredGenresForReaders(readers, artworks);

  console.log("Seeding complete!");
  process.exit(0);
};

runSeed();
