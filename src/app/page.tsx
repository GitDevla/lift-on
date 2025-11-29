import prisma from "@/lib/prisma";

export default async function Home() {
  const exercises = await prisma.exercise.findMany();
  return (
    <div>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  );
}
