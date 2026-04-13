import "dotenv/config";
import prisma from "./src/lib/prisma.js";

async function main() {
  console.log("Seeding database...");

  // Create Authority User
  const authority = await prisma.user.upsert({
    where: { email: "charan7@gmail.com" },
    update: {},
    create: {
      email: "charan7@gmail.com",
      name: "City Admin",
      password: "charan123",
      role: "authority",
    },
  });

  // Create a regular Citizen for testing
  const citizen = await prisma.user.upsert({
    where: { email: "citizen@civicsense.local" },
    update: {},
    create: {
      email: "citizen@civicsense.local",
      name: "Local Citizen",
      password: "password123",
      role: "citizen",
    },
  });

  // Create initial issues
  const initialIssues = [
    { title: 'Road Damage Near Park', category: 'Road Damage', severity: 'High', status: 'Open', description: 'Large pothole actively damaging cars on Main St right past the intersection. Looks about 2ft wide.', latitude: 34.0522, longitude: -118.2437, reporterId: citizen.id },
    { title: 'Waste Overflow', category: 'Waste Management', severity: 'Medium', status: 'In Progress', description: 'Garbage bins overturned and overflowing for 3 days near the public park entrance.', latitude: 34.0531, longitude: -118.2415, reporterId: citizen.id },
    { title: 'Burst Water Pipe', category: 'Water Supply', severity: 'Critical', status: 'Open', description: 'Possible burst pipe, water gushing out onto the sidewalk constantly.', latitude: 34.0545, longitude: -118.2401, reporterId: citizen.id },
  ];

  for (const issue of initialIssues) {
    await prisma.issue.create({
      data: issue,
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
