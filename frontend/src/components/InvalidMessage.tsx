import Header from "./Header";

export default function InvalidMessage({ text }: { text: string }) {
  return (
    <>
      <Header />
      <br />
      <div className="mx-5 flex justify-center items-center">
        <span className="py-3 px-5 rounded-2xl bg-accent/20 text-center mt-10 text-accent text-4xl opacity-90 md:text-5xl">
          {text}
        </span>
      </div>
    </>
  );
}
