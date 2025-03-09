import Header from "../components/Header";

export default function InvalidUser({ id }: { id: string | undefined }) {
  return (
    <>
      <Header />
      <br />
      <div className="flex justify-center items-center">
        <span className="py-3 px-4 rounded-2xl bg-accent/20 text-center mt-10 text-accent text-4xl opacity-90 md:text-5xl">
          {" "}
          User with ID: <span className="text-primary">{id}</span> not found
        </span>
      </div>
    </>
  );
}
