import DataTable from "@/components/DataTable";

const Home = () => {
  return (
    <main className="max-w-screen-xl m-auto">
      <section>
        <h1 className="text-4xl font-bold text-center mt-8">
          Welcome to the Home Page 🎉
        </h1>
        <DataTable />
      </section>
    </main>
  );
};

export default Home;
