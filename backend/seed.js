import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/user.js";
import Content from "./models/content.js"; // ensure you have this model
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
"/uploads/seed/AttackonTitan_013.jpg",
"/uploads/seed/AttackonTitan_014.jpg",
"/uploads/seed/AttackonTitan_015.jpg",
"/uploads/seed/AttackonTitan_016.jpg",
"/uploads/seed/AttackonTitan_017.jpg",
"/uploads/seed/AttackonTitan_018.jpg",
"/uploads/seed/AttackonTitan_019.jpg",
"/uploads/seed/AttackonTitan_020.jpg",
"/uploads/seed/AttackonTitan_021.jpg",
"/uploads/seed/AttackonTitan_022.jpg",
"/uploads/seed/AttackonTitan_023.jpg",
"/uploads/seed/AttackonTitan_024.jpg",
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

    users.push(
      new User({
        username: `artist${i + 1}`,
        email: `artist${i + 1}@mail.com`,
        password,
        role: "artist",
        profile: {
          bio: faker.lorem.sentence(),
          avatarUrl: `https://picsum.photos/seed/artist${i}/200`,
        },
      })
    );
  }

  // Create consumers/readers
  for (let i = 0; i < READER_COUNT; i++) {
    const password = await bcrypt.hash("password123", 10);

    users.push(
      new User({
        username: `reader${i + 1}`,
        email: `reader${i + 1}@mail.com`,
        password,
        role: "consumer",
        profile: {
          bio: faker.lorem.sentence(),
          avatarUrl: `https://picsum.photos/seed/reader${i}/200`,
        },
      })
    );
  }

  const createdUsers = await User.insertMany(users);
  console.log("Users seeded!");
  return createdUsers;
};

const createArtworks = async (artists) => {
  let artworks = [];

  for (const artist of artists) {
    for (let i = 0; i < ARTWORK_COUNT_PER_ARTIST; i++) {
      const artwork = new Content({
        title: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        genre: GENRES[Math.floor(Math.random() * GENRES.length)],
        fileUrl: PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)],
        artist: artist._id,
        isSeries: false,
      });

      artworks.push(artwork);
    }
  }

  const createdArtworks = await Content.insertMany(artworks);
  console.log("Artworks seeded!");
  return createdArtworks;
};

const seedFollowing = async (readers, artists) => {
  for (const reader of readers) {
    const followingCount = Math.floor(Math.random() * artists.length);

    const randomFollow = artists.slice(0, followingCount).map(a => a._id);

    reader.following = randomFollow;
    await reader.save();
  }

  console.log("Following relationships seeded!");
};

const seedLibrary = async (readers, artworks) => {
  for (const reader of readers) {
    const randomLibrary = artworks
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
      .map(a => ({ content: a._id }));

    reader.library = randomLibrary;
    await reader.save();
  }

  console.log("Library seeded!");
};

const runSeed = async () => {
  await connectDB();
  await clearDatabase();

  const users = await createUsers();
  const artists = users.filter(u => u.role === "artist");
  const readers = users.filter(u => u.role === "consumer");

  const artworks = await createArtworks(artists);

  await seedFollowing(readers, artists);
  await seedLibrary(readers, artworks);

  console.log("🎉 Seeding complete!");
  process.exit(0);
};

runSeed();
