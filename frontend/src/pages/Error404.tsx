import Header from "../components/Header";

export default function Error404() {
  return (
    <>
      <Header />
      <h1 className="text-center m-25 text-3xl text-accent font-bold">
        <span className="text-5xl">404</span> Not Found
      </h1>
    </>
  );
}
