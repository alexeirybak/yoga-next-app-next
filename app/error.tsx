"use client";

export default function ErrorWrapper({ error }: { error: Error }) {
  return <h1 className="text-[30px]">Упс! {error.message}</h1>;
}