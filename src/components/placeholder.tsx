import { Plus, Podcast } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const diffuculty = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

export function CreateConfig() {
  const [type, setType] = useState("easy");

  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <ScrollArea className="h-fit w-full">
        <CardHeader>
          <CardTitle>
            Lets build your exam 
          </CardTitle>
          <CardDescription>
            What area are you having problems with?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Difficulty</Label>
              <Select defaultValue={type}>
                <SelectTrigger id="area">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {diffuculty.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      onClick={() => setType(item.value)}
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Phone Number" />
            </div> */}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Message Title</Label>
            <Input id="title" placeholder="Reminder for..." />
          </div>
          <div className="grid gap-2">
            <div className="w-full">
              <Label htmlFor="description">Notes</Label>
            </div>
            <Textarea id="description" placeholder="Hey, I need help with..." />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button className="w-full" variant="default">
            Submit (2 credits)
          </Button>
        </CardFooter>
      </ScrollArea>
    </div>
  );
}
