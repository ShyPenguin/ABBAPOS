import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routers from "./routers/Routers";

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <main className="h-screen w-screen font-golos bg-[#F8F9FD]">
      <QueryClientProvider client={client}>
        <Routers />
      </QueryClientProvider>
    </main>
  );
}

export default App;
