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
      label: "Disclaimer Modal",
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    props.onConfirm();
    trackEvent("ButtonClick", {
      label: "Disclaimer Modal",
      value: "Confirmed",
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    trackEvent("ButtonClick", {
      label: "DisclaimerModal",
      value: "Cancelled",
    });
  };

  const Content = () => {
    return (
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("disclaimerModal-title")}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p className="text-primary">{t("disclaimerModal-highlight")}</p>
              <p>{t("disclaimerModal-post")}</p>
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
