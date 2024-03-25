import { Badge } from "./badge";

interface NotFoundProps {
  message?: string;
}

export default function NotFound({ message }: NotFoundProps) {
  return (
    <section className="flex-1 pt-8 md:pt-24">
      <div className="flex flex-col items-center space-y-4">
        <Badge>404 Page</Badge>
        <h1 className="text-6xl font-bold">Oops! Page not found.</h1>
        <p className="text-xl">
          {message ?? "Sorry, we couldn't find the page you were looking for."}
        </p>
      </div>
    </section>
  );
}
