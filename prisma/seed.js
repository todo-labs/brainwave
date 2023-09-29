const { PrismaClient, Topics } = require("@prisma/client");

const prisma = new PrismaClient();

const metadata = [
  // {
  //   topic: Topics.LITERATURE,
  //   subtopics: [
  //     "American English",
  //     "Chronology",
  //     "Other sources of literature",
  //     "Genre",
  //   ],
  // },
  // {
  //   topic: Topics.MATH_I,
  //   subtopics: [
  //     "Geometry",
  //     "Algebra",
  //     "Basic trigonometry",
  //     "Elementary statistics",
  //     "Algebraic functions",
  //     "Arithmetic and geometric sequences",
  //     "Logic Elementary number theory",
  //   ],
  // },
  // {
  //   topic: Topics.MATH_II,
  //   subtopics: [
  //     "Three-dimensional and coordinate geometry",
  //     "Algebra",
  //     "Trigonometry",
  //     "Probability",
  //     "Functions",
  //     "Logic",
  //     "Permutations and combinations",
  //     "Elementary number theory",
  //     "Proofs",
  //     "Sequences and limits",
  //   ],
  // },
  // {
  //   topic: Topics.BIOLOGY_E,
  //   subtopics: [
  //     "Cellular",
  //     "Ecology",
  //     "Molecular",
  //     "Genetics",
  //     "Evolution",
  //     "Organismal",
  //     "Diversity biology",
  //   ],
  // },
  // {
  //   topic: Topics.BIOLOGY_M,
  //   subtopics: [
  //     "Cellular",
  //     "Ecology",
  //     "Molecular",
  //     "Genetics",
  //     "Evolution",
  //     "Organismal",
  //     "Diversity biology",
  //   ],
  // },
  // {
  //   topic: Topics.CHEMISTRY,
  //   subtopics: [
  //     "Reaction types",
  //     "Structure & states of matter",
  //     "Stoichiometry",
  //     "Thermochemistry",
  //     "Equilibrium & reaction rates",
  //     "Descriptive chemistry",
  //   ],
  // },
  // {
  //   topic: Topics.US_HISTORY,
  //   subtopics: [
  //     "Political",
  //     "Economical",
  //     "Social",
  //     "Foreign",
  //     "Cultural history and periods",
  //     "Intellectual",
  //   ],
  // },
  // {
  //   topic: Topics.WORLD_HISTORY,
  //   subtopics: ["Geographic material", "Chronological material"],
  // },
  {
    topic: Topics.PHYSICS,
    subtopics: ["Kinematics"],
  },
];

const seedMetadata = async () => {
  await prisma.metadata.createMany({
    data: metadata.map((item) => ({
      topic: item.topic,
      subtopics: item.subtopics,
    })),
  });
  console.log("metadata seeded successfully.");
};

async function main() {
  try {
    await seedMetadata();
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
