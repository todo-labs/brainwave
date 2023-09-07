import { Separator } from "./ui/separator";

interface ISectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Section = (props: ISectionProps) => {
  return (
    <section>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold capitalize tracking-tight">
          {props.title}
        </h2>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
      <Separator className="my-4" />
      {props.children}
    </section>
  );
};

export default Section;
