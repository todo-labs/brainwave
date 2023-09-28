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
import { useState } from "react";
import { useMixpanel } from "@/lib/mixpanel";

type Props = {
  onConfirm: () => void;
};

const useDisclaimerModal = (props: Props) => {
  const { t } = useTranslation(["common"]);
  const [isOpen, setIsOpen] = useState(false);
  const { trackEvent } = useMixpanel();

  const open = () => {
    setIsOpen(true);
    trackEvent("ViewedModal", {
      label: "Disclaimer",
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    props.onConfirm();
    trackEvent("ViewedModal", {
      label: "Disclaimer",
      value: "Confirmed",
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    trackEvent("ViewedModal", {
      label: "Disclaimer",
      value: "Cancelled",
    });
  };

  const Content = () => {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("disclaimerModal-title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("disclaimerModal-pre")}{" "}
              <span className="text-primary">
                {t("disclaimerModal-highlight")}
              </span>
              . {t("disclaimerModal-post")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return { open, Content };
};

export default useDisclaimerModal;
