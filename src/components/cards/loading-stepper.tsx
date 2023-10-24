import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, LoaderIcon } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ILoadingProps {
  title: string;
  loading: boolean;
  completed?: boolean;
  onClick?: () => void;
}

const LoadingStepper = ({
  title,
  loading,
  onClick,
  completed,
}: ILoadingProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { t } = useTranslation(["common"]);

  const textList = Array.from(
    { length: 30 },
    (_, index) => `loading-exam-${index + 1}`
  );

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        const index = Math.floor(Math.random() * textList.length);
        setCurrentIndex(index);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <Alert>
      {loading ? (
        <LoaderIcon
          className={cn("h-4 w-4 text-muted-foreground", {
            "animate-spin": loading,
          })}
        />
      ) : (
        <Terminal className="h-4 w-4" />
      )}
      <AlertTitle
        className={cn({
          "text-muted-foreground": loading,
          "text-primary": !loading && completed,
        })}
      >
        {title}
      </AlertTitle>
      <AlertDescription className="flex justify-between text-muted-foreground">
        <span>{t(textList[currentIndex] || "loading-exam")}</span>
        {!!onClick && (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onClick}
          >
            {t("continue")}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LoadingStepper;
