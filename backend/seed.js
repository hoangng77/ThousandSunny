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
  "Fantasy",
  "Romance",
  "Horror",
  "Action",
  "Comedy",
  "Drama",
  "Sci-Fi",
  "Mystery",
  "Slice of Life",
  "Adventure",
];

const ARTIST_COUNT = 5;
const READER_COUNT = 5;
const ARTWORK_COUNT_PER_ARTIST = 6;

// Load avatars from uploads/avatar folder
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

  // Create artists
  for (let i = 0; i < ARTIST_COUNT; i++) {
    const password = await bcrypt.hash("password123", 10);
    const avatarUrl = AVATARS[i % AVATARS.length] || `https://picsum.photos/seed/artist${i}/200`;

    users.push(
      new User({
        username: `artist${i + 1}`,
        email: `artist${i + 1}@mail.com`,
        password,
        role: "artist",
        profile: {
          bio: faker.lorem.sentence(),
          avatarUrl,
        },
        preferredGenres: [], // will fill after artworks
      })
    );
  }

  // Create consumers/readers
  for (let i = 0; i < READER_COUNT; i++) {
    const password = await bcrypt.hash("password123", 10);
    const avatarUrl = AVATARS[(i + ARTIST_COUNT) % AVATARS.length] || `https://picsum.photos/seed/reader${i}/200`;

    users.push(
      new User({
        username: `reader${i + 1}`,
        email: `reader${i + 1}@mail.com`,
        password,
        role: "consumer",
        profile: {
          bio: faker.lorem.sentence(),
          avatarUrl,
        },
        preferredGenres: [], // will fill after library
      })
    );
  }

  const createdUsers = await User.insertMany(users);
  console.log("Users seeded!");
  return createdUsers;
};

const createArtworksAndSetPreferredGenres = async (artists) => {
  const artworks = [];

  for (const artist of artists) {
    const artistGenres = {};

    for (let i = 0; i < ARTWORK_COUNT_PER_ARTIST; i++) {
      const genre = GENRES[Math.floor(Math.random() * GENRES.length)];

      const artwork = new Content({
        title: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        genre,
        fileUrl: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
        artist: artist._id,
        isSeries: false,
      });

      artworks.push(artwork);

      // count genres for preferredGenres
      if (!artistGenres[genre]) artistGenres[genre] = 1;
      else artistGenres[genre]++;
    }

    // set artist's preferredGenres
    artist.preferredGenres = Object.entries(artistGenres).map(([genre, count]) => ({ genre, count }));
    await artist.save();
  }

  const createdArtworks = await Content.insertMany(artworks);
  console.log("Artworks seeded and artist preferredGenres updated!");
  return createdArtworks;
};

// Seed following randomly
const seedFollowing = async (readers, artists) => {
  for (const reader of readers) {
    const followingCount = Math.floor(Math.random() * artists.length);
    const randomFollow = artists.slice(0, followingCount).map(a => a._id);
    reader.following = randomFollow;
    await reader.save();
  }
  console.log("Following relationships seeded!");
};

// Seed library and set preferredGenres for readers based on library genres
const seedLibraryAndPreferredGenres = async (readers, artworks) => {
  for (const reader of readers) {
    // Pick 4 random artworks for library
    const randomLibrary = artworks.sort(() => 0.5 - Math.random()).slice(0, 4);
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

  const artworks = await createArtworksAndSetPreferredGenres(artists);
  await seedFollowing(readers, artists);
  await seedLibraryAndPreferredGenres(readers, artworks);

  console.log("🎉 Seeding complete!");
  process.exit(0);
};

runSeed();
