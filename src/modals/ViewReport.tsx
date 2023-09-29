import { Report, User } from "@prisma/client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, statusToColor } from "@/lib/utils";
import { format } from "date-fns";
import { Paragraph } from "@/components/ui/typography";
import { Label } from "@/components/ui/label";

const ViewReportModal = (props: Report & { user: User }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="capitalize">
          {props.ticketNumber || "No Ticket Number"}
        </DialogTitle>
        <DialogDescription className="space-y-2">
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Status
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Created
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td
                    className={cn(
                      "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
                      statusToColor(props.status)
                    )}
                  >
                    {props.status}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {format(props.createdAt, "MM/dd/yyyy")}
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    {props.type}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <section className="space-y-3">
            <div className="flex space-x-4">
              <article>
                <Label>Page</Label>
                <Paragraph>{props.pageUrl}</Paragraph>
              </article>
              <article>
                <Label>User</Label>
                <Paragraph>{props.user.name}</Paragraph>
              </article>
            </div>
            <article>
              <Label>Message</Label>
              <Paragraph>{props.txt}</Paragraph>
            </article>
            <article>
              <Label>User Agent</Label>
              <Paragraph>{props.userAgent}</Paragraph>
            </article>
          </section>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};

export default ViewReportModal;
