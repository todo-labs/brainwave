import { useTranslation } from "next-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  onConfirm: () => void;
  open: boolean;
  setShouldOpen: (open: boolean) => void;
  onCancel?: () => void;
}

const DisclaimerModal = (props: Props) => {
  const { t } = useTranslation(["common"]);

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("disclaimerModal.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("disclaimerModal.pre")}{" "}
            <span className="text-primary">
              {t("disclaimerModal.highlight")}
            </span>
            . {t("disclaimerModal.post")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.onCancel}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={props.onConfirm}>
            {t("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DisclaimerModal;
